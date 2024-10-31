import { useRef, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const useWebRTC = (roomId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const peerConnections = useRef({});
  const socket = useRef(null);
  // const [connectedSocketIds, setConnectedSocketIds] = useState([]);

  // Lấy luồng localStream và xử lý khi không truy cập được
  useEffect(() => {
    if (!localStream) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(setLocalStream)
        .catch(() => setLocalStream(createSimulatedStream()));
    }
  }, [localStream]);

  // Các hàm WebRTC: Tạo peerConnection và quản lý ICE Candidate
  const createPeerConnection = useCallback((socketId) => {
    const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const peerConnection = new RTCPeerConnection(config);

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.current.emit('ice-candidate', { to: socketId, candidate: event.candidate });
      }
    };

    peerConnection.ontrack = event => {
      const [remoteStream] = event.streams;
      setRemoteStreams(prevStreams => 
        !prevStreams.some(stream => stream.id === remoteStream.id) 
          ? [...prevStreams, remoteStream] 
          : prevStreams
      );
    };

    peerConnection.onconnectionstatechange = () => {
      setIsConnected(peerConnection.connectionState === 'connected');
    };

    if (localStream) {
      localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    }

    return peerConnection;
  }, [localStream]);

  // Các xử lý offer/answer/ICE candidate
  const handleOffer = useCallback((offer, socketId) => {
    const peerConnection = peerConnections.current[socketId] || createPeerConnection(socketId);
    peerConnections.current[socketId] = peerConnection;

    peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => peerConnection.createAnswer())
      .then(answer => {
        peerConnection.setLocalDescription(answer);
        socket.current.emit('answer', { to: socketId, answer });
      })
      .catch(console.error);
  }, [createPeerConnection]);

  const handleAnswer = useCallback((answer, socketId) => {
    const peerConnection = peerConnections.current[socketId];
    if (peerConnection) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }, []);

  const handleIceCandidate = useCallback(({ candidate, socketId }) => {
    const peerConnection = peerConnections.current[socketId];
    if (peerConnection && candidate) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
    }
  }, []);

  // Khởi tạo và quản lý socket kết nối
  useEffect(() => {
    socket.current = io.connect('http://localhost:3000');

    socket.current.on('offer', handleOffer);
    socket.current.on('answer', handleAnswer);
    socket.current.on('ice-candidate', handleIceCandidate);
    
    // Xử lý yêu cầu tham gia và phản hồi phê duyệt/từ chối
    socket.current.on('join-approved', () => setIsApproved(true));
    socket.current.on('join-rejected', () => alert("Yêu cầu tham gia đã bị từ chối."));
    socket.current.on('disconnect', () => setIsConnected(false));

    const currentPeerConnections = peerConnections.current;

    // Cleanup function
    return () => {
      Object.values(currentPeerConnections).forEach(peerConnection => {
        if (peerConnection) peerConnection.close();
      });
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [handleOffer, handleAnswer, handleIceCandidate]);

  // Quản lý yêu cầu tham gia vào phòng
  const requestJoin = useCallback(() => {
    socket.current.emit('request-join', { roomId });
  }, [roomId]);

  const startCall = useCallback(() => {
    socket.current.emit('join-room', roomId);
  }, [roomId]);

  // Hàm để tạo stream giả lập khi không thể truy cập camera/microphone
  const createSimulatedStream = () => {
    const simulatedStream = new MediaStream();
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    simulatedStream.addTrack(canvas.captureStream().getVideoTracks()[0]);

    const audioContext = new AudioContext();
    simulatedStream.addTrack(audioContext.createMediaStreamDestination().stream.getAudioTracks()[0]);

    return simulatedStream;
  };

  // Trả về các giá trị cần sử dụng trong component khác
  return { localStream, remoteStreams, startCall, requestJoin, isConnected, isApproved };
};

export default useWebRTC;
