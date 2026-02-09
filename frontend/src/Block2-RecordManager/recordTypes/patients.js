// File: src/Block2-RecordManager/recordTypes/patients.js
export const patientSchema = {
  name: "text",
  age: "number",
  phone: "text",
  gender: {
    type: "dropdown",
    options: ["Male", "Female", "Other"]
  },
  status: {
    type: "dropdown",
    options: ["Active", "Inactive", "Pending"]
  }
};