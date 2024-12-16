import axios from "axios";
// import { data } from "framer-motion/client";

// Thiết lập base URL cho API
const API_URL = 'http://127.0.0.1:5000';


// Hàm gửi dữ liệu điểm danh tới server
export const saveAttendance = async (attendanceData) => {
    try {
        const response = await axios.post(`${API_URL}/class/attendance`, attendanceData);
        console.log("Dữ liệu đã được gửi thành công:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu điểm danh:", error);
        throw error;
    }
};