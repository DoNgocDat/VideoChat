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

export const getFullAvatarUrl = (relativePath) => {
    const BASE_URL = 'http://127.0.0.1:5000';
    if (!relativePath || typeof relativePath !== 'string') {
        return ''; // Trả về chuỗi rỗng nếu không hợp lệ
    }

    // Kiểm tra nếu đường dẫn đã bao gồm BASE_URL thì không cần thêm
    const fullUrl = relativePath.startsWith('/uploads')
        ? `${BASE_URL}${relativePath}` // Tạo URL đầy đủ từ đường dẫn tương đối
        : relativePath;

    return fullUrl;
};

export const uploadAvatar = async (loginName, file) => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');
        
        console.log('Login name:', loginName);
        console.log('Selected file:', file);
        
        const formData = new FormData();
        formData.append('file', file); // Đổi 'avatar' thành 'file' để khớp với BE
        
        console.log('FormData after append:', formData);
        
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        
        const response = await axios.post(`http://127.0.0.1:5000/auth/upload-avt/${loginName}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Avatar uploaded successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};
