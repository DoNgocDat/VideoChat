import { useRef, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const useWebRTC = (roomId) => {
  const [localStream, setLocalStream] = useState(null);        // Luồng video/audio của người dùng hiện tại
  const [remoteStreams, setRemoteStreams] = useState([]);      // Các luồng video/audio của những người dùng khác
  const [isConnected, setIsConnected] = useState(false);       // Trạng thái kết nối WebRTC
  const peerConnections = useRef({});                          // Đối tượng lưu các kết nối WebRTC
  const socket = useRef(null);                                 // Tham chiếu đến socket.io client
  const [connectedSocketIds, setConnectedSocketIds] = useState([]); // Lưu socketId đã kết nối


  // Tạo kết nối WebRTC cho người dùng khác
  const createPeerConnection = useCallback((socketId) => {
    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    const peerConnection = new RTCPeerConnection(config);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit('ice-candidate', { to: socketId, candidate: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStreams(prevStreams => {
        if (!prevStreams.some(stream => stream.id === remoteStream.id)) {
          return [...prevStreams, remoteStream];
        }
        return prevStreams;
      });
    };

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    } else {
      console.warn("Local stream chưa sẵn sàng để thêm track.");
    }

    peerConnection.onconnectionstatechange = () => {
      console.log("Trạng thái kết nối:", peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        setIsConnected(true);
      } else if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'failed') {
        setIsConnected(false);
      }
    };

    return peerConnection;
  }, [localStream]);

  // Xử lý offer nhận được từ người dùng khác
  const handleOffer = useCallback((offer, socketId) => {
    if (!peerConnections.current[socketId]) {
      const peerConnection = createPeerConnection(socketId);
      peerConnections.current[socketId] = peerConnection;
    }
  
    const peerConnection = peerConnections.current[socketId];
    
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => peerConnection.createAnswer())
      .then(answer => {
        peerConnection.setLocalDescription(answer);
        socket.current.emit('answer', { to: socketId, answer });
      })
      .catch(error => {
        console.error("Lỗi khi xử lý offer: ", error);
      });
  }, [createPeerConnection]);

  // Xử lý answer nhận được từ người dùng khác
  const handleAnswer = useCallback((answer, socketId) => {
    const peerConnection = peerConnections.current[socketId];
    if (peerConnection) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }, []);

  // Xử lý ICE candidate nhận được từ người dùng khác
  const handleIceCandidate = useCallback(({ candidate, socketId }) => {
    const peerConnection = peerConnections.current[socketId];
    if (peerConnection && candidate) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(error => console.error("Error adding received ice candidate", error));
    }
  }, []);

  // Kết nối socket.io và xử lý các sự kiện WebRTC khi component được mount
  useEffect(() => {
    socket.current = io.connect('http://localhost:3000');

    if (!localStream) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);
        })
        .catch((error) => {
          console.error("Lỗi khi truy cập camera/microphone:", error);
        });
    }

    // Tham gia vào phòng và lắng nghe các sự kiện
    socket.current.on('join-room', (socketId) => {
      console.log(`Đã tham gia phòng với socketId: ${socketId}`);
      setConnectedSocketIds((prev) => [...prev, socketId]); // Lưu lại socketId
    });

    socket.current.on('offer', handleOffer);
    socket.current.on('answer', handleAnswer);
    socket.current.on('ice-candidate', handleIceCandidate);

    socket.current.on('disconnect', () => {
      console.log("Ngắt kết nối với signaling server");
      setIsConnected(false);
    });

    const currentPeerConnections = peerConnections.current;
    return () => {
      Object.values(currentPeerConnections).forEach(peerConnection => {
        if (peerConnection) peerConnection.close();
      });
      socket.current.disconnect();
    };
  }, [handleOffer, handleAnswer, handleIceCandidate, localStream]);

  // Hàm lấy peerConnection theo socketId
  const getPeerConnection = useCallback((socketId) => {
    return peerConnections.current[socketId] || null;
  }, []);

  useEffect(() => {
    if (Object.keys(peerConnections.current).length > 0) {
      const socketIds = Object.keys(peerConnections.current);
      socketIds.forEach((socketId) => {
        const peerConnection = getPeerConnection(socketId);
        if (peerConnection) {
          console.log("PeerConnection sẵn sàng cho socketId:", socketId, peerConnection);
        } else {
          console.warn("PeerConnection chưa sẵn sàng cho socketId:", socketId);
        }
      });
    } else {
      console.warn("Chưa có PeerConnection nào được khởi tạo.");
    }
    console.log("Is Connected: ", isConnected);
  }, [isConnected]);

  // Hàm để bắt đầu tham gia vào phòng gọi
  const startCall = useCallback(() => {
    socket.current.emit('join-room', roomId);
  }, [roomId]);

  // Trả về các giá trị cần sử dụng trong component khác
  return { localStream, remoteStreams, startCall, getPeerConnection, isConnected, connectedSocketIds };
};

export default useWebRTC;
