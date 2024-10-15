import styled from "styled-components";
import Background from '../images/Background.jpg';
import logoSky from '../images/logo-sky.png';
import Avata from '../images/avata.jpg';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BackgroundImg = styled.div`
  position: relative; /* Để lớp phủ và nội dung có thể nằm bên trong */
  width: 100%;
  float: left;
  background-image: url(${Background});
  background-position: center;
  background-size: cover;
  height: 100vh;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7); /* Màu phủ trắng với độ mờ 70% */
  z-index: 1; /* Đảm bảo nó nằm dưới phần nội dung */
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
`;

const HeaderLeft = styled.div`
  width: 50%;
  float: left;
`;

const HeaderRight = styled.div`
  width: 40%;
  float: left;
  margin: 7px;
  text-align: right;
`;

const Logo = styled.img`
  width: 120px;
  height: 30px;
  padding-left: 17px;
`;

const StyledLink = styled(Link)`
  color: #1c0e72;
  text-decoration: none;
  margin: 0 10px;
`;

const ButtonAvata = styled.button`
    background-image: url(${Avata});
    background-size: cover;
    background-position: center;
    height: 40px;
    width: 40px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
`;

const UserNameLink = styled(Link)`
    text-decoration: none;
    color: #1c0e72;
    margin-left: 16px;
    font-size: 20px;
`;

const TitleCreateClass = styled.h2`
  position: relative; /* Để nội dung nằm trên lớp phủ */
  z-index: 2; /* Đảm bảo nội dung nằm trên lớp phủ */
  text-align: center;
  color: #000000;
  margin-top: 200px;
`;

const ButtonCreateClass = styled.button`
    background-color: #007aff;
    color: #ffffff;
    border: none;
    height: 30px;
    width: 150px;
    border-radius: 30px;
    position: relative; /* Để nội dung nằm trên lớp phủ */
    z-index: 2;
    margin-left: 370px;
`;

const InputClassCode = styled.input`
    height: 25px;
    width: 150px;
    background-color: #eceaea;
    color: #3c3c43;
    border-radius: 15px;
    margin-left: 20px;
    margin-right: 20px;
    position: relative; /* Để nội dung nằm trên lớp phủ */
    z-index: 2;
`;

const ButtonJoin = styled.button`
    background-color: #ffffff;
    color: #007aff;
    border-color: #007aff;
    height: 30px;
    width: 150px;
    border-radius: 30px;
    position: relative; /* Để nội dung nằm trên lớp phủ */
    z-index: 2;
`;

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function CreateClass() {
  return (
    <>
      <RouteLink>
        <HeaderLeft>
          <Logo src={logoSky} alt="Logo Sky" /> <br />
          <StyledLink to="/">SKY VIDEO CHAT</StyledLink>
        </HeaderLeft>

        <HeaderRight>
          <ButtonAvata></ButtonAvata>
          <UserNameLink>Đỗ Ngọc Đạt</UserNameLink>
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
          style={{ position: 'relative', zIndex: 2 }}
        >
          <TitleCreateClass>
            SKY VIDEO CHAT<br />
            Ứng dụng gọi video trực tuyến hỗ trợ học tập<br />
            Học tập và làm việc online, bắt kịp xu hướng công nghệ
          </TitleCreateClass> <br />
        </motion.div>
        <ButtonCreateClass>Tạo lớp học</ButtonCreateClass>
        <InputClassCode placeholder="Nhập mã lớp"></InputClassCode>
        <ButtonJoin>Tham gia</ButtonJoin>
      </BackgroundImg>
    </>
  );
}

export default CreateClass;
