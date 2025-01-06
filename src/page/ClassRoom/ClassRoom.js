import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash, faChalkboard, faHandPaper, faSignOutAlt,
  faUsers, faComments, faClipboardList, faCrown, faSearch, faStop, faPaperclip, faPaperPlane, faDownload
} from '@fortawesome/free-solid-svg-icons';

// import useWebRTC from '../page/useWebRTC';
// import io from 'socket.io-client'; // Import socket.io-client
import { useSocketContext } from '../socketContext';
import * as XLSX from 'xlsx';
import { saveAttendance } from './services';

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
    // display: ${(props) => (props.isScreenSharing ? 'block' : 'block')};
    z-index: ${(props) => (props.isScreenSharing ? '1' : 'auto')}; /* Đảm bảo hiển thị lên trên màn hình chia sẻ */
    transition: all 0.3s ease; /* Hiệu ứng mượt mà */
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
  overflow: hidden; /* Ẩn nội dung tràn */
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
  background-color: ${(props) => (props.checked ? '#4CAF50' : '#cccccc')};
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

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  position: absolute;
  bottom: 10px;
  left: 15px;
  right: 15px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #4CAF40;
  }
`;

const TableContainer = styled.div`
  flex-grow: 1; /* Phần bảng chiếm hết khoảng trống */
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: auto; /* Cuộn nội dung nếu vượt khung */
  max-height: 400px; /* Giới hạn chiều cao khung */
  max-height: calc(100% - 50px); /* Đảm bảo bảng không tràn qua phần nút */
  color: #000000
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  position: sticky;
  top: 0; /* Cố định tiêu đề bảng */
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
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

  const [allowMic, setAllowMic] = useState(true);
  const [allowChat, setAllowChat] = useState(true);

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

  /* const [searchTerm, setSearchTerm] = useState(""); // Quản lý giá trị tìm kiếm

  // Hàm xử lý khi người dùng nhập vào ô tìm kiếm
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Lọc danh sách học viên nếu có giá trị tìm kiếm
  const filteredParticipants =
    searchTerm.trim() === ""
      ? participants // Hiển thị toàn bộ danh sách nếu chưa tìm kiếm
      : participants.filter((participant) =>
        participant.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      ); */

  const [searchTerm, setSearchTerm] = useState(""); // Quản lý giá trị tìm kiếm

  // Hàm loại bỏ dấu tiếng Việt
  const removeAccents = (str) => {
    if (!str) return ""; // Đảm bảo không lỗi nếu `str` là null hoặc undefined
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
      .replace(/đ/g, "d") // Xử lý riêng 'đ'
      .replace(/Đ/g, "D")
      .toLowerCase(); // Chuyển thành chữ thường
  };

  // Hàm xử lý khi người dùng nhập vào ô tìm kiếm
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Lọc danh sách học viên nếu có giá trị tìm kiếm
  const filteredParticipants =
    searchTerm.trim() === ""
      ? participants // Hiển thị toàn bộ danh sách nếu chưa tìm kiếm
      : participants.filter((participant) =>
        removeAccents(participant.fullName).includes(removeAccents(searchTerm))
      );

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

  const { socket, connected, id } = useSocketContext();
  const [targetUser, setTargetUser] = useState(null);
  const [myUserId, setMyUserId] = useState(null);

  // Thêm log trạng thái để kiểm tra tại từng bước

  const currentOtherUser = useRef(null);


  const createPeerConnection = useCallback(() => {
    // Nếu PeerConnection đang tồn tại và hoạt động, sử dụng lại nó.
    if (peerConnection.current && peerConnection.current.signalingState !== "closed") {
      console.warn("Sử dụng lại PeerConnection hiện tại.");
      return peerConnection.current;
    }

    // Dọn dẹp PeerConnection cũ nếu cần
    if (peerConnection.current) {
      console.log("Đóng PeerConnection cũ.");
      peerConnection.current.ontrack = null;
      peerConnection.current.onicecandidate = null;
      peerConnection.current.oniceconnectionstatechange = null;

      try {
        peerConnection.current.close();
      } catch (error) {
        console.error("Lỗi khi đóng PeerConnection:", error);
      }
      peerConnection.current = null;
    }

    // Tạo PeerConnection mới
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:turn.anyfirewall.com:443?transport=tcp",
          username: "webrtc",
          credential: "webrtc",
        },
      ],
    });

    // Gắn các sự kiện cho PeerConnection mới
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          room: classCode,
          senderId: myUserId,
        });
      } else {
        console.log("Không còn ICE candidate.");
      }
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (!remoteStreams.find((s) => s.id === stream.id)) {
        setRemoteStreams((prev) => [...prev, stream]);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("Trạng thái ICE:", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        console.error("Kết nối ICE thất bại. Khởi động lại ICE.");
        pc.restartIce();
      }
    };

    pc.onsignalingstatechange = () => {
      console.log("Trạng thái tín hiệu:", pc.signalingState);
    };

    peerConnection.current = pc;
    return pc;
  }, [socket, classCode, myUserId, remoteStreams]);

  // Cập nhật createPeerConnection để chỉ gửi tín hiệu đến SFU

  // const createPeerConnection = useCallback(() => {
  //   if (peerConnection.current) {
  //     // Nếu kết nối hiện tại chưa đóng, đóng nó trước
  //     if (peerConnection.current.signalingState !== 'closed') {
  //       peerConnection.current.close();
  //     }
  //   }

  //   const pc = new RTCPeerConnection({
  //     iceServers: [
  //       { urls: 'stun:stun.l.google.com:19302' },
  //       { urls: 'turn:your-turn-server.com', username: 'user', credential: 'password' },
  //     ],
  //   });

  //   // Kiểm tra socket và classCode trước khi đăng ký sự kiện ICE
  //   const handleIceCandidate = (event) => {
  //     if (!socket) {
  //       console.warn('Socket chưa được khởi tạo. Không thể gửi ICE candidate.');
  //       return;
  //     }

  //     if (!classCode) {
  //       console.warn('Mã lớp học không hợp lệ. Không thể gửi ICE candidate.');
  //       return;
  //     }

  //     if (event.candidate) {
  //       try {
  //         socket.emit('ice-candidate', { 
  //           candidate: event.candidate, 
  //           room: classCode,
  //           senderId: myUserId,
  //         });
  //       } catch (error) {
  //         console.error('Lỗi khi gửi ICE candidate:', error);
  //       }
  //     }
  //   };

  //   // Đăng ký sự kiện ICE candidate với hàm kiểm tra
  //   pc.onicecandidate = handleIceCandidate;

  //   // Đăng ký sự kiện track
  //   pc.ontrack = (event) => {
  //     const [stream] = event.streams;
  //     if (!remoteStreams.find((s) => s.id === stream.id)) {
  //       setRemoteStreams((prev) => [...prev, stream]);
  //     }
  //   };

  //   peerConnection.current = pc;
  //   return pc;
  // }, [socket, classCode, remoteStreams]);


  useEffect(() => {
    console.log("Cập nhật remoteStreams:", remoteStreams);
  }, [remoteStreams]);

  // useEffect(() => {
  //   const setupPeerConnection = async () => {
  //     let localMediaStream = null;

  //     try {
  //       // Kiểm tra nếu PeerConnection đã tồn tại và còn hoạt động
  //       if (peerConnection.current && peerConnection.current.signalingState !== "closed") {
  //         console.log("PeerConnection đã tồn tại, sử dụng lại.");
  //         console.log("PeerConnection hiện tại:", peerConnection.current);
  //         return; // Thoát sớm, không tạo mới
  //       }

  //       // Chỉ tạo mới PeerConnection nếu cần
  //       const pc = createPeerConnection();
  //       peerConnection.current = pc; // Gán PeerConnection vào biến toàn cục

  //       // Lấy luồng media từ thiết bị
  //       try {
  //         localMediaStream = await navigator.mediaDevices.getUserMedia({
  //           video: true,
  //           audio: true,
  //         });
  //         setLocalStream(localMediaStream);
  //         console.log("Lấy được luồng media từ thiết bị.");
  //       } catch (mediaError) {
  //         console.error("Lỗi truy cập media:", mediaError);

  //         // Nếu không truy cập được thiết bị, sử dụng luồng giả lập
  //         const simulatedStream = createSimulatedStream();
  //         if (simulatedStream) {
  //           localMediaStream = simulatedStream;
  //           setLocalStream(simulatedStream);
  //           console.warn("Sử dụng luồng giả lập do lỗi truy cập thiết bị.");
  //         } else {
  //           throw new Error("Không thể tạo luồng media.");
  //         }
  //       }

  //       // Thêm các track vào PeerConnection
  //       const addedTrackIds = new Set();
  //       if (localMediaStream) {
  //         localMediaStream.getTracks().forEach((track) => {
  //           if (!addedTrackIds.has(track.id)) {
  //             try {
  //               pc.addTrack(track, localMediaStream);
  //               addedTrackIds.add(track.id);
  //               console.log("Track được thêm vào PeerConnection:", track);
  //             } catch (addTrackError) {
  //               console.error("Lỗi khi thêm track vào PeerConnection:", addTrackError);
  //             }
  //           }
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi thiết lập PeerConnection:", error);
  //     }

  //     // Cleanup khi component unmount
  //     return () => {
  //       if (localMediaStream) {
  //         localMediaStream.getTracks().forEach((track) => track.stop());
  //         console.log("Dừng tất cả các track của luồng media.");
  //       }
  //       if (peerConnection.current) {
  //         peerConnection.current.ontrack = null;
  //         peerConnection.current.onicecandidate = null;
  //         peerConnection.current.oniceconnectionstatechange = null;
  //         peerConnection.current.close();
  //         peerConnection.current = null;
  //         console.log("Đóng và xóa PeerConnection.");
  //       }
  //     };
  //   };

  //   setupPeerConnection();
  // }, [createPeerConnection]);
  const setupPeerConnection = useCallback(async () => {
    let localMediaStream = null;

    try {
      if (peerConnection.current && peerConnection.current.signalingState !== "closed") {
        console.log("PeerConnection đã tồn tại, sử dụng lại.");
        return true;
      }

      const pc = createPeerConnection();
      peerConnection.current = pc;

      try {
        localMediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(localMediaStream);
        console.log("Lấy được luồng media từ thiết bị.");
      } catch (mediaError) {
        console.error("Lỗi truy cập media:", mediaError);

        const simulatedStream = createSimulatedStream();
        if (simulatedStream) {
          localMediaStream = simulatedStream;
          setLocalStream(simulatedStream);
          console.warn("Sử dụng luồng giả lập do lỗi truy cập thiết bị.");
        } else {
          throw new Error("Không thể tạo luồng media.");
        }
      }

      const addedTrackIds = new Set();
      if (localMediaStream) {
        localMediaStream.getTracks().forEach((track) => {
          if (!addedTrackIds.has(track.id)) {
            try {
              pc.addTrack(track, localMediaStream);
              addedTrackIds.add(track.id);
              console.log("Track được thêm vào PeerConnection:", track);
            } catch (addTrackError) {
              console.error("Lỗi khi thêm track vào PeerConnection:", addTrackError);
            }
          }
        });
      }

      return true;
    } catch (error) {
      console.error("Lỗi khi thiết lập PeerConnection:", error);
      return false;
    }
  }, [peerConnection, createPeerConnection, setLocalStream]);


  const retryCounts = useRef(new Map()); // Theo dõi số lần thử
  const MAX_RETRIES = 5; // Giới hạn số lần gửi offer

  useEffect(() => {
    // const storedUserId = localStorage.getItem('userId');
    if (id) {
      setMyUserId(id);
    }
  }, [id]);

  //   const initiateWebRTCConnection = useCallback(async (otherUser) => {
  //     currentOtherUser.current = otherUser; // Cập nhật giá trị vào ref

  //     try {
  //         console.log('--- Bắt đầu khởi tạo WebRTC Connection ---');
  //         console.log('Target userId:', otherUser.userId);

  //         const pc = createPeerConnection(currentOtherUser.current);
  //         console.log('Đã khởi tạo PeerConnection:', pc , ' với người dùng: ', currentOtherUser.current);

  //         const offer = await pc.createOffer();
  //         console.log('Đã tạo offer:', offer);

  //         await pc.setLocalDescription(offer);
  //         console.log('Đã đặt local description:', pc.localDescription);

  //         socket.emit('offer', {
  //             offer,
  //             targetUserId: parseInt(otherUser.userId, 10),
  //             senderUserId: myUserId, // Thêm ID của người gửi
  //         });
  //         console.log('Đã gửi offer tới targetUserId:', otherUser.userId, 'từ senderUserId:', myUserId);

  //         const currentRetries = retryCounts.current.get(otherUser.userId) || 0;
  //         retryCounts.current.set(otherUser.userId, currentRetries + 1);
  //         console.log('Số lần gửi offer cho userId:', otherUser.userId, '->', currentRetries + 1);

  //         if (currentRetries + 1 >= MAX_RETRIES) {
  //             console.warn(`Đạt giới hạn gửi offer cho userId: ${otherUser.userId}`);
  //             offeredUsers.current.delete(otherUser.userId);
  //         }
  //     } catch (error) {
  //         console.error('Lỗi khi tạo offer:', error);
  //     }
  // }, [socket, createPeerConnection, myUserId]);

  // Khởi tạo kết nối WebRTC và gửi offer đến server
  const initiateWebRTCConnection = useCallback(async () => {
    try {
      // Gọi hàm thiết lập PeerConnection
      const isPeerConnectionReady = await setupPeerConnection();

      if (!isPeerConnectionReady) {
        console.error("PeerConnection không được thiết lập, dừng quá trình.");
        return;
      }

      // Sử dụng PeerConnection hiện tại
      const pc = peerConnection.current;

      // Kiểm tra trạng thái signaling trước khi tạo offer
      if (pc.signalingState !== "stable") {
        console.warn(
          `Không thể tạo offer trong trạng thái signaling: ${pc.signalingState}`
        );
        return;
      }

      // Tạo và gửi offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Gửi offer lên server SFU
      socket.emit("offer", { offer, room: classCode, senderId: myUserId });
      console.log("Đã gửi offer đến SFU:", offer);
    } catch (error) {
      console.error("Lỗi khi khởi tạo WebRTC:", error);
    }
  }, [setupPeerConnection, peerConnection, socket, classCode, myUserId]);




  const isWaitingForConnection = useRef(false); // Prevent duplicate polling
  const offeredUsers = useRef(new Set());

  // Hàm xử lý danh sách người dùng
  const handleUserList = useCallback((users) => {
    console.log('--- Xử lý danh sách người dùng ---');
    console.log('Danh sách người dùng từ socket:', users);

    // Lọc danh sách người dùng
    const otherUsers = users.filter((user) => user.userId !== myUserId);
    console.log('Người dùng khác:', otherUsers);
    currentOtherUser.current = otherUsers; // Cập nhật giá trị vào ref


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
    socket.emit('join-room', { classCode, userId: userId, fullName: fullName, userName: userName });
    console.log(`Đã tham gia phòng: ${classCode}`);

    initiateWebRTCConnection();

    const handleOffer = async (data) => {
      try {
        if (!data?.offer) {
          console.error("Dữ liệu offer không hợp lệ:", data);
          return;
        }

        let pc = peerConnection.current;
        if (!pc || pc.signalingState === "closed") {
          console.log("PeerConnection chưa tồn tại hoặc đã bị đóng. Tạo mới.");
          pc = createPeerConnection();
          peerConnection.current = pc; // Gán lại giá trị mới
        }

        // Nếu trạng thái ICE không ổn định, khởi động lại
        if (pc.iceConnectionState === "failed" || pc.signalingState !== "stable") {
          console.warn("Trạng thái không ổn định, khởi động lại ICE.");
          pc.restartIce();
        }

        // Đặt remote description
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        console.log("Đã thiết lập remote description với offer.");

        // Tạo answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("Đã tạo và đặt local description với answer.");

        // Gửi answer trở lại server
        socket.emit("answer", {
          answer: pc.localDescription,
          room: classCode,
          senderId: myUserId,
        });
      } catch (error) {
        console.error("Lỗi khi xử lý offer:", error);
      }
    };



    const handleAnswer = async (data) => {
      try {
        if (!peerConnection.current) {
          console.warn('No active peer connection');
          return;
        }

        // Kiểm tra trạng thái
        if (peerConnection.current.signalingState !== 'have-local-offer') {
          console.warn('Invalid signaling state for setting remote answer:', peerConnection.current.signalingState);
          return;
        }

        const remoteDesc = new RTCSessionDescription(data.answer);
        await peerConnection.current.setRemoteDescription(remoteDesc);
        console.log('Remote description set successfully');
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    };

    const handleIceCandidate = async (data) => {
      if (!peerConnection.current || !data.candidate) {
        console.warn("Không có PeerConnection hoặc candidate không hợp lệ.");
        return;
      }
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        console.log("Đã thêm ICE candidate thành công.");
      } catch (error) {
        console.error("Lỗi khi thêm ICE candidate:", error);
      }
    };


    // Đăng ký các event listener
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    // Lắng nghe danh sách người tham gia
    socket.on('room-users', (users) => {
      console.log('Danh sách người dùng trong phòng:', users);
      setParticipants(users);


      // So sánh trước khi cập nhật
      // const previousUsers = participants.map((p) => p.userId);
      // const currentUsers = users.map((u) => u.userId);

      // if (JSON.stringify(previousUsers) !== JSON.stringify(currentUsers)) {
      //     setParticipants(users);
      //     console.log('Cập nhật danh sách người dùng:', users);

      //     if (typeof handleUserList === 'function') {
      //         handleUserList(users);
      //     }
      // } else {
      //     console.log('Danh sách người dùng không thay đổi.');
      // }
    });


    // Lắng nghe thông báo
    socket.on('notification', (data) => {
      console.log('Nhận thông báo:', data);
      alert(data.message);
      setNotifications((prev) => [...prev, data]);
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

    // Lắng nghe sự kiện giơ tay từ server
    socket.on('hand_raised', (data) => {
      // Chỉ hiển thị nếu không phải là người giơ tay
      // if (data.userId !== userId) {
      setNotification(`${data.fullName} đang giơ tay phát biểu`);
      setTimeout(() => {
        setNotification(""); // Xóa thông báo sau 2 giây
      }, 2000);
      // }
    });

    // Lắng nghe offer từ WebRTC
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
    // socket.on("offer", async (data) => {
    //   console.log("Nhận offer đầy đủ:", data);

    //   if (!data || !data.offer || !data.senderUserId) {
    //       console.error("Lỗi: Dữ liệu offer không hợp lệ. Dữ liệu nhận được:", data);
    //       return;
    //   }

    //   try {
    //       const pc = createPeerConnection();
    //       await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
    //       console.log("Đã đặt remote description thành công.");

    //       const answer = await pc.createAnswer();
    //       await pc.setLocalDescription(answer);

    //       socket.emit("answer", {
    //           answer: pc.localDescription,
    //           targetUserId: data.senderUserId, // Trả lời người gửi offer
    //       });
    //       console.log("Đã gửi answer tới senderUserId:", data.senderUserId);
    //   } catch (error) {
    //       console.error("Lỗi khi xử lý offer:", error);
    //   }
    // });


    // // Lắng nghe answer từ WebRTC
    // socket.on('answer', async (answer) => {
    //     console.log('Nhận answer:', answer);
    //     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    // });

    // Nhận answer

    // Nhận offer từ server SFU

    // socket.on('offer', async (data) => {
    //   const pc = createPeerConnection();
    //   await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
    //   const answer = await pc.createAnswer();
    //   await pc.setLocalDescription(answer);
    //   socket.emit('answer', { answer: pc.localDescription, room: classCode });
    // });

    // socket.on('answer', async (data) => {
    //   console.log('Nhận answer:', data.answer);

    //   try {
    //     await peerConnection.current.setRemoteDescription(
    //       new RTCSessionDescription(data.answer)
    //     );
    //   } catch (error) {
    //     console.error('Lỗi khi xử lý answer:', error);
    //   }

    //   // Xóa số lần thử khi nhận được phản hồi
    //   retryCounts.current.delete(data.senderUserId);
    // });


    // // Lắng nghe ice-candidate từ WebRTC
    // socket.on('ice-candidate', (candidate) => {
    //     console.log('Nhận ICE candidate:', candidate);
    //     peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    // });

    // Nhận ICE candidate


    // Nhận answer từ server SFU

    // socket.on('answer', async (data) => {
    //   try {
    //     if (peerConnection.current) {
    //       await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    //     }
    //   } catch (error) {
    //     console.error('Lỗi khi xử lý answer:', error);
    //   }
    // });

    // socket.on('ice-candidate', (data) => {
    //   console.log('Nhận ICE candidate:', data.candidate);

    //   try {
    //     peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    //     console.log("Thêm ICE candidate thành công:", data.candidate);
    //   } catch (error) {
    //     console.error('Lỗi khi thêm ICE candidate:', error);
    //   }
    // });

    // Nhận ICE candidate từ server SFU

    // socket.on('ice-candidate', (data) => {
    //   try {
    //     if (peerConnection.current) {
    //       peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    //     }
    //   } catch (error) {
    //     console.error('Lỗi khi thêm ICE candidate:', error);
    //   }
    // });

    return () => {
      socket.emit('leave-room', { classCode });
      socket.off('room-users');
      socket.off("receive-message");
      socket.off('notification');
      socket.off('join-request');
      socket.off('hand_raised');
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
    const videoElement = document.getElementById('sharedScreen'); // Video màn hình chia sẻ

    if (videoElement) {
      // Dừng tất cả track từ màn hình chia sẻ
      const screenStream = videoElement.srcObject;
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }

      // Đặt lại thuộc tính video và ẩn màn hình chia sẻ
      videoElement.style.display = 'none';
      videoElement.srcObject = null;
    }

    // Trả trạng thái camera chính về ban đầu
    setIsScreenSharing(false);
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

      // Hiển thị màn hình được chia sẻ vào phần tử video riêng biệt
      handleScreenShare(screenStream);

      // Khi người dùng dừng chia sẻ màn hình
      videoTrack.onended = () => {
        stopScreenShare();
        setIsScreenSharing(false);
      };

      // Cập nhật trạng thái chia sẻ màn hình
      setIsScreenSharing(true);
    } catch (error) {
      // Nếu người dùng không chọn màn hình hoặc đóng cửa sổ chọn
      if (error.name === "NotAllowedError" || error.name === "AbortError") {
        console.log("Người dùng đã hủy chia sẻ màn hình.");
        // stopScreenShare();
      } else {
        console.error("Lỗi khi chia sẻ màn hình: ", error);
      }
      stopScreenShare();
      // Đảm bảo trạng thái được cập nhật đúng
      setIsScreenSharing(false);
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
    // setNotification(`${userName} đang giơ tay phát biểu`);
    // setTimeout(() => {
    //   setNotification(""); // Xóa thông báo sau 2 giây
    // }, 2000);
    // Gửi sự kiện giơ tay với thông tin đầy đủ
    socket.emit('raise_hand', {
      userId: userId,
      classCode: classCode,
      fullName: fullName,
      userName: userName
    });
  };

  const currentUserId = localStorage.getItem('userId'); // Lấy userId của người dùng hiện tại

  // Kiểm tra người dùng hiện tại có phải là chủ phòng
  const isOwner = participants.length > 0 && participants[0].userId === currentUserId;

  // Kiểm tra có yêu cầu tham gia hay không
  const hasJoinRequests = joinRequests.length > 0;

  const [attendanceData, setAttendanceData] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [attendance, setAttendance] = useState(false);
  const [isAttendanceExported, setIsAttendanceExported] = useState(false);

  // Hàm xử lý khi tải file Excel
  const handleFileUpload1 = (e) => {
    const file = e.target.files[0];

    // Kiểm tra nếu không có file nào được chọn
    if (!file) {
      console.log('Không có file nào được chọn.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setFileData(jsonData); // Lưu dữ liệu file gốc
      setAttendanceData(jsonData); // Dữ liệu sẽ được hiển thị
    };

    reader.readAsArrayBuffer(file);
  };

  // Hàm xử lý điểm danh
  const handleAttendance = (users) => {
    if (!fileData) {
      alert('Chưa có file nào được tải lên. Vui lòng tải file trước khi điểm danh.');
      return;
    }

    if (!Array.isArray(users) || users.length === 0) {
      alert('Danh sách người tham gia không hợp lệ.');
      return;
    }

    const today = new Date().toISOString().split('T')[0]; // Ngày hiện tại (YYYY-MM-DD)
    const headers = fileData[0]; // Lấy hàng tiêu đề
    let dateColumnIndex = headers.indexOf('Ngày');
    let attendanceColumnIndex = headers.indexOf('Đi học');
    let classCodeColumnIndex = headers.indexOf('Mã lớp');

    // Nếu chưa tìm thấy các cột, thêm chúng vào tiêu đề
    if (dateColumnIndex === -1) {
      headers.push('Ngày');
      dateColumnIndex = headers.length - 1;
    }
    if (attendanceColumnIndex === -1) {
      headers.push('Đi học');
      attendanceColumnIndex = headers.length - 1;
    }
    if (classCodeColumnIndex === -1) {
      headers.push('Mã lớp');
      classCodeColumnIndex = headers.length - 1;
    }

    // Cập nhật dữ liệu điểm danh
    const updatedData = fileData.map((row, rowIndex) => {
      if (rowIndex === 0) return row; // Bỏ qua dòng tiêu đề

      const [_, fullName, userName] = row;

      // Kiểm tra xem học viên có trong danh sách tham gia không
      const isPresent = users.some(
        (user) => user.fullName === fullName && user.userName === userName
      );

      // Cập nhật dữ liệu vào các cột tương ứng
      row[dateColumnIndex] = today;
      row[attendanceColumnIndex] = isPresent ? 'T' : 'F';
      row[classCodeColumnIndex] = classCode;

      return row;
    });
    setAttendanceData([...updatedData]); // Cập nhật state
    console.log(updatedData);
    setAttendance(true);
    alert('Điểm danh thành công!');
  };


  const handleExportFile = async () => {
    if (!attendance) {
      alert("Vui lòng điểm danh trước khi xuất file.");
      return;
    }

    if (attendanceData.length > 0) {
      try {
        const worksheet = XLSX.utils.aoa_to_sheet(attendanceData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
        XLSX.writeFile(workbook, 'attendance.xlsx');

        // Chỉ đặt isAttendanceExported thành true sau khi file được lưu thành công
        setIsAttendanceExported(true);
        console.log("File đã được xuất thành công.");

        // Gửi dữ liệu đã điểm danh tới server
        const dataToSend = attendanceData.slice(1).map((row) => ({
          HoTen: row[1], // Họ tên
          TenDangNhap: row[2], // Tên đăng nhập
          Ngay: row[3], // Ngày
          DiHoc: row[4], // Trạng thái Đi học
          MaLop: row[5], // Mã lớp
        }));

        console.log("Dữ liệu gửi đi:", dataToSend);

        // await saveAttendance(dataToSend);
        console.log("Dữ liệu điểm danh đã được gửi thành công tới server.");
      } catch (error) {
        console.error("Lỗi khi xuất file:", error);
      }
    }
  };

  // Hàm thoát phòng học
  const handleLeaveClass = () => {
    console.log("isOwner:", isOwner, "isAttendanceExported:", isAttendanceExported);

    // Nếu là chủ phòng và chưa xuất file thì hiện thông báo
    if (isOwner) {
      const shouldExport = isAttendanceExported;

      if (!shouldExport) {
        const confirmExport = window.confirm(
          "Bạn chưa xuất file điểm danh. Bạn có muốn xuất file trước khi rời lớp không?"
        );

        if (confirmExport) {
          handleExportFile();
        }
      }
    }

    // 1. Dừng localStream
    if (localStream && localStream instanceof MediaStream) {
      localStream.getTracks().forEach(track => {
        track.stop(); // Dừng từng track (audio/video)
        console.log(`Track ${track.kind} của localStream đã dừng`);
      });
      setLocalStream(null); // Reset localStream state
    }

    // 2. Dừng remoteStreams
    if (remoteStreams.length > 0) {
      remoteStreams.forEach(stream => {
        if (stream instanceof MediaStream) {
          stream.getTracks().forEach(track => {
            track.stop(); // Dừng từng track
            console.log(`Track ${track.kind} của remoteStream đã dừng`);
          });
        }
      });
      setRemoteStreams([]); // Reset remoteStreams state
    }

    // 3. Dừng chia sẻ màn hình (nếu có)
    const screenStream = document.getElementById('sharedScreen')?.srcObject;
    if (screenStream instanceof MediaStream) {
      screenStream.getTracks().forEach(track => {
        track.stop(); // Dừng từng track
        console.log(`Track ${track.kind} của chia sẻ màn hình đã dừng`);
      });
      document.getElementById('sharedScreen').srcObject = null; // Reset srcObject
    }

    // 4. Đóng kết nối WebRTC (PeerConnection)
    if (peerConnection.current) {
      peerConnection.current.ontrack = null;
      peerConnection.current.onicecandidate = null;
      peerConnection.current.close(); // Đóng kết nối
      peerConnection.current = null; // Reset PeerConnection
      console.log("Đã đóng PeerConnection");
    }

    // 5. Giải phóng quyền truy cập camera/mic
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        stream.getTracks().forEach(track => {
          track.stop(); // Dừng tất cả các track đang giữ quyền
        });
        console.log("Đã giải phóng quyền truy cập camera/mic");
      })
      .catch(error => {
        console.warn("Không thể giải phóng quyền truy cập media:", error);
      });

    console.log("Đã dừng toàn bộ luồng media và kết nối");

    navigate('/create-class');
  };

  return (
    <Container>
      <VideoContainer activePanel={activePanel} isScreenSharing={isScreenSharing}>
        <StyledVideo ref={localVideoRef} autoPlay muted playsInline isScreenSharing={isScreenSharing} />
        {/* <StyledVideo ref={remoteVideoRef} autoPlay playsInline style={{ borderRadius: '10px'}}/> */}
        {/* {remoteStreams.length > 0 ? ( */}
        {remoteStreams.map((stream, index) => {
          console.log("Gán stream vào video:", { stream, index });
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
                display: stream ? 'block' : 'block',
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
          <ButtonControlCM onClick={toggleMic} isOn={isMicOn}
            title={allowMic || isOwner ? 'Bật/Tắt Mic' : 'Không được phép'}
            disabled={!allowMic && !isOwner} // Vô hiệu hóa nếu không được phép
          >
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
          {/* Chỉ hiển thị các tính năng này nếu người dùng là chủ phòng */}
          {isOwner && (
            <>
              <ButtonFeature onClick={() => togglePanel('attendance')} title='Điểm danh'>
                <FontAwesomeIcon icon={faClipboardList} />
              </ButtonFeature>
              <ButtonFeature onClick={() => togglePanel('owner')} title='Bộ điều khiển'>
                <FontAwesomeIcon icon={faCrown} />
              </ButtonFeature>
            </>
          )}
        </RightPanel>
      </MainControl>

      {/* Khung người tham gia */}
      {activePanel === 'participants' && (
        <FloatingPanel>
          <HeaderPanel>Danh sách học viên</HeaderPanel>
          <FindContainer>
            <FindInput type="text" placeholder="Tìm kiếm học viên..." value={searchTerm} onChange={handleSearch} />
            <FindButton>
              <FontAwesomeIcon icon={faSearch} />
            </FindButton>

          </FindContainer>

          {/* Hiển thị yêu cầu tham gia nếu có */}
          {isOwner && hasJoinRequests && (
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
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant, index) => (
                <ParticipantItem key={participant.id}>
                  {index === 0 ? (
                    <strong>
                      {participant.fullName} (Chủ phòng)
                    </strong>
                  ) : (
                    <span>{participant.fullName}</span>
                  )}
                </ParticipantItem>
              ))
            ) : (
              <EmptyMessage>Không tìm thấy học viên</EmptyMessage>
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
              placeholder={allowChat || isOwner ? 'Nhập tin nhắn...' : 'Chat đã bị tắt bởi chủ phòng'}
              disabled={!allowChat && !isOwner} // Vô hiệu hóa khi không được phép
            />
            <SendButton onClick={handleSendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </SendButton>
            <FileUploadInput
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={!allowChat && !isOwner} // Vô hiệu hóa khi không được phép
            />
          </ChatInputContainer>
        </FloatingPanel>
      )}

      {/* Khung điểm danh */}
      {activePanel === 'attendance' && (
        <FloatingPanel>
          <HeaderPanel>Điểm danh</HeaderPanel>
          {/* Table */}
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  {attendanceData.length > 0 &&
                    attendanceData[0].map((header, index) => (
                      <TableHeader key={index}>{header}</TableHeader>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {attendanceData.slice(1).filter(row => row.some(cell => cell !== '')).map((row, index) => (
                  <TableRow key={index}>
                    {row.map((cell, cellIndex) => (
                      <TableData key={cellIndex}>{cell}</TableData>
                    ))}
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
          {/* Actions */}
          <Actions>
            {/* File Upload */}
            <FileUploadIcon as="label" title="Tải file">
              <FileUploadInput type="file" accept=".xlsx, .csv" onChange={handleFileUpload1} />
              <FontAwesomeIcon icon={faPaperclip} />
            </FileUploadIcon>

            {/* Attendance Button */}
            <ActionButton onClick={() => handleAttendance(participants)}>Điểm danh</ActionButton>

            {/* Export File */}
            <ActionButton onClick={handleExportFile}>Xuất file</ActionButton>
          </Actions>
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
