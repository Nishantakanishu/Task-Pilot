const app = require("./app");
const connectDB = require("./config/db");
const { PORT, NODE_ENV } = require("./config/env");
const { ensureDemoUser } = require("./utils/seedDemoUser");

const startServer = async () => {
  await connectDB();
  if (NODE_ENV !== "production") {
    await ensureDemoUser();
  }
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
