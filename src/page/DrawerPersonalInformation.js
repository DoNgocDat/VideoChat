// DrawerPersonalInformation.js
import React, { useState } from "react";
import styled from "styled-components";

const Drawer = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    width: 400px;
    height: 100%;
    background-color: #fff;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
    padding: 20px;
    z-index: 1001;
    animation: ${(props) => (props.isExiting ? 'slideOut 0.3s forwards' : 'slideIn 0.3s forwards')};

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

const DrawerTitle = styled.h2`
    font-size: 20px;
    margin-bottom: 20px;
    color: #0288D1;
`;

const InputField = styled.input`
    width: calc(100% - 30px); /* Giảm chiều rộng để tạo khoảng cách từ lề */
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-left: 10px; /* Thêm khoảng cách từ lề trái */
`;


const GenderField = styled.div`
    margin-bottom: 15px;
    label {
        margin-right: 10px;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
`;

const StyledButtonUpdate = styled.button`
    background-color: ${(props) => (props.disabled ? '#888' : '#0288D1')};
    width: 150px;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 10px 10px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => (props.disabled ? '#888' : '#0056b3')};
    }
`;

const StyledButtonCancel = styled.button`
    background-color: #ffffff;
    width: 150px;
    color: #0288D1;
    border-color: #0288D1;
    border-radius: 30px;
    padding: 10px 10px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
        background-color: #cfd4da;
    }
`;

function DrawerPersonalInformation({ onClose, isExiting, userInfo, onUpdateInfo }) {
    const [name, setName] = useState(userInfo.name);
    const [birthDate, setBirthDate] = useState(userInfo.birthDate);
    const [gender, setGender] = useState(userInfo.gender);
    const [address, setAddress] = useState(userInfo.address);
    const [phone, setPhone] = useState(userInfo.phone);
    const [email, setEmail] = useState(userInfo.email);
    const [emailError, setEmailError] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailError(!validateEmail(newEmail));
    };
    const handleUpdate = () => {
        onUpdateInfo({ name, birthDate, gender, address, phone, email });
        onClose();
    };

    return (
        <Drawer isExiting={isExiting}>
            <DrawerTitle>Chỉnh sửa thông tin</DrawerTitle>
            <InputField placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} />
            <InputField type="date" placeholder="Ngày sinh" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            <GenderField>
                <label>
                    <input type="radio" name="gender" value="Nam" checked={gender === "Nam"} onChange={() => setGender("Nam")} /> Nam
                </label>
                <label>
                    <input type="radio" name="gender" value="Nữ" checked={gender === "Nữ"} onChange={() => setGender("Nữ")} /> Nữ
                </label>
            </GenderField>
            <InputField placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
            <InputField placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <InputField
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                style={{ borderColor: emailError ? 'red' : '#ccc' }}
            />
            {emailError && <p style={{ color: 'red' }}>Email không đúng định dạng</p>}            <ButtonWrapper>
                <StyledButtonUpdate onClick={handleUpdate} disabled={emailError}>Cập nhật</StyledButtonUpdate>
                <StyledButtonCancel onClick={onClose}>Hủy</StyledButtonCancel>
            </ButtonWrapper>
        </Drawer>
    );
}

export default DrawerPersonalInformation;
