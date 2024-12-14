// import { useEffect, useRef, useState } from 'react';
// import { io } from 'socket.io-client';

// const useSocket = (classCode) => {
//     const socketRef = useRef(null);
//     const [connectedSocket, setConnectedSocket] = useState(null);


//     useEffect(() => {
//         if (!classCode || (socketRef.current && socketRef.current.connected)) return;

//         console.log('Khởi tạo socket cho lớp:', classCode);

//         const userId = localStorage.getItem('userId');
//         const fullName = localStorage.getItem('full_name');
//         const userName = localStorage.getItem('user_name');

//         if (!userId || !fullName || !userName) {
//             console.error('Thiếu thông tin user để kết nối socket');
//             return;
//         }

//         const socket = io('http://localhost:5000/', {
//             query: { userId, fullName, userName, classCode },
//         });

//         socket.on('connect', () => {
//             console.log('Socket đã kết nối:', socket.id);
//             socketRef.current = socket;
//             setConnectedSocket(socket);  // Chỉ set socket khi đã kết nối
//             // console.log('Socket sau khi kết nối:', socketRef.current);
//         });

//         // socket.on('disconnect', () => {
//         //     console.log('Socket đã ngắt kết nối');
//         //     socketRef.current = null;
//         //     setConnectedSocket(null);
//         // });

//         socket.on('disconnect', (reason) => {
//             console.warn(`Socket ngắt kết nối. Lý do: ${reason}`);
//             socketRef.current = null;
//             setConnectedSocket(null);
//         });
        
//         socket.on('connect_error', (err) => {
//             console.error('Lỗi kết nối socket:', err.message);
//         });

//         socket.onAny((event, ...args) => {
//             console.log(`Sự kiện socket: ${event}`, args);
//         });

//         return () => {
//             // socket.disconnect();
//             // console.log('Ngắt kết nối socket cho lớp:', classCode);
//             // socketRef.current = null;
//             if (socketRef.current) {
//                 console.log('Ngắt kết nối socket từ client');
//                 socketRef.current.disconnect();
//                 socketRef.current = null;
//             }
//         };
//     }, [classCode]);

//     // useEffect(() => {
//     //     console.log(socketRef.current)
//     // }, [socketRef.current]);

//     // return socketRef.current; // Trả về socketRef.current
//     return connectedSocket;  // Trả về socket chỉ khi đã kết nối

// };

// export default useSocket;

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (classCode) => {
    const socketRef = useRef(null);
    const [connectedSocket, setConnectedSocket] = useState(null);

    useEffect(() => {
        // Nếu không có classCode hoặc socket đã tồn tại và đang kết nối, thoát sớm
        if (!classCode) {
            console.warn('Không có classCode, không khởi tạo socket.');
            return;
        }

        if (socketRef.current && socketRef.current.connected) {
            console.log('Socket đã tồn tại và đang kết nối:', socketRef.current.id);
            setConnectedSocket(socketRef.current); // Đảm bảo state được cập nhật
            return;
        }

        console.log('Khởi tạo socket mới cho lớp:', classCode);

        // Lấy thông tin user từ localStorage
        const userId = localStorage.getItem('userId');
        const fullName = localStorage.getItem('full_name');
        const userName = localStorage.getItem('user_name');

        if (!userId || !fullName || !userName) {
            console.error('Thiếu thông tin user để kết nối socket.');
            return;
        }

        // Khởi tạo socket mới
        const socket = io('http://localhost:5000/', {
            query: { userId, fullName, userName, classCode },
        });

        // Lưu socket vào ref và state
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket đã kết nối:', socket.id);
            setConnectedSocket(socket); // Cập nhật state khi kết nối thành công
        });

        socket.on('disconnect', (reason) => {
            console.warn(`Socket ngắt kết nối. Lý do: ${reason}`);
            setConnectedSocket(null); // Xóa socket khỏi state khi mất kết nối
        });

        socket.on('connect_error', (err) => {
            console.error('Lỗi kết nối socket:', err.message);
        });

        socket.onAny((event, ...args) => {
            console.log(`Sự kiện socket: ${event}`, args);
        });

        // Cleanup socket khi component bị unmount
        return () => {
            if (socketRef.current) {
                console.log('Ngắt kết nối socket từ client.');
                socketRef.current.disconnect();
                socketRef.current = null;
                setConnectedSocket(null);
            }
        };
    }, [classCode]); // Theo dõi classCode để khởi tạo lại socket khi thay đổi

    return connectedSocket; // Trả về socket đã kết nối
};

export default useSocket;
