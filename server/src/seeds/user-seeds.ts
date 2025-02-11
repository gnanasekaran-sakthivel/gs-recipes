import { User } from "../models/user.js";
import { sequelize } from "../models/index.js";

const seedUsers = async () => {
  await sequelize.sync({ force: true });
  await User.bulkCreate(
    [
      { username: "TammyP", password: "ilikecheese2" },
      { username: "NovaBean", password: "iamdog0322" },
      { username: "HelloKitty", password: "kuromi1104" },
    ],
    { individualHooks: true }
  );
};

seedUsers();
