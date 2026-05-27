const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");
const { ensureDemoUser } = require("./utils/seedDemoUser");

const startServer = async () => {
  await connectDB();
  // Keep the demo admin account available on every deployment.
  const demoUser = await ensureDemoUser();
  console.log(`Demo admin ready: ${demoUser.email}`);
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
