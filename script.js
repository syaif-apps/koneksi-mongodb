// public/script.js

const API_BASE_URL = 'http://localhost:3000/api/items'; // URL dasar API Anda

document.addEventListener('DOMContentLoaded', () => {
    fetchItems(); // Panggil fungsi untuk mengambil item saat halaman dimuat

    const addItemForm = document.getElementById('addItemForm');
    addItemForm.addEventListener('submit', handleAddItem);
});

// Fungsi untuk mengambil dan menampilkan semua item
async function fetchItems() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const items = await response.json();
        displayItems(items); // Tampilkan item di UI
    } catch (error) {
        console.error('Error fetching items:', error);
        const itemList = document.getElementById('itemList');
        itemList.innerHTML = '<li>Error loading items. Please try again later.</li>';
    }
}

// Fungsi untuk menampilkan item di UI
function displayItems(items) {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; // Kosongkan daftar sebelum menambahkan yang baru

    if (items.length === 0) {
        itemList.innerHTML = '<li>No items found. Add one above!</li>';
        return;
    }

    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.name}</strong>
            <p>${item.description}</p>
            <small>Created: ${new Date(item.createdAt).toLocaleString()}</small>
            <button onclick="deleteItem('${item._id}')">Delete</button>
        `;
        itemList.appendChild(li);
    });
}

// Fungsi untuk menangani penambahan item baru
async function handleAddItem(event) {
    event.preventDefault(); // Mencegah form untuk refresh halaman

    const itemNameInput = document.getElementById('itemName');
    const itemDescriptionInput = document.getElementById('itemDescription');

    const name = itemNameInput.value;
    const description = itemDescriptionInput.value;

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description }) // Kirim data sebagai JSON string
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        const newItem = await response.json();
        console.log('Item added:', newItem);

        itemNameInput.value = ''; // Kosongkan input form
        itemDescriptionInput.value = '';

        fetchItems(); // Ambil ulang daftar item untuk memperbarui UI
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item: ' + error.message);
    }
}

// Fungsi untuk menghapus item
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return; // Batalkan jika pengguna tidak yakin
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        console.log('Item deleted:', id);
        fetchItems(); // Ambil ulang daftar item untuk memperbarui UI
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item: ' + error.message);
    }
}