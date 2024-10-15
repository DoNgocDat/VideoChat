import styled from "styled-components";
import BannerLogin from '../images/banner-login.jpg';
import LogoSky from '../images/logo-sky.png';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const ContentLeft = styled.div`
  width: 50%;
  float: left;
  background-image: url(${BannerLogin});
  background-position: center;
  background-size: cover;
  height: 100vh;
`;

const TitleLogin = styled.h2`
    color: #ffffff;
    text-align: center;
    margin-top: 250px;
`;

const ContentRight = styled.div`
  width: 50%;
  float: left;
`;

const LogoSkyImg = styled.img`
    width: 120px;
    height: 70px;
    margin-left: 40%;
    margin-top: 10%;
`;

const Title = styled.h3`
    text-align: center;
    color: #4981d6;
`;

const Input = styled.input`
    margin-left: 30%;
    background-color: #c9c8c8;
    height: 30px;
    width: 245px;
    margin-bottom: 20px;
    border: none;
    border-radius: 10px;
`;

const ButtonLogin = styled.button`
    background-color: #007aff;
    color: #ffffff;
    margin-left: 40%;
    border: none;
    height: 35px;
    width: 130px;
    border-radius: 30px;
    cursor: pointer;
`;

const ContentBottom = styled.p`
    text-align: center;
`;

const ContentBottomLink = styled(Link)`
    text-decoration: none;
    color: #007aff;
`;

const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function Register() {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate('/');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <>
            <ContentLeft>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    variants={variants}
                >
                    <TitleLogin>Chào mừng bạn đến với <br /> SKY VIDEO CHAT</TitleLogin>
                </motion.div>
            </ContentLeft>
            <ContentRight>
                <LogoSkyImg src={LogoSky} alt="Logo Sky" onClick={handleReturnHome} /> <br />
                <Title>Đăng ký</Title>
                <Input placeholder="Tên đăng nhập"></Input>
                <Input placeholder="Mật khẩu"></Input> <br />
                <Input placeholder="Nhập lại mật khẩu"></Input> <br />
                <Input placeholder="Email"></Input> <br />
                <ButtonLogin onClick={handleLogin}>Đăng ký</ButtonLogin>
                <ContentBottom>Bạn đã có tài khoản?<ContentBottomLink to="/login"> Đăng nhập</ContentBottomLink></ContentBottom>
            </ContentRight>
        </>
    );
}

export default Register;
