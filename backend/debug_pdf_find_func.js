const pdfParse = require("pdf-parse");

console.log("Is pdfParse a function?", typeof pdfParse === "function");
console.log("Keys of pdfParse:", Object.keys(pdfParse));

for (const key of Object.keys(pdfParse)) {
  if (typeof pdfParse[key] === "function") {
    console.log(`Found function key: ${key}`);
  }
}
