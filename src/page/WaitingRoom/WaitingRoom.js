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
import useWebRTC from '../useWebRTC';
// import { Socket } from "socket.io-client";

import { getUserInfo, requestJoinClass } from './services';


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
    background-image: url(${Avata});
    background-size: cover;
    background-position: center;
    height: 40px;
    width: 40px;
    border: none;
    border-radius: 50%;
    margin-right: 10px; /* Space between avatar and name */
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

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function WaitingRoom() {
    const navigate = useNavigate();
    const { classCode } = useParams(); // Lấy mã lớp từ URL
    const [userId, setUserId] = useState(null);
    const [userInfo, setUserInfo] = useState(null); // Khởi tạo userInfo là null
    const { localStream } = useWebRTC();
    const localVideoRef = useRef(null);
    // const [classCode, setClassCode] = useState('');
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isApproved, setIsApproved] = useState(false);  // Trạng thái chờ phê duyệt

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
          setUserInfo({
            name: data.fullName,
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

    useEffect(() => {
      if (localStream) {
        localVideoRef.current.srcObject = localStream;
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


  // Gửi yêu cầu tham gia lớp học
  const handleRequestJoin = async () => {
    try {
      const userId = parseInt(localStorage.getItem('userId'), 10);
      const fullName = localStorage.getItem('full_name');

      // console.log({userId, fullName, classCode});
  
      if (!userId || isNaN(userId)) {
        throw new Error('userId không hợp lệ');
      }
      if (!fullName || !classCode) {
        throw new Error('Thiếu thông tin tham gia lớp học');
      }

      const data = {
        userId: userId,
        fullName: fullName,
        classCode: classCode,
      }

      console.log(data);
  
      const response = await requestJoinClass(data);
      console.log(response.message);
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu tham gia lớp học:', error);
    }
  };
  
    

    // Điều kiện điều hướng vào phòng học chỉ khi yêu cầu được phê duyệt
    useEffect(() => {
      if (isApproved) {
        navigate(`/classroom/1234567`);
      }
    }, [isApproved, navigate]);

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
          <ButtonAvata onClick={handlePersonalInformationClick} />
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
              <TitleRequestJoin>Sẵn sàng tham gia lớp học?</TitleRequestJoin>
              <ButtonRequestJoin onClick={handleRequestJoin}>Yêu cầu tham gia</ButtonRequestJoin>
            </ContentRow>
          </MainContent>
      </BackgroundImg>
    </>
  );
}

export default WaitingRoom;
