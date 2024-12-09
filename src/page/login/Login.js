import React, { useState } from 'react';
import styled from 'styled-components';
import BannerLogin from '../../images/banner-login.jpg';
import LogoSky from '../../images/logo-sky.png';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from './services';

// Các styled components
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

const StyledLink = styled.span`
    color: #007aff;
    cursor: pointer;
    margin-top: 0 auto;
    margin-left: auto;
    margin-right: 30%;
    display: block;
    text-align: right;
`;

const ButtonLogin = styled.button`
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

const ContentBottom = styled.p`
    text-align: center;
    margin-top: 20px;
`;

const ContentBottomLink = styled(Link)`
    text-decoration: none;
    color: #007aff;
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

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false); // State cho modal
    const navigate = useNavigate();

    const handleForgotPasswordClick = () => {
        navigate('/forgot-password');
    };

    const handleReturnHome = () => {
        navigate('/');
    };

    const handleLogin = async () => {
        const loginData = { loginName: username, password };

        try {
            const response = await login(loginData);
            console.log(response);

            if (response && response.access_token) {
                const userId = extractUserIdFromToken(response.access_token); // Gọi hàm để lấy ID

                if (userId) {
                    console.log('Lấy ID người dùng thành công:', userId); // Thông báo thành công
                    localStorage.setItem('userId', userId); // Lưu ID vào localStorage
                    localStorage.setItem('full_name', response.full_name);
                    localStorage.setItem('user_name', response.user_name);
                    localStorage.setItem('access_token', response.access_token); // Lưu token nếu cần
                    navigate('/create-class');
                } else {
                    console.log('Không thể lấy ID từ token'); // Thông báo không thành công
                    setShowModal(true);
                }
            } else {
                setShowModal(true); // Hiển thị modal khi đăng nhập thất bại
            }
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            setShowModal(true); // Hiển thị modal khi có lỗi
        }
    };

    // Hàm để lấy user_id từ token
    const extractUserIdFromToken = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã payload từ token
        return payload.id; // Giả định rằng ID người dùng nằm trong payload
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    const closeModal = () => {
        setShowModal(false); // Đóng modal
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
                <LogoSkyImg src={LogoSky} alt="Logo Sky" onClick={handleReturnHome} />
                <Title>Đăng Nhập</Title>
                <Input
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <StyledLink onClick={handleForgotPasswordClick}>Bạn quên mật khẩu?</StyledLink>
                <ButtonLogin onClick={handleLogin}>Đăng nhập</ButtonLogin>
                <ContentBottom>Bạn chưa có tài khoản?<ContentBottomLink to="/register"> Đăng ký</ContentBottomLink></ContentBottom>
            </ContentRight>

            <AnimatePresence>
                {showModal && (
                    <ModalBackground>
                        <ModalContent
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3>Đăng nhập thất bại</h3>
                            <p>Vui lòng kiểm tra lại tài khoản và mật khẩu của bạn.</p>
                            <ModalButton onClick={closeModal}>Đóng</ModalButton>
                        </ModalContent>
                    </ModalBackground>
                )}
            </AnimatePresence>
        </>
    );
}

export default Login;
