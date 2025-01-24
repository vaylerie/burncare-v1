let token = localStorage.getItem('token');
if (!token) {
    console.error('Token is undefined!')
}

function getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${date}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function updateTimestamp() {
    const timestampElement = document.getElementById('realtime-timestamp');
    if (timestampElement) {
        timestampElement.textContent = getCurrentTimestamp();
    }
}

// Perbarui timestamp setiap detik
setInterval(updateTimestamp, 1000);

// Tampilkan waktu saat halaman pertama kali dimuat
updateTimestamp();


//display data count
document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = '/api/admin/history';
    const totalHistory = document.getElementById('history-count');
    const todayHistory = document.getElementById('today-count');

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
                totalHistory.textContent = '0';
                todayHistory.textContent = '0';
                return;
            }

            // Total history count
            totalHistory.textContent = `${historyData.length}`;

            // Calculate today's history count
            const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
            const todayCount = historyData.filter(record => {
                const recordDate = new Date(record.waktu_upload).toISOString().split('T')[0];
                return recordDate === today;
            }).length;

            // Display today's count
            todayHistory.textContent = `${todayCount}`;
        } else {
            totalHistory.textContent = 'Error fetching data';
            todayHistory.textContent = 'Error fetching data';
        }
    } catch (error) {
        console.error('Error:', error);
        totalHistory.textContent = 'Error fetching data';
        todayHistory.textContent = 'Error fetching data';
    }
});

//display user count
document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = '/api/admin/userdata';
    const totalUser = document.getElementById('user-count');

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-TOKEN': token
            }
        });

        if(response.ok) {
            const data = await response.json();
            console.log(data);
            const historyData = data.data;

            if (historyData.length === 0) {
                totalUser.textContent = '0';
                return;
            } else {
                totalUser.textContent = `${historyData.length}`;
            }
        } else {
            totalUsery.textContent = 'Error fetching data';
        }
    } catch (error) {
        console.error('Error:', error);
        totalUser.textContent = 'Error fetching data';
    }
});

// display users history
document.addEventListener('DOMContentLoaded', async () => {
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
                'X-API-TOKEN': token
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