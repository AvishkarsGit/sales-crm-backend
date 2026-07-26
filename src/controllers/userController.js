import User from "../models/User.js";
import Lead from "../models/Lead.js";
import asyncHandler from "../utils/asyncHandler.js";


const getUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter).sort({ createdAt: -1 });

  const usersWithLeads = await Promise.all(
    users.map(async (user) => {
      const leads = await Lead.find({ assignedTo: user._id }).select(
        "name company status"
      );
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        assignedLeads: leads,
      };
    })
  );

  res.status(200).json(usersWithLeads);
});

export { getUsers };
