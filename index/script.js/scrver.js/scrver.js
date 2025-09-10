const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const xlsx = require("xlsx");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Public folder serve karna
app.use(express.static(path.join(__dirname, "public")));

const FILE_NAME = "patients.xlsx";

// Excel file me data save karne ka function
function saveToExcel(data) {
  let workbook;
  let worksheet;

  if (fs.existsSync(FILE_NAME)) {
    workbook = xlsx.readFile(FILE_NAME);
    worksheet = workbook.Sheets["Patients"];
  } else {
    workbook = xlsx.utils.book_new();
    worksheet = xlsx.utils.json_to_sheet([]);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Patients");
  }

  let oldData = xlsx.utils.sheet_to_json(worksheet);
  oldData.push(data);

  let newSheet = xlsx.utils.json_to_sheet(oldData);
  workbook.Sheets["Patients"] = newSheet;
  xlsx.writeFile(workbook, FILE_NAME);
}

// Form submit API
app.post("/submit", (req, res) => {
  try {
    const { name, mobile, disease, otherDisease } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ success: false, message: "Name & Mobile required!" });
    }

    const patientData = {
      Name: name,
      Mobile: mobile,
      Disease: Array.isArray(disease) ? disease.join(", ") : disease || "",
      OtherDisease: otherDisease || "",
      Date: new Date().toLocaleString()
    };

    saveToExcel(patientData);

    res.json({ success: true, message: "Data saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving data:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Server start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
