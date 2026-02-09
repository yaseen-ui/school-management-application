export const tableColumns = {
  tenants: [
    { field: "schoolName", headerName: "School Name" },
    { field: "contactAddress.street", headerName: "Street Address" },
    { field: "contactAddress.city", headerName: "City" },
    { field: "contactAddress.state", headerName: "State" },
    { field: "contactAddress.zip", headerName: "Zip Code" },
    { field: "contactPhone", headerName: "Contact Phone" },
    { field: "contactEmail", headerName: "Contact Email" },
    { field: "adminFullName", headerName: "Admin Full Name" },
    { field: "adminPhone", headerName: "Admin Phone" },
    { field: "adminEmail", headerName: "Admin Email" },
    { field: "subscriptionPlan", headerName: "Subscription Plan" },
    { field: "domain", headerName: "Domain" },
    { field: "logo", headerName: "Logo", type: "profilePic" },
    { field: "caption", headerName: "Caption" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" }
  ],

  classes: [
    { field: "className", headerName: "Class Name" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
    ],
  students: [
    // Personal Details
    { field: "firstName", headerName: "First Name" },
    { field: "middleName", headerName: "Middle Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "dateOfBirth", headerName: "Date of Birth" },
    { field: "gender", headerName: "Gender" },

    // Identification Details
    { field: "aadhaarNumber", headerName: "Aadhaar Number" },
    { field: "casteCategory", headerName: "Caste Category" },
    { field: "subCaste", headerName: "Sub Caste" },
    { field: "religion", headerName: "Religion" },
    { field: "motherTongue", headerName: "Mother Tongue" },
    { field: "bloodGroup", headerName: "Blood Group" },
    { field: "nationality", headerName: "Nationality" },
    { field: "identificationMarks", headerName: "Identification Marks" },

    // Admission Details
    { field: "classApplyingFor", headerName: "Class Applying For" },
    { field: "mediumOfInstruction", headerName: "Medium of Instruction" },
    { field: "previousSchoolName", headerName: "Previous School Name" },
    { field: "previousClassAttended", headerName: "Previous Class Attended" },
    { field: "transferCertificateNo", headerName: "Transfer Certificate Number" },
    { field: "dateOfIssueTC", headerName: "Date of Issue of TC" },
    { field: "modeOfTransport", headerName: "Mode of Transport" },

    // Parent/Guardian Details
    { field: "fatherName", headerName: "Father's Name" },
    { field: "fatherPhone", headerName: "Father's Phone Number" },
    { field: "fatherOccupation", headerName: "Father's Occupation" },
    { field: "fatherAadhaar", headerName: "Father's Aadhaar Number" },
    { field: "motherName", headerName: "Mother's Name" },
    { field: "motherPhone", headerName: "Mother's Phone Number" },
    { field: "motherOccupation", headerName: "Mother's Occupation" },
    { field: "motherAadhaar", headerName: "Mother's Aadhaar Number" },
    { field: "guardianName", headerName: "Guardian's Name" },
    { field: "guardianRelation", headerName: "Guardian's Relation to Student" },
    { field: "guardianContact", headerName: "Guardian's Contact Number" },

    // Address Details
    { field: "permanentAddress", headerName: "Permanent Address" },
    { field: "state", headerName: "State" },
    { field: "pincode", headerName: "Pincode" },

    // Fee & Scholarship Details
    { field: "feePaymentMode", headerName: "Fee Payment Mode" },
    { field: "bankAccountDetails", headerName: "Bank Account Details" },
    { field: "midDayMealEligibility", headerName: "Mid-Day Meal Eligibility" },

    // Grade & Section (Snapshot)

    // Documents
    { field: "studentPassportPhoto", headerName: "Student Passport Photo" },
    { field: "motherPassportPhoto", headerName: "Mother's Passport Photo" },
    { field: "fatherPassportPhoto", headerName: "Father's Passport Photo" },
    { field: "guardianPassportPhoto", headerName: "Guardian's Passport Photo" },
    { field: "studentAadharCopy", headerName: "Student Aadhaar Copy" },
    { field: "parentsAadharCopy", headerName: "Parents' Aadhaar Copy" },
    { field: "casteCertificateCopy", headerName: "Caste Certificate Copy" },
    { field: "birthCertificateCopy", headerName: "Birth Certificate Copy" },
    { field: "tcCopy", headerName: "Transfer Certificate Copy" },
    { field: "conductCertificateCopy", headerName: "Conduct Certificate Copy" },
    { field: "previousYearsMarksheetCopy", headerName: "Previous Years' Marksheet Copy" },
    { field: "incomeCertificateCopy", headerName: "Income Certificate Copy" },

    // Tenant ID

    // Metadata
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ],
  grades: [
    { field: "courseName", headerName: "Course Name" },
    { field: "gradeName", headerName: "Grade Name" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ],
  course: [
    { field: "courseName", headerName: "Course Name" },
    { field: "description", headerName: "Course Description" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ],
  section: [
    // { field: "id", headerName: "Section ID" },
    // { field: "tenantId", headerName: "Tenant ID" },
    // { field: "gradeId", headerName: "Grade ID" },
    { field: "gradeName", headerName: "Grade Name" },
    { field: "sectionName", headerName: "Section Name" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ],
  academicYears: [
    { field: "name", headerName: "Academic Year" },
    { field: "startDate", headerName: "Start Date" },
    { field: "endDate", headerName: "End Date" },
    { field: "status", headerName: "Status" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ],
  teachers: [
    { field: "fullName", headerName: "Full Name" },
    { field: "email", headerName: "Email" },
    { field: "phone", headerName: "Phone" },
    { field: "gender", headerName: "Gender" },
    { field: "employeeCode", headerName: "Employee Code" },
    { field: "profilePhotoUrl", headerName: "Profile Photo" },
    { field: "yearsOfExperience", headerName: "Years of Experience" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ],
};

