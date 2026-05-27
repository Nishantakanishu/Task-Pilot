const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const { DEMO_USER, ensureDemoUser } = require("./src/utils/seedDemoUser");

const seedUser = async () => {
  try {
    // Connect to database
    await connectDB();
    const user = await ensureDemoUser();
    console.log(`Demo user ready: ${DEMO_USER.email}`);

    console.log("\nUser Details:");
    console.log(`- Name: ${user.name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- Password: [Hidden (${DEMO_USER.password})]`);

  } catch (error) {
    console.error("❌ Error seeding user:", error);
  } finally {
    // Disconnect from database
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
};

seedUser();
