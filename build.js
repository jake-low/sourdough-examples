import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const exampleName = process.argv[2];

if (!exampleName) {
  console.error("Usage: node build.js <example-name>");
  process.exit(1);
}

const stylePath = path.join(__dirname, exampleName, "style.js");

try {
  const { style } = await import(stylePath);
  console.log(JSON.stringify(style, null, 2));
} catch (error) {
  console.error(`Failed to build ${exampleName}:`, error.message);
  process.exit(1);
}
