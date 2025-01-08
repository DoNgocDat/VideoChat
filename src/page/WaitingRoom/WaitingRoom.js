import styled from "styled-components";
import Background from '../../images/Background.jpg';
import logoSky from '../../images/logo-sky.png';
import Avata from '../../images/avata.jpg';
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons"; // Import các icon cần thiết

import React, { useRef , useEffect} from "react";
// import useWebRTC from '../useWebRTC';
// import socket from "../socket";
// import io from "socket.io-client";
import { useSocketContext } from '../socketContext';


import { getUserInfo, getFullAvatarUrl, requestJoinClass } from './services';


const BackgroundImg = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url(${Background});
    background-position: center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
`;

const BackgroundOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 1;
`;

const RouteLink = styled.nav`
    background-color: #ffffff;
    padding: 10px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    height: 50px;
    box-shadow: 2px 2px 2px #c0deeb;
    display: flex;
    justify-content: space-between; /* Align avatar and logo properly */
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    padding-left: 20px;
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    padding-right: 30px;
`;

const Logo = styled.img`
    position: absolute;
    top: 5px; /* Adjust to position logo on top of text */
    z-index: 3;
    width: 100px; /* Adjust size as needed */
    height: auto;
`;

const StyledLink = styled(Link)`
    color: #0288D1;
    text-decoration: none;
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    margin-top: 45px;
`;

const ButtonAvata = styled.button`
    background-size: cover;
    background-position: center;
    height: 40px;
    width: 40px;
    border-color: cornflowerblue;
    border-radius: 50%;
    margin-bottom: 10px;
    margin-right: 10px;
    padding: 0; /* Đảm bảo không có padding */
    cursor: pointer;
`;

const UserNameLink = styled(Link)`
    text-decoration: none;
    color: #0288D1;
    font-size: 18px;
`;

const StyledBackLink = styled.span`
    position: absolute;
    top: 80px;
    left: 20px;
    color: #222222;
    cursor: pointer;
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
    float: left;
    z-index:10;
`;

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 10; /* Đảm bảo nó nằm phía trên background */
    position: relative;
    margin-top: 130px;
`;

const VideoContainer = styled.div`
    width: 80%;
    height: 350px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 20px; /* Khoảng cách phía dưới video */
`;

const StyledVideo = styled.video`
    width: 55%;  /* Điều chỉnh kích thước video */
    height: 100%;  /* Đảm bảo video chiếm hết chiều cao khung chứa */
    object-fit: cover;  /* Đảm bảo video giữ đúng kích thước và không bị méo */
`;

const ControlButton = styled.button`
    background-color: ${({ isOn }) => (isOn ? "#0288D1" : "#ff4d4f")}; /* Màu xanh khi bật, màu đỏ khi tắt */
    color: #ffffff;
    border: none;
    height: 60px;
    width: 60px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    margin: 10px; /* Khoảng cách giữa các nút */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
`;

const ControlsRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
`;

const ContentRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;  /* Khoảng cách giữa title và button */
`;

const TitleRequestJoin = styled.p`
    z-index: 2;
    text-align: center;
    color: #222222;
    font-size: 22px;
    font-weight: 700;
`;

const ButtonRequestJoin = styled.button`
    background-color: #0288D1;
    color: #ffffff;
    border: none;
    height: 40px;
    width: 190px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 18px;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #09f;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ImgAvata = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: cover;
