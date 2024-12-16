// import { exec } from "child_process";
// import { readdir, readFile, writeFile } from "fs/promises";
// import path from "path";

// const MIGRATION_FOLDER = "./drizzle/migrations";

// async function autoGenerateMigration() {
//   try {
//     console.log("🚀 Generating migration...");
//     await execCommand("npx drizzle-kit generate");

//     // Identify the latest migration file
//     const files = await readdir(MIGRATION_FOLDER);
//     const migrationFile = files.sort().reverse().find((file) => file.endsWith(".sql"));

//     if (!migrationFile) {
//       throw new Error("No migration files found. Make sure the migration process completed successfully.");
//     }

//     const migrationPath = path.join(MIGRATION_FOLDER, migrationFile);
//     console.log(`📄 Latest migration: ${migrationFile}`);

//     // Read the migration file
//     const migrationContent = await readFile(migrationPath, "utf-8");

//     // Generate rollback SQL
//     const rollbackSQL = generateRollbackSQL(migrationContent);

//     if (!rollbackSQL.trim()) {
//       console.log("⚠️ No rollback logic generated. Ensure your migration file has reversible SQL.");
//       return;
//     }

//     // Append rollback logic
//     const updatedContent = `${migrationContent.trim()}\n\n-- ROLLBACK\n${rollbackSQL.trim()}`;
//     await writeFile(migrationPath, updatedContent, "utf-8");

//     console.log(`✅ Rollback logic appended to ${migrationFile}`);
//   } catch (error) {
//     console.error("❌ Error generating migration with rollback:", error.message);
//   }
// }

// function generateRollbackSQL(migrationContent) {
//   const lines = migrationContent.split("\n");
//   const rollbackStatements = lines.map((line) => {
//     try {
//       if (line.trim().startsWith("CREATE TABLE")) {
//         const match = line.match(/CREATE TABLE (\w+)/i);
//         const tableName = match?.[1];
//         if (tableName) return `DROP TABLE IF EXISTS ${tableName};`;
//       }

//       if (line.trim().startsWith("ALTER TABLE")) {
//         const match = line.match(/ALTER TABLE (\w+)/i);
//         const tableName = match?.[1];
//         if (tableName) return `-- Reverse ALTER TABLE ${tableName} manually.`;
//       }

//       if (line.trim().startsWith("CREATE INDEX")) {
//         const match = line.match(/CREATE INDEX (\w+)/i);
//         const indexName = match?.[1];
//         if (indexName) return `DROP INDEX IF EXISTS ${indexName};`;
//       }
//     } catch (err) {
//       console.error(`⚠️ Error processing line for rollback: "${line.trim()}"`, err.message);
//     }
//     return ""; // Default to no action for unsupported lines
//   });

//   return rollbackStatements.filter((stmt) => stmt).join("\n");
// }

// async function execCommand(command) {
//   return new Promise((resolve, reject) => {
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         reject(error);
//       } else {
//         console.log(stdout || stderr);
//         resolve(stdout || stderr);
//       }
//     });
//   });
// }

// autoGenerateMigration();


// import { exec } from "child_process";
// import { readdir, readFile, writeFile } from "fs/promises";
// import path from "path";


// // Paths for migrations and rollbacks
// const migrationsDir = "./drizzle/migrations";
// const rollbacksDir = "./drizzle/rollbacks";

// // Utility to execute shell commands
// const execCommand = (command) => {
//   return new Promise((resolve, reject) => {
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         reject(`Error: ${stderr}`);
//       } else {
//         resolve(stdout);
//       }
//     });
//   });
// };

// // Function to generate migration and rollback
// async function generateMigration(name) {
//   const timestamp = Date.now();
//   const migrationFileName = `migration_${timestamp}_${name}.js`;
//   const rollbackFileName = `rollback_${timestamp}_${name}.js`;

//   // Ensure directories exist
//   await fs.mkdir(migrationsDir, { recursive: true });
//   await fs.mkdir(rollbacksDir, { recursive: true });

//   // Run drizzle-kit to generate migration
//   console.log("Running Drizzle migration generator...");
//   try {
//     const drizzleOutput = await execCommand("npx drizzle-kit generate");
//     console.log(drizzleOutput);
//   } catch (error) {
//     console.error("Failed to generate migration using drizzle-kit:", error);
//     process.exit(1);
//   }

//   // Create a sample migration content
//   const migrationContent = `import { sql } from "drizzle-orm";

// export default sql\`
//   CREATE TABLE ${name} (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) NOT NULL
//   );
// \`;
// `;

//   // Write migration file
//   await fs.writeFile(path.join(migrationsDir, migrationFileName), migrationContent);

//   // Create rollback content
//   const rollbackContent = `import { sql } from "drizzle-orm";

// export default sql\`
//   DROP TABLE IF EXISTS ${name};
// \`;
// `;

//   // Write rollback file
//   await fs.writeFile(path.join(rollbacksDir, rollbackFileName), rollbackContent);

//   console.log(`Migration created: ${migrationFileName}`);
//   console.log(`Rollback created: ${rollbackFileName}`);
// }

// // Run the function to generate migration and rollback files
// const migrationName = process.argv[2]; // Pass table name as argument
// if (!migrationName) {
//   console.error("Please provide a name for the migration!");
//   process.exit(1);
// }

// generateMigration(migrationName).catch((error) => {
//   console.error("An error occurred:", error);
// });



// import { exec } from "child_process";
// import { mkdir, writeFile } from "fs/promises";
// import path from "path";

// // Paths for migrations and rollbacks
// const migrationsDir = "./drizzle/migrations";
// const rollbacksDir = "./drizzle/rollbacks";

// // Utility to execute shell commands
// const execCommand = (command) => {
//   return new Promise((resolve, reject) => {
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         reject(`Error: ${stderr}`);
//       } else {
//         resolve(stdout);
//       }
//     });
//   });
// };

// // Function to generate migration and rollback
// async function generateMigration(name) {
//   const timestamp = Date.now();
//   const migrationFileName = `migration_${timestamp}_${name}.js`;
//   const rollbackFileName = `rollback_${timestamp}_${name}.js`;

//   // Ensure directories exist
//   await mkdir(migrationsDir, { recursive: true });
//   await mkdir(rollbacksDir, { recursive: true });

//   // Run drizzle-kit to generate migration
//   console.log("Running Drizzle migration generator...");
//   try {
//     const drizzleOutput = await execCommand(`npx drizzle-kit generate --name ${migrationFileName}`);
//     console.log(drizzleOutput);
//   } catch (error) {
//     console.error("Failed to generate migration using drizzle-kit:", error);
//     process.exit(1);
//   }

//   // Create rollback content
//   const rollbackContent = `import { sql } from "drizzle-orm";

// export default sql\`
//   DROP TABLE IF EXISTS ${name};
// \`;
// `;

//   // Write rollback file
//   const rollbackPath = path.join(rollbacksDir, rollbackFileName);
//   await writeFile(rollbackPath, rollbackContent, "utf8");

//   console.log(`Migration created: ${migrationPath}`);
//   console.log(`Rollback created: ${rollbackPath}`);
// }

// // Run the function to generate migration and rollback files
// const migrationName = process.argv[2]; // Pass table name as argument
// if (!migrationName) {
//   console.error("Please provide a name for the migration!");
//   process.exit(1);
// }

// generateMigration(migrationName).catch((error) => {
//   console.error("An error occurred:", error);
// });
import { exec } from "child_process";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";

// Paths for migrations and rollbacks
const migrationsDir = "./drizzle/migrations";
const rollbacksDir = "./drizzle/rollbacks";

// Utility to execute shell commands
const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Extract tables and enums from migration file
const extractTablesAndEnums = async (migrationPath) => {
  const migrationContent = await readFile(migrationPath, "utf8");
  const tableRegex = /CREATE TABLE (\w+)/g;
  const enumRegex = /CREATE TYPE (\w+)/g;

  const tables = [...migrationContent.matchAll(tableRegex)].map((match) => match[1]);
  const enums = [...migrationContent.matchAll(enumRegex)].map((match) => match[1]);

  return { tables, enums };
};

// Generate rollback SQL from tables and enums
const generateRollbackSQL = ({ tables, enums }) => {
  const dropTables = tables.map((table) => `DROP TABLE IF EXISTS ${table};`).join("\n");
  const dropEnums = enums.map((enumType) => `DROP TYPE IF EXISTS ${enumType};`).join("\n");
  return `${dropTables}\n${dropEnums}`;
};

// Function to generate migration and rollback
async function generateMigration(name) {
  const timestamp = Date.now();


  const rollbackFileName = `rollback_${timestamp}_${name}.js`;
  const rollbackPath = path.join(rollbacksDir, rollbackFileName);

  // Ensure directories exist
  await mkdir(migrationsDir, { recursive: true });
  await mkdir(rollbacksDir, { recursive: true });

  // Run drizzle-kit to generate migration
  console.log("Running Drizzle migration generator...");
  try {
    await execCommand(`npx drizzle-kit generate --name ${name}`);
    console.log(`Migration file generated: ${migrationPath}`);
  } catch (error) {
    console.error("Failed to generate migration using drizzle-kit:", error);
    process.exit(1);
  }

  // Extract tables and enums from the migration file
  const { tables, enums } = await extractTablesAndEnums(migrationPath);

  // Generate rollback SQL
  const rollbackSQL = generateRollbackSQL({ tables, enums });

  // Write rollback file
  await writeFile(rollbackPath, `import { sql } from "drizzle-orm";\n\nexport default sql\`\n${rollbackSQL}\n\`;`, "utf8");

  console.log(`Rollback file created: ${rollbackPath}`);
}

// Run the function to generate migration and rollback files
const migrationName = process.argv[2]; // Pass table name as argument
if (!migrationName) {
  console.error("Please provide a name for the migration!");
  process.exit(1);
}

generateMigration(migrationName).catch((error) => {
  console.error("An error occurred:", error);
});
