import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash, faChalkboard, faHandPaper, faSignOutAlt, 
         faUsers, faComments, faClipboardList, faCrown, faSearch, faStop, faPaperclip, faPaperPlane, faDownload } from '@fortawesome/free-solid-svg-icons';

// import useWebRTC from '../page/useWebRTC';
// import io from 'socket.io-client'; // Import socket.io-client
import { useSocketContext } from './socketContext';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #2C2F33; /* Background tối */
  color: #edf2f4; /* Màu chữ dễ nhìn */
`;

const VideoContainer = styled.div`
    width: ${(props) => (props.activePanel ? '70%' : '75%')}; /* Giảm kích thước khi FloatingPanel hiển thị */
    height: 650px;
    display: flex;
    justify-content: ${(props) => 
        props.activePanel ? 'flex-start' : 
        props.isScreenSharing ? 'center' : 
        'space-around'
    };
    align-items: center;
    margin-top: 30px; 
    margin-right: ${(props) => (props.activePanel ? '25%' : '0')}; /* Thêm khoảng cách để đẩy video sang trái */
    position: relative; /* Sử dụng vị trí tương đối để điều chỉnh vị trí các video */
    // overflow: hidden; /* Ngăn nội dung tràn ra ngoài */
`;

const StyledVideo = styled.video`
    position: absolute;
    width: ${(props) => (props.isScreenSharing ? '20%' : '100%')}; /* Thu nhỏ khi chia sẻ màn hình */
    height: ${(props) => (props.isScreenSharing ? '20%' : '103%')};
    bottom: ${(props) => (props.isScreenSharing ? '10px' : '0')}; /* Đặt cách lề dưới khi chia sẻ màn hình */
    right: ${(props) => (props.isScreenSharing ? '10px' : 'auto')}; /* Đặt cách lề phải khi chia sẻ màn hình */
    object-fit: cover;
    border-radius: 10px;
    display: ${(props) => (props.isScreenSharing ? 'block' : 'inline')};
    z-index: ${(props) => (props.isScreenSharing ? '1' : 'auto')}; /* Đảm bảo hiển thị lên trên màn hình chia sẻ */
`;

const SharedScreenVideo = styled.video`
  width: ${(props) => (props.isScreenSharing ? '100%' : '0')}; /* Chiếm hết VideoContainer khi chia sẻ */
  height: ${(props) => (props.isScreenSharing ? '100%' : '0')}; /* Chiếm hết VideoContainer khi chia sẻ */
  object-fit: contain;
  border-radius: 10px;
  display: ${(props) => (props.isScreenSharing ? 'block' : 'none')}; /* Chỉ hiển thị khi đang chia sẻ màn hình */
  position: absolute; /* Cố định video */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const MainControl = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  padding: 10px;
  border-radius: 10px;
  color: white;
  margin-top: auto;
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 18px;
`;

const CenterPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-around;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const ButtonFeature = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 24px;
  margin: 0 10px;

  &:hover {
    color: #ff4d4d;
  }
`;

const ButtonControlCM = styled.button`
  background-color: ${({ isOn }) => (isOn ? "#f0f0f0" : "#ff4d4f")};
  border: none;
  color: ${({ isOn }) => (isOn ? "#000000" : "#f0f0f0")};
  cursor: pointer;
  font-size: 24px;
  width: 60px;
  height: 60px;
  margin: 0 10px;
  border-radius: 50%; 
  padding: 10px; 

  &:hover {
    background-color: #ffcccc; 
    color: #ff4d4d;
  }

  &:focus {
    outline: none;
  }
`;

const ButtonControl = styled.button`
  background-color: #f0f0f0;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 24px;
  width: 60px;
  height: 60px;
  margin: 0 10px;
  border-radius: 50%; 
  padding: 10px; 
  color: #000; 

  &:hover {
    background-color: #ffcccc; 
    color: #ff4d4d;
  }

  &:focus {
    outline: none;
  }
`;

const Notification = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  animation: fade-in-out 2s ease-in-out;

  @keyframes fade-in-out {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    10% {
      opacity: 1;
      transform: translateY(0);
    }
    90% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(20px);
    }
  }
`;

const FloatingPanel = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  width: 22%;
  height: 82.5%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  z-index: 1000;
`;

const HeaderPanel = styled.span`
  font-size: 20px;
  margin-right: 10px;
  font-weight: 600;
  color: #333;
`;

const FindContainer = styled.div`
  display: flex;
  align-items: center;  // Căn giữa theo trục dọc
  margin-bottom: 10px;
  margin-top: 10px;
`;

const FindInput = styled.input`
  width: 100%;
  height: 35px;
  padding: 5px;
  margin-right: 10px;  // Khoảng cách giữa input và button
  border-radius: 10px;
`;

const FindButton = styled.button`
  background-color: transparent;
  border: none;
  color: #000000;
  cursor: pointer;
  font-size: 30px;
  padding: 5px;

  &:hover {
    color: #b3b3b3;
  }
`;

