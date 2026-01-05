const pdf = require("pdf-parse");
const fs = require("fs");

console.log("Type of pdf:", typeof pdf);
console.log("pdf:", pdf);

// Create a dummy PDF file or just check if it's a function
if (typeof pdf === "function") {
  console.log("PDF-parse is correctly loaded as a function.");
} else {
  console.log("PDF-parse is NOT a function.");
}
