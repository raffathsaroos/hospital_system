const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospital_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// --- USER MODEL (For Auth) ---
const UserSchema = new mongoose.Schema({
    Username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// --- UNIVERSAL MODEL HELPER (For Records) ---
const getDynamicModel = (collectionName) => {
    return mongoose.models[collectionName] || 
           mongoose.model(collectionName, new mongoose.Schema({}, { strict: false, timestamps: true }));
};

// --- AUTH ROUTES ---
app.post('/api/signup', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        res.status(400).json({ message: "Error: User already exists." });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        res.status(200).json({ message: "Login successful!", email: user.email, username: user.Username });
    } catch (err) {
        res.status(500).json({ message: "Server error during login." });
    }
});

// --- UNIVERSAL RECORD ROUTES ---
app.get('/api/:collection', async (req, res) => {
    try {
        const DataModel = getDynamicModel(req.params.collection);
        const data = await DataModel.find();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/:collection', async (req, res) => {
    try {
        const DataModel = getDynamicModel(req.params.collection);
        const newItem = new DataModel(req.body);
        await newItem.save();
        res.json(newItem);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/:collection/:id', async (req, res) => {
    try {
        const DataModel = getDynamicModel(req.params.collection);
        await DataModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/:collection/:id', async (req, res) => {
    try {
        const DataModel = getDynamicModel(req.params.collection);
        const updatedItem = await DataModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: false }
        );
        if (!updatedItem) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json(updatedItem);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});
// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));