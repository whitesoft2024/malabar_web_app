// gdcsSchemeController.js
const GdcsSchema = require('../models/gdcsSchemeModel');

const GdcsCreateController = {
    fetch: async (req, res) => {
        try {
            const gdcsSchemeData = await GdcsSchema.find();
            res.json(gdcsSchemeData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = GdcsCreateController;
