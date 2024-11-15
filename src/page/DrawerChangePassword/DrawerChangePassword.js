// import React from "react";
// import styled from "styled-components";

// const Drawer = styled.div`
//     position: fixed;
//     right: 0;
//     top: 0;
//     width: 400px;
//     height: 100%;
//     background-color: #fff;
//     box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
//     padding: 20px;
//     z-index: 1001;
//     animation: ${(props) => (props.isExiting ? 'slideOut 0.3s forwards' : 'slideIn 0.3s forwards')};

//     @keyframes slideIn {
//         from {
//             transform: translateX(100%);
//             opacity: 0;
//         }
//         to {
//             transform: translateX(0);
//             opacity: 1;
//         }
//     }

//     @keyframes slideOut {
//         from {
//             transform: translateX(0);
//             opacity: 1;
//         }
//         to {
//             transform: translateX(100%);
//             opacity: 0;
//         }
//     }
// `;

// const DrawerTitle = styled.h2`
//     font-size: 20px;
//     margin-bottom: 20px;
//     color: #0288D1;
// `;

// const InputField = styled.input`
//     width: calc(100% - 30px);
//     padding: 10px;
//     margin-bottom: 15px;
//     border-radius: 5px;
//     border: 1px solid #ccc;
// `;

// const ButtonWrapper = styled.div`
//     display: flex;
//     justify-content: space-around;
//     margin-top: 15px;
// `;

// const StyledButtonUpdate = styled.button`
//     background-color: #0288D1;
//     width: 150px;
//     color: white;
//     border: none;
//     border-radius: 30px;
//     padding: 10px 10px;
//     font-size: 14px;
//     cursor: pointer;
//     &:hover {
//         background-color: #0056b3;
//     }
// `;

// const StyledButtonCancel = styled.button`
//     background-color: #ffffff;
//     width: 150px;
//     color: #0288D1;
//     border-color: #0288D1;
//     border-radius: 30px;
//     padding: 10px 10px;
//     font-size: 14px;
//     cursor: pointer;
//     &:hover {
//         background-color: #cfd4da;
//     }
// `;

// function DrawerChangePassword({ onClose, isExiting }) {
//     return (
//         <Drawer isExiting={isExiting}>
//             <DrawerTitle>Đổi Mật Khẩu</DrawerTitle>
//             <InputField type="password" placeholder="Mật khẩu cũ" />
//             <InputField type="password" placeholder="Mật khẩu mới" />
//             <ButtonWrapper>
//                 <StyledButtonUpdate onClick={onClose}>Cập nhật</StyledButtonUpdate>
//                 <StyledButtonCancel onClick={onClose}>Hủy</StyledButtonCancel>
//             </ButtonWrapper>
//         </Drawer>
//     );
// }

// export default DrawerChangePassword;


// DrawerChangePassword.js
import React, { useState } from "react";
import styled from "styled-components";
import { changePassword } from "./services"; // Import hàm thay đổi mật khẩu từ services

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
  width: calc(100% - 30px);
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
`;

const StyledButtonUpdate = styled.button`
  background-color: #0288D1;
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

function DrawerChangePassword({ onClose, isExiting, accessToken }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    const data = { oldPassword, newPassword };

    try {
      const response = await changePassword(data, accessToken); // Gọi API thay đổi mật khẩu
      if (response.success) {
        onClose(); // Đóng drawer khi thành công
        alert("Đổi mật khẩu thành công!");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Đổi mật khẩu thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Drawer isExiting={isExiting}>
      <DrawerTitle>Đổi Mật Khẩu</DrawerTitle>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <InputField
        type="password"
        placeholder="Mật khẩu cũ"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <InputField
        type="password"
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <ButtonWrapper>
        <StyledButtonUpdate onClick={handleChangePassword}>Cập nhật</StyledButtonUpdate>
        <StyledButtonCancel onClick={onClose}>Hủy</StyledButtonCancel>
      </ButtonWrapper>
    </Drawer>
  );
}

export default DrawerChangePassword;
