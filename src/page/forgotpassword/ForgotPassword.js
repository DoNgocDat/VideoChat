import styled from "styled-components";
import BannerLogin from '../../images/banner-login.jpg';
import LogoSky from '../../images/logo-sky.png';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useState } from 'react';
import { forgotPassword } from './services';

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

const Title = styled.p`
    text-align: center;
    color: #0288D1;
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

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #007aff;
    margin-top: 0 auto;
    display: block;
    margin-left: auto;
    margin-right: 30%;
    text-align: right;
`;

const ButtonAuthen = styled.button`
    background-color: #0288D1;
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

function PorgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // forgotpassword.js
    const handleAuthenAccountClick = async () => {
        try {
            const data = { email };  // Gửi email vào API
            const response = await forgotPassword(data);
            console.log(response);  // Kiểm tra phản hồi từ API chi tiết

            if (response && response.message === "Mã OTP đã được gửi đến email của bạn") {
                if (response.otp) {
                    localStorage.setItem('otp', response.otp);  // Lưu OTP vào localStorage
                    localStorage.setItem('email', email);  // Lưu email vào localStorage
                    setMessage(response.message);  // Hiển thị thông báo thành công
                    navigate('/authen-account');  // Chuyển hướng người dùng đến trang nhập OTP
                } else {
                    setMessage("Không nhận được mã OTP từ máy chủ.");
                }
            } else {
                setMessage(response.message || "Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error in handleAuthenAccountClick:", error);
            setMessage("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    const handleReturnHome = () => {
        navigate('/');
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
                <Title>Quên Mật Khẩu</Title>
                <Input
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <StyledLink to="/login">Quay lại</StyledLink>
                <ButtonAuthen onClick={handleAuthenAccountClick}>Xác nhận</ButtonAuthen>
                {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}
            </ContentRight>
        </>
    );
}

export default PorgotPassword;