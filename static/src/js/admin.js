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

