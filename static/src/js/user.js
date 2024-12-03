document.getElementById('editForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nama = document.getElementById('editNama').value.trim();
    const username = document.getElementById('editUsername').value.trim();
    const password = document.getElementById('editPassword').value.trim();

    const updatedData = {};
    if (nama) updatedData.nama = nama;
    if (username) updatedData.username = username;
    if (password) updatedData.password = password;

    if (Object.keys(updatedData).length === 0) {
        alert('Tidak ada perubahan yang dilakukan.');
        return;
    }

    try {
        const response = await fetch('/api/auth/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-API-TOKEN': localStorage.getItem('token'),
            },
            body: JSON.stringify(updatedData),
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = '/profil';
        } else {
            console.error('Update failed:', data.message);
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during updating:', error);
        alert('An error occurred. Please try again.');
    }
});
