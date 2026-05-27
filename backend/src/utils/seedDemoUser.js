const User = require("../models/User.model");
const ROLES = require("../constants/roles");
const bcrypt = require("bcryptjs");

const DEMO_USER = {
  name: "Nishu Chaubey",
  email: "nishuchaube12@gmail.com",
  password: "123456",
  role: ROLES.ADMIN,
};

const ensureDemoUser = async () => {
  const hashedPassword = await bcrypt.hash(DEMO_USER.password, 12);

  // Update every matching document so stale duplicates cannot keep old credentials around.
  await User.updateMany(
    { email: DEMO_USER.email },
    {
      $set: {
        name: DEMO_USER.name,
        password: hashedPassword,
        role: DEMO_USER.role,
      },
    }
  );

  const existingUser = await User.findOne({ email: DEMO_USER.email });
  if (existingUser) {
    return existingUser;
  }

  return User.create(DEMO_USER);
};

module.exports = {
  DEMO_USER,
  ensureDemoUser,
};
