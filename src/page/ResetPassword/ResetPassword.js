import styled from "styled-components";
import BannerLogin from '../../images/banner-login.jpg';
import LogoSky from '../../images/logo-sky.png';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { PostRePass} from './services';
import { useState } from 'react';

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

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate('/');
    };

    const handlePasswordChange = async () => {
        const email = localStorage.getItem('email'); // Lấy email từ localStorage
    
        if (!email) {
            setMessage("Không tìm thấy email, vui lòng thử lại.");
            return;
        }
    
        if (newPassword !== rePassword) {
            setMessage("Mật khẩu và mật khẩu xác nhận không khớp.");
            return;
        }
    
        try {
            const response = await PostRePass(email, { newPassword, rePassword });
            console.log(response); // Xem chi tiết phản hồi từ API
            if (response && response.message) {
                setMessage(response.message);
                navigate('/login');  // Chuyển hướng về trang đăng nhập sau khi đặt lại mật khẩu thành công
            }
        } catch (error) {
            setMessage("Đã xảy ra lỗi trong quá trình đặt lại mật khẩu.");
            console.error("Error resetting password:", error);
        }
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
                    <TitleLogin>Chính xác là bạn rồi, hãy cho<br /> SKY VIDEO CHAT <br />biết mật khẩu mới của bạn nhé</TitleLogin>
                </motion.div>
            </ContentLeft>
            <ContentRight>
                <LogoSkyImg src={LogoSky} alt="Logo Sky" onClick={handleReturnHome} />
                <Title>Đặt lại mật khẩu</Title>
                <Input 
                    type="password" 
                    placeholder="Mật khẩu mới" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input 
                    type="password" 
                    placeholder="Nhập lại mật khẩu mới" 
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                />
                <ButtonAuthen onClick={handlePasswordChange}>Hoàn tất</ButtonAuthen>
            </ContentRight>
        </>

    );
}

export default ResetPassword;