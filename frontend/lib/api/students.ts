import { apiClient } from "./client"

export interface ApiColumn {
  field: string
  headerName: string
  type?: string
}

export interface Student {
  id: string
  tenantId: string
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  gender: string
  gradeId: string
  sectionId: string
  aadhaarNumber?: string
  casteCategory?: string
  subCaste?: string
  religion?: string
  motherTongue?: string
  nationality?: string
  identificationMarks?: string
  fatherName?: string
  fatherOccupation?: string
  fatherPhone?: string
  fatherAadhaar?: string
  motherName?: string
  motherOccupation?: string
  motherPhone?: string
  motherAadhaar?: string
  guardianName?: string
  guardianRelation?: string
  guardianContact?: string
  classApplyingFor?: string
  mediumOfInstruction?: string
  previousSchoolName?: string
  previousClassAttended?: string
  transferCertificateNo?: string
  dateOfIssueTC?: string
  modeOfTransport?: string
  studentPassportPhoto?: string
  motherPassportPhoto?: string
  fatherPassportPhoto?: string
  guardianPassportPhoto?: string
  studentAadhaarCopy?: string
  parentsAadharCopy?: string
  birthCertificateCopy?: string
  casteCertificateCopy?: string
  tcCopy?: string
  conductCertificateCopy?: string
  previousYearsMarksheetCopy?: string
  incomeCertificateCopy?: string
  permanentAddress?: string
  state?: string
  pincode?: string
  feePaymentMode?: string
  bankAccountDetails?: string
  midDayMealEligibility?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateStudentRequest {
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  gender: string
  gradeId: string
  sectionId: string
}

export interface UpdateStudentRequest {
  firstName?: string
  middleName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: string
  gradeId?: string
  sectionId?: string
  aadhaarNumber?: string
  casteCategory?: string
  subCaste?: string
  religion?: string
  motherTongue?: string
  nationality?: string
  identificationMarks?: string
  fatherName?: string
  fatherOccupation?: string
  fatherPhone?: string
  fatherAadhaar?: string
  motherName?: string
  motherOccupation?: string
  motherPhone?: string
  motherAadhaar?: string
  guardianName?: string
  guardianRelation?: string
  guardianContact?: string
  classApplyingFor?: string
  mediumOfInstruction?: string
  previousSchoolName?: string
  previousClassAttended?: string
  transferCertificateNo?: string
  dateOfIssueTC?: string
  modeOfTransport?: string
  studentPassportPhoto?: string
  motherPassportPhoto?: string
  fatherPassportPhoto?: string
  guardianPassportPhoto?: string
  studentAadhaarCopy?: string
  parentsAadharCopy?: string
  birthCertificateCopy?: string
  casteCertificateCopy?: string
  tcCopy?: string
  conductCertificateCopy?: string
  previousYearsMarksheetCopy?: string
  incomeCertificateCopy?: string
  permanentAddress?: string
  state?: string
  pincode?: string
  feePaymentMode?: string
  bankAccountDetails?: string
  midDayMealEligibility?: boolean
}

export const studentsApi = {
  list: () => apiClient.get<{ status: string; data: { columns: ApiColumn[]; rows: Student[] }; message: string }>("/students"),

  getById: (id: string) => apiClient.get<{ status: string; data: Student; message: string }>(`/students/${id}`),

  create: (data: CreateStudentRequest) =>
    apiClient.post<{ status: string; data: Student; message: string }>("/students", data),

  update: (id: string, data: UpdateStudentRequest) =>
    apiClient.put<{ status: string; data: Student; message: string }>(`/students/${id}`, data),

  delete: (id: string) => apiClient.delete<{ status: string; message: string }>(`/students/${id}`),
}
