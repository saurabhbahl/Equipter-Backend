// import { userSeed } from "./userSeed.js";
// userSeed();

// import { dbInstance } from "../config/dbConnection.cjs";
// import { userSeed } from "./userSeed.js";
// import { zoneSeeder } from "./zoneSeeder.js";
// import { stateSeeder } from "./stateSeeder.js";
// import { financingRateConfigSeeder } from "./financingRateConfigSeeder.js";
// import { zoneStateSeeder } from "./zoneStateSeeder.js";
// import { productSeeder } from "./productSeeder.js";
// import { shippingMethodSeeder } from "./shippingMethodSeeder.js";
// import { webQuoteSeeder } from "./webQuoteSeeder.js";
// import { fullPaymentSeeder } from "./fullPaymentSeeder.js";
// import { emiPlanSeeder } from "./emiPlanSeeder.js";
// import { installmentsTrackingSeeder } from "./installmentsTrackingSeeder.js";
// import { emiTransactionSeeder } from "./emiTransactionSeeder.js";
// import { orderSeeder } from "./orderSeeder.js";
// import { developmentStageSeeder } from "./developmentStageSeeder.js";
// import { quoteAccessorySeeder } from "./quoteAccessorySeeder.js";
// import { accessoryImage } from "../models/tables.js";
// import { accessoryImageSeeder } from "./accessoryImageSeeder.js";
// import { productImageSeeder } from "./productImageSeeder.js";

// async function runSeeders() {
//   try {
//     console.log("Starting seeders...");

//     // Independent tables
//     await zoneSeeder();
//     await stateSeeder();
//     await financingRateConfigSeeder();

//     // Simple foreign key relationships
//     await zoneStateSeeder();
//     await productSeeder();
//     await accessoryImage();
//     await shippingMethodSeeder();

//     // Dependent tables
//     await accessoryImageSeeder()
//     await productImageSeeder()
//     await webQuoteSeeder();
//     await fullPaymentSeeder();
//     await emiPlanSeeder();
//     await quoteAccessorySeeder();
//     await installmentsTrackingSeeder();
//     await emiTransactionSeeder();
//     await orderSeeder();
//     await developmentStageSeeder();

//     console.log("All seeders executed successfully!");
//   } catch (error) {
//     console.error("Error running seeders:", error);
//   } finally {
//     // Close the database connection
//     dbInstance.end();
//   }
// }

// // Run all seeders
// runSeeders();

import { dbInstance } from "../config/dbConnection.cjs";
import { userSeed } from "./userSeed.js";
import { zoneSeeder } from "./zoneSeeder.js";
import { stateSeeder } from "./stateSeeder.js";
import { financingRateConfigSeeder } from "./financingRateConfigSeeder.js";
import { zoneStateSeeder } from "./zoneStateSeeder.js";
import { productSeeder } from "./productSeeder.js";
import { shippingMethodSeeder } from "./shippingMethodSeeder.js";
import { webQuoteSeeder } from "./webQuoteSeeder.js";
import { fullPaymentSeeder } from "./fullPaymentSeeder.js";
import { emiPlanSeeder } from "./emiPlanSeeder.js";
import { installmentsTrackingSeeder } from "./installmentsTrackingSeeder.js";
import { emiTransactionSeeder } from "./emiTransactionSeeder.js";
import { orderSeeder } from "./orderSeeder.js";
import { developmentStageSeeder } from "./developmentStageSeeder.js";
import { quoteAccessorySeeder } from "./quoteAccessorySeeder.js";
import { accessoryImageSeeder } from "./accessoryImageSeeder.js";
import { productImageSeeder } from "./productImageSeeder.js";
import { accessorySeeder } from "./accessorySeeder.js";
import { accessoryProductSeeder } from "./accessoryProductSeeder.js";

async function runSeeders() {
  try {
    console.log("1.🚀 Starting seeders...");

    console.log("2.🌍 Running zoneSeeder...");
    await zoneSeeder();

    console.log("3.📍 Running stateSeeder...");
    await stateSeeder();

    console.log("4.💰 Running financingRateConfigSeeder...");
    await financingRateConfigSeeder();

    console.log("5.🔗 Running zoneStateSeeder...");
    await zoneStateSeeder();

    console.log("6.🛠️ Running productSeeder...");
    await productSeeder();
    

    console.log("7.🛠️ Running accessorySeeder...");
    await accessorySeeder();

    console.log("8.📷 Running accessoryImageSeeder...");
    await accessoryImageSeeder();

    console.log("9.📷 Running accessoryProductSeeder...");
    await accessoryProductSeeder();

    console.log("10.🚚 Running shippingMethodSeeder...");
    await shippingMethodSeeder();

    console.log("11.🖼️ Running productImageSeeder...");
    await productImageSeeder();

    console.log("12.💬 Running webQuoteSeeder...");
    await webQuoteSeeder();

    console.log("13.💳 Running fullPaymentSeeder...");
    await fullPaymentSeeder();

    console.log("14.📄 Running emiPlanSeeder...");
    await emiPlanSeeder();

    console.log("15.🔢 Running quoteAccessorySeeder...");
    await quoteAccessorySeeder();

    console.log("16.📆 Running installmentsTrackingSeeder...");
    await installmentsTrackingSeeder();

    console.log("17.💸 Running emiTransactionSeeder...");
    await emiTransactionSeeder();

    console.log("18.🛒 Running orderSeeder...");
    await orderSeeder();

    console.log("19.🏗️ Running developmentStageSeeder...");
    await developmentStageSeeder();

    console.log("🎉 All seeders executed successfully!");
  } catch (error) {
    console.error("❌ Error running seeders:", error);
  } finally {
    console.log("🔒 Closing database connection...");

  }
}

// Run all seeders
runSeeders();




// import { dbInstance } from "../config/dbConnection.cjs";
// import { userSeed } from "./userSeed.js";
// import { zoneSeeder } from "./zoneSeeder.js";
// import { stateSeeder } from "./stateSeeder.js";
// import { financingRateConfigSeeder } from "./financingRateConfigSeeder.js";
// import { zoneStateSeeder } from "./zoneStateSeeder.js";
// import { productSeeder } from "./productSeeder.js";
// import { shippingMethodSeeder } from "./shippingMethodSeeder.js";
// import { webQuoteSeeder } from "./webQuoteSeeder.js";
// import { fullPaymentSeeder } from "./fullPaymentSeeder.js";
// import { emiPlanSeeder } from "./emiPlanSeeder.js";
// import { installmentsTrackingSeeder } from "./installmentsTrackingSeeder.js";
// import { emiTransactionSeeder } from "./emiTransactionSeeder.js";
// import { orderSeeder } from "./orderSeeder.js";
// import { developmentStageSeeder } from "./developmentStageSeeder.js";
// import { quoteAccessorySeeder } from "./quoteAccessorySeeder.js";
// import { accessoryImageSeeder } from "./accessoryImageSeeder.js";
// import { productImageSeeder } from "./productImageSeeder.js";
// import { accessorySeeder } from "./accessorySeeder.js";
// import { accessoryProductSeeder } from "./accessoryProductSeeder.js";

// async function runSeeders() {
//   try {
//     console.log("1. 🚀 Starting seeders...");

//     // Independent seeders
//     console.log("2. 🌍 Running zoneSeeder...");
//     await zoneSeeder();

//     console.log("3. 📍 Running stateSeeder...");
//     await stateSeeder();

//     console.log("4. 💰 Running financingRateConfigSeeder...");
//     await financingRateConfigSeeder();

//     // Dependent seeders
//     console.log("5. 🔗 Running zoneStateSeeder...");
//     await zoneStateSeeder();

//     console.log("6. 🛠️ Running productSeeder...");
//     await productSeeder();

//     console.log("7. 🛠️ Running accessorySeeder...");
//     await accessorySeeder();

//     console.log("8. 📷 Running accessoryImageSeeder...");
//     await accessoryImageSeeder();

//     console.log("9. 📦 Running accessoryProductSeeder...");
//     await accessoryProductSeeder();

//     console.log("10. 🚚 Running shippingMethodSeeder...");
//     await shippingMethodSeeder();

//     console.log("11. 🖼️ Running productImageSeeder...");
//     await productImageSeeder();

//     console.log("12. 💬 Running webQuoteSeeder...");
//     await webQuoteSeeder();

//     // Conditional execution to ensure only one payment type per WebQuote
//     const webQuotes = await dbInstance.query("SELECT id, financing FROM web_quote");
//     const fullPaymentEligible = webQuotes.filter((wq) => wq.financing === "cash");
//     const emiEligible = webQuotes.filter((wq) => wq.financing === "financing");

//     if (fullPaymentEligible.length) {
//       console.log("13. 💳 Running fullPaymentSeeder...");
//       await fullPaymentSeeder(fullPaymentEligible.map((wq) => wq.id));
//     }

//     if (emiEligible.length) {
//       console.log("14. 📄 Running emiPlanSeeder...");
//       await emiPlanSeeder(emiEligible.map((wq) => wq.id));
//     }

//     console.log("15. 🔢 Running quoteAccessorySeeder...");
//     await quoteAccessorySeeder();

//     console.log("16. 📆 Running installmentsTrackingSeeder...");
//     await installmentsTrackingSeeder();

//     console.log("17. 💸 Running emiTransactionSeeder...");
//     await emiTransactionSeeder();

//     console.log("18. 🛒 Running orderSeeder...");
//     await orderSeeder();

//     console.log("19. 🏗️ Running developmentStageSeeder...");
//     await developmentStageSeeder();

//     console.log("🎉 All seeders executed successfully!");
//   } catch (error) {
//     console.error("❌ Error running seeders:", error);
//   } finally {
//     console.log("🔒 Closing database connection...");
//     dbInstance.end();
//   }
// }

// // Run all seeders
// runSeeders();
