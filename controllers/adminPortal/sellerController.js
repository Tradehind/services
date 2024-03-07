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


exports.importNewDataSeller = async (req, res) => {


    let filePath = __dirname + '/' + "imports/820386.csv";
    
    try {
     //   const filePath = 'path/to/your/csvfile.csv'; // Path to your CSV file
    
        // Ensure the file exists
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: 'File not found' });
        }
    
        // Create a stream to read the CSV file
        const stream = fs.createReadStream(filePath)
          .pipe(csvParser());
    
        // Process each row
        let importedCount = 0;
        stream.on('data', async (row) => {
          try {
            
           

            // {
            //     Company: '',
            //     Name: 'firoj khan',
            //     Mobile: '9200940040',
            //     Address: 'House no 2027,Gomti Pura Dabra',
            //     Pincode: '475110',
            //     City: 'Gwalior',
            //     State: 'MP',
            //     Country: 'India',
            //     Email: 'firojkhan728@gmail.com',
            //     Domain: 'hamiltonpaints.com'
            //   }

            if(row.Company && row.Mobile && row.City && row.Company!='N/A'){

                let inObj = {
                    company_name: capitalizeFirstLetter(row.Company),
                    phone1: row.Mobile.replace(/\s/g, ''),
                    address1:row.Address,
                    pincode: row.Pincode.replace(/\s/g, ''),
                    city: capitalizeFirstLetter(row.City),
                    state: capitalizeFirstLetter(row.State),
                    email1: row.Email,
                    website: row.Domain
                }

                if(row.Pincode && !isInteger(row.Pincode)){
                    console.log('removing pincode', inObj.pincode);
                    delete inObj.pincode;
                }

                let findSeller = await SellerModel.findOne({company_name: inObj.company_name, phone:inObj.phone1});
                if(!findSeller){
                    const newSeller = await SellerModel.create(inObj);
                }
                importedCount++;
             //   console.log('row company_name imported', row.Company);
                

            }else{
              //  console.log('row company_name not imported', row.Company);
            }

            

          } catch (error) {
            console.error('Error importing seller:', error);
          }
        });
    
        // When the stream ends, send response
        stream.on('end', () => {
          res.status(200).json({ message: `Sellers imported successfully. Total: ${importedCount}` });
        });
      } catch (error) {
        console.error('Error importing sellers:', error);
        res.status(500).json({ error: 'Error importing sellers' });
      }

    


}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function isInteger(value) {
    return /^\d+$/.test(value);
  }