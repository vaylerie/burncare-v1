// Login form
document.getElementById('loginForm').addEventListener('submit', async function (event){
    event.preventDefault(); // Prevent the default form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            // Handle successful login (e.g., redirect or show a success message)
            console.log('Login successful:', data);
            // Store the token in localStorage or sessionStorage
            localStorage.setItem('token', data.data.token);
            // Redirect to another page or perform other actions
            window.location.href = '/user'; // Change this to your desired route
        } else {
            // Handle errors (e.g., show an error message)
            console.error('Login failed:', data.message);
            alert(data.message); // Display the error message
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});

// Admin Login form
document.getElementById('adminForm').addEventListener('submit', async function (event){
    event.preventDefault(); // Prevent the default form submission
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            // Handle successful login (e.g., redirect or show a success message)
            console.log('Login successful:', data);
            // Store the token in localStorage or sessionStorage
            localStorage.setItem('token', data.data.token);
            // Redirect to another page or perform other actions
            window.location.href = '/admin'; // Change this to your desired route
        } else {
            // Handle errors (e.g., show an error message)
            console.error('Login failed:', data.message);
            alert(data.message); // Display the error message
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});

// Register form
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const nama = document.getElementById('regNama').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const role = String("General")
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, nama, role }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Login successful:', data);
            window.location.href = '/login';
        } else {
            console.error('Login failed:', data.message);
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occured. Please try again.');
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

