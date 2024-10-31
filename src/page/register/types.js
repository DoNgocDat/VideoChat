// Dữ liệu đăng ký ban đầu
export const RegisterData = {
    loginName: '',
    fullName: '',
    email: '',
    password: '',
    rePassword: '',// Để xác nhận lại mật khẩu
};

// Phản hồi đăng ký từ server
export const RegisterResponse = {
    success: false, // True nếu đăng ký thành công
    message: '', // Thông báo phản hồi từ server
    user: {
        id: '',
        name: '',
        email: ''
    }
};
