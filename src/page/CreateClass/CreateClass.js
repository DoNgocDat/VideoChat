import styled from "styled-components";
import Background from '../../images/Background.jpg';
import logoSky from '../../images/logo-sky.png';
import Avata from '../../images/avata.jpg';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { getUserInfo, createLopHoc, checkClass } from './services';

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
    color: #0288D1;;
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
    color: #0288D1;;
    font-size: 18px;
`;

const TitleCreateClass = styled.p`
    position: relative;
    text-align: center;
    color: #0288D1;;
    font-size: 35px;
    font-weight: 700;
    z-index:100;
`;

const ActionContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    width: 50%;
    z-index: 10;
`;

const ButtonCreateClass = styled.button`
    background-color: #0288D1;;
    color: #ffffff;
    border: none;
    height: 40px;
    width: 180px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 20px;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const InputClassCode = styled.input`
    height: 40px;
    width: 200px;
    background-color: #eceaea;
    color: #3c3c43;
    border-radius: 15px;
    border: none;
    padding-left: 15px;
    margin-right: 20px;
`;

const ButtonJoin = styled.button`
    background-color: #ffffff;
    color: #0288D1;;
    border: 2px solid #0288D1;;
    height: 40px;
    width: 180px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Styled component cho nền của modal
const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled(motion.div)` // Thêm motion.div để có hiệu ứng
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
`;

const ModalButton = styled.button`
    background-color: #0288D1;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
`;

function CreateClass() {
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // Khởi tạo userInfo là null
  const navigate = useNavigate();
  const [classCode, setClassCode] = useState('');
  const [showModal, setShowModal] = useState(false); // State cho modal

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

  const handleJoinClass = async () => {
    try {
      // Kiểm tra mã lớp qua API
      const classExists = await checkClass(classCode); // Gọi API kiểm tra mã lớp
  
      if (classExists) {
        // Nếu tồn tại, điều hướng đến phòng chờ
        navigate(`/waiting-room/${classCode}`);
      } else {
        // Nếu không tồn tại, hiển thị thông báo lỗi
        setShowModal(true); // Hiển thị modal thông báo
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra mã lớp:', error);
      alert('Đã xảy ra lỗi khi kiểm tra mã lớp. Vui lòng thử lại.');
    }
  };

    const closeModal = () => {
      setShowModal(false); // Đóng modal
  };


  const handleCreateClass = async () => {
    if (!userId) {
      console.error('Không tìm thấy user id');
      return;
    }

    try {
        // Gửi yêu cầu tạo lớp học với userId
        const createdClass = await createLopHoc(userId);
        
        console.log('Lớp học được tạo thành công:', createdClass);

        navigate(`/classroom/${createdClass.MaLop}`);
    } catch (error) {
        console.error('Lỗi khi tạo lớp học:', error);
        alert('Không thể tạo lớp học. Vui lòng thử lại.');
    }
  };


  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <>
      <RouteLink>
        <HeaderLeft>
          <Logo src={logoSky} alt="Logo Sky" onClick={handleReturnHome} />
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
          style={{ zIndex: 2 }}
        >
          <TitleCreateClass>
            SKY VIDEO CHAT<br />
            Ứng dụng gọi video trực tuyến hỗ trợ học tập<br />
            Học tập và làm việc online, bắt kịp xu hướng công nghệ
          </TitleCreateClass>
        </motion.div>

        <ActionContainer>
          <ButtonCreateClass onClick={handleCreateClass}>
            <FontAwesomeIcon icon={faVideo} style={{ marginRight: '8px' }} />
            Tạo lớp
          </ButtonCreateClass>

          <InputClassCode
            placeholder="Nhập mã lớp"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
          />

          <ButtonJoin onClick={handleJoinClass}>
            <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '8px' }} />
            Tham gia
          </ButtonJoin>
        </ActionContainer>

        <AnimatePresence>
          {showModal && (
            <ModalBackground>
              <ModalContent
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <h3>Tham gia thất bại</h3>
                <p>Vui lòng nhập đúng mã lớp.</p>
                <ModalButton onClick={closeModal}>Đóng</ModalButton>
              </ModalContent>
            </ModalBackground>
          )}
        </AnimatePresence>

      </BackgroundImg>
    </>
  );
}

export default CreateClass;
