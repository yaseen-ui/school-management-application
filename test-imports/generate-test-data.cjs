const XLSX = require("xlsx");

// Exact order from STUDENT_FIELDS in imports.service.js (42 fields)
const headers = [
  "admissionNumber", "pen", "apaarId",
  "firstName", "middleName", "lastName", "dateOfBirth", "gender",
  "aadhaarNumber", "casteCategory", "subCaste", "religion",
  "motherTongue", "bloodGroup", "nationality", "identificationMarks",
  "fatherName", "fatherOccupation", "fatherPhone", "fatherAadhaar",
  "motherName", "motherOccupation", "motherPhone", "motherAadhaar",
  "guardianName", "guardianRelation", "guardianContact",
  "guardianOccupation", "guardianAadhaar",
  "classApplyingFor", "mediumOfInstruction",
  "previousSchoolName", "previousClassAttended",
  "transferCertificateNo", "dateOfIssueTC", "modeOfTransport",
  "permanentAddress", "state", "pincode",
  "feePaymentMode", "bankAccountDetails", "midDayMealEligibility"
];

function row(admissionNumber, firstName, middleName, lastName, dob, gender, aadhaar, caste, subCaste, religion, motherTongue, bloodGroup, nationality, identMarks, fatherName, fatherOcc, fatherPhone, fatherAadhaar, motherName, motherOcc, motherPhone, motherAadhaar, guardianName, guardianRel, guardianPhone, guardianOcc, guardianAadhaar, classApplying, medium, prevSchool, prevClass, tcNo, tcDate, transport, address, stateVal, pincode, feeMode, bankDetails, mdm) {
  return [admissionNumber || "", "", "", firstName, middleName || "", lastName, dob, gender, aadhaar || "", caste || "", subCaste || "", religion || "", motherTongue || "", bloodGroup || "", nationality || "Indian", identMarks || "", fatherName || "", fatherOcc || "", fatherPhone || "", fatherAadhaar || "", motherName || "", motherOcc || "", motherPhone || "", motherAadhaar || "", guardianName || "", guardianRel || "", guardianPhone || "", guardianOcc || "", guardianAadhaar || "", classApplying || "", medium || "", prevSchool || "", prevClass || "", tcNo || "", tcDate || "", transport || "", address || "", stateVal || "", pincode || "", feeMode || "", bankDetails || "", mdm || ""];
}

const rows = [
  row("ADM-2026-011", "Aditya", "Raj", "Mehta", "11/05/2018", "Male", "", "General", "", "Hindu", "Hindi", "A+", "Indian", "", "Sanjay Mehta", "Chartered Accountant", "+919876543222", "", "Pooja Mehta", "Architect", "+919876543223", "", "", "", "", "", "", "", "", "English", "Ryan International School", "", "TC-011", "10/04/2026", "Bus", "21 Sector 15 Gurugram", "Haryana", "122001", "Online", "", "false"),

  row("ADM-2026-012", "Zoya", "Fatima", "Sheikh", "27/10/2018", "Female", "", "OBC", "", "Muslim", "Urdu", "O+", "Indian", "", "Arif Sheikh", "Software Engineer", "+919876543224", "", "Nazia Sheikh", "Homemaker", "+919876543225", "", "", "", "", "", "", "", "", "English", "Crescent Public School", "", "TC-012", "11/04/2026", "Van", "44 Banjara Hills Hyderabad", "Telangana", "500034", "Cash", "", "false"),

  row("ADM-2026-013", "Kabir", "", "Malhotra", "08/03/2019", "Male", "", "General", "", "Hindu", "Punjabi", "B+", "Indian", "", "Rohit Malhotra", "Businessman", "+919876543226", "", "Simran Malhotra", "Fashion Designer", "+919876543227", "", "", "", "", "", "", "", "", "English", "Delhi Public School", "", "TC-013", "12/04/2026", "Bus", "18 Model Town Ludhiana", "Punjab", "141002", "Online", "", "true"),

  row("ADM-2026-014", "Meera", "Lakshmi", "Iyer", "19/07/2018", "Female", "", "General", "", "Hindu", "Tamil", "AB+", "Indian", "", "Krishnan Iyer", "Bank Manager", "+919876543228", "", "Revathi Iyer", "Lecturer", "+919876543229", "", "", "", "", "", "", "", "", "English", "Vidya Mandir", "", "TC-014", "13/04/2026", "Van", "29 T Nagar Chennai", "Tamil Nadu", "600017", "Online", "", "false"),

  row("ADM-2026-015", "Atharv", "", "Kulkarni", "02/12/2018", "Male", "", "General", "", "Hindu", "Marathi", "A-", "Indian", "", "Nitin Kulkarni", "Civil Engineer", "+919876543230", "", "Swati Kulkarni", "Dentist", "+919876543231", "", "", "", "", "", "", "", "", "English", "Orchid International School", "", "TC-015", "14/04/2026", "Bus", "63 Kothrud Pune", "Maharashtra", "411038", "Cash", "", "false"),

  row("ADM-2026-016", "Sara", "Maria", "Fernandes", "16/01/2019", "Female", "", "Christian", "", "Christian", "Konkani", "O-", "Indian", "", "Anthony Fernandes", "Hotel Manager", "+919876543232", "", "Clara Fernandes", "Teacher", "+919876543233", "", "Joseph Fernandes", "Uncle", "+919876543234", "", "", "", "", "English", "St Marys High School", "", "TC-016", "15/04/2026", "Bus", "14 Panjim Market Road", "Goa", "403001", "Online", "", "true"),

  row("ADM-2026-017", "Devansh", "Mohan", "Joshi", "21/09/2018", "Male", "", "General", "", "Hindu", "Hindi", "B-", "Indian", "", "Mohan Joshi", "Government Employee", "+919876543235", "", "Kavita Joshi", "Homemaker", "+919876543236", "", "", "", "", "", "", "", "", "Hindi", "Kendriya Vidyalaya", "", "TC-017", "16/04/2026", "Van", "52 Arera Colony Bhopal", "Madhya Pradesh", "462016", "Cash", "", "false"),

  row("ADM-2026-018", "Aisha", "Noor", "Rahman", "06/06/2018", "Female", "", "OBC", "", "Muslim", "Bengali", "A+", "Indian", "", "Faisal Rahman", "Doctor", "+919876543237", "", "Nusrat Rahman", "Pharmacist", "+919876543238", "", "", "", "", "", "", "", "", "English", "Don Bosco School", "", "TC-018", "17/04/2026", "Bus", "91 New Town Kolkata", "West Bengal", "700156", "Online", "", "false"),

  row("ADM-2026-019", "Nikhil", "", "Panda", "13/04/2019", "Male", "", "SC", "", "Hindu", "Odia", "O+", "Indian", "", "Pradeep Panda", "Railway Employee", "+919876543239", "", "Mamata Panda", "Nurse", "+919876543240", "", "", "", "", "", "", "", "", "English", "DAV Public School", "", "TC-019", "18/04/2026", "Bus", "37 Saheed Nagar Bhubaneswar", "Odisha", "751007", "Online", "", "true"),

  row("ADM-2026-020", "Tanvi", "Ramesh", "Desai", "28/08/2018", "Female", "", "General", "", "Hindu", "Gujarati", "AB-", "Indian", "", "Ramesh Desai", "Textile Merchant", "+919876543241", "", "Bhavna Desai", "Accountant", "+919876543242", "", "Ketan Desai", "Uncle", "+919876543243", "", "", "", "", "English", "", "", "TC-020", "19/04/2026", "Van", "76 Alkapuri Vadodara", "Gujarat", "390007", "Cash", "", "false"),
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
if (allOk) console.log("All 10 rows: OK");

const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Section B Students");
XLSX.writeFile(wb, "test-imports/section-b-students.xlsx");
console.log("Wrote test-imports/section-b-students.xlsx");