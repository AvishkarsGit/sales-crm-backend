import Deal from "../models/Deal.js";
import Lead from "../models/Lead.js";
import asyncHandler from "../utils/asyncHandler.js";


const canAccessLead = (lead, user) => {
  if (user.role === "admin") return true;
  return lead.assignedTo.toString() === user._id.toString();
};

const getDeals = asyncHandler(async (req, res) => {
  const { stage, lead, search } = req.query;

  let filter = {};

  if (req.user.role !== "admin") {
    filter.createdBy = req.user._id;
  }

  if (stage) {
    filter.stage = stage;
  }

  if (lead) {
    filter.lead = lead;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const deals = await Deal.find(filter)
    .populate("lead", "name company status")
    .sort({ createdAt: -1 });

  res.status(200).json(deals);
});

const getDealById = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id).populate("lead", "name company status assignedTo");

  if (!deal) {
    return res.status(404).json({ message: "Deal not found" });
  }

  if (req.user.role !== "admin" && deal.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to view this deal" });
  }

  res.status(200).json(deal);
});

const createDeal = asyncHandler(async (req, res) => {
  const { title, value, stage, lead: leadId } = req.body;

  const lead = await Lead.findById(leadId);
  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  if (!canAccessLead(lead, req.user)) {
    return res.status(403).json({ message: "Not authorized to add a deal to this lead" });
  }

  const deal = await Deal.create({
    title,
    value,
    stage,
    lead: leadId,
    createdBy: req.user._id,
  });

  res.status(201).json(deal);
});

const updateDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);

  if (!deal) {
    return res.status(404).json({ message: "Deal not found" });
  }

  if (req.user.role !== "admin" && deal.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to update this deal" });
  }

  const { title, value, stage } = req.body;

  deal.title = title ?? deal.title;
  deal.value = value ?? deal.value;
  deal.stage = stage ?? deal.stage;

  const updatedDeal = await deal.save();
  res.status(200).json(updatedDeal);
});

const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);

  if (!deal) {
    return res.status(404).json({ message: "Deal not found" });
  }

  if (req.user.role !== "admin" && deal.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to delete this deal" });
  }

  await deal.deleteOne();
  res.status(200).json({ message: "Deal deleted successfully" });
});

export { getDeals, getDealById, createDeal, updateDeal, deleteDeal };
