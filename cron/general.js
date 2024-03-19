// cronJob.js

const cron = require('node-cron');
const { SellerModel } = require('../models');


// Cron Job to Remove Duplicate Sellers
// const removeDuplicateSellers = async () => {
//     try {
//         let offset = 0;
//         const batchSize = 1000;

//         const sellers = await SellerModel.find({ filtered: { $exists: false } })
//             .limit(batchSize);
//         //console.log(sellers, 'se');


//         for (const seller of sellers) {
//             //console.log(seller.company_name, 'seller');
//             if (!seller?.phone1) {
//                 console.log('----removing phone does not exists----');
//                 await SellerModel.findByIdAndDelete(seller._id).exec()
//             } else {

//                 let findByPhone = await SellerModel.find({ phone1: seller.phone1 }).exec();
//                 //console.log('----in else----',findByPhone);
//                 if (findByPhone.length > 1) {
//                     console.log('more than one phone records found---');
//                     for (let i = 1; i < findByPhone.length; i++) {
//                         const recordToDelete = findByPhone[i];
//                         try {
//                             await SellerModel.findByIdAndDelete(recordToDelete._id);
//                             console.log('Duplicate record deleted:', recordToDelete.company_name);
//                         } catch (error) {
//                             console.error('Error deleting duplicate record:', error);
//                         }
//                     }
//                 } else {
//                     //console.log('genuine record---',findByPhone.length, '1 records, -----');
//                 }
//             }

//              await SellerModel.findByIdAndUpdate(seller._id, {filtered:true}).exec();
//              console.log('Updating filtered----', seller.company_name);
//         };

//         console.log('Duplicate sellers removed and marked successfully.');
//     } catch (error) {
//         console.error('Error removing duplicate sellers:', error);
//     }
// };


const removeDuplicateSellers = async () => {
    try {
        const batchSize = 1000;
        let offset = 0;

        console.log(`Starting filter cron-----`);
        while (true) {
            const sellers = await SellerModel.find({ filtered: { $exists: false } })
                .limit(batchSize)
                .select('company_name phone1')
                .sort('phone1');

            if (sellers.length === 0) break;

            const uniquePhoneNumbers = new Set();
            const bulkOperations = [];

            for (const seller of sellers) {
                if (!seller.phone1) {
                    console.log(`Removing seller (${seller._id}) as phone does not exist`);
                    bulkOperations.push({
                        deleteOne: { filter: { _id: seller._id } }
                    });
                } else if (uniquePhoneNumbers.has(seller.phone1)) {
                    console.log(`Removing duplicate seller (${seller._id}): ${seller.company_name}`);
                    bulkOperations.push({
                        deleteOne: { filter: { _id: seller._id } }
                    });
                } else {
                    uniquePhoneNumbers.add(seller.phone1);
                }

                bulkOperations.push({
                    updateOne: {
                        filter: { _id: seller._id },
                        update: { $set: { filtered: true } }
                    }
                });

                console.log(`Updating filtered for seller (${seller._id}): ${seller.company_name}`);
            }

            if (bulkOperations.length > 0) {
                await SellerModel.bulkWrite(bulkOperations);
            }

           
        }

        console.log('Duplicate sellers removed and marked successfully.');
    } catch (error) {
        console.error('Error removing duplicate sellers:', error);
    }
};

cron.schedule('*/10 * * * *', () => {
    removeDuplicateSellers();
});

