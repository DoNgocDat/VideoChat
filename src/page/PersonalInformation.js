import styled from "styled-components";
import logoSky from '../images/logo-sky.png';
import Avata from '../images/avata.jpg';
import { Link } from "react-router-dom";
import { useState } from "react";
import DrawerPersonalInformation from './DrawerPersonalInformation';
import DrawerChangePassword from './DrawerChangePassword';

// Header (phần điều hướng trên cùng)
const RouteLink = styled.nav`
    background-color: #ffffff;
    padding: 10px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    height: 60px;
    box-shadow: 2px 2px 2px #c0deeb;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const HeaderLeft = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 20px;
`;

const Logo = styled.img`
    width: 100px;
    height: auto;
`;

const StyledLink = styled(Link)`
    color: #1c0e72;
    text-decoration: none;
    font-size: 15px;
    font-weight: bold;
    margin-top: 5px;
`;

// Phần nội dung chính
const ContentWrapper = styled.div`
    margin-top: 80px;
    padding: 20px;
    transition: opacity 0.3s ease;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000; 
    opacity: ${(props) => (props.isEditing ? 1 : 0)};
    pointer-events: ${(props) => (props.isEditing ? 'auto' : 'none')};
    transition: opacity 0.3s ease;
`;

const ButtonAvata = styled.button`
    background-image: url(${Avata});
    background-size: cover;
    background-position: center;
    height: 70px;
    width: 70px;
    border: none;
    border-radius: 50%;
    margin-bottom: 10px;
`;

const UserNameLink = styled(Link)`
    text-decoration: none;
    color: #1c0e72;
    font-size: 20px;
    font-weight: bold;
`;

const AvatarWrapper = styled.div`
    text-align: center; 
    margin-bottom: 20px;
`;

const InfoWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto; 
    margin-top: 20px;
`;

const InfoCard = styled.div`
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 10px;
    width: 45%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: left; 
`;

const InfoTitle = styled.h3`
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
`;

const InfoText = styled.p`
    font-size: 16px;
    color: #555;
    line-height: 1.5;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
`;

const StyledButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 10px 10px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

// Main component
function PersonalInformation() {
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordChanging, setIsPasswordChanging] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const toggleEditing = () => {
        if (isEditing) {
            setIsExiting(true);
            setTimeout(() => {
                setIsEditing(false);
                setIsExiting(false);
            }, 300);
        } else {
            setIsEditing(true);
            setIsExiting(false);
        }
    };

    const togglePasswordChange = () => {
        if (isPasswordChanging) {
            setIsExiting(true);
            setTimeout(() => {
                setIsPasswordChanging(false);
                setIsExiting(false);
            }, 300);
        } else {
            setIsPasswordChanging(true);
            setIsExiting(false);
        }
    };

    return (
        <>
            <RouteLink>
                <HeaderLeft>
                    <Logo src={logoSky} alt="Logo Sky" />
                    <StyledLink to="/">SKY VIDEO CHAT</StyledLink>
                </HeaderLeft>
            </RouteLink>

            <Overlay isEditing={isEditing || isPasswordChanging} onClick={() => {
                if (isEditing) toggleEditing();
                if (isPasswordChanging) togglePasswordChange(); // Đóng drawer đổi mật khẩu khi bấm vào overlay
            }} />
            <ContentWrapper style={{ opacity: isEditing || isPasswordChanging ? 0.5 : 1 }}>
                <AvatarWrapper>
                    <ButtonAvata src={Avata} alt="Avata" /> <br />
                    <UserNameLink>Đỗ Ngọc Đạt</UserNameLink>
                </AvatarWrapper>

                <InfoWrapper>
                    <InfoCard>
                        <InfoTitle>Thông tin cá nhân</InfoTitle>
                        <InfoText>Họ và tên: Đỗ Ngọc Đạt</InfoText>
                        <InfoText>Ngày sinh: 28/04/2003</InfoText>
                        <InfoText>Giới tính: Nam</InfoText>
                        <InfoText>Địa chỉ: Tỉnh Phú Yên</InfoText>
                        <InfoText>Số điện thoại: 0335057747</InfoText>
                        <InfoText>Email: dongocdat28042003@gmail.com</InfoText>
                    </InfoCard>
                    <InfoCard>
                        <InfoTitle>Thông tin tài khoản</InfoTitle>
                        <InfoText>Tên đăng nhập: dongocdat</InfoText>
                        <InfoText>Mật khẩu: ********</InfoText>
                    </InfoCard>
                </InfoWrapper>

                <ButtonWrapper>
                    <StyledButton onClick={toggleEditing}>Chỉnh sửa</StyledButton>
                    <StyledButton onClick={togglePasswordChange}>Đổi mật khẩu</StyledButton>
                </ButtonWrapper>
            </ContentWrapper>

            {isEditing && <DrawerPersonalInformation onClose={toggleEditing} isExiting={isExiting} />}
            {isPasswordChanging && <DrawerChangePassword onClose={togglePasswordChange} isExiting={isExiting} />}
        </>
    );
}

export default PersonalInformation;