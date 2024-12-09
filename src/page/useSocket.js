import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (classCode) => {
    const socketRef = useRef(null);
    const [connectedSocket, setConnectedSocket] = useState(null);


    useEffect(() => {
        if (!classCode || (socketRef.current && socketRef.current.connected)) return;

        console.log('Khởi tạo socket cho lớp:', classCode);

        const userId = localStorage.getItem('userId');
        const fullName = localStorage.getItem('full_name');
        const userName = localStorage.getItem('user_name');

        if (!userId || !fullName || !userName) {
            console.error('Thiếu thông tin user để kết nối socket');
            return;
        }

        const socket = io('http://localhost:5000/', {
            query: { userId, fullName, userName, classCode },
        });

        socket.on('connect', () => {
            console.log('Socket đã kết nối:', socket.id);
            socketRef.current = socket;
            setConnectedSocket(socket);  // Chỉ set socket khi đã kết nối
            // console.log('Socket sau khi kết nối:', socketRef.current);
        });

        // socket.on('disconnect', () => {
        //     console.log('Socket đã ngắt kết nối');
        //     socketRef.current = null;
        //     setConnectedSocket(null);
        // });

        socket.on('disconnect', (reason) => {
            console.warn(`Socket ngắt kết nối. Lý do: ${reason}`);
            socketRef.current = null;
            setConnectedSocket(null);
        });
        
        socket.on('connect_error', (err) => {
            console.error('Lỗi kết nối socket:', err.message);
        });

        socket.onAny((event, ...args) => {
            console.log(`Sự kiện socket: ${event}`, args);
        });

        return () => {
            // socket.disconnect();
            // console.log('Ngắt kết nối socket cho lớp:', classCode);
            // socketRef.current = null;
            if (socketRef.current) {
                console.log('Ngắt kết nối socket từ client');
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [classCode]);

    // useEffect(() => {
    //     console.log(socketRef.current)
    // }, [socketRef.current]);

    // return socketRef.current; // Trả về socketRef.current
    return connectedSocket;  // Trả về socket chỉ khi đã kết nối

};

export default useSocket;
