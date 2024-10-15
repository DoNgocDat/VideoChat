import styled from "styled-components";
import BannerLogin from '../images/banner-login.jpg';
import LogoSky from '../images/logo-sky.png';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const ContentLeft = styled.div`
  width: 45%;
  float: left;
  background-image: url(${BannerLogin});
  background-position: center;
  background-size: cover;
  height: 100vh;
`;

const TitleLogin = styled.h2`
    color: #ffffff;
    font-size: 40px;
    text-align: center;
    margin-top: 35%;
`;

const ContentRight = styled.div`
    width: 55%;
    float: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const LogoSkyImg = styled.img`
    width: 150px;
    height: 70px;
    margin: 0 auto;
    display: block;
`;

const Title = styled.h3`
    text-align: center;
    color: #007aff;
    font-size: 35px;
    font-weight: 620;
`;

const Input = styled.input`
    background-color: #b3b3b366;
    height: 30px;
    width: 40%;
    margin: 10px auto;
    display: block;
    border: none;
    border-radius: 10px;
    padding: 5px;
`;

const ButtonAuthen = styled.button`
    background-color: #007aff;
    color: #ffffff;
    font-size: 15px;
    margin: 20px auto;
    display: block;
    border: none;
    height: 30px;
    width: 20%;
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
                <LogoSkyImg src={LogoSky} alt="Logo Sky" onClick={handleReturnHome} />
                <Title>Xác thực tài khoản</Title>
                <Input placeholder="Nhập mã xác thực"></Input>
                <ButtonAuthen onClick={handleResetPassword}>Xác nhận</ButtonAuthen>
            </ContentRight>
        </>

    );
}

export default AuthenAccount;