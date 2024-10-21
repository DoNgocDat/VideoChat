// DrawerPersonalInformation.js
import React from "react";
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
    background-color: #007bff;
    width: 150px;
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

const StyledButtonCancel = styled.button`
    background-color: #ffffff;
    width: 150px;
    color: #007bff;
    border-color: #007bff;
    border-radius: 30px;
    padding: 10px 10px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
        background-color: #cfd4da;
    }
`;

function DrawerPersonalInformation({ onClose, isExiting }) {
    return (
        <Drawer isExiting={isExiting}>
            <DrawerTitle>Chỉnh sửa thông tin</DrawerTitle>
            <InputField placeholder="Họ tên" />
            <InputField placeholder="Ngày sinh" />
            <GenderField>
                <label>
                    <input type="radio" name="gender" value="Nam" /> Nam
                </label>
                <label>
                    <input type="radio" name="gender" value="Nữ" /> Nữ
                </label>
            </GenderField>
            <InputField placeholder="Địa chỉ" />
            <InputField placeholder="Số điện thoại" />
            <InputField placeholder="Email" />
            <ButtonWrapper>
                <StyledButtonUpdate onClick={onClose}>Cập nhật</StyledButtonUpdate>
                <StyledButtonCancel onClick={onClose}>Hủy</StyledButtonCancel>
            </ButtonWrapper>
        </Drawer>
    );
}

export default DrawerPersonalInformation;