const JoinRequestsContainer = styled.div`
  max-height: 100px; /* Giới hạn chiều cao để hiển thị tối đa 3 yêu cầu */
  overflow-y: auto;
  margin-top: 10px; /* Khoảng cách so với khung tìm kiếm */
  padding: 5px;
  border-top: 1px solid #ddd;
`;

const RequestList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const RequestItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
  color: #000000
`;

/* Danh sách học viên */
const ParticipantList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: calc(100vh - 250px); /* Giới hạn chiều cao, tự điều chỉnh theo màn hình */
  overflow-y: auto;
  border-top: 1px solid #ddd;
  padding-top: 10px;

  /* Tự động giảm chiều cao khi danh sách yêu cầu tham gia xuất hiện */
  transition: max-height 0.3s ease;
`;

/* Học viên */
const ParticipantItem = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  strong {
    color: #000000;
    font-weight: bold;
  }

  span {
    font-size: 1rem;
    color: #000000;
  }
`;

/* Khi không có học viên */
const EmptyMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #888;
  margin: 20px 0;
`;

const Button = styled.button`
  margin-left: 5px;
  padding: 3px 6px;
  background-color: #4CAF50; /* Màu xanh cho nút phê duyệt */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
  &:nth-child(2) {
    background-color: #f44336; /* Màu đỏ cho nút từ chối */
  }
`;


const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%; 
`;

const Label = styled.span`
  margin-right: 8px;
  color: #000000;
  flex-grow: 1;
`;

const Switch = styled.div`
  position: relative;
  width: 36px;
  height: 18px;
  background-color: ${(props) => (props.checked ? '#007aff' : '#cccccc')};
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: ${(props) => (props.checked ? '18px' : '2px')};
    width: 14px;
    height: 14px;
    background-color: #ffffff;
    border-radius: 50%;
    transition: left 0.3s;
  }
`;

const ChatDisplay = styled.div`
  height: 83%;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 5px;
  // background-color: #f0f0f0;
  border-radius: 5px;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
`;

const Message = styled.div`
  margin-bottom: 5px;
  padding: 5px;
  background-color: #edf2f4;
  border-radius: 5px;
  color: #2b2d42;
  max-width: 70%;
  word-wrap: break-word;
  // background-color: ${(props) => (props.isUser ? "#cce5ff" : "#edf2f4")};
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
  border-radius: 0 0 8px 8px;
  box-sizing: border-box; /* Đảm bảo padding không làm tràn */
  width: 100%; /* Đảm bảo nó không tràn khung */
  gap: 8px; /* Khoảng cách giữa các thành phần */
`;

const FileUploadIcon = styled.div`
  flex: 0 0 auto; /* Giữ kích thước cố định */
  cursor: pointer;
  font-size: 18px;
  color: #2b2d42;

  &:hover {
    color: #1b1d32;
  }
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%; /* Đảm bảo không bị tràn */
`;

const FileUploadInput = styled.input`
  display: none;
`;

const SendButton = styled.button`
  flex: 0 0 auto; /* Giữ kích thước cố định */
  padding: 8px 12px;
  background-color: #2b2d42;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    background-color: #1b1d32;
  }
`;

const SenderName = styled.div`
  font-weight: bold;
  margin-bottom: 3px;
  color: #2b2d42;
`;

const DownloadIcon = styled.a`
  margin-right: 8px;
  color: #2b2d42;
  text-decoration: none;

  &:hover {
    color: #1b1d32;
  }
