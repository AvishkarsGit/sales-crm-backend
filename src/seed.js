import mongoose from "mongoose";
import getEnvVariables from "./environment/env.js";
import User from "./models/User.js";
import Lead from "./models/Lead.js";
import Deal from "./models/Deal.js";
import Activity from "./models/Activity.js";

const seedDatabase = async () => {
  try {
    const { mongo_uri } = getEnvVariables();
    const conn = await mongoose.connect(mongo_uri);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    // Clear existing collections
    console.log("Clearing existing database collections...");
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Deal.deleteMany({});
    await Activity.deleteMany({});

    // 1. Seed Users
    console.log("Seeding Users...");
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    const aliceSales = await User.create({
      name: "Alice Sales",
      email: "alice@example.com",
      password: "password123",
      role: "sales",
    });

    const bobSales = await User.create({
      name: "Bob Sales",
      email: "bob@example.com",
      password: "password123",
      role: "sales",
    });

    // 2. Seed Leads
    console.log("Seeding Leads...");
    const leadAcme = await Lead.create({
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+1 555-0101",
      company: "Acme Corp",
      status: "Qualified",
      notes: "Interested in annual subscription enterprise tier.",
      assignedTo: aliceSales._id,
    });

    const leadStark = await Lead.create({
      name: "Stark Industries",
      email: "info@stark.com",
      phone: "+1 555-0102",
      company: "Stark Industries",
      status: "Contacted",
      notes: "Follow up next week after demo.",
      assignedTo: aliceSales._id,
    });

    const leadWayne = await Lead.create({
      name: "Wayne Enterprises",
      email: "bruce@wayne.com",
      phone: "+1 555-0103",
      company: "Wayne Enterprises",
      status: "New",
      notes: "Requested pricing catalogue.",
      assignedTo: bobSales._id,
    });

    const leadCyberdyne = await Lead.create({
      name: "Cyberdyne Systems",
      email: "sales@cyberdyne.com",
      phone: "+1 555-0104",
      company: "Cyberdyne Systems",
      status: "Qualified",
      notes: "Looking for customized enterprise workflow.",
      assignedTo: bobSales._id,
    });

    const leadGlobex = await Lead.create({
      name: "Globex Corporation",
      email: "hank@globex.com",
      phone: "+1 555-0105",
      company: "Globex",
      status: "Lost",
      notes: "Budget freeze this quarter.",
      assignedTo: aliceSales._id,
    });

    // 3. Seed Deals
    console.log("Seeding Deals...");
    const dealAcme = await Deal.create({
      title: "Acme Enterprise License",
      value: 25000,
      stage: "Negotiation",
      lead: leadAcme._id,
      createdBy: aliceSales._id,
    });

    const dealStark = await Deal.create({
      title: "Stark R&D Pilot Package",
      value: 50000,
      stage: "Prospect",
      lead: leadStark._id,
      createdBy: aliceSales._id,
    });

    const dealWayne = await Deal.create({
      title: "Wayne Security CRM Setup",
      value: 15000,
      stage: "Won",
      lead: leadWayne._id,
      createdBy: bobSales._id,
    });

    const dealCyberdyne = await Deal.create({
      title: "Cyberdyne Automated Pipeline",
      value: 35000,
      stage: "Prospect",
      lead: leadCyberdyne._id,
      createdBy: bobSales._id,
    });

    // 4. Seed Activities
    console.log("Seeding Activities...");
    await Activity.create([
      {
        type: "Call",
        description: "Introductory discovery call with CTO to discuss licensing.",
        lead: leadAcme._id,
        deal: dealAcme._id,
        createdBy: aliceSales._id,
      },
      {
        type: "Meeting",
        description: "Demo presentation of sales analytics dashboard.",
        lead: leadAcme._id,
        deal: dealAcme._id,
        createdBy: aliceSales._id,
      },
      {
        type: "Note",
        description: "Client requested SLA agreement details before signing.",
        lead: leadStark._id,
        deal: dealStark._id,
        createdBy: aliceSales._id,
      },
      {
        type: "Call",
        description: "Discussed pricing breakdown and onboarding schedule.",
        lead: leadWayne._id,
        deal: dealWayne._id,
        createdBy: bobSales._id,
      },
      {
        type: "Follow-up",
        description: "Sent follow-up email with technical documentation.",
        lead: leadCyberdyne._id,
        deal: dealCyberdyne._id,
        createdBy: bobSales._id,
      },
    ]);

    console.log("==========================================");
    console.log("Database seeded successfully!");
    console.log("==========================================");
    console.log("Admin account  -> Email: admin@example.com | Password: password123");
    console.log("Sales account 1-> Email: alice@example.com | Password: password123");
    console.log("Sales account 2-> Email: bob@example.com   | Password: password123");
    console.log("==========================================");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
