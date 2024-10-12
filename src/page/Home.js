import styled from "styled-components";
import { motion } from "framer-motion";
import Banner from '../images/banner.jpg';
import Content from '../images/content.png';
import { Link, useNavigate } from "react-router-dom";
import logoSky from '../images/logo-sky.png';

const Container = styled.div`
  margin: 100px 20px 20px 20px;
`;

const Title = styled.h3`
  text-align: center;
  margin: 30px;
  color: #1c0e72;
`;

const BannerImg = styled.img`
  height: 450px;
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const TitleIntro = styled.h3`
  font-weight: 700;
  color: #1c0e72;
`;

const ContentTitle = styled.p`
  line-height: 2;
  font-weight: 500;
  font-family: revert;
`;

const ContainerContent = styled.div`
  margin-top: 35px;
`;

const ContentImg = styled.img`
  width: 100%;
  height: 220px;
  object-fit: contain;
`;

const ContentLeft = styled.div`
  width: 50%;
  float: left;
  margin: 20px;
`;

const ContentRight = styled.div`
  width: 40%;
  float: left;
  text-align: center;
`;

const ClearFix = styled.div`
  clear: both;
`;

const BottomSection = styled.div`
  margin-top: 50px;
  text-align: center;
`;

const BottomContact = styled.div`
  width: 34%;
  float: left;
  text-align: center;
`;

const BottomPolicy = styled.div`
  width: 33%;
  float: left;
  text-align: center;
`;

const BottomSocialNetwork = styled.div`
  width: 33%;
  float: left;
  text-align: center;
`;

const RouteLink = styled.nav`
  background-color: #ffffff;
  padding: 10px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  height: 50px;
  box-shadow: 2px 2px 2px #c0deeb;
`;

const HeaderLeft = styled.div`
  width: 50%;
  float: left;
`;

const HeaderRight = styled.div`
  width: 40%;
  float: left;
  margin: 7px;
  text-align: right;
`;

const Logo = styled.img`
  width: 120px;
  height: 30px;
  padding-left: 17px;
`;

const StyledLink = styled(Link)`
  color: #1c0e72;
  text-decoration: none;
  margin: 0 10px;
`;

const ButtonRegister = styled.button`
  margin: 5px;
  height: 25px;
  width: 90px;
  border-radius: 30px;
  border-color: #007aff;
  color: #007aff;
  box-shadow: 2px 2px 2px #c0deeb;

  &:hover {
    background-color: #c0deeb;
    border-color: #c0deeb;
  }
`;

const ButtonLogin = styled.button`
  margin: 5px;
  height: 25px;
  width: 90px;
  border-radius: 30px;
  border-color: #007aff;
  background-color: #007aff;
  color: #ffffff;
  box-shadow: 2px 2px 2px #c0deeb;

  &:hover {
    background-color: #489cd3;
    border-color: #489cd3;
  }
`;

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <RouteLink>
        <HeaderLeft>
          <Logo src={logoSky} alt="Logo Sky" /> <br />
          <StyledLink to="/">SKY VIDEO CHAT</StyledLink>
        </HeaderLeft>

        <HeaderRight>
          <ButtonRegister>Đăng ký</ButtonRegister>
          <ButtonLogin onClick={() => navigate('/login')}>Đăng nhập</ButtonLogin>
        </HeaderRight>
      </RouteLink>

      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={variants}
        >
          <Title>Chào mừng bạn đến với SKY VIDEO CHAT!</Title>
        </motion.div>
        <BannerImg src={Banner} alt="Banner" />

        <ContainerContent>
          <ContentLeft>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              variants={variants}
            >
              <TitleIntro>Về Sky Video Chat</TitleIntro>
              <ContentTitle>
                Nền tảng học trực tuyến và kết nối mọi lúc, mọi nơi.<br />
                Tham gia ngay để trải nghiệm khóa học video <br />
                chất lượng cao, giao lưu với giáo viên và bạn bè.<br />
                Cùng Sky Video Chat, việc học trở nên thú vị và dễ dàng hơn bao giờ hết!
              </ContentTitle>
            </motion.div>
          </ContentLeft>

          <ContentRight>
            <ContentImg src={Content} alt="Content" />
          </ContentRight>

          <ClearFix />
        </ContainerContent>

        <hr />

        <BottomSection>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={variants}
          >
            <BottomContact>
              <TitleIntro>Liên hệ</TitleIntro>
              <ContentTitle>Email: support@skyvideochat.com</ContentTitle>
              <ContentTitle>Số điện thoại: +84 123 456 789</ContentTitle>
            </BottomContact>

            <BottomPolicy>
              <TitleIntro>Chính sách</TitleIntro>
              <ContentTitle>Chính sách bảo mật</ContentTitle>
              <ContentTitle>Điều khoản sử dụng</ContentTitle>
            </BottomPolicy>

            <BottomSocialNetwork>
              <TitleIntro>Mạng xã hội</TitleIntro>
              <ContentTitle>Facebook</ContentTitle>
              <ContentTitle>Linkedin</ContentTitle>
            </BottomSocialNetwork>
          </motion.div>
          <br />
          <ContentTitle>© 2024 Sky Video Chat. Bản quyền thuộc về Sky Video Chat</ContentTitle>
        </BottomSection>
      </Container>
    </>
  );
}

export default Home;
