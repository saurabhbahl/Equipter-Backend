import { exec } from "child_process";
import { readdir, readFile } from "fs/promises";
import path from "path";

const MIGRATION_FOLDER = "./drizzle/migrations";

async function autoRollback() {
  try {
    console.log("🔄 Rolling back the last migration...");

    // Identify the latest migration file
    const files = await readdir(MIGRATION_FOLDER);
    const migrationFile = files.sort().reverse().find((file) => file.endsWith(".sql"));
    const migrationPath = path.join(MIGRATION_FOLDER, migrationFile);

    console.log(`📄 Last migration: ${migrationFile}`);

    // Read the rollback section from the migration file
    const migrationContent = await readFile(migrationPath, "utf-8");
    const rollbackSQL = extractRollbackSQL(migrationContent);

    if (!rollbackSQL) {
      console.error("❌ No rollback logic found in the last migration file.");
      return;
    }

    // Execute the rollback SQL
    console.log("🔧 Executing rollback...");
    await execCommand(`psql ${process.env.DB_URL} -c "${rollbackSQL}"`);

    console.log("✅ Rollback executed successfully.");
  } catch (error) {
    console.error("❌ Error executing rollback:", error);
  }
}

function extractRollbackSQL(migrationContent) {
  const rollbackSection = migrationContent.split("-- ROLLBACK")[1];
  return rollbackSection ? rollbackSection.trim() : null;
}

async function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log(stdout || stderr);
        resolve(stdout || stderr);
      }
    });
  });
}

autoRollback();
