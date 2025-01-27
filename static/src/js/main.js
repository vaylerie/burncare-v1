//Username
document.addEventListener('DOMContentLoaded', async () => {
    let token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is undefined!');
    }

    try {
        const response = await fetch('/api/auth/currentuser', {
            method: 'GET',
            headers: {
                'X-API-TOKEN': token
            }
        });

        if (response.ok) {
            const data = await response.json();
            const currentUser = data.data;

            const usernameElement = document.querySelector('#current-username');
            usernameElement.textContent = currentUser.username;

            const nameElement = document.querySelector('#current-name');
            nameElement.textContent = currentUser.nama;
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});

// display result (last upload)
document.addEventListener('DOMContentLoaded', async () => {
    let token = localStorage.getItem('token');
    if (!token) {
        console.error('Token is undefined!');
    }
    
    try {
        const response = await fetch('/api/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-TOKEN': token
            }
        });

        if (response.ok) {
            const data = await response.json();
            const historyData = data.data;
            const lastRecord = historyData[historyData.length -1];

            const classificationElement = document.querySelector('#classification');
            classificationElement.textContent = lastRecord.derajat_klasifikasi;
            const imageElement = document.querySelector('#uploaded-image');
            imageElement.src = lastRecord.file_path;
            const resultElement = document.querySelector('#result-image');
            resultElement.src = lastRecord.result_path;
            const confidenceScore = document.querySelector('#confidence-score');
            confidenceScore.textContent = lastRecord.confidence_score;
            const deskripsiElement = document.querySelector('#deskripsi');
            deskripsiElement.textContent = lastRecord.deskripsi;
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});

// display users history
document.addEventListener('DOMContentLoaded', async () => {
    let token = localStorage.getItem('token'); // Contoh mengambil dari localStorage
    if (!token) {
        console.error('Token is undefined!');
        // Redirect ke halaman login atau tampilkan pesan kesalahan
    }
    console.log('Token:', token);
    const apiUrl = '/api/history';
    const tableBody = document.getElementById('history-table').querySelector('tbody');

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-TOKEN': token
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            const historyData = data.data;

            if (historyData.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">No history found</td></tr>';
                return;
            }
            
            historyData.sort((a, b) => new Date(b.waktu_upload) - new Date(a.waktu_upload));

            historyData.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td class="py-2 px-2 text-center">${record.waktu_upload}</td>
            <td class="py-2 px-4"> <img src="${record.file_path}" alt="Image" style="max-width:100%; height:auto;"></td>
            <td class="py-2 px-4"> <img src="${record.result_path}" alt="Image" style="max-width:100%; height:auto;"></td>
            <td class="py-2 text-center">${record.derajat_klasifikasi}</td>
            <td class="py-2 text-center">${record.confidence_score}</td>
        `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="5">Error fetching data</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        tableBody.innerHTML = '<tr><td colspan="5">Error fetching data</td></tr>';
    }
});

// Upload Form
document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    console.log('Form submitted');
    event.preventDefault(); // Prevent default form submission
    let token = localStorage.getItem('token');

    const imageInput = document.getElementById('image');
    const file = imageInput.files[0]; // Access the uploaded file

    if (!file) {
        alert('Please select a file before uploading.');
        return;
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxFileSize) {
        alert('File size exceeds the 5MB limit. Please upload a smaller file.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file); // Append the file to the FormData object

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'X-API-TOKEN': token // Custom header for authentication
            },
            body: formData // Send FormData
        });

        const data = await response.json();
        if (response.ok) {
            // Handle successful upload
            console.log('Upload successful:', data);
            window.location.href = '/hasil'; // Redirect on success
        } else {
            // Handle server errors
            console.error('Upload failed:', data.message);
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during upload:', error);
        alert('An error occurred. Please try again.');
    }
});

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-API-TOKEN': localStorage.getItem('token')
            },
        });

        if (response.ok) {
            window.location.href = '/'
        } else {
            const errorData = await response.json();
            alert('Logout failed: ' + errorData.data);
        }
    } catch (error) {
        console.error('Error during logout: ', error);
        alert('An error occurred while logging out. Please try again');
    }
};

