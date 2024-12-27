// display users history
document.addEventListener('DOMContentLoaded', async () => {
    let token = localStorage.getItem('token'); // Contoh mengambil dari localStorage
    if (!token) {
        console.error('Token is undefined!');
        // Redirect ke halaman login atau tampilkan pesan kesalahan
    }
    console.log('Token:', token);
    const apiUrl = '/api/admin/history';
    const tableBody = document.getElementById('user-history-table').querySelector('tbody');

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
            
            historyData.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td class="py-2 px-2 text-center">${record.waktu_upload}</td>
            <td class="py-2 px-2 text-center">${record.username}</td>
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

// display users 
document.addEventListener('DOMContentLoaded', async () => {
    let token = localStorage.getItem('token'); // Contoh mengambil dari localStorage
    if (!token) {
        console.error('Token is undefined!');
        // Redirect ke halaman login atau tampilkan pesan kesalahan
    }
    console.log('Token:', token);
    const apiUrl = '/api/admin/userdata';
    const tableBody = document.getElementById('user-table').querySelector('tbody');

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
            const userData = data.data;

            if (userData.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">No user found</td></tr>';
                return;
            }
            
            userData.forEach((record, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td class="py-2 px-2 text-center">${index + 1}</td>
            <td class="py-2 px-2 ">${record.nama}</td>
            <td class="py-2 px-2 ">${record.username}</td>
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