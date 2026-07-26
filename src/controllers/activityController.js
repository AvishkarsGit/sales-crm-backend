import Activity from "../models/Activity.js";
import Lead from "../models/Lead.js";
import asyncHandler from "../utils/asyncHandler.js";

const canAccessLead = (lead, user) => {
  if (user.role === "admin") return true;
  return lead.assignedTo.toString() === user._id.toString();
};

const getActivities = asyncHandler(async (req, res) => {
  const { lead, search } = req.query;

  let filter = {};

  if (req.user.role !== "admin") {
    filter.createdBy = req.user._id;
  }

  if (lead) {
    filter.lead = lead;
  }

  if (search) {
    filter.$or = [
      { description: { $regex: search, $options: "i" } },
      { type: { $regex: search, $options: "i" } },
    ];
  }

  const activities = await Activity.find(filter)
    .populate("lead", "name company")
    .populate("deal", "title stage")
    .sort({ createdAt: -1 });

  res.status(200).json(activities);
});

const createActivity = asyncHandler(async (req, res) => {
  const { type, description, lead: leadId, deal } = req.body;

  const lead = await Lead.findById(leadId);
  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  if (!canAccessLead(lead, req.user)) {
    return res.status(403).json({ message: "Not authorized to log activity for this lead" });
  }

  const activity = await Activity.create({
    type,
    description,
    lead: leadId,
    deal: deal || null,
    createdBy: req.user._id,
  });

  res.status(201).json(activity);
});

const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    return res.status(404).json({ message: "Activity not found" });
  }

  if (req.user.role !== "admin" && activity.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to delete this activity" });
  }

  await activity.deleteOne();
  res.status(200).json({ message: "Activity deleted successfully" });
});

export { getActivities, createActivity, deleteActivity };
