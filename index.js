// index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Memuat variabel lingkungan dari file .env

const app = express(); // Deklarasi app hanya sekali

// Middleware
app.use(cors()); // Mengizinkan permintaan dari domain lain
app.use(express.json()); // Mengizinkan parsing JSON di body permintaan

// MongoDB Connection
// Pastikan MongoDB Anda berjalan di localhost:27017
// dan database 'myapp' akan otomatis dibuat jika belum ada.
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Define a simple schema for 'items'
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Menjadikan 'name' wajib
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Item = mongoose.model('Item', itemSchema);

// Opsional: Definisikan skema dan model untuk 'users' jika Anda berencana menggunakannya
// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// });
// const User = mongoose.model('User', userSchema);


// ===================================
// API Routes
// Semua definisi rute harus ada DI SINI, sebelum app.listen()
// ===================================

// Rute untuk '/api/items'
// GET all items
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new item
app.post('/api/items', async (req, res) => {
    const item = new Item({
        name: req.body.name,
        description: req.body.description
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem); // Status 201 Created
    } catch (error) {
        // Status 400 Bad Request untuk error validasi atau input
        res.status(400).json({ message: error.message });
    }
});

// GET item by ID
app.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        // Handle CastError (invalid ID format) atau error server lainnya
        res.status(500).json({ message: error.message });
    }
});

// PUT (Update) item by ID
app.put('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body, // Langsung gunakan body yang dikirim
            { new: true, runValidators: true } // `new: true` untuk mengembalikan dokumen yang sudah diperbarui, `runValidators: true` untuk menjalankan validasi skema
        );
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE item by ID
app.delete('/api/items/:id', async (req, res) => {
    try {
        const result = await Item.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' }); // Mengubah pesan agar lebih jelas
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Rute untuk '/api/users' (sesuai permintaan Anda)
// Penting: Jika Anda ingin menggunakan data user nyata, Anda perlu mendefinisikan 'User' model
// seperti yang saya komentari di atas dan mengambil data dari sana.
app.get('/api/users', async (req, res) => {
    try {
        // Contoh: Mengambil semua user dari database (jika Anda memiliki model User)
        // const users = await User.find();
        // res.json(users);

        // Jika Anda belum memiliki model User atau data user, kirimkan respons statis dulu:
        res.json({ message: 'Ini adalah daftar user dari API Anda!', users: [] });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
});


// Start server
// Gunakan PORT dari process.env.PORT jika tersedia (untuk deployment), atau 3000 sebagai default
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});