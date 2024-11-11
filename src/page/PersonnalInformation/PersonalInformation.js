import styled from "styled-components";
import logoSky from '../../images/logo-sky.png';
import Avata from '../../images/avata.jpg';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DrawerPersonalInformation from '../DrawerPersonalInformation';
import DrawerChangePassword from '../DrawerChangePassword';
import { getUserInfo } from './services';

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

// Main component
function PersonalInformation() {
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordChanging, setIsPasswordChanging] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userInfo, setUserInfo] = useState(null); // Khởi tạo userInfo là null
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate('/');
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

    // Lấy thông tin người dùng khi userId thay đổi
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo(userId);
                setUserInfo({
                    loginName: data.loginName,
                    name: data.fullName,
                    birthDate: "N/A", // Cập nhật nếu có dữ liệu
                    gender: "N/A", // Cập nhật nếu có dữ liệu
                    address: "N/A", // Cập nhật nếu có dữ liệu
                    phone: data.phoneNumber || "N/A",
                    password: data.password,
                    email: data.email,
                });
            } catch (error) {
                console.error('Không thể lấy thông tin người dùng:', error);
            }
        };

        if (userId) {
            fetchUserInfo();
        }
    }, [userId]);

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

    return (
        <>
            <RouteLink>
                <HeaderLeft>
                    <Logo src={logoSky} alt="Logo Sky" onClick={handleReturnHome} />
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
                    <UserNameLink>{userInfo ? userInfo.name : 'Loading...'}</UserNameLink>
                </AvatarWrapper>

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

            {isEditing && <DrawerPersonalInformation onClose={toggleEditing} isExiting={isExiting} userInfo={userInfo} onUpdateInfo={handleUpdateInfo} />}
            {isPasswordChanging && <DrawerChangePassword onClose={togglePasswordChange} isExiting={isExiting} />}
        </>
    );
}

export default PersonalInformation;

// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import logoSky from '../../images/logo-sky.png';
// import Avata from '../../images/avata.jpg';
// import DrawerPersonalInformation from '../DrawerPersonalInformation';
// import DrawerChangePassword from '../DrawerChangePassword';
// import { getUserInfo } from './services';

// // Main component
// function PersonalInformation() {
//     const [isEditing, setIsEditing] = useState(false);
//     const [isPasswordChanging, setIsPasswordChanging] = useState(false);
//     const [isExiting, setIsExiting] = useState(false);
//     const [userId, setUserId] = useState(null);
//     const [userInfo, setUserInfo] = useState(null); // Khởi tạo userInfo là null
//     const navigate = useNavigate();

//     const handleReturnHome = () => {
//         navigate('/');
//     };

//     // Lấy userId từ localStorage
//     useEffect(() => {
//         const storedUserId = localStorage.getItem('userId');
//         if (storedUserId) {
//             setUserId(storedUserId);
//             console.log('Lấy ID người dùng thành công:', storedUserId); // Thông báo thành công
//         } else {
//             console.error('Không tìm thấy userId trong localStorage');
//             // Có thể điều hướng về trang login nếu không có userId
//             navigate('/login');
//         }
//     }, [navigate]);

//     // Lấy thông tin người dùng khi userId thay đổi
//     useEffect(() => {
//         const fetchUserInfo = async () => {
//             try {
//                 const data = await getUserInfo(userId);
//                 setUserInfo({
//                     loginName: data.loginName,
//                     name: data.fullName,
//                     birthDate: "N/A", // Cập nhật nếu có dữ liệu
//                     gender: "N/A", // Cập nhật nếu có dữ liệu
//                     address: "N/A", // Cập nhật nếu có dữ liệu
//                     phone: data.phoneNumber || "N/A",
//                     password: data.password,
//                     email: data.email,
//                 });
//             } catch (error) {
//                 console.error('Không thể lấy thông tin người dùng:', error);
//             }
//         };

//         if (userId) {
//             fetchUserInfo();
//         }
//     }, [userId]);

//     const toggleEditing = () => {
//         if (isEditing) {
//             setIsExiting(true);
//             setTimeout(() => {
//                 setIsEditing(false);
//                 setIsExiting(false);
//             }, 300);
//         } else {
//             setIsEditing(true);
//             setIsExiting(false);
//         }
//     };

