// import { createContext, useContext, useMemo, useEffect } from 'react';
// import useSocket from './useSocket';

// const SocketContext = createContext(null);

// export const SocketProvider = ({ children, classCode }) => {
//     const socket = useSocket(classCode);

//     const value = useMemo(() => socket, [socket]); // Đảm bảo giá trị context không thay đổi liên tục

//     // if (!socket) {
//     //     console.log('Socket chưa được khởi tạo');
//     //     return <div>Đang kết nối đến socket...</div>;
//     // }

//     console.log('Socket status:', {
//         socket,
//         connected: socket?.connected,
//         id: socket?.id
//       });

//     // Sử dụng useEffect để theo dõi socket
//     useEffect(() => {
//         console.log('Socket in Provider:', socket);
//     }, [socket]);

//     return (
//         <SocketContext.Provider value={value}>
//             {children}
//         </SocketContext.Provider>
//     );
// };

// export const useSocketContext = () => useContext(SocketContext);

import { createContext, useContext, useEffect, useState } from 'react';
import useSocket from './useSocket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children, classCode }) => {
    const [socketState, setSocketState] = useState({
        socket: null,
        connected: false,
        id: null,
    });

    const socket = useSocket(classCode);

    useEffect(() => {
        // Nếu socket chưa được khởi tạo, thoát sớm
        if (!socket) {
            console.log('Socket chưa được khởi tạo');
            return;
        }

        const updateState = () => {
            setSocketState({
                socket,
                connected: socket.connected,
                id: socket.id,
            });
            console.log('Socket state updated:', {
                connected: socket.connected,
                id: socket.id,
            });
        };

        // Xử lý sự kiện "connect"
        const handleConnect = () => {
            console.log('Socket connected:', socket.id);
            updateState();
        };

        // Xử lý sự kiện "disconnect"
        const handleDisconnect = () => {
            console.log('Socket disconnected');
            setSocketState({
                socket,
                connected: false,
                id: null,
            });
        };

        // Lắng nghe sự kiện kết nối và ngắt kết nối
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        // Cập nhật trạng thái ban đầu nếu socket đã kết nối
        if (socket.connected) {
            handleConnect();
        }

        // Dọn dẹp các sự kiện khi component bị unmount
        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
        };
    }, [socket]);

    // useEffect(() => {
    //     console.log('socketState updated:', socketState);
    // }, [socketState]);
    

    return (
        <SocketContext.Provider value={socketState}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => useContext(SocketContext);

