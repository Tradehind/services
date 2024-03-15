const { SellerModel } = require('../../models');
const Seller = SellerModel;
const fs = require('file-system');
const xlsx = require('node-xlsx');
const { Op } = require('sequelize');
const { sendSingleMail } = require('../../functions/emailer');
const XlsxStreamReader = require("xlsx-stream-reader");
const csvParser = require('csv-parser');

exports.createSeller = async (req, res) => {
    try {
        const newSeller = await SellerModel.create(req.body);
        res.status(201).json(newSeller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Read Seller by ID
exports.getSellerById = async (req, res) => {
    try {
        const seller = await SellerModel.findById(req.params.id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.json(seller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Seller by ID
exports.updateSeller = async (req, res) => {
    try {
        console.log(req.body, ' req.body', req.params.id);
        const updatedSeller = await Seller.updateOne({ _id: req.params.id }, req.body);
        if (!updatedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.json(updatedSeller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Seller by ID
exports.deleteSeller = async (req, res) => {
    try {
        const deletedSeller = await Seller.findByIdAndDelete(req.params.id);
        if (!deletedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.json({ message: 'Seller deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markInactiveSellerById = async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const update = { is_active: req.body.status };
        const options = { new: true }; // To return the updated document
        const updatedSeller = await Seller.findOneAndUpdate(filter, update, options);
        if (!updatedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        sendSingleMail('khushaly194@gmail.com', 'test', 'test');
        res.json({ message: 'Seller status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sellerListingAdmin = async (req, res) => {
    const { page = 1, pageSize = 100 } = req.query;


    try {
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        let query;
        if (req?.query?.state && req?.query?.state != 'All') {

            const stateQuery = { state: { $regex: req.query.state, $options: 'i' } };

            query = await Seller.find(stateQuery)
                .skip(offset)
                .limit(limit);

        } else {
            query = await Seller.find()
                .skip(offset)
                .limit(limit);
        }

        res.json(query);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.searchFromSellerList = async (req, res) => {

    let payload = req.body;
    var records;
    if (payload?.keyword) {
        let keyword = payload.keyword;
        records = await Seller.find({
            $or: [
                { company_name: { $regex: keyword, $options: 'i' } },
                { first_name: { $regex: keyword, $options: 'i' } },
                { last_name: { $regex: keyword, $options: 'i' } },
                { designation: { $regex: keyword, $options: 'i' } },
                { email1: { $regex: keyword, $options: 'i' } },
                { email2: { $regex: keyword, $options: 'i' } },
                { city: { $regex: keyword, $options: 'i' } },
                { state: { $regex: keyword, $options: 'i' } },
                { phone1: { $regex: keyword, $options: 'i' } },
                { phone2: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } },
            ]
        });
    }

    res.json(records);

};


exports.importDataSeller = async (req, res) => {

    let fileName = "b2b_import.xlsx";
    let obj = xlsx.parse(__dirname + '/' + fileName);
    obj = xlsx.parse(fs.readFileSync(__dirname + '/' + fileName));

    if (!obj || !obj[0] || !obj[0]?.data) {
        return 'expected data not found in sheet';
    }

    let accessData = obj[0].data;

    let finalArr = [];
    let keyNames = ['company_name', 'first_name', 'last_name', 'designation',
        'email1', 'email2', 'address1', 'address2', 'city', 'state', 'pincode',
        'website', 'phone1', 'phone2'];

    accessData.forEach((arrData, indexM) => {
        var resultObject = {};
        keyNames.forEach((key, index) => {
            resultObject[key.trim()] = arrData[index];
        });
        finalArr.push(resultObject);
    });

    finalArr = JSON.parse(JSON.stringify(finalArr));
    finalArr = finalArr.slice(1, finalArr.length);
    console.log(finalArr.length, '<---------data length');



    const batchSize = 30000;
    const delayBetweenBatches = 5000;
    var id = 1;
    for (let i = 0; i < finalArr.length; i += batchSize) {

        var batch = finalArr.slice(i, i + batchSize);
        console.log('--------------------------------------------------------');
        console.log('--------------Starting Batch Import---------------------');
        console.log('--------------------------------------------------------');
        console.log('--------------------------------------------------------');
        console.log('-----------------', i, '<-----to---->', i + batchSize, '----------------');
        // Execute the insert operation for the current batch

        batch = batch.map(obj => {
            // console.log(obj, 'obj');
            const newObj = { ...obj }; // Create a shallow copy of the object
            // console.log(newObj, 'newObj');
            if (newObj?.phone1) newObj.phone1 = newObj.phone1.toString(); // Convert key to string
            if (newObj?.phone2) newObj.phone2 = newObj.phone2.toString();
            delete newObj.pincode;
            // newObj.id = id;
            // id++;
            return newObj;
        });

        console.log(batch, 'betch------------------------------');
        await Seller.bulkCreate(batch, { returning: true, individualHooks: true });


        if (i + batchSize < finalArr.length) {
            await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
    }

    console.log('Data insertion completed.');

}


// exports.importNewDataSeller = async (req, res) => {
//     const filePath = __dirname + '/' + "imports/pvt.csv";

//     try {
//         if (!fs.existsSync(filePath)) {
//             return res.status(404).json({ error: 'File not found' });
//         }

//         let importedCount = 0;
//         const batchSize = 100; // Adjust batch size as needed
//         let batch = [];

//         const processRow = async (row) => {
//             try {
//                 let company_name = row.Company;
//                 let first_name = row.Name;
//                 let phone1 = row.Mobile;
//                 // let phone2 = row.Mobile2;
//                 let address1 = row.Address;
//                 let pincode = row.Pincode;
//                 let city = row.City;
//                 // let state = row.State;
//                 let email1 = row.Email;


//                     if (company_name) {  company_name = capitalizeFirstLetter(company_name)  }
//                     if (city) {    city = capitalizeFirstLetter(city)    }
//                     // if (state) {  state = capitalizeFirstLetter(state) }
//                     if (phone1) {   phone1 = capitalizeFirstLetter(phone1).replace(/\s/g, '')  }

//                     let inObj = {
//                         company_name: company_name,
//                         first_name: first_name,
//                         phone1: phone1,
//                         //  phone2: phone2,
//                         address1: address1,
//                         pincode: pincode,
//                         city: city,
//                         // state: state,
//                         email1: email1,
//                         // website: row.Website
//                     }

//                     if (pincode) {
//                         pincode = pincode.replace(/\s/g, '');

//                         if (!isStringConvertibleToInteger(pincode)) {
//                             console.log('removing pincode', pincode);
//                             delete inObj.pincode;
//                         } else {
//                             inObj.pincode = pincode
//                         }

//                     }

//                 if (company_name && phone1 && city) {
//                     // Check for duplicacy using mobile number
//                     const existingSeller = await SellerModel.findOne({ phone1: inObj.phone1, company_name:company_name  });
//                     if (!existingSeller) {
//                         console.log('not existing adding to batch---', company_name);
//                         // Push data to the batch
//                         batch.push(inObj);
//                         importedCount++;

//                         if (batch.length >= batchSize) {
//                             console.log(batch.length, '--------', batchSize,  '---------------------------------------batch size importing now------------------------------------------------------------------------------------------');
//                             importBulk(batch);
//                             batch = []; // Clear the batch
//                             stream.pause();
//                             setTimeout(() => {
//                                 console.log('Waiting for 10 seconds before processing the next batch...');
//                                 stream.resume(); // Resume reading the stream to process the next batch
//                             }, 10000); // 10 seconds delay
//                         }
//                     } else {
//                         console.log('Seller with data already exists:', company_name);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error importing seller:', error);
//             }
//         };

//         let stream = fs.createReadStream(filePath)
//             .pipe(csvParser())
//             .on('data', async (row) => {
//                 await processRow(row);
//             })
//             .on('end', async () => {
//                 // Insert remaining documents in the batch
//                 if (batch.length > 0) {
//                     console.log('inside this ----end');
//                     //importBulk(batch);
//                 }
//                 res.status(200).json({ message: `Sellers imported successfully. Total: ${importedCount}` });
//             });

//     } catch (error) {
//         console.error('Error importing sellers:', error);
//         res.status(500).json({ error: 'Error importing sellers' });
//     }
// };


// exports.importNewDataSeller = async (req, res) => {
//     const filePath = __dirname + '/' + "imports/pvt.csv";

//     try {
//         if (!fs.existsSync(filePath)) {
//             return res.status(404).json({ error: 'File not found' });
//         }

//         let importedCount = 0;
//         const batchSize = 100; // Adjust batch size as needed
//         let batch = [];
//         let pauseStream = false; // Flag to control stream pausing

//         const processRow = async (row) => {
//             try {
//                 let company_name = row.Company;
//                 let first_name = row.Name;
//                 let phone1 = row.Mobile;
//                 // let phone2 = row.Mobile2;
//                 let address1 = row.Address;
//                 let pincode = row.Pincode;
//                 let city = row.City;
//                 // let state = row.State;
//                 let email1 = row.Email;

//                 if (company_name) { company_name = capitalizeFirstLetter(company_name) }
//                 if (city) { city = capitalizeFirstLetter(city) }
//                 // if (state) { state = capitalizeFirstLetter(state) }
//                 if (phone1) { phone1 = capitalizeFirstLetter(phone1).replace(/\s/g, '') }

//                 let inObj = {
//                     company_name: company_name,
//                     first_name: first_name,
//                     phone1: phone1,
//                     //  phone2: phone2,
//                     address1: address1,
//                     pincode: pincode,
//                     city: city,
//                     // state: state,
//                     email1: email1,
//                     // website: row.Website
//                 }

//                 if (pincode) {
//                     pincode = pincode.replace(/\s/g, '');

//                     if (!isStringConvertibleToInteger(pincode)) {
//                         console.log('removing pincode', pincode);
//                         delete inObj.pincode;
//                     } else {
//                         inObj.pincode = pincode
//                     }

//                 }

//                 if (company_name && phone1 && city) {
//                     // Check for duplicacy using mobile number
//                     const existingSeller = await SellerModel.findOne({ phone1: inObj.phone1, company_name: company_name });
//                     if (!existingSeller) {
//                         console.log('not existing adding to batch---', company_name);
//                         // Push data to the batch
//                         batch.push(inObj);
//                         importedCount++;

//                         if (batch.length >= batchSize) {
//                             console.log(batch.length, '--------', batchSize, '---------------------------------------batch size importing now------------------------------------------------------------------------------------------');
//                             importBulk(batch);
//                             batch = []; // Clear the batch
//                             pauseStream = true; // Set flag to pause the stream
//                             setTimeout(() => {
//                                 console.log('Waiting for 10 seconds before processing the next batch...');
//                                 pauseStream = false; // Set flag to resume the stream
//                                 stream.resume(); // Resume reading the stream to process the next batch
//                             }, 10000); // 10 seconds delay
//                         }
//                     } else {
//                         console.log('Seller with data already exists:', company_name);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error importing seller:', error);
//             }
//         };

//         const stream = fs.createReadStream(filePath)
//             .pipe(csvParser())
//             .on('data', async (row) => {
//                 if (!pauseStream) { // Check if the stream should be paused
//                     await processRow(row);
//                 } else {
//                     stream.pause(); // Pause the stream
//                 }
//             })
//             .on('end', async () => {
//                 // Insert remaining documents in the batch
//                 if (batch.length > 0) {
//                     console.log('inside this ----end');
//                     //importBulk(batch);
//                 }
//                 res.status(200).json({ message: `Sellers imported successfully. Total: ${importedCount}` });
//             });

//     } catch (error) {
//         console.error('Error importing sellers:', error);
//         res.status(500).json({ error: 'Error importing sellers' });
//     }
// };

// async function importBulk(batch) {
//     console.log('importing bulk data*************************', batch);
//     for (const item of batch) {
//         try {
//             const result = await SellerModel.create(item);
//             console.log('Data imported successfully:', result);
//         } catch (error) {
//             console.error('Error importing data:', error);
//             // Handle the error as needed
//         }
//     }
// }


// exports.importNewDataSeller = async (req, res) => {
//     const filePath = __dirname + '/' + "imports/pvt.csv";

//     try {
//         if (!fs.existsSync(filePath)) {
//             return res.status(404).json({ error: 'File not found' });
//         }

//         let importedCount = 0;
//         const batchSize = 1000; // Adjust batch size as needed
//         let batch = [];

//         const processRow = async (row) => {
//             try {


//                 // Your data processing logic here...

//                 //                 let company_name = row.Company;
//                 let first_name = row.Name;
//                 let phone1 = row.Mobile;
//                 // let phone2 = row.Mobile2;
//                 let address1 = row.Address;
//                 let pincode = row.Pincode;
//                 let city = row.City;
//                 // let state = row.State;
//                 let email1 = row.Email;

//                 if (company_name && phone1 && city) {


//                     if (company_name) {
//                         company_name = capitalizeFirstLetter(company_name)
//                     }

//                     if (city) {
//                         city = capitalizeFirstLetter(city)
//                     }

//                     // if (state) {
//                     //     state = capitalizeFirstLetter(state)
//                     // }

//                     if (phone1) {
//                         phone1 = capitalizeFirstLetter(phone1).replace(/\s/g, '')
//                     }

//                     let inObj = {
//                         company_name: company_name,
//                         first_name: first_name,
//                         phone1: phone1,
//                         //  phone2: phone2,
//                         address1: address1,
//                         pincode: pincode,
//                         city: city,
//                         // state: state,
//                         email1: email1,
//                         // website: row.Website
//                     }

//                     if (pincode) {
//                         pincode = pincode.replace(/\s/g, '');

//                         if (!isStringConvertibleToInteger(pincode)) {
//                             console.log('removing pincode', pincode);
//                             delete inObj.pincode;
//                         } else {
//                             inObj.pincode = pincode
//                         }

//                     }

//                     batch.push(inObj);


//                     if (batch.length >= batchSize) {
//                         // Insert batch into the database
//                         await SellerModel.insertMany(batch);
//                         batch = []; // Clear the batch
//                     }


//                 }
//             } catch (error) {
//                 console.error('Error importing seller:', error);
//             }
//         };

//         const stream = fs.createReadStream(filePath)
//             .pipe(csv())
//             .on('data', async (row) => {
//                 await processRow(row);
//             })
//             .on('end', async () => {
//                 // Insert remaining documents in the batch
//                 if (batch.length > 0) {
//                     await SellerModel.insertMany(batch);
//                 }
//                 res.status(200).json({ message: `Sellers imported successfully. Total: ${importedCount}` });
//             });

//     } catch (error) {
//         console.error('Error importing sellers:', error);
//         res.status(500).json({ error: 'Error importing sellers' });
//     }
// };


exports.importNewDataSeller = async (req, res) => {
    const filePath = __dirname + '/' + "imports/1004257.csv";

    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        let importedCount = 0;

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', async (row) => {
         
                // Remove extra quotes from company_name
                let company_name = row.Company;
                if(company_name){
                    company_name = company_name.replace(/^"|"$/g, '');
                }

               // let first_name = row.ContactPerson;
                let phone1 = row.Mobile;
                // let phone2 = row.phone;
                // let address1 = row.Address;
                // let pincode = row.Pincode;
                let city = row.City;
                let email1 = row.Email;
                let website = row.Website;
                let address1 = row.Address;
               // let Addresstemp = row.StreetAddress;
               // let Area = row.Area;
              //  let state = row.MSc;

                // Filter out empty fields and join them with commas
              //  let result = [Area, Addresstemp, Addresstemp1].filter(field => field).join(', ');

                let inObj = {

                    company_name: company_name,
                   // first_name: first_name,
                    phone1: phone1,
                    // pincode: pincode,
                    city: city,
                    email1: email1,
                    website: website,
                    // phone2:phone2,
                    // email2:email2,
                    address1: address1,
                   // state: state

                }

               
                // if (company_name && city) {
                // const existingSeller = await SellerModel.findOne({ phone1: phone1, company_name: company_name });
                // if (!existingSeller) {
                //console.log('Importing this', company_name);
                try {

                    await SellerModel.create(inObj);
                } catch (error) {
                    console.error('Error occurred while creating seller:', error);
                    // Handle the error accordingly, such as logging, notifying the user, or taking corrective actions.
                }
                // } else {
                //     console.log('Seller with data already exists:', company_name);
                // }
                // }
            })
            .on('end', async () => {
            })
            .on('error', (error) => {
                reject(error);
            });


        res.status(200).json({ message: `Sellers imported successfully. Total: ${importedCount}` });

    } catch (error) {
        console.error('Error importing sellers:', error);
        res.status(500).json({ error: 'Error importing sellers' });
    }
};


async function importBulk(batch) {
    const newSeller = await SellerModel.insertMany(batch);


}

exports.createSellerBulkPoint = async (req, res) => {
    try {
        console.log('body-------------------', req.body);
        let data = req.body;

        if (data) {
            const newSeller = await SellerModel.insertMany(req.body);
        }
        // 
        res.status(201).json(req.body);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function isInteger(value) {
    return /^\d+$/.test(value);
}

function isStringConvertibleToInteger(str) {
    // Use parseInt to attempt conversion
    const num = parseInt(str);

    // Check if the result is not NaN (Not a Number) and the parsed number is equal to the original string
    // This ensures that the entire string was successfully converted to an integer
    return !isNaN(num) && num.toString() === str;
}


// API endpoint to clean up duplicate seller records
exports.filterDataSeller = async (req, res) => {
    try {
        // Fetch all seller records from the database
        const allSellers = await Seller.find({ filtered: { $exists: false } }).limit(10000).exec();;

        for (const seller of allSellers) {
            
            const filter = { _id: seller._id };
            let update = { filtered: true };

            if(seller.company_name){
                update.company_name = seller.company_name.toLowerCase();
            }
            if(seller.address1){
                update.address1 = seller.address1.toLowerCase();
                update.address1 = update.address1.trim();
            }
            if(seller.state){
                update.state = capitalizeFirstLetter(seller.state);
                update.state = update.state.trim();
            }
            if(seller.city){
                update.city = capitalizeFirstLetter(seller.city);
                update.city = update.city.trim();
            }

            console.log('seller----', update);
            
        }


        res.json({ message: 'Duplicate seller records cleaned up successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to clean up duplicate seller records.' });
    }
}