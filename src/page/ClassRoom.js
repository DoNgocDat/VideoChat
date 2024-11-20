import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash, faChalkboard, faHandPaper, faSignOutAlt, 
         faUsers, faComments, faClipboardList, faCrown, faSearch, faStop, faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import useWebRTC from '../page/useWebRTC';
import socket from 'socket.io-client'

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
  background-color: #f0f0f0;
  border-radius: 5px;
`;

const Message = styled.div`
  margin-bottom: 5px;
  padding: 5px;
  background-color: #edf2f4;
  border-radius: 5px;
  color: #2b2d42;
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



function ClassRoom() {
  const { classCode } = useParams(); // Lấy mã lớp từ URL
  const navigate = useNavigate();
  const { localStream, remoteStreams, startCall, getPeerConnection, isConnected, connectedSocketIds } = useWebRTC(classCode);
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef([]);
  
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [activePanel, setActivePanel] = useState(null);   // Trạng thái duy nhất để lưu panel đang mở
    
  // Trạng thái để theo dõi khi người dùng đang chia sẻ màn hình
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);

  const [allowMic, setAllowMic] = useState(false);
  const [allowChat, setAllowChat] = useState(false);


  // Khi luồng local hoặc remote thay đổi, gán nó vào phần tử video
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }

    if (remoteStreams.length > 0) {
      remoteStreams.forEach((stream, index) => {
        if (remoteVideoRefs.current[index] && stream) {
          remoteVideoRefs.current[index].srcObject = stream;
        }
      });
    }
  }, [localStream, remoteStreams]);

  // // Bắt đầu cuộc gọi khi người dùng vào phòng học
  useEffect(() => {
    startCall();
  }, [startCall]);

  useEffect(() => {
    console.log("Mã lớp:", classCode);
    console.log("Socket ID đã kết nối:", connectedSocketIds);
  }, [classCode, connectedSocketIds]);

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

  useEffect(() => {
    if (socket.current) { // Kiểm tra nếu socket.current đã tồn tại
      socket.current.on('request-join', ({ roomId, userId }) => {
        console.log(`Người dùng ${userId} yêu cầu tham gia phòng ${roomId}`);
        setJoinRequests(prevRequests => [...prevRequests, { roomId, userId }]);
      });
    } else {
      console.error("Socket chưa được khởi tạo.");
    }
  }, []);  

  const handleApproveRequest = (userId) => {
    // Gửi sự kiện 'approve-join' qua socket.io
    socket.current.emit('approve-join', { userId });
    // Xóa yêu cầu đã phê duyệt khỏi danh sách
    setJoinRequests(prevRequests => prevRequests.filter(request => request.userId !== userId));
  };
  
  const handleRejectRequest = (userId) => {
    // Từ chối yêu cầu tham gia (ở đây chỉ cần xóa yêu cầu khỏi danh sách)
    setJoinRequests(prevRequests => prevRequests.filter(request => request.userId !== userId));
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
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

    // Nếu không có peerConnection, chỉ hiển thị màn hình cục bộ
    if (!isConnected) {
      handleScreenShare(screenStream); // Gán vào element cục bộ
      return;
    }

    // Lấy đối tượng peerConnection với socketId (bạn cần xác định socketId)
    const socketId = connectedSocketIds[0];  // Thay bằng giá trị socketId đúng
    const peerConnection = getPeerConnection(socketId);

    // Kiểm tra kết nối WebRTC
    if (!peerConnection || !isConnected) {
      console.error("Kết nối WebRTC chưa sẵn sàng.");
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

      // Gửi track màn hình tới peer (không thay thế video camera)
      const videoTrack = screenStream.getVideoTracks()[0];
      peerConnection.addTrack(videoTrack, screenStream);

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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMessages([...messages, { sender: "You", text: `Đã gửi file: ${file.name}` }]);
    }
  };



  const toggleAllowMic = () => setAllowMic(!allowMic);
  const toggleAllowChat = () => setAllowChat(!allowChat);

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
        {remoteStreams.length > 0 ? (
          remoteStreams.map((stream, index) => (
            <StyledVideo key={index} ref={el => {
                if (el) {
                  remoteVideoRefs.current[index] = el;
                  el.srcObject = stream; // Gán trực tiếp stream vào từng video
                }
              }} 
              autoPlay 
              playsInline 
              style={{ borderRadius: '10px', display: stream ? 'block' : 'none' }}
              isScreenSharing={isScreenSharing}
            />
          ))
        ) : null}

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
          <ButtonControl title='Giơ tay'>
            <FontAwesomeIcon icon={faHandPaper} />
          </ButtonControl>
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
                {joinRequests.slice(0, 3).map(request => (
                  <RequestItem key={request.userId}>
                    Người dùng {request.userId}
                    <Button onClick={() => handleApproveRequest(request.userId)}>Phê duyệt</Button>
                    <Button onClick={() => handleRejectRequest(request.userId)}>Từ chối</Button>
                  </RequestItem>
                ))}
              </RequestList>
            </JoinRequestsContainer>
          )}
        </FloatingPanel>
      )}

      {/* Khung chat */}
      {activePanel === 'chat' && (
        <FloatingPanel>
          <HeaderPanel>Chat</HeaderPanel>
          
          {/* Khu vực hiển thị tin nhắn */}
          <ChatDisplay>
            {/* Render các tin nhắn tại đây */}
            {messages.map((msg, index) => (
              <Message key={index}>
                <strong>{msg.sender}: </strong>{msg.text}
              </Message>
            ))}
          </ChatDisplay>

          {/* Ô nhập tin nhắn và chức năng gửi tin nhắn */}
          <ChatInputContainer>
            <FileUploadIcon onClick={() => fileInputRef.current.click()}>
              <FontAwesomeIcon icon={faPaperclip} />
            </FileUploadIcon>
            <ChatInput
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
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
