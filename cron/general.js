// cronJob.js

const cron = require('node-cron');
const { SellerModel } = require('../models');


// Cron Job to Remove Duplicate Sellers
const removeDuplicateSellers = async () => {
    try {
        let offset = 0;
        const batchSize = 10000;

        const sellers = await SellerModel.find({ filtered: { $exists: false } })
            .limit(batchSize)
            .skip(offset);
        //console.log(sellers, 'se');


        for (const seller of sellers) {
            //console.log(seller.company_name, 'seller');
            if (!seller?.phone1) {
                console.log('----removing phone does not exists----');
                await SellerModel.findByIdAndDelete(seller._id).exec()
            } else {

                let findByPhone = await SellerModel.find({ phone1: seller.phone1 }).exec();
                //console.log('----in else----',findByPhone);
                if (findByPhone.length > 1) {
                    console.log('more than one phone records found---');
                    for (let i = 1; i < findByPhone.length; i++) {
                        const recordToDelete = findByPhone[i];
                        try {
                            await SellerModel.findByIdAndDelete(recordToDelete._id);
                            console.log('Duplicate record deleted:', recordToDelete.company_name);
                        } catch (error) {
                            console.error('Error deleting duplicate record:', error);
                        }
                    }
                } else {
                    //console.log('genuine record---',findByPhone.length, '1 records, -----');
                }
            }

             await SellerModel.findByIdAndUpdate(seller._id, {filtered:true}).exec();
        };

        console.log('Duplicate sellers removed and marked successfully.');
    } catch (error) {
        console.error('Error removing duplicate sellers:', error);
    }
};
cron.schedule('*/1 * * * *', () => {
    removeDuplicateSellers();
});

