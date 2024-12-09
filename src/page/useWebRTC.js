import { useRef, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const useWebRTC = (classCode) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]); // Danh sách các stream từ người khác
  const [participants, setParticipants] = useState([]); // Danh sách người tham gia
  const [joinRequests, setJoinRequests] = useState([]); // Danh sách yêu cầu tham gia
  
  const peerConnections = useRef({});
  const socket = useRef(null);

  // Lấy luồng localStream
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // console.log("Real localStream captured:", stream);
        setLocalStream(stream);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        const simulatedStream = createSimulatedStream();
        if (simulatedStream) {
          // console.log("Simulated localStream created:", simulatedStream);
          setLocalStream(simulatedStream);
        } else {
          console.error("Failed to create simulated stream");
        }
      });
  }, []);
  

  // Tạo WebRTC peer connection
  const createPeerConnection = useCallback(
    (socketId) => {
      const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
      const peerConnection = new RTCPeerConnection(config);
  
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit('ice-candidate', { to: socketId, candidate: event.candidate });
        }
      };
  
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteStreams((prevStreams) =>
          !prevStreams.some((stream) => stream.id === remoteStream.id)
            ? [...prevStreams, remoteStream]
            : prevStreams
        );
      };
  
      // Thêm track từ localStream nếu chưa tồn tại
      if (localStream) {
        const existingTracks = peerConnection.getSenders().map((sender) => sender.track);
        localStream.getTracks().forEach((track) => {
          if (!existingTracks.includes(track)) {
            peerConnection.addTrack(track, localStream);
          }
        });
      }
  
      return peerConnection;
    },
    [localStream]
  );
  

  // Xử lý WebRTC events
  const handleOffer = useCallback(
    (offer, socketId) => {
      const peerConnection =
        peerConnections.current[socketId] || createPeerConnection(socketId);
      peerConnections.current[socketId] = peerConnection;

      peerConnection
        .setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => peerConnection.createAnswer())
        .then((answer) => {
          peerConnection.setLocalDescription(answer);
          socket.current.emit('answer', { to: socketId, answer });
        });
    },
    [createPeerConnection]
  );

  const handleAnswer = useCallback((answer, socketId) => {
    const peerConnection = peerConnections.current[socketId];
    if (peerConnection) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }, []);

  const handleIceCandidate = useCallback(({ candidate, socketId }) => {
    const peerConnection = peerConnections.current[socketId];
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }, []);

  // Khởi tạo socket kết nối
  useEffect(() => {
    socket.current = io('http://localhost:3000', {
      query: {
        userId: localStorage.getItem('userId'),
        fullName: localStorage.getItem('full_name'),
        userName: localStorage.getItem('user_name'),
      },
    });

    // Kết nối socket
    socket.current.on('connect', () => {
      console.log('WebSocket connected:', socket.current.id);
      socket.current.emit('join-room', `${classCode}`); // Tham gia phòng
    });

    // Cập nhật danh sách người tham gia
    socket.current.on('update-participants', (data) => {
      console.log('Danh sách người tham gia:', data);
      setParticipants(data || []);
    });

    // Nhận yêu cầu tham gia
    socket.current.on('new-join-request', (request) => {
      console.log('Yêu cầu tham gia:', request);
      alert(`${request.fullName} yêu cầu tham gia lớp học.`)
      setJoinRequests((prev) => [...prev, request]);
    });

    socket.current.on('offer', handleOffer);
    socket.current.on('answer', handleAnswer);
    socket.current.on('ice-candidate', handleIceCandidate);

    return () => {
      // Cleanup socket và peer connections
      socket.current.off('new-join-request');
      socket.current.off('update-participants'); 
      socket.current.off('offer', handleOffer);
      socket.current.off('answer', handleAnswer);
      socket.current.off('ice-candidate', handleIceCandidate);
      socket.current.emit('leave-room', classCode); // Rời phòng

      // Đóng tất cả các kết nối peer
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};

      socket.current.disconnect();
      socket.current = null;
    };
  }, [classCode, handleOffer, handleAnswer, handleIceCandidate]);

  // Theo dõi và tạo kết nối WebRTC khi `participants` thay đổi
  // useEffect(() => {
  //   participants.forEach((participant) => {
  //     if (!peerConnections.current[participant.id]) {
  //       console.log(`Tạo kết nối WebRTC cho participant:`, participant);
  
  //       const peerConnection = createPeerConnection(participant.id);
  //       peerConnections.current[participant.id] = peerConnection;
  
  //       // Thêm track từ localStream nếu đã sẵn sàng
  //       if (localStream) {
  //         const existingTracks = peerConnection.getSenders().map((sender) => sender.track);
  //         localStream.getTracks().forEach((track) => {
  //           if (!existingTracks.includes(track)) {
  //             peerConnection.addTrack(track, localStream);
  //           }
  //         });
  //       }
  //     }
  //   });
  
  //   // Cleanup peerConnections không còn cần thiết
  //   return () => {
  //     Object.keys(peerConnections.current).forEach((socketId) => {
  //       if (!participants.some((p) => p.id === socketId)) {
  //         console.log(`Đóng peerConnection không cần thiết:`, socketId);
  //         peerConnections.current[socketId].close();
  //         delete peerConnections.current[socketId];
  //       }
  //     });
  //   };
  // }, [participants, localStream, createPeerConnection]);
  
  // Phê duyệt yêu cầu
  const approveRequest = useCallback((userName) => {
    socket.current.emit('approve-request', { classCode, userName });
    setJoinRequests((prev) => prev.filter((req) => req.userName !== userName));
    console.log(`Đã phê duyệt yêu cầu của: ${userName}`)
  }, [classCode]);

  // Từ chối yêu cầu
  const rejectRequest = useCallback((userName) => {
    socket.current.emit('reject-request', { classCode, userName });
    setJoinRequests((prev) => prev.filter((req) => req.userName !== userName));
    console.log(`Đã từ chối yêu cầu của: ${userName}`);
  }, [classCode]);

  // Tạo stream giả lập
  const createSimulatedStream = () => {
    try {
      const simulatedStream = new MediaStream();
  
      // Video track
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'gray';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const videoTrack = canvas.captureStream(30).getVideoTracks()[0];
      simulatedStream.addTrack(videoTrack);
  
      // Audio track
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      const destination = audioContext.createMediaStreamDestination();
      oscillator.connect(destination);
      oscillator.start();
      const audioTrack = destination.stream.getAudioTracks()[0];
      simulatedStream.addTrack(audioTrack);
  
      // console.log("Simulated stream created:", simulatedStream);
      return simulatedStream;
    } catch (error) {
      console.error("Error creating simulated stream:", error);
      return null;
    }
  };   

  return { localStream, remoteStreams, participants, joinRequests, approveRequest, rejectRequest, socket: socket.current };
};

export default useWebRTC;