`;


function ClassRoom() {
  const navigate = useNavigate();
  const { classCode } = useParams(); // Lấy mã lớp từ URL
  const username = localStorage.getItem('full_name');

  // const { localStream, remoteStreams } = useWebRTC(classCode);
  
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [activePanel, setActivePanel] = useState(null);   // Trạng thái duy nhất để lưu panel đang mở
    
  // Trạng thái để theo dõi khi người dùng đang chia sẻ màn hình
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const [allowMic, setAllowMic] = useState(false);
  const [allowChat, setAllowChat] = useState(false);
  
  // const [socket, setSocket] = useState(null); // Lưu kết nối socket.io
  // const socket = useRef(null); // Kết nối WebSocket
  const peerConnection = useRef(null); // PeerConnection instance
  const [notifications, setNotifications] = useState([]); // Khai báo trạng thái lưu thông báo
  const [participants, setParticipants] = useState([]); // Danh sách người tham gia
  const [joinRequests, setJoinRequests] = useState([]); // Danh sách yêu cầu tham gia

  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef([]);
  const [localStream, setLocalStream] = useState(null); // Luồng video/audio local
  const [remoteStreams, setRemoteStreams] = useState([]); // Danh sách luồng remote

  // Khi luồng local hoặc remote thay đổi, gán nó vào phần tử video
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      if (localVideoRef.current.srcObject !== localStream) {
        localVideoRef.current.srcObject = localStream;
      }
    }
  
    remoteStreams.forEach((stream, index) => {
      const remoteVideoRef = remoteVideoRefs.current[index];
      if (remoteVideoRef) {
        if (remoteVideoRef.srcObject !== stream) {
          remoteVideoRef.srcObject = stream;
        }
      } else {
        console.warn(`Không tìm thấy ref cho remote video tại index ${index}`);
      }
    });
  
    // Loại bỏ các ref không còn sử dụng
    remoteVideoRefs.current = remoteVideoRefs.current.slice(0, remoteStreams.length);
  }, [localStream, remoteStreams]);
  

  useEffect(() => {
    // Hàm tắt tất cả các track
    const stopMediaTracks = () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  
    // Lắng nghe sự kiện "beforeunload" để tắt khi đóng trình duyệt
    window.addEventListener('beforeunload', stopMediaTracks);
  
    // Cleanup khi component bị unmount
    return () => {
      stopMediaTracks();
      window.removeEventListener('beforeunload', stopMediaTracks);
    };
  }, [localStream]);

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

  // const socket = useSocketContext();
  const { socket, connected, id } = useSocketContext();
  const [targetUser, setTargetUser] = useState(null);

//   const createPeerConnection = useCallback(() => {
//     // Luôn đóng kết nối cũ nếu tồn tại
//     if (peerConnection.current) {
//         try {
//             peerConnection.current.close();
//         } catch (error) {
//             console.warn('Lỗi khi đóng kết nối cũ:', error);
//         }
//     }

//     // Tạo kết nối mới
//     const pc = new RTCPeerConnection({
//         iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
//     });

//     // Đảm bảo kết nối được thiết lập đúng
//     pc.onsignalingstatechange = (event) => {
//         console.log('Trạng thái tín hiệu:', pc.signalingState);
//     };

//     pc.oniceconnectionstatechange = (event) => {
//         console.log('Trạng thái ICE:', pc.iceConnectionState);
//     };

//     // pc.onicecandidate = (event) => {
//     //     if (event.candidate) {
//     //         socket.emit('ice-candidate', event.candidate);
//     //     }
//     // };

//     pc.onicecandidate = (event) => {
//       if (event.candidate && targetUser) {
//         socket.emit('ice-candidate', {
//           candidate: event.candidate,
//           targetUserId: targetUser?.userId,
//         });
//       }
//     };

//     pc.ontrack = (event) => {
//         console.log('Nhận track từ remote peer:', event.streams[0]);
//         setRemoteStreams((prev) => [...prev, event.streams[0]]);
//     };

//     // Lưu tham chiếu
//     peerConnection.current = pc;
//     return pc;
// }, [socket, targetUser]);

// useEffect(() => {
//     let pc;
//     let localMediaStream = null;

//     const setupPeerConnection = async () => {
//         try {
//             // Tạo kết nối peer
//             pc = createPeerConnection();

//             // Lấy luồng media
//             try {
//                 localMediaStream = await navigator.mediaDevices.getUserMedia({ 
//                     video: true, 
//                     audio: true 
//                 });
//                 setLocalStream(localMediaStream);
//             } catch (mediaError) {
//                 console.error('Lỗi truy cập media:', mediaError);
                
//                 // Thử stream giả lập nếu không truy cập được media
//                 const simulatedStream = createSimulatedStream();
//                 if (simulatedStream) {
//                     localMediaStream = simulatedStream;
//                     setLocalStream(simulatedStream);
//                     console.warn('Sử dụng luồng giả lập do lỗi truy cập thiết bị');
//                 } else {
//                     throw new Error('Không thể tạo luồng media');
//                 }
//             }

//             // Thêm track một cách an toàn
//             if (localMediaStream && pc.signalingState !== 'closed') {
//                 localMediaStream.getTracks().forEach(track => {
//                     try {
//                         pc.addTrack(track, localMediaStream);
//                         // console.log('Track được thêm:', track);
//                     } catch (addTrackError) {
//                         console.error('Lỗi khi thêm track:', addTrackError);
//                         // Nếu không thể thêm track, tạo lại kết nối
//                         pc = createPeerConnection();
//                         pc.addTrack(track, localMediaStream);
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error('Lỗi thiết lập kết nối peer:', error);
//         }
//     };

//     // Gọi hàm thiết lập
//     setupPeerConnection();

//     // Dọn dẹp
//     return () => {
//         if (localMediaStream) {
//             localMediaStream.getTracks().forEach(track => track.stop());
//         }
//         if (pc && pc.signalingState !== 'closed') {
//             pc.close();
//         }
//     };
// }, [createPeerConnection]);

  // Thêm log trạng thái để kiểm tra tại từng bước
  const createPeerConnection = useCallback(() => {
    if (peerConnection.current) {
      console.log("Trạng thái hiện tại của PeerConnection:", peerConnection.current.signalingState);
      if (peerConnection.current.signalingState !== "closed") {
          console.warn("PeerConnection hiện tại đang hoạt động, không tạo mới.");
          return peerConnection.current;
      }
      try {
          peerConnection.current.close();
          console.log("Đóng kết nối cũ thành công.");
      } catch (error) {
          console.warn("Lỗi khi đóng kết nối cũ:", error);
      }
    }

    // Tạo PeerConnection mới
    const pc = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            // { urls: "turn:your-turn-server.com", username: "user", credential: "password" },
        ],
    });

    // Đăng ký sự kiện signaling state
    pc.onsignalingstatechange = () => {
        console.log("Trạng thái tín hiệu:", pc.signalingState);
    };

    // Đăng ký sự kiện trạng thái ICE
    pc.oniceconnectionstatechange = () => {
        console.log("Trạng thái ICE:", pc.iceConnectionState);
        if (pc.iceConnectionState === "failed") {
            console.error("Kết nối ICE thất bại. Đang thử lại...");
            pc.restartIce(); // Khởi động lại ICE nếu thất bại
        }
    };

    // Đăng ký sự kiện ICE candidate
    pc.onicecandidate = (event) => {
        if (event.candidate && targetUser) {
            console.log("Gửi ICE candidate:", event.candidate);
            socket.emit("ice-candidate", {
                candidate: event.candidate,
                targetUserId: targetUser?.userId,
            });
        } else {
            console.warn("Không có thêm ICE candidate.");
        }
    };

    // Đăng ký sự kiện track từ remote peer
    pc.ontrack = (event) => {
      // console.log("Nhận track từ remote peer:", event.streams[0]);
      setRemoteStreams((prev) => {
        const streamExists = prev.some((stream) => stream.id === event.streams[0].id);
        return streamExists ? prev : [...prev, event.streams[0]]; // Loại bỏ stream trùng lặp
      });
    };

    peerConnection.current = pc; // Lưu kết nối hiện tại
    return pc;
}, [socket, targetUser]);


  useEffect(() => {
    const setupPeerConnection = async () => {
        let localMediaStream = null;

        try {
            // Tạo PeerConnection
            const pc = createPeerConnection();

            // Lấy luồng media từ thiết bị
            try {
                localMediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setLocalStream(localMediaStream);
                // console.log("Lấy được luồng media từ thiết bị:", localMediaStream);
            } catch (mediaError) {
                console.error("Lỗi truy cập media:", mediaError);

                // Thử luồng giả lập nếu không truy cập được thiết bị
                const simulatedStream = createSimulatedStream();
                if (simulatedStream) {
                    localMediaStream = simulatedStream;
                    setLocalStream(simulatedStream);
                    console.warn("Sử dụng luồng giả lập do lỗi truy cập thiết bị");
                } else {
                    throw new Error("Không thể tạo luồng media");
                }
            }

            // Thêm track vào PeerConnection
            if (localMediaStream && pc.signalingState !== "closed") {
                localMediaStream.getTracks().forEach((track) => {
                    try {
                        pc.addTrack(track, localMediaStream);
                        // console.log("Track được thêm vào PeerConnection:", track);
                    } catch (addTrackError) {
                        console.error("Lỗi khi thêm track:", addTrackError);

                        // Nếu không thể thêm track, tạo lại PeerConnection
                        pc = createPeerConnection();
                        pc.addTrack(track, localMediaStream);
                    }
                });
            }
        } catch (error) {
            console.error("Lỗi thiết lập kết nối peer:", error);
        }

        // Dọn dẹp khi component unmount
        return () => {
            if (localMediaStream) {
                localMediaStream.getTracks().forEach((track) => track.stop());
                console.log("Dừng tất cả các track của luồng media.");
            }
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
                console.log("Đóng và xóa PeerConnection.");
            }
        };
    };

    setupPeerConnection();
  }, [createPeerConnection]);

  const [myUserId, setMyUserId] = useState(null);
  const retryCounts = useRef(new Map()); // Theo dõi số lần thử
  const MAX_RETRIES = 5; // Giới hạn số lần gửi offer

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setMyUserId(storedUserId);
    }
  }, []);

  const initiateWebRTCConnection = useCallback(async (otherUser) => {
    try {
        console.log('--- Bắt đầu khởi tạo WebRTC Connection ---');
        console.log('Target userId:', otherUser.userId);

        const pc = createPeerConnection();
        console.log('Đã khởi tạo PeerConnection:', pc);

        const offer = await pc.createOffer();
        console.log('Đã tạo offer:', offer);

        await pc.setLocalDescription(offer);
        console.log('Đã đặt local description:', pc.localDescription);

        socket.emit('offer', {
            offer,
            targetUserId: parseInt(otherUser.userId, 10),
            senderUserId: myUserId, // Thêm ID của người gửi
        });
        console.log('Đã gửi offer tới targetUserId:', otherUser.userId, 'từ senderUserId:', myUserId);

        const currentRetries = retryCounts.current.get(otherUser.userId) || 0;
        retryCounts.current.set(otherUser.userId, currentRetries + 1);
        console.log('Số lần gửi offer cho userId:', otherUser.userId, '->', currentRetries + 1);

        if (currentRetries + 1 >= MAX_RETRIES) {
            console.warn(`Đạt giới hạn gửi offer cho userId: ${otherUser.userId}`);
            offeredUsers.current.delete(otherUser.userId);
        }
    } catch (error) {
        console.error('Lỗi khi tạo offer:', error);
    }
}, [socket, createPeerConnection, myUserId]);



  const isWaitingForConnection = useRef(false); // Prevent duplicate polling
  const offeredUsers = useRef(new Set());

  // Hàm xử lý danh sách người dùng
  const handleUserList = useCallback((users) => {
    console.log('--- Xử lý danh sách người dùng ---');
    console.log('Danh sách người dùng từ socket:', users);

    // Lọc danh sách người dùng
    const otherUsers = users.filter((user) => user.userId !== myUserId);
    console.log('Người dùng khác:', otherUsers);

    if (otherUsers.length > 0) {
        const firstUser = users[0];
        console.log('Người dùng đầu tiên trong danh sách:', firstUser);

        if (firstUser.userId === myUserId) {
            console.log('Tôi là người khởi tạo, chuẩn bị gửi offer.');
            otherUsers.forEach((otherUser) => {
                console.log('Kiểm tra kết nối với userId:', otherUser.userId);

                if (!offeredUsers.current.has(otherUser.userId)) {
                    console.log('Chưa kết nối với userId:', otherUser.userId);
                    setTargetUser(otherUser);

                    // Đánh dấu userId đã xử lý trước khi gọi kết nối
                    offeredUsers.current.add(otherUser.userId);
                    console.log('Đã đánh dấu userId:', otherUser.userId);

                    // Khởi tạo kết nối
                    initiateWebRTCConnection(otherUser);
                } else {
                    console.log('Đã kết nối trước đó với userId:', otherUser.userId);
                }
            });
        } else {
            console.log('Tôi không phải là người khởi tạo. Chờ offer...');
        }
    } else {
        console.log('Chỉ có 1 người trong phòng. Không làm gì.');
    }
}, [myUserId, initiateWebRTCConnection]);



  const userId = localStorage.getItem('userId');
  const fullName = localStorage.getItem('full_name');
  const userName = localStorage.getItem('user_name');

  useEffect(() => {
    if (!socket || connected === undefined) {
      console.log('Socket chưa sẵn sàng trong ClassRoom. Chờ khởi tạo...');
      if (!isWaitingForConnection.current) {
          isWaitingForConnection.current = true;

          // Polling until socket is ready
          const interval = setInterval(() => {
              if (socket?.connected) {
                  console.log('Socket đã sẵn sàng. Dừng polling.');
                  isWaitingForConnection.current = false;
                  clearInterval(interval);
              } else {
                  console.log('Đang chờ socket kết nối...');
              }
          }, 3000);

          return () => clearInterval(interval);
      }
      return;
    }
    
    // console.log('Socket status:', {
    //   socket,
    //   connected: socket?.connected,
    //   id: socket?.id
    // });

    // if (!connected || !socket) {
    //     console.log('Socket chưa sẵn sàng trong ClassRoom');
    //     return;
    // }

    // console.log('Socket connected in ClassRoom:', socket, connected, id);

    // // Client
    // socket.emit('test-event', { message: 'Hello server' });

    // // Client
    // socket.on('test-response', (data) => {
    //   console.log('Received response from server:', data);
    // });
    
    // Tham gia phòng học
    socket.emit('join-room', { classCode, userId: userId, fullName: fullName, userName: userName});
    console.log(`Đã tham gia phòng: ${classCode}`);

    // Lắng nghe danh sách người tham gia
    socket.on('room-users', (users) => {
      console.log('Danh sách người dùng trong phòng:', users);
      
      // So sánh trước khi cập nhật
      const previousUsers = participants.map((p) => p.userId);
      const currentUsers = users.map((u) => u.userId);
  
      if (JSON.stringify(previousUsers) !== JSON.stringify(currentUsers)) {
          setParticipants(users);
          console.log('Cập nhật danh sách người dùng:', users);
  
          if (typeof handleUserList === 'function') {
              handleUserList(users);
          }
      } else {
          console.log('Danh sách người dùng không thay đổi.');
      }
    });
  

    // Lắng nghe thông báo
    socket.on('notification', (data) => {
        console.log('Nhận thông báo:', data);
        setNotifications((prev) => [...prev, data]);
        // alert(data.message);
    });

    // Lắng nghe danh sách yêu cầu tham gia
    socket.on('join-request', (requests) => {
        console.log('Danh sách yêu cầu tham gia:', requests);
        setJoinRequests(requests);
    });


    socket.on("receive-message", (message) => {
      // Kiểm tra nếu tin nhắn là của chính người gửi thì bỏ qua
      if (message.userId === userId) {
        console.log("Bỏ qua tin nhắn của chính mình:", message);
        return;
      }
      
      console.log("Nhận tin nhắn:", message);
      setMessages((prevMessages) => [message, ...prevMessages]);
    });

    // // Lắng nghe offer từ WebRTC
    // socket.on('offer', async (offer) => {
    //     console.log('Nhận offer:', offer);
    //     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    //     const answer = await peerConnection.current.createAnswer();
    //     await peerConnection.current.setLocalDescription(answer);
    //     // socket.emit('answer', answer);
    //     socket.emit('answer', { answer, targetUserId: targetUser.id });
    //     console.log(answer, targetUser);
    // });

    // Nhận offer
    socket.on("offer", async (data) => {
      console.log("Nhận offer đầy đủ:", data);
  
      if (!data || !data.offer || !data.senderUserId) {
          console.error("Lỗi: Dữ liệu offer không hợp lệ. Dữ liệu nhận được:", data);
          return;
      }
  
      try {
          const pc = createPeerConnection();
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          console.log("Đã đặt remote description thành công.");
  
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
  
          socket.emit("answer", {
              answer: pc.localDescription,
              targetUserId: data.senderUserId, // Trả lời người gửi offer
          });
          console.log("Đã gửi answer tới senderUserId:", data.senderUserId);
      } catch (error) {
          console.error("Lỗi khi xử lý offer:", error);
      }
    });
  

    // // Lắng nghe answer từ WebRTC
    // socket.on('answer', async (answer) => {
    //     console.log('Nhận answer:', answer);
    //     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    // });

    // Nhận answer
    socket.on('answer', async (data) => {
      console.log('Nhận answer:', data.answer);

      try {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      } catch (error) {
        console.error('Lỗi khi xử lý answer:', error);
      }

      // Xóa số lần thử khi nhận được phản hồi
      retryCounts.current.delete(data.senderUserId);
    });


    // // Lắng nghe ice-candidate từ WebRTC
    // socket.on('ice-candidate', (candidate) => {
    //     console.log('Nhận ICE candidate:', candidate);
    //     peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    // });

    // Nhận ICE candidate
    socket.on('ice-candidate', (data) => {
      console.log('Nhận ICE candidate:', data.candidate);

      try {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error('Lỗi khi thêm ICE candidate:', error);
      }
    });

    return () => {
        socket.emit('leave-room', { classCode });
        socket.off('room-users');
        socket.off("receive-message");
        socket.off('notification');
        socket.off('join-request');
        socket.off('offer');
        socket.off('answer');
        socket.off('ice-candidate');
    };
  }, [connected, socket, id, classCode, handleUserList, userId, fullName, userName]);


  const approveRequest = (userId) => {
    if (socket) {
      socket.emit('handle-join-request', { classCode, userId, action: 'approve' });
    }
  };
  
  const rejectRequest = (userId) => {
    if (socket) {
      socket.emit('handle-join-request', { classCode, userId, action: 'reject' });
    }
  };

  // Hàm bật/tắt camera
  const toggleCamera = () => {
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);  // Cập nhật trạng thái camera
    }
  };

  // Hàm bật/tắt mic
  const toggleMic = () => {
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);  // Cập nhật trạng thái microphone
    }
  };

  // Hàm toggle hiển thị panel, nếu nhấn vào cùng 1 panel thì tắt đi, nếu nhấn vào panel khác thì chuyển sang panel đó
  const togglePanel = (panelName) => {
    setActivePanel(prevPanel => (prevPanel === panelName ? null : panelName));
  };

  // Hàm toggle chia sẻ màn hình
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Nếu đang chia sẻ màn hình, dừng chia sẻ
      stopScreenShare();
      setIsScreenSharing(false);
    } else {
      // Nếu chưa chia sẻ, bắt đầu chia sẻ màn hình
      await shareScreen();
      setIsScreenSharing(true);
    }
  };

  // Hàm xử lý hiển thị màn hình chia sẻ
  const handleScreenShare = (screenStream) => {
    const videoElement = document.getElementById('sharedScreen');  // Sử dụng video phần tử riêng biệt

    if (videoElement && screenStream) {
      videoElement.srcObject = screenStream;
      videoElement.style.display = 'block'; // Hiển thị video màn hình chia sẻ
      videoElement.play();
    }
  };

  // Hàm dừng chia sẻ màn hình
  const stopScreenShare = () => {
    const videoElement = document.getElementById('sharedScreen');  // Video riêng cho màn hình chia sẻ
    const screenStream = videoElement?.srcObject;

    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      videoElement.style.display = 'none'; // Ẩn video màn hình sau khi dừng chia sẻ
      videoElement.srcObject = null; // Xóa stream khỏi video element
    }
  };

  // Hàm chia sẻ màn hình chính (không thay thế camera video)
  const shareScreen = async () => {
    // const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

    // Nếu không có peerConnection, chỉ hiển thị màn hình cục bộ
    // if (!isConnected) {
    //   handleScreenShare(screenStream); // Gán vào element cục bộ
    //   return;
    // }

    // // Lấy đối tượng peerConnection với socketId (bạn cần xác định socketId)
    // const socketId = connectedSocketIds[0];  // Thay bằng giá trị socketId đúng
    // const peerConnection = getPeerConnection(socketId);

    // // Kiểm tra kết nối WebRTC
    // if (!peerConnection || !isConnected) {
    //   console.error("Kết nối WebRTC chưa sẵn sàng.");
    //   return;
    // }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

      // Gửi track màn hình tới peer (không thay thế video camera)
      const videoTrack = screenStream.getVideoTracks()[0];
      // peerConnection.addTrack(videoTrack, screenStream);

      // setIsScreenSharing(true);

      // Hiển thị màn hình được chia sẻ vào phần tử video riêng biệt
      handleScreenShare(screenStream);

      // Khi người dùng dừng chia sẻ màn hình
      videoTrack.onended = () => {
        stopScreenShare();
        setIsScreenSharing(false);
      };
    } catch (error) {
      console.error("Lỗi khi chia sẻ màn hình: ", error);
      setIsScreenSharing(false);  // Cập nhật trạng thái khi có lỗi
    }
  };

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatDisplayRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Hàm gửi tin nhắn
  const handleSendMessage = () => {
      if (newMessage.trim()) {
          const message = {
              sender: fullName || "Bạn",
              text: newMessage,
              isFile: false,
              userId,
          };
  
          // Phát tin nhắn qua socket
          socket.emit("send-message", {
              message,
              classCode,
          });
  
          // Cập nhật tin nhắn cục bộ
          setMessages([message, ...messages]);
          setNewMessage("");
      }
  };
  
  // Hàm gửi file
  const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const fileURL = URL.createObjectURL(file);
          const message = {
              sender: fullName || "Bạn",
              text: file.name,
              fileURL,
              isFile: true,
              userId,
          };
  
          // Phát file qua socket
          socket.emit("send-file", {
              message,
              classCode,
          });
  
          // Cập nhật tin nhắn cục bộ
          setMessages([message, ...messages]);
      }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }

  // Tự động cuộn xuống dưới khi có tin nhắn mới
  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleAllowMic = () => setAllowMic(!allowMic);
  const toggleAllowChat = () => setAllowChat(!allowChat);

  const [notification, setNotification] = useState("");

  const handleRaiseHand = (userName) => {
    setNotification(`${userName} đang giơ tay phát biểu`);
    setTimeout(() => {
      setNotification(""); // Xóa thông báo sau 2 giây
    }, 2000);
  };

  // Hàm thoát phòng học
  const handleLeaveClass = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    navigate('/create-class');
  };

  return (
    <Container>
      <VideoContainer activePanel={activePanel} isScreenSharing={isScreenSharing}>
        <StyledVideo ref={localVideoRef} autoPlay muted playsInline isScreenSharing={isScreenSharing} />
        {/* <StyledVideo ref={remoteVideoRef} autoPlay playsInline style={{ borderRadius: '10px'}}/> */}
        {/* {remoteStreams.length > 0 ? ( */}
        {remoteStreams.map((stream, index) => {
          const uniqueKey = `${stream.id || `generated`}-${index}`;
          return (
              <StyledVideo
                  key={`remote-stream-${uniqueKey}`}
                  ref={(el) => {
                      if (el) {
                          remoteVideoRefs.current[index] = el;
                          if (el.srcObject !== stream) {
                              el.srcObject = stream;
                          }
                      }
                  }}
                  autoPlay
                  playsInline
                  style={{
                      borderRadius: '10px',
                      display: stream ? 'block' : 'none',
                  }}
                  isScreenSharing={isScreenSharing}
              />
            );
        })}


        {/* Video để xem màn hình được chia sẻ */}
        <SharedScreenVideo id="sharedScreen" autoPlay playsInline isScreenSharing={isScreenSharing} />
      </VideoContainer>
      
      <MainControl>
        {/* Left: Class Code */}
        <LeftPanel>
          {classCode}
        </LeftPanel>

        {/* Center: Control Buttons */}
        <CenterPanel>
          <ButtonControlCM onClick={toggleCamera} isOn={isCameraOn} title='Bật/Tắt Camera'>
            <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} />
          </ButtonControlCM>
          <ButtonControlCM onClick={toggleMic} isOn={isMicOn} title='Bật/Tắt Mic'>
            <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} />
          </ButtonControlCM>
          <ButtonControl onClick={toggleScreenShare} title='Bật/Tắt Chia sẻ màn hình'>
            <FontAwesomeIcon icon={isScreenSharing ? faStop : faChalkboard} />
          </ButtonControl>
          <ButtonControl onClick={() => handleRaiseHand(username)} title='Giơ tay'>
            <FontAwesomeIcon icon={faHandPaper} />
          </ButtonControl>
          {notification && <Notification>{notification}</Notification>}
          <ButtonControl onClick={handleLeaveClass} title='Rời khỏi lớp'>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </ButtonControl>
        </CenterPanel>

        {/* Right: Additional Features */}
        <RightPanel>
        <ButtonFeature onClick={() => togglePanel('participants')} title='Danh sách học viên'>
          <FontAwesomeIcon icon={faUsers} />
        </ButtonFeature>
        <ButtonFeature onClick={() => togglePanel('chat')} title='Chat'>
          <FontAwesomeIcon icon={faComments} />
        </ButtonFeature>
        <ButtonFeature onClick={() => togglePanel('attendance')} title='Điểm danh'>
          <FontAwesomeIcon icon={faClipboardList} />
        </ButtonFeature>
        <ButtonFeature onClick={() => togglePanel('owner')} title='Bộ điều khiển'>
          <FontAwesomeIcon icon={faCrown} />
        </ButtonFeature>
        </RightPanel>
      </MainControl>

      {/* Khung người tham gia */}
      {activePanel === 'participants' && (
        <FloatingPanel>
          <HeaderPanel>Danh sách học viên</HeaderPanel>
          <FindContainer>
            <FindInput type="text" placeholder="Tìm kiếm học viên..." />
            <FindButton>
              <FontAwesomeIcon icon={faSearch} />
            </FindButton>

          </FindContainer>

          {/* Hiển thị yêu cầu tham gia nếu có */}
          {joinRequests.length > 0 && (
          <JoinRequestsContainer>
            <HeaderPanel>Yêu cầu tham gia</HeaderPanel>
            <RequestList>
              {joinRequests.map((request, index) => (
                <RequestItem key={index}>
                  {request.fullName} ({request.userName})
                  <Button onClick={() => approveRequest(request.userId)}>Phê duyệt</Button>
                  <Button onClick={() => rejectRequest(request.userId)}>Từ chối</Button>
                </RequestItem>
              ))}
            </RequestList>
          </JoinRequestsContainer>
        )}


          <ParticipantList>
            {participants.length > 0 ? (
              participants.map((participant, index) => (
                <ParticipantItem key={participant.id}>
                  {index === 0 ? (
                    <strong>
                      {participant.fullName} (Chủ phòng)
                    </strong>
                  ) : (
                    <span>
                      {participant.fullName}
                    </span>
                  )}
                </ParticipantItem>
              ))
            ) : (
              <EmptyMessage>Chưa có học viên nào trong lớp</EmptyMessage>
            )}
          </ParticipantList>



        </FloatingPanel>
      )}

      {/* Khung chat */}
      {activePanel === 'chat' && (
        <FloatingPanel>
          <HeaderPanel>Chat</HeaderPanel>
          
          {/* Khu vực hiển thị tin nhắn */}
          <ChatDisplay ref={chatDisplayRef}>
            {/* Render các tin nhắn tại đây */}
            {messages.map((msg, index) => {
              const showSender =
                index === messages.length - 1 ||
                messages[index + 1].sender !== msg.sender; // Hiển thị tên nếu tin nhắn khác người gửi trước đó

              return (
                <Message key={index} isUser={msg.sender === "Bạn"}>
                  {showSender && <SenderName>{msg.sender}</SenderName>}
                  {msg.isFile ? (
                    <>
                      <DownloadIcon href={msg.fileURL} download={msg.text}>
                        <FontAwesomeIcon icon={faDownload} />  
                        {msg.text}
                      </DownloadIcon>
                    </>
                  ) : (
                    msg.text
                  )}
                </Message>
              );
            })}
          </ChatDisplay>

          {/* Ô nhập tin nhắn và chức năng gửi tin nhắn */}
          <ChatInputContainer>
            <FileUploadIcon onClick={() => fileInputRef.current.click()}>
              <FontAwesomeIcon icon={faPaperclip} />
            </FileUploadIcon>
            <ChatInput
              type="text"
              value={newMessage}
              maxLength={200}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
            />
            <SendButton onClick={handleSendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </SendButton>
            <FileUploadInput
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </ChatInputContainer>
        </FloatingPanel>
      )}

      {/* Khung điểm danh */}
      {activePanel === 'attendance' && (
        <FloatingPanel>
          <HeaderPanel>Điểm danh</HeaderPanel>
          
        </FloatingPanel>
      )}

      {/* Khung quyền chủ phòng */}
      {activePanel === 'owner' && (
        <FloatingPanel>
          <HeaderPanel>Bộ điều khiển</HeaderPanel>
          
          {/* Cho phép mọi người bật mic */}
          <SwitchContainer onClick={toggleAllowMic}>
            <Label>Cho phép mọi người bật mic</Label>
            <Switch checked={allowMic} />
          </SwitchContainer>

          {/* Cho phép mọi người chat */}
          <SwitchContainer onClick={toggleAllowChat}>
            <Label>Cho phép mọi người chat</Label>
            <Switch checked={allowChat} />
          </SwitchContainer>
        </FloatingPanel>
      )}
    </Container>
  );
};

export default ClassRoom;
