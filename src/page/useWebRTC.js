import { useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';

const useWebRTC = (roomId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Kết nối tới signaling server
    socket.current = io.connect('http://localhost:3000'); 

    // Lấy media stream của local (camera/mic)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
      });

    socket.current.on('offer', handleOffer);
    socket.current.on('answer', handleAnswer);
    socket.current.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const createPeerConnection = () => {
    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    peerConnection.current = new RTCPeerConnection(config);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit('ice-candidate', event.candidate);
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    localStream.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, localStream);
    });
  };

  const handleOffer = (offer) => {
    createPeerConnection();
    peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    peerConnection.current.createAnswer().then(answer => {
      peerConnection.current.setLocalDescription(answer);
      socket.current.emit('answer', answer);
    });
  };

  const handleAnswer = (answer) => {
    peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleIceCandidate = (candidate) => {
    peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const startCall = () => {
    createPeerConnection();
    peerConnection.current.createOffer().then(offer => {
      peerConnection.current.setLocalDescription(offer);
      socket.current.emit('offer', offer);
    });
  };

  return { localStream, remoteStream, startCall };
};

export default useWebRTC;
