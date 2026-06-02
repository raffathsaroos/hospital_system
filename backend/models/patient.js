import mongoose from 'mongoose';



const counterSchema = new mongoose.Schema(

    {

        _id: { type: String, required: true },

        sequenceValue: { type: Number, default: 0 },

    },

    { versionKey: false }

);



export const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);



const patientSchema = new mongoose.Schema(

    {

        patientId: {

            type: String,

            required: true,

            unique: true,

            trim: true,

        },

        fullName: {

            type: String,

            required: [true, 'Full name is required'],

            trim: true,

            minlength: [2, 'Full name must be at least 2 characters long'],

            maxlength: [120, 'Full name cannot exceed 120 characters'],

        },

        dateOfBirth: {

            type: Date,

            required: [true, 'Date of birth is required'],

        },

        gender: {

            type: String,

            required: [true, 'Gender is required'],

            enum: ['male', 'female', 'other'],

        },

        phone: {

            type: String,

            required: [true, 'Phone number is required'],

            trim: true,

            maxlength: [30, 'Phone number cannot exceed 30 characters'],

        },

        address: {

            type: String,

            required: [true, 'Address is required'],

            trim: true,

            maxlength: [300, 'Address cannot exceed 300 characters'],

        },

        emergencyContactName: {

            type: String,

            required: [true, 'Emergency contact name is required'],

            trim: true,

            maxlength: [120, 'Emergency contact name cannot exceed 120 characters'],

        },

        emergencyContactPhone: {

            type: String,

            required: [true, 'Emergency contact phone is required'],

            trim: true,

            maxlength: [30, 'Emergency contact phone cannot exceed 30 characters'],

        },

        bloodGroup: {

            type: String,

            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],

            default: 'unknown',

        },

        allergies: {

            type: String,

            trim: true,

            default: '',

            maxlength: [1000, 'Allergies cannot exceed 1000 characters'],

        },

        medicalNotes: {

            type: String,

            trim: true,

            default: '',

            maxlength: [3000, 'Medical notes cannot exceed 3000 characters'],

        },

        status: {

            type: String,

            enum: ['active', 'admitted', 'discharged', 'inactive'],

            default: 'active',

        },

        createdBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: 'User',

            required: true,

        },

        userAccount: {

            type: mongoose.Schema.Types.ObjectId,

            ref: 'User',

            default: null,

            index: true,

        },

    },

    { timestamps: true }

);



patientSchema.index({ fullName: 'text', phone: 'text' });

patientSchema.index({ createdBy: 1 });



const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);



export default Patient;
