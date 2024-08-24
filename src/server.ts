import mongoose from "mongoose";
import { app } from "./app";
import config from "./app/config";
import seedAdmin from "./app/DB";


async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    await seedAdmin();
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
