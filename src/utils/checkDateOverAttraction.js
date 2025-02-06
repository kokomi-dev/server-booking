const cron = require("node-cron");
const Attraction = require("../models/Attraction");

cron.schedule("0 0 * * *", async () => {
  const today = new Date().toISOString();
  await Attraction.updateMany(
    { startDate: { $lt: today } },
    { isOverDate: true }
  );
});
