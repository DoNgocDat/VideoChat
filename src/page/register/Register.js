import React, { useState } from 'react';
import styled from "styled-components";
import BannerLogin from '../../images/banner-login.jpg';
import LogoSky from '../../images/logo-sky.png';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { register } from './services';
import { RegisterData } from './types';

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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  text-align: center;
`;

const ModalButton = styled.button`
  background-color: #007aff;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Register() {
  const [formData, setFormData] = useState(RegisterData);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRegister = async () => {
    if (formData.password !== formData.rePassword) {
      setErrorMessage('Mật khẩu không khớp.');
      return;
    }

    try {
      const response = await register(formData);
      if (response.success) {
        setModalMessage('Đăng ký thành công.');
        navigate('/login');
        setShowModal(true);
        setTimeout(() => {
            navigate('/login');
        }, 2000);
      } else {
        setModalMessage(response.message || 'Đăng ký thất bại.');
        setShowModal(true);
      }
    } catch (error) {
      setModalMessage('Đăng ký thất bại. Vui lòng thử lại.');
      setShowModal(true);
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const closeModal = () => setShowModal(false);

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
        <Title>Đăng ký</Title>
        <Input
          name="loginName"
          placeholder="Tên đăng nhập"
          value={formData.loginName}
          onChange={handleChange}
        />
        <Input
          name="fullName"
          placeholder="Họ tên"
          value={formData.fullName}
          onChange={handleChange}
        />
        <Input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          name="rePassword"
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={formData.rePassword}
          onChange={handleChange}
        />
        {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
        <ButtonLogin onClick={handleRegister}>Đăng ký</ButtonLogin>
        <ContentBottom>
          Bạn đã có tài khoản?
          <ContentBottomLink to="/login"> Đăng nhập</ContentBottomLink>
        </ContentBottom>
      </ContentRight>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <p>{modalMessage}</p>
            <ModalButton onClick={closeModal}>Đóng</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

export default Register;
