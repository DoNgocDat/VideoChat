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
    margin-top: 220px;
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

const ButtonAuthen = styled.button`
    background-color: #007aff;
    color: #ffffff;
    margin-left: 40%;
    border: none;
    height: 35px;
    width: 130px;
    border-radius: 30px;
    cursor: pointer;
`;

const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function AuthenAccount() {

    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate('/');
    };

    const handleResetPassword = () => {
        navigate('/reset-password');
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
                    <TitleLogin>Bạn đừng quá lo lắng <br /> SKY VIDEO CHAT <br /> sẽ giúp bạn lấy lại mật khẩu</TitleLogin>
                </motion.div>
            </ContentLeft>
            <ContentRight>
                <LogoSkyImg src={LogoSky} alt="Logo Sky" onClick={handleReturnHome} /> <br />
                <Title>Xác thực tài khoản</Title>
                <Input placeholder="Nhập mã xát thực"></Input> <br />
                <ButtonAuthen onClick={handleResetPassword}>Xát nhận</ButtonAuthen>
            </ContentRight>
        </>

    );
}

export default AuthenAccount;