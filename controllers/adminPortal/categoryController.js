const { CategoryModel } = require('../../models');
const Category = CategoryModel;

exports.createCategory = async (req, res) => {
    try {
        let payload = req.body;

        if (payload?.name) {
            payload.name = payload.name.toLowerCase();
        }

        payload.is_active = true;
        const category = await Category.create(payload);
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const { page = 1, pageSize = 100 } = req.query;
        const offset = (page - 1) * pageSize;
        const limit = parseInt(pageSize);
        const categories = await Category.find().skip(offset).limit(limit).exec();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getActiveCategories = async (req, res) => {
    try {
        const categories = await Category.find({ is_active: true }).exec();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).exec();
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategoryById = async (req, res) => {
    try {
        let payload = req.body;
        console.log(payload);
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, payload, { new: true }).exec();
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markActiveInActiveCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).exec();

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Toggle the 'active' status
        category.is_active = !category.is_active;
        const updatedCategory = await category.save();

        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategoryById = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id).exec();
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.importDataCategory = async (req, res) => {

    let fileName = "category.xlsx";
    let obj = xlsx.parse(__dirname + '/' + fileName);
    obj = xlsx.parse(fs.readFileSync(__dirname + '/' + fileName));

    if (!obj || !obj[0] || !obj[0]?.data) {
        return 'expected data not found in sheet';
    }

    let accessData = obj[0].data;

    let finalArr = [];
    let keyNames = ['name', 'description', 'icon', 'image'];

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

            if (newObj?.phone1) newObj.is_active = true; // Convert key to string

            return newObj;
        });

        console.log(batch, 'betch------------------------------');
        await CategoryModel.bulkCreate(batch, { returning: true, individualHooks: true });


        if (i + batchSize < finalArr.length) {
            await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
    }

    console.log('Data insertion completed.');

}