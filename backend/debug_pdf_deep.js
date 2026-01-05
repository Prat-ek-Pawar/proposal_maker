const pdf = require("pdf-parse");
console.log("Keys:", Object.keys(pdf));
console.log("Is function?", typeof pdf === "function");
console.log(
  "Is default a function?",
  pdf.default && typeof pdf.default === "function"
);
