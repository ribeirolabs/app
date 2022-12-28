const { join } = require("path");
const { readFileSync, writeFileSync } = require("fs");

const envPath = join(__dirname, "../../.env");

const variables = readFileSync(envPath, "utf8")
  .split("\n")
  .filter((env) => !env.startsWith("VERCEL"));

writeFileSync(envPath, variables.join("\n"));
