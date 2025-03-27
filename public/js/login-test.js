import axios from 'axios';
// Import login function from './auth' if needed. Ensure there are no conflicts with the local login function.
import { login as authLogin } from './auth';

const login = async (email, password) => {
  console.log('Attempting login with:', email, password);

  try {
    const res = await axios({
      method: 'POST',
      url: process.env.API_URL || 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    console.log('Login successful:', res);
    // Handle successful login, e.g., redirect or save token
    // window.location.href = '/dashboard';
  } catch (err) {
    if (err.response) {
      // Server responded with a status other than 2xx
      console.log('Error response:', err.response.data);
      alert('Login failed: ' + err.response.data.message);
    } else if (err.request) {
      // Request was made but no response received
      console.log('Network error:', err.request);
      alert('Network error. Please try again later.');
    } else {
      // Something else caused the error
      console.log('Error:', err.message);
      alert('An unexpected error occurred: ' + err.message);
    }
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();

  // Basic validation
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Please fill in both fields.');
    return;
  }

  // Optionally, you can add more validation for email format here

  // Disable the form during the login process
  e.target.querySelector('button').disabled = true;

  login(email, password).finally(() => {
    // Re-enable the form button
    e.target.querySelector('button').disabled = false;
  });
});

// export const login = async (email, password) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: '/api/v1/users/login',
//       data: {
//         email,
//         password,
//       },
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'Logged in successfully!');
//       window.setTimeout(() => {
//         location.assign('/');
//       }, 1500);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

// export const logout = async () => {
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: '/api/v1/users/logout',
//     });
//     if (res.data.status === 'success') location.reload(true);
//   } catch (err) {
//     console.log(err.response);
//     showAlert('error', 'Error logging out! Try again.');
//   }
// };
