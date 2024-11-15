import axios from 'axios';

// Set the base URL for the API
const API_URL = 'http://127.0.0.1:5000/auth/profile';

// Function to fetch user information based on access token
export const getUserInfo = async () => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('access_token');
        console.log('Access token retrieved:', token); // Debug: Check if token is available

        // Check if token exists
        if (!token) {
            throw new Error('No access token found');
        }

        // Send a GET request with the token in the Authorization header
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('User info retrieved successfully:', response.data); // Debug: Log the retrieved data

        // Return user data from the response
        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error; // Throw the error to be handled by the calling function
    }
};
