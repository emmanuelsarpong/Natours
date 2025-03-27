import axios from 'axios';

const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios.post('/api/v1/users/signup', {
      name,
      email,
      password,
      passwordConfirm,
    });

    if (res.data.status === 'success') {
      alert('Sign-up successful! Redirecting...');
      window.setTimeout(() => {
        location.assign('/me'); // Redirect to the user account page
      }, 1500);
    }
  } catch (err) {
    alert(`Sign-up failed: ${err.response.data.message}`);
  }
};

document.querySelector('#signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Sign-up form submitted'); // Debugging

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const passwordConfirm = document
    .getElementById('passwordConfirm')
    .value.trim();

  signup(name, email, password, passwordConfirm);
});
