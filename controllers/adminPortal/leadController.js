const { LeadModel } = require('../../models');
const { Op } = require('sequelize');

exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.leadListingPaginated = async (req, res) => {
  const { page = 1, pageSize = 100 } = req.query;

  try {
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    let whereMatch = {};

    if (req?.query?.state && req?.query?.state != 'All') {
      whereMatch.state = { $regex: req.query.state, $options: 'i' };
    }

    if (req?.query?.dateFilter && req.query.dateFilter != "All") {
      if (req.query.dateFilter == 'today') {
        const TODAY_START = new Date().setHours(0, 0, 0, 0);
        const NOW = new Date();
        whereMatch.createdAt = { $gt: TODAY_START, $lt: NOW };
      } else if (req.query.dateFilter == 'week') {
        var curr = new Date();
        var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
        var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
        whereMatch.createdAt = { $gt: firstday, $lt: lastday };
      } else if (req.query.dateFilter == 'month') {
        var date = new Date(),
          y = date.getFullYear(),
          m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        whereMatch.createdAt = { $gt: firstDay, $lt: lastDay };
      }
    }

    if (req?.query?.status && req.query.status != "All") {
      whereMatch.status = req.query.status;
    }

    let query;
    query = await Lead.find(whereMatch).skip(offset).limit(limit).exec();

    res.json(query);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).exec();
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLeadById = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
    if (!updatedLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    if (!req?.body?.status && !req?.body?.leadId) {
      return res.status(400).json({ msg: 'Missing required parameters' });
    }
    const updatedLead = await Lead.findByIdAndUpdate(req.body.leadId, { status: req.body.status }, { new: true }).exec();
    res.json({ status: 200, msg: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLeadById = async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id).exec();
    if (!deletedLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