`;


const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function WaitingRoom() {
    const navigate = useNavigate();
    const { classCode } = useParams(); // Lấy mã lớp từ URL
    const [userId, setUserId] = useState(null);
    const [userInfo, setUserInfo] = useState(null); // Khởi tạo userInfo là null
    // const { localStream } = useWebRTC();
    const [localStream, setLocalStream] = useState(null);
    const localVideoRef = useRef(null);

    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    // const [isApproved, setIsApproved] = useState(false);  // Trạng thái chờ phê duyệt

      // Lấy userId từ localStorage
    useEffect(() => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        console.log('Lấy ID người dùng thành công:', storedUserId); // Thông báo thành công
      } else {
        console.error('Không tìm thấy userId trong localStorage');
        // Có thể điều hướng về trang login nếu không có userId
        navigate('/login');
      }
    }, [navigate]);

  // Lấy thông tin người dùng khi userId thay đổi
  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const data = await getUserInfo(userId);
            console.log("User Data:", data);  // Kiểm tra dữ liệu API trả về

            // Kiểm tra lại và xử lý avatar
            const avatarUrl = data.AnhDaiDien ? getFullAvatarUrl(data.AnhDaiDien) : Avata; // Nếu không có ảnh, dùng ảnh mặc định

            setUserInfo({
                name: data.fullName,
                avatar: avatarUrl,  // Sử dụng URL ảnh đã được tạo
            });
        } catch (error) {
            console.error('Không thể lấy thông tin người dùng:', error);
        }
    };

    if (userId) {
        fetchUserInfo();
    }
}, [userId]);

    const handlePersonalInformationClick = () => {
      navigate('/personal-information');
    };


    // useEffect(() => {
    //   console.log("Local stream:", localStream);
    // }, [localStream]);

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

    // Xử lý localStream
    useEffect(() => {
      const getMediaStream = async () => {
          try {
              const stream = await navigator.mediaDevices.getUserMedia({
                  video: true,
                  audio: true,
              });
              console.log('Truy cập camera/microphone thành công.');
              setLocalStream(stream); // Sử dụng stream thật nếu thành công
              // localVideoRef.current = stream; // Lưu stream vào ref

          } catch (error) {
              console.error('Lỗi khi truy cập camera/microphone:', error);

              // Sử dụng stream giả lập
              const simulatedStream = createSimulatedStream();
              if (simulatedStream) {
                  console.warn('Đang sử dụng stream giả lập.');
                  setLocalStream(simulatedStream); // Sử dụng stream giả lập nếu không thể truy cập thiết bị thật
              } else {
                  console.error('Không thể tạo stream giả lập.');
              }
          }
      };

      getMediaStream();

      return () => {
          if (localStream) {
              localStream.getTracks().forEach((track) => track.stop());
          }
      };
    }, []);

    

    useEffect(() => {
      if (localStream && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.play().catch((err) => {
          console.error("Error playing video:", err);
        });
      }
    }, [localStream]);    

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


    const [isLoading, setIsLoading] = useState(false);
    // const socket = useRef(null); // Sử dụng useRef để quản lý socket
    const { socket, connected, id } = useSocketContext();


    // Gửi yêu cầu tham gia lớp học
    const [isRequestSent, setIsRequestSent] = useState(false);
  
  // Xử lý phản hồi từ server qua socket
  useEffect(() => {
    if (!socket || !connected) {
      console.warn("Socket chưa sẵn sàng, chờ khởi tạo...");
      return;
    }

    socket.on('approval-response', (response) => {
        console.log('Nhận phản hồi phê duyệt:', response);
        if (response.status === 'approved') {
            navigate(`/classroom/${classCode}`);
        } else if (response.status === 'rejected') {
            alert('Yêu cầu của bạn đã bị từ chối.');
            setIsRequestSent(false);
        }
        setIsRequestSent(false); // Cho phép gửi lại yêu cầu
        setIsLoading(false);
    });

    return () => {
        socket.off('approval-response');
    };
  }, [socket, classCode, navigate]);

  // Gửi yêu cầu tham gia lớp học
  const handleRequestJoin = async () => {
      if (!socket || !socket.connected) {
        console.warn("Socket chưa được kết nối. Vui lòng thử lại sau.");
        return;
    }
  
      if (isRequestSent || !socket) return; // Đảm bảo không gửi nhiều lần và socket đã kết nối
      setIsRequestSent(true);

      try {
          const userId = localStorage.getItem('userId');
          const userName = localStorage.getItem('user_name');
          const fullName = localStorage.getItem('full_name');

          if (!userId || !userName || !fullName || !classCode) {
              throw new Error('Thiếu thông tin tham gia lớp học');
          }

          // Gửi yêu cầu tham gia qua socket
          socket.emit('join-request', { userId, userName, fullName, classCode });
          console.log('Yêu cầu tham gia được gửi qua socket:', { userId, userName, fullName, classCode });

          // Gửi yêu cầu qua API (nếu cần thiết)
          const response = await requestJoinClass({ userName, fullName, classCode });
          console.log(response.message);

          setIsLoading(true); // Hiển thị trạng thái chờ
      } catch (error) {
          console.error('Lỗi khi gửi yêu cầu tham gia lớp học:', error);
          alert('Gửi yêu cầu thất bại. Vui lòng thử lại.');
          setIsRequestSent(false); // Cho phép gửi lại
      } finally {
          // Đặt timeout để cho phép gửi lại sau 1 phút
          setTimeout(() => {
              setIsRequestSent(false);
              setIsLoading(false);
          }, 60000); // 1 phút
      }
  };
  
  // Hàm rời khỏi phòng chờ
  const handleLeave = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    navigate('/create-class');
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <>
      <RouteLink>
        <HeaderLeft>
          <Logo src={logoSky} alt="Logo Sky" onClick={handleReturnHome}/>
          <StyledLink to="/">SKY VIDEO CHAT</StyledLink>
        </HeaderLeft>

        <HeaderRight>
          {/* <ButtonAvata onClick={handlePersonalInformationClick} /> */}
          <ButtonAvata onClick={handlePersonalInformationClick}>
            <ImgAvata
              src={userInfo?.avatar || Avata} // Nếu avatar không hợp lệ, hiển thị ảnh mặc định
              alt="User Avatar"
            />
          </ButtonAvata>
        <UserNameLink to="/personal-information">{userInfo ? userInfo.name : 'Loading...'}</UserNameLink>
      </HeaderRight>
      </RouteLink>

      <BackgroundImg>
        <BackgroundOverlay />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={variants}
        >
        </motion.div>
        <StyledBackLink onClick={handleLeave}>
            <FontAwesomeIcon icon={faArrowLeftLong} style={{marginRight: '8px'}} />
            Quay lại
        </StyledBackLink>

        <MainContent>
            <VideoContainer>
              <StyledVideo ref={localVideoRef} autoPlay muted playsInline style={{ borderRadius: '10px'}}/>
            </VideoContainer>

            <ControlsRow>
              <ControlButton onClick={toggleCamera} isOn={isCameraOn}>
                <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} />
              </ControlButton>

              <ControlButton onClick={toggleMic} isOn={isMicOn}>
                <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} />
              </ControlButton>
            </ControlsRow>

            <ContentRow>
              {isLoading ? (
                <SpinnerWrapper>
                  <TitleRequestJoin>Đang chờ phê duyệt...</TitleRequestJoin>
                  <Spinner />
                </SpinnerWrapper>
              ) : (
                <>
                  <TitleRequestJoin>Sẵn sàng tham gia lớp học?</TitleRequestJoin>
                  <ButtonRequestJoin onClick={handleRequestJoin}>Yêu cầu tham gia</ButtonRequestJoin>
                </>
              )}
            </ContentRow>

          </MainContent>
      </BackgroundImg>
    </>
  );
}

export default WaitingRoom;
