import Lead from "../models/Lead.js";
import asyncHandler from "../utils/asyncHandler.js";

const getLeads = asyncHandler(async (req, res) => {
  const { search, status } = req.query;

  // base filter depends on role
  let filter = {};
  if (req.user.role !== "admin") {
    filter.assignedTo = req.user._id;
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    // simple case-insensitive search across a few fields, no aggregation needed
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  const leads = await Lead.find(filter)
    .populate("assignedTo", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json(leads);
});


const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email role");

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  // sales user can only view their own lead
  if (req.user.role !== "admin" && lead.assignedTo._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to view this lead" });
  }

  res.status(200).json(lead);
});


const createLead = asyncHandler(async (req, res) => {
  const { name, email, phone, company, status, notes } = req.body;

  const lead = await Lead.create({
    name,
    email,
    phone,
    company,
    status,
    notes,
    assignedTo: req.user._id, // lead always belongs to the creator (sales user)
  });

  res.status(201).json(lead);
});

const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  if (req.user.role !== "admin" && lead.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to update this lead" });
  }

  const { name, email, phone, company, status, notes } = req.body;

  lead.name = name ?? lead.name;
  lead.email = email ?? lead.email;
  lead.phone = phone ?? lead.phone;
  lead.company = company ?? lead.company;
  lead.status = status ?? lead.status;
  lead.notes = notes ?? lead.notes;

  const updatedLead = await lead.save();
  res.status(200).json(updatedLead);
});

const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  if (req.user.role !== "admin" && lead.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to delete this lead" });
  }

  await lead.deleteOne();
  res.status(200).json({ message: "Lead deleted successfully" });
});

export { getLeads, getLeadById, createLead, updateLead, deleteLead };
