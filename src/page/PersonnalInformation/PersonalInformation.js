import styled from "styled-components";
import logoSky from '../../images/logo-sky.png';
import Avata from '../../images/avata.jpg';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import DrawerPersonalInformation from '../DrawerPersonalInformation/DrawerPersonalInformation';
import DrawerChangePassword from '../DrawerChangePassword/DrawerChangePassword';
import { getUserInfo } from './services';
import { uploadAvatar } from './services'
import dayjs from 'dayjs';
import { FaBars, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';
import { getFullAvatarUrl } from './services';

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
    color: #0288D1;
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
    background-size: cover;
    background-position: center;
    height: 70px;
    width: 70px;
    border-color: cornflowerblue;
    border-radius: 50%;
    margin-bottom: 10px;
    padding: 0; /* Đảm bảo không có padding */
`;

const ImgAvata = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: cover;
`

const UserNameLink = styled(Link)`
    text-decoration: none;
    color: #0288D1;
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
    color: #0288D1;
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
    background-color: #0288D1;
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

const MenuWrapper = styled.div`
    position: absolute;
    top: 60px;
    right: 10px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: ${(props) => (props.isOpen ? 'block' : 'none')};
    z-index: 1001;
`;

const MenuItem = styled.div`
    padding: 10px 20px;
    font-size: 16px;
    color: #0288D1;
    cursor: pointer;
    &:hover {
        background-color: #f1f1f1;
    }
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 20px;
`;

const MenuIcon = styled.button`
    background: none;
    border: none;
    font-size: 30px;
    color: #0288D1;
    cursor: pointer;
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 60px;
    right: 30px; /* Add 30px space from the right edge */
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 200px;
    display: ${(props) => (props.isOpen ? "block" : "none")};
`;

// Main component
function PersonalInformation() {
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordChanging, setIsPasswordChanging] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userInfo, setUserInfo] = useState(null); // Khởi tạo userInfo là null
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token');
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Track selected avatar
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [isUploading, setIsUploading] = useState(null)
    const fileInputRef = useRef(null);

    const handleReturnHome = () => {
        navigate('/');
    };


    const handleButtonAvataClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Simulate click on input
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && userInfo?.loginName) {
            setIsUploading(true);
            console.log('Login name:', userInfo?.loginName);
            try {
                await uploadAvatar(userInfo.loginName, file); // Gửi tệp lên server
                console.log('Upload successful');
                // Tải lại trang sau khi cập nhật ảnh đại diện thành công
                window.location.reload();
            } catch (error) {
                console.error('Upload failed:', error);
            } finally {
                setIsUploading(false);
            }
        } else {
            console.error('No file selected or loginName is missing.');
        }
    };
    
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

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();

                setUserInfo({
                    loginName: data.loginName,
                    name: data.fullName,
                    birthDate: data.NgaySinh ? dayjs(data.NgaySinh).format("DD/MM/YYYY") : "N/A",
                    gender: data.GioiTinh || "N/A",
                    address: data.DiaChi || "N/A",
                    phone: data.SoDienThoai || "N/A",
                    email: data.email,
                    avatar: getFullAvatarUrl(data.AnhDaiDien), // Sử dụng hàm getFullAvatarUrl để tạo URL đầy đủ
                });
            } catch (error) {
                console.error('Could not fetch user information:', error);
                navigate('/login'); // Optional: Redirect to login if token is invalid or missing
            }
        };

        fetchUserInfo();
    }, [navigate]);

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

    const handleUpdateInfo = (updatedInfo) => {
        setUserInfo(updatedInfo);
        setIsEditing(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const handleAttendance = () => {
        navigate('/attendance'); // Assuming there's a page for attendance
    };

    const avatarUrl = getFullAvatarUrl(userInfo?.AnhDaiDien);

    return (
        <>
            <RouteLink>
                <HeaderLeft>
                    <Logo src={logoSky} alt="Logo Sky" onClick={handleReturnHome} />
                    <StyledLink to="/">SKY VIDEO CHAT</StyledLink>
                </HeaderLeft>
                <HeaderRight>
                    <MenuIcon onClick={toggleMenu}>
                        <FaBars />
                    </MenuIcon>
                    <DropdownMenu isOpen={isMenuOpen}>
                        {/* <MenuItem onClick={handleAttendance}>
                            <FaClipboardList /> Điểm danh
                        </MenuItem> */}
                        <MenuItem onClick={handleLogout}>
                            <FaSignOutAlt /> Đăng xuất
                        </MenuItem>
                    </DropdownMenu>
                </HeaderRight>
            </RouteLink>

            <Overlay isEditing={isEditing || isPasswordChanging} onClick={() => {
                if (isEditing) toggleEditing();
                if (isPasswordChanging) togglePasswordChange(); // Đóng drawer đổi mật khẩu khi bấm vào overlay
            }} />
            <ContentWrapper style={{ opacity: isEditing || isPasswordChanging ? 0.5 : 1 }}>
                <AvatarWrapper>
                    <ButtonAvata onClick={handleButtonAvataClick}>
                        <ImgAvata
                            src={userInfo?.avatar || Avata} // Nếu avatar tồn tại, dùng avatar từ API, nếu không hiển thị ảnh mặc định
                            alt="User Avatar"
                        />
                    </ButtonAvata>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*" // Chỉ chấp nhận file ảnh
                        onChange={handleFileChange}
                    />
                    <br />
                    <UserNameLink>{userInfo ? userInfo.name : 'Loading...'}</UserNameLink>
                </AvatarWrapper>

                {isUploading && <p>Đang tải lên...</p>}

                <InfoWrapper>
                    <InfoCard>
                        <InfoTitle>Thông tin cá nhân</InfoTitle>
                        <InfoText>Họ và tên: {userInfo ? userInfo.name : 'Loading...'}</InfoText>
                        <InfoText>Ngày sinh: {userInfo ? userInfo.birthDate : 'Loading...'}</InfoText>
                        <InfoText>Giới tính: {userInfo ? userInfo.gender : 'Loading...'}</InfoText>
                        <InfoText>Địa chỉ: {userInfo ? userInfo.address : 'Loading...'}</InfoText>
                        <InfoText>Số điện thoại: {userInfo ? userInfo.phone : 'Loading...'}</InfoText>
                        <InfoText>Email: {userInfo ? userInfo.email : 'Loading...'}</InfoText>
                    </InfoCard>
                    <InfoCard>
                        <InfoTitle>Thông tin tài khoản</InfoTitle>
                        <InfoText>Tên đăng nhập: {userInfo ? userInfo.loginName : 'Loading...'}</InfoText>
                        <InfoText>
                            Mật khẩu: {userInfo ? '********' : 'Loading...'}
                        </InfoText>
                    </InfoCard>

                </InfoWrapper>

                <ButtonWrapper>
                    <StyledButton onClick={toggleEditing}>Chỉnh sửa</StyledButton>
                    <StyledButton onClick={togglePasswordChange}>Đổi mật khẩu</StyledButton>
                </ButtonWrapper>
            </ContentWrapper>

            {isEditing && <DrawerPersonalInformation onClose={toggleEditing} isExiting={isExiting} userInfo={userInfo} onUpdateInfo={handleUpdateInfo} accessToken={accessToken} />}
            {isPasswordChanging && <DrawerChangePassword onClose={togglePasswordChange} isExiting={isExiting} accessToken={accessToken} />}
        </>
    );
}

export default PersonalInformation;