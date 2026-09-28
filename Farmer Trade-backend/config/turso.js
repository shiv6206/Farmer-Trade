import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const databaseUrl = process.env.TURSO_DATABASE_URL || "file:./local.db";

if (process.env.NODE_ENV === "production" && databaseUrl.startsWith("file:")) {
  throw new Error("Production requires a remote Turso/libSQL database; local SQLite is not durable deployment storage");
}

const tursoClient = createClient({
  url: databaseUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const initializeSchema = async () => {
  const schemaPath = join(__dirname, "..", "models", "schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");
  const statements = schema
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await tursoClient.execute(statement + ";");
  }

  console.log("Turso schema initialized successfully");
};

export { tursoClient, initializeSchema };
export default tursoClient;