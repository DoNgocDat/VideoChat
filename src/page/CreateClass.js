import styled from "styled-components";
import Background from '../images/Background.jpg';
import logoSky from '../images/logo-sky.png';
import Avata from '../images/avata.jpg';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

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
    color: #1c0e72;
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
    color: #1c0e72;
    font-size: 18px;
`;

const TitleCreateClass = styled.p`
    position: relative;
    text-align: center;
    color: #000000;
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
    background-color: #007aff;
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
    color: #007aff;
    border: 2px solid #007aff;
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

// const generateClassCode = () => {
//   return Math.floor(1000000 + Math.random() * 9000000).toString();
// };

function CreateClass() {

  const navigate = useNavigate();
  const [classCode, setClassCode] = useState('');
  const handlePersonalInformationClick = () => {
      navigate('/personal-information');
  };

  const handleJoinClass = () => {
      // Kiểm tra xem mã lớp có phải là chuỗi 7 chữ số
      // if (classCode.length !== 7 || !/^\d{7}$/.test(classCode)) {
      //   setError('Vui lòng nhập mã lớp 7 chữ số');
      //   return;
      // }

      if (classCode !== '1234567') {
        alert('Vui lòng nhập đúng mã lớp 1234567');
        return;
      }
      navigate('/waiting-room');
  };

  const handleCreateClass = () => {
      // const classCode = generateClassCode();
      // navigate(`/classroom/${classCode}`);
      navigate(`/classroom/1234567`);
  };


  return (
    <>
      <RouteLink>
        <HeaderLeft>
          <Logo src={logoSky} alt="Logo Sky" />
          <StyledLink to="/">SKY VIDEO CHAT</StyledLink>
        </HeaderLeft>

        <HeaderRight>
          <ButtonAvata onClick={handlePersonalInformationClick}/>
          <UserNameLink to="/personal-information">Đỗ Ngọc Đạt</UserNameLink>
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
        <TitleCreateClass>
            SKY VIDEO CHAT<br />
            Ứng dụng gọi video trực tuyến hỗ trợ học tập<br />
            Học tập và làm việc online, bắt kịp xu hướng công nghệ
        </TitleCreateClass>

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
      </BackgroundImg>
    </>
  );
}

export default CreateClass;
