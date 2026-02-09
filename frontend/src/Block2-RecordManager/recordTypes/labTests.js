export const labSchema = {
  patientName: "text",
  testType: {
    type: "dropdown",
    options: ["Blood Test", "X-Ray", "Urine Analysis", "MRI", "ECG"]
  },
  referringDoctor: "text",
  status: {
    type: "dropdown",
    options: ["Pending", "In Progress", "Completed", "Cancelled"]
  },
  labTechnician: "text",
  testDate: "text"
};