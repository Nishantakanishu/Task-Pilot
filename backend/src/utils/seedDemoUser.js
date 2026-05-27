const User = require("../models/User.model");
const ROLES = require("../constants/roles");

const DEMO_USER = {
  name: "Nishu Chaubey",
  email: "nishuchaube12@gmail.com",
  password: "12345678",
  role: ROLES.ADMIN,
};

const ensureDemoUser = async () => {
  const existingUser = await User.findOne({ email: DEMO_USER.email });

  if (existingUser) {
    existingUser.name = DEMO_USER.name;
    existingUser.password = DEMO_USER.password;
    existingUser.role = DEMO_USER.role;
    await existingUser.save();
    return existingUser;
  }

  return User.create(DEMO_USER);
};

module.exports = {
  DEMO_USER,
  ensureDemoUser,
};
