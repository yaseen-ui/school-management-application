const XLSX = require("xlsx");

// Exact order from FACULTY_FIELDS in imports.service.js (16 fields)
const headers = [
  "fullName", "email", "phone", "gender", "employeeCode", "employeeType",
  "dateOfBirth", "dateOfJoining", "yearsOfExperience",
  "governmentIdType", "governmentIdNumber",
  "drivingLicenseNumber", "drivingExperienceYears", "vehicleType", "licenseExpiryDate",
];

function row(fullName, email, phone, gender, employeeCode, employeeType, dob, doj, yrsExp, govIdType, govIdNum, dlNum, dlYrs, vehicleType, licExpiry) {
  return [
    fullName || "", email || "", phone || "", gender || "",
    employeeCode || "", employeeType || "teacher",
    dob || "", doj || "", yrsExp != null ? String(yrsExp) : "",
    govIdType || "", govIdNum != null ? String(govIdNum) : "",
    dlNum || "", dlYrs != null ? String(dlYrs) : "",
    vehicleType || "", licExpiry || "",
  ];
}

const rows = [
  row("Rajesh Kumar", "rajesh.kumar@school.in", "+919876540101", "Male", "EMP-001", "teacher", "15/05/1985", "01/06/2015", "10", "aadhar", "123456789012", "", "", "", ""),
  row("Sunita Sharma", "sunita.sharma@school.in", "+919876540102", "Female", "EMP-002", "teacher", "22/09/1990", "15/06/2017", "8", "aadhar", "234567890123", "", "", "", ""),
  row("Vikram Patel", "vikram.patel@school.in", "+919876540103", "Male", "EMP-003", "admin", "10/03/1982", "01/04/2012", "13", "pan", "ABCDE1234F", "", "", "", ""),
  row("Anita Desai", "anita.desai@school.in", "+919876540104", "Female", "EMP-004", "clerk", "05/08/1992", "01/07/2019", "6", "aadhar", "345678901234", "", "", "", ""),
  row("Mohammed Asif", "mohammed.asif@school.in", "+919876540105", "Male", "EMP-005", "security", "18/11/1980", "01/01/2018", "7", "voter_id", "VOT123456", "", "", "", ""),
  row("Priya Banerjee", "priya.banerjee@school.in", "+919876540106", "Female", "EMP-006", "accountant", "30/01/1988", "01/09/2016", "9", "pan", "FGHIJ5678G", "", "", "", ""),
  row("Suresh Yadav", "suresh.yadav@school.in", "+919876540107", "Male", "EMP-007", "driver", "25/04/1983", "01/03/2014", "11", "aadhar", "456789012345", "DL-0012345", "8", "bus", "15/06/2028"),
  row("Deepa Nair", "deepa.nair@school.in", "+919876540108", "Female", "EMP-008", "teacher", "12/12/1991", "01/07/2020", "5", "aadhar", "567890123456", "", "", "", ""),
  row("Kamlesh Tiwari", "kamlesh.tiwari@school.in", "+919876540109", "Male", "EMP-009", "office_boy", "08/01/1995", "01/10/2021", "4", "aadhar", "678901234567", "", "", "", ""),
  row("Lakshmi Iyer", "lakshmi.iyer@school.in", "+919876540110", "Female", "EMP-010", "cleaner", "20/06/1986", "01/05/2019", "6", "voter_id", "VOT789012", "", "", "", ""),
];

const headerCount = headers.length;
console.log("Headers:", headerCount);
let allOk = true;
rows.forEach((r, i) => {
  if (r.length !== headerCount) {
    console.error(`FAIL Row ${i + 2}: ${r.length} cols (expected ${headerCount})`);
    allOk = false;
  }
});
if (allOk) console.log(`All ${rows.length} rows: OK`);

const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Faculty");
XLSX.writeFile(wb, "test-imports/faculty-import.xlsx");
console.log("Wrote test-imports/faculty-import.xlsx");