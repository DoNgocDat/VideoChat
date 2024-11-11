import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash, 
         faChalkboard, faHandPaper, faSignOutAlt, 
         faUsers, faComments, faClipboardList, faCrown, 
         faSearch, faStop } from '@fortawesome/free-solid-svg-icons';

import useWebRTC from '../page/useWebRTC';
import socket from 'socket.io-client'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #37474F; /* Background tối */
  color: #edf2f4; /* Màu chữ dễ nhìn */
`;

const VideoContainer = styled.div`
    width: 75%;
    height: 350px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 20px; /* Khoảng cách phía dưới video */
    margin-top: 150px; 
`;

const StyledVideo = styled.video`
    width: 55%;  /* Điều chỉnh kích thước video */
    height: 100%;  /* Đảm bảo video chiếm hết chiều cao khung chứa */
    object-fit: cover;  /* Đảm bảo video giữ đúng kích thước và không bị méo */
`;

const MainControl = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  padding: 30px;
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
  top: 20px;
  right: 20px;
  width: 22%;
  height: 80%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  z-index: 1000;
`;

const HeaderPanel = styled.span`
  font-size: 27px;
  margin-right: 10px;
  font-weight: 700;
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

  // Hàm thoát phòng học
  const handleLeaveClass = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    navigate('/create-class');
  };

  return (
    <Container>
      <VideoContainer>
        <StyledVideo ref={localVideoRef} autoPlay muted playsInline style={{ borderRadius: '10px'}}/>
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
            />
          ))
        ) : null}

        {/* Video để xem màn hình được chia sẻ */}
        <StyledVideo id="sharedScreen" autoPlay playsInline style={{ borderRadius: '10px', display: 'none' }} />
      </VideoContainer>
      
      <MainControl>
        {/* Left: Class Code */}
        <LeftPanel>
          {classCode}
        </LeftPanel>

        {/* Center: Control Buttons */}
        <CenterPanel>
          <ButtonControlCM onClick={toggleCamera} isOn={isCameraOn}>
            <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} />
          </ButtonControlCM>
          <ButtonControlCM onClick={toggleMic} isOn={isMicOn}>
            <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} />
          </ButtonControlCM>
          <ButtonControl onClick={toggleScreenShare}>
            <FontAwesomeIcon icon={isScreenSharing ? faStop : faChalkboard} />
          </ButtonControl>
          <ButtonControl>
            <FontAwesomeIcon icon={faHandPaper} />
          </ButtonControl>
          <ButtonControl onClick={handleLeaveClass}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </ButtonControl>
        </CenterPanel>

        {/* Right: Additional Features */}
        <RightPanel>
        <ButtonFeature onClick={() => togglePanel('participants')}>
          <FontAwesomeIcon icon={faUsers} />
        </ButtonFeature>
        <ButtonFeature onClick={() => togglePanel('chat')}>
          <FontAwesomeIcon icon={faComments} />
        </ButtonFeature>
        <ButtonFeature onClick={() => togglePanel('attendance')}>
          <FontAwesomeIcon icon={faClipboardList} />
        </ButtonFeature>
        <ButtonFeature onClick={() => togglePanel('owner')}>
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
          
        </FloatingPanel>
      )}
    </Container>
  );
};

export default ClassRoom;
