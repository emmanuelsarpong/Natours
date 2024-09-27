/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const token = localStorage.getItem('jwt'); // Retrieve the token from localStorage

    // Log the token when retrieved from localStorage
    console.log('Retrieved token from localStorage:', token);

    if (!token) {
      showAlert('error', 'You are not logged in! Please log in again.');
      throw new Error('No authentication token found. Please log in again.');
    }

    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    // Log the URL and the token before sending the request
    console.log(
      `Sending PATCH request to URL: ${url} with token: Bearer ${token}`,
    );

    const res = await axios({
      method: 'PATCH',
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`, // Ensure JWT token is sent in headers
      },
    });

    // Log the response data for debugging
    console.log('Server response:', res.data);

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    // Log the full error for debugging
    console.error('Error in updateSettings:', err);

    // Check if the server response contains a message
    if (err.response) {
      console.error('Server response error:', err.response.data);
      showAlert('error', err.response.data.message);
    } else {
      showAlert('error', 'Something went wrong! Please try again later.');
    }
  }
};