//     const togglePasswordChange = () => {
//         if (isPasswordChanging) {
//             setIsExiting(true);
//             setTimeout(() => {
//                 setIsPasswordChanging(false);
//                 setIsExiting(false);
//             }, 300);
//         } else {
//             setIsPasswordChanging(true);
//             setIsExiting(false);
//         }
//     };

//     const handleUpdateInfo = (updatedInfo) => {
//         setUserInfo(updatedInfo);
//         setIsEditing(false);
//     };

//     return (
//         <>
//             <nav className="bg-white p-2 fixed top-0 left-0 w-full z-10 h-16 shadow-md flex justify-between items-center">
//                 <div className="flex flex-col items-center pl-5">
//                     <img src={logoSky} alt="Logo Sky" className="w-24 h-auto cursor-pointer" onClick={handleReturnHome} />
//                     <Link to="/" className="text-[#0288D1] text-sm font-bold mt-1">SKY VIDEO CHAT</Link>
//                 </div>
//             </nav>

//             <div className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10 ${isEditing || isPasswordChanging ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`} 
//                 onClick={() => {
//                     if (isEditing) toggleEditing();
//                     if (isPasswordChanging) togglePasswordChange();
//                 }} />
            
//             <div className={`mt-20 p-5 ${isEditing || isPasswordChanging ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}>
//                 <div className="text-center mb-5">
//                     <button className="bg-cover bg-center w-16 h-16 rounded-full mb-2" style={{ backgroundImage: `url(${Avata})` }} />
//                     <Link to="/" className="text-[#0288D1] text-lg font-bold">{userInfo ? userInfo.name : 'Loading...'}</Link>
//                 </div>

//                 <div className="flex justify-between w-11/12 mx-auto mt-5">
//                     <div className="bg-[#f9f9f9] rounded-lg p-4 w-2/5 shadow-lg text-left">
//                         <h3 className="text-[#0288D1] text-xl mb-4">Thông tin cá nhân</h3>
//                         <p className="text-[#555] text-base mb-2">Họ và tên: {userInfo ? userInfo.name : 'Loading...'}</p>
//                         <p className="text-[#555] text-base mb-2">Ngày sinh: {userInfo ? userInfo.birthDate : 'Loading...'}</p>
//                         <p className="text-[#555] text-base mb-2">Giới tính: {userInfo ? userInfo.gender : 'Loading...'}</p>
//                         <p className="text-[#555] text-base mb-2">Địa chỉ: {userInfo ? userInfo.address : 'Loading...'}</p>
//                         <p className="text-[#555] text-base mb-2">Số điện thoại: {userInfo ? userInfo.phone : 'Loading...'}</p>
//                         <p className="text-[#555] text-base mb-2">Email: {userInfo ? userInfo.email : 'Loading...'}</p>
//                     </div>
//                     <div className="bg-[#f9f9f9] rounded-lg p-4 w-2/5 shadow-lg text-left">
//                         <h3 className="text-[#0288D1] text-xl mb-4">Thông tin tài khoản</h3>
//                         <p className="text-[#555] text-base mb-2">Tên đăng nhập: {userInfo ? userInfo.loginName : 'Loading...'}</p>
//                         <p className="text-[#555] text-base mb-2">Mật khẩu: {userInfo ? '********' : 'Loading...'}</p>
//                     </div>
//                 </div>

//                 <div className="flex justify-around mt-5">
//                     <button 
//                         className="bg-[#0288D1] text-white rounded-3xl py-2 px-4 text-sm cursor-pointer hover:bg-[#0056b3]"
//                         onClick={toggleEditing}>Chỉnh sửa</button>
//                     <button 
//                         className="bg-[#0288D1] text-white rounded-3xl py-2 px-4 text-sm cursor-pointer hover:bg-[#0056b3]"
//                         onClick={togglePasswordChange}>Đổi mật khẩu</button>
//                 </div>
//             </div>

//             {isEditing && <DrawerPersonalInformation onClose={toggleEditing} isExiting={isExiting} userInfo={userInfo} onUpdateInfo={handleUpdateInfo} />}
//             {isPasswordChanging && <DrawerChangePassword onClose={togglePasswordChange} isExiting={isExiting} />}
//         </>
//     );
// }

// export default PersonalInformation;
