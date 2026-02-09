export const medicineSchema = {
  name: "text",
  brand: "text",
  stockQuantity: "number",
  unitPrice: "number",
  category: {
    type: "dropdown",
    options: ["Antibiotic", "Painkiller", "Vaccine", "Vitamin"]
  },
  expiryDate: "text" // You could also use "date" type later
};