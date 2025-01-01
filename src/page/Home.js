import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Banner from '../images/banner2.webp';
import Content from '../images/content.png';
import { Link, useNavigate } from "react-router-dom";
import logoSky from '../images/logo-sky.png';
import { useEffect, useState } from "react";
import PrivacyPolicyContent from "./PrivacyPolicyContent";
import TermsOfUse from './TermsOfUse';
import ft1 from '../images/ft1.jpg';
import ft2 from '../images/banner1.jpg';
import ft3 from '../images/ft3.jpg';

const Container = styled.div`
  margin: 100px 20px 20px 20px;
  /* background-color: #E0F7FA;  */
`;

const Title = styled.h1`
  text-align: center;
  margin: 30px;
  color: #0288D1; /* Màu xanh dương đậm hơn cho tiêu đề */

  span {
    background-image: linear-gradient(45deg, #81D4FA, #0288D1, #2c46ea);
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }
`;

const BannerImg = styled.img`
  height: 500px;
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const TitleIntro = styled.h2`
  font-weight: 700;
  color: #0288D1; /* Xanh đậm */
`;

const ContentTitle = styled.p`
  line-height: 2;
  font-weight: 500;
  font-family: revert;
  color: #333; /* Màu xám đậm cho văn bản chính */
`;

const BottomTitle = styled.p`
  line-height: 2;
  font-weight: 500;
  font-family: revert;
  color: #333;
  cursor: pointer;
`;

const ContentTitleCR = styled.p`
  line-height: 2;
  font-weight: 500;
  font-family: revert;
  text-align: center;
  color: #0288D1; /* Màu xanh chủ đề */
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
  margin-top: 40px;
  text-align: center;
  display: columns;
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
  background-image: ${({ scrolled }) =>
    scrolled
      ? "linear-gradient(to bottom, #0288D1, rgba(173, 216, 230, 0.8))"
      : "linear-gradient(to bottom, #81D4FA, rgba(255, 255, 255, 0.1))"
  };
  transition: background-image 0.3s ease;
  padding: 10px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  height: 50px;
  display: flex;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  padding-right: 30px;
`;

const Logo = styled.img`
  position: absolute;
  top: 5px;
  z-index: 3;
  width: 100px;
  height: auto;
`;

const StyledLink = styled(Link)`
  color: #0288D1;
  text-decoration: none;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  margin-top: 45px;
`;

const ButtonRegister = styled.button`
  margin: 5px;
  height: 25px;
  width: 90px;
  border-radius: 30px;
  border: 2px solid #0288D1; /* Đổi màu viền */
  color: #0288D1;
  cursor: pointer;
  background-color: transparent;

  &:hover {
    background-color: #81D4FA;
    color: #ffffff;
  }
`;

const ButtonLogin = styled.button`
  margin: 5px;
  height: 25px;
  width: 90px;
  border-radius: 30px;
  background-color: #0288D1;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    background-color: #489cd3;
  }
`;

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
    max-width: 620px;
`;

const ModalButton = styled.button`
    background-color: #0288D1;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
`;

const SectionContainer = styled.div`
  padding: 48px 16px;
  // background-color: #f9fafb; /* Màu nền nhạt */
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #0288D1; /* Màu xanh chủ đạo */
  text-align: center;
  margin-bottom: 12px;
`;

const SectionDescription = styled.p`
  color: #6b7280; /* Màu xám nhạt */
  text-align: center;
  margin-bottom: 24px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const FeatureCard = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0288D1;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  color: #374151;
`;

const FeatureImage = styled.img`
  width: 100%;
  max-width: 350px; /* Đảm bảo ảnh không quá lớn */
  height: 238px; /* Tự động thay đổi chiều cao theo tỷ lệ */
  margin-top: 16px;
  border-radius: 8px; /* Làm tròn góc ảnh */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Tạo hiệu ứng đổ bóng */
`;


const FAQList = styled.div`
  margin-top: 24px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div`
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FAQQuestion = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #0288D1;
`;

const FAQAnswer = styled.p`
  color: #374151;
  margin-top: 8px;
`;


const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showModalPrivacyPolicy, setshowModalPrivacyPolicy] = useState(false)
  const [showModalTermsOfUse, setShowModalTermsOfUse] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeModalPrivacyPolicy = () => {
    setshowModalPrivacyPolicy(false); // Đóng modal
  };

  const openeModalPrivacyPolicy = () => {
    setshowModalPrivacyPolicy(true); // Mở modal
  };

  const closeModalTermsOfUse = () => {
    setShowModalTermsOfUse(false)
  }

  const openModalTermsOfUse = () => {
    setShowModalTermsOfUse(true)
  }

  return (
    <>
      <RouteLink scrolled={scrolled}>
        <HeaderLeft>
          <Logo src={logoSky} alt="Logo Sky" /> <br />
          <StyledLink to="/">SKY VIDEO CHAT</StyledLink>
        </HeaderLeft>

        <HeaderRight>
          <ButtonRegister onClick={() => navigate('/register')}>Đăng ký</ButtonRegister>
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
          <Title>
            Chào mừng bạn đến với <span>SKY VIDEO CHAT!</span>
          </Title>
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

        <SectionContainer>
        {/* Phần Các Tính Năng Nổi Bật */}
        <div>
          <SectionTitle>Các tính năng nổi bật</SectionTitle>
          <SectionDescription>
            Khám phá những tính năng đặc biệt giúp Sky Video Chat trở nên khác biệt.
          </SectionDescription>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureTitle>Họp trực tuyến chất lượng cao</FeatureTitle>
              <FeatureDescription>
                Tối ưu cho giáo viên và học sinh.
              </FeatureDescription>
              <FeatureImage src={ft1} alt="Kết nối nhanh chóng" />
            </FeatureCard>
            <FeatureCard>
              <FeatureTitle>Giao diện thân thiện</FeatureTitle>
              <FeatureDescription>
                Dễ sử dụng, thích hợp cho mọi đối tượng.
              </FeatureDescription>
              <FeatureImage src={ft2} alt="Hỗ trợ 24/7" />

            </FeatureCard>
            <FeatureCard>
              <FeatureTitle>Bảo mật hàng đầu</FeatureTitle>
              <FeatureDescription>
                Mọi dữ liệu được mã hóa an toàn.
              </FeatureDescription>
              <FeatureImage src={ft3} alt="Bảo mật hàng đầu" />
            </FeatureCard>
          </FeaturesGrid>
        </div>

        {/* Phần Câu Hỏi Thường Gặp */}
        <div style={{ marginTop: "48px" }}>
          <SectionTitle>Câu hỏi thường gặp</SectionTitle>
          <SectionDescription>
            Những thắc mắc phổ biến của người dùng về Sky Video Chat.
          </SectionDescription>
          <FAQList>
            <FAQItem>
              <FAQQuestion>Làm thế nào để đăng ký tài khoản?</FAQQuestion>
              <FAQAnswer>
                Nhấn nút "Đăng ký" hoặc truy cập trang đăng ký. Điền thông tin cần thiết và xác nhận qua email.
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>Sky Video Chat có thu phí không?</FAQQuestion>
              <FAQAnswer>
                Không toàn bộ đều miễn phí.
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>Làm sao để liên hệ với đội hỗ trợ?</FAQQuestion>
              <FAQAnswer>
                Gửi email đến support@skyvideochat.com hoặc gọi hotline +84 123 456 789.
              </FAQAnswer>
            </FAQItem>
          </FAQList>
        </div>
      </SectionContainer>

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
              <BottomTitle>Email: support@skyvideochat.com</BottomTitle>
              <BottomTitle>Số điện thoại: +84 123 456 789</BottomTitle>
            </BottomContact>

            <BottomPolicy>
              <TitleIntro>Chính sách</TitleIntro>
              <BottomTitle onClick={openeModalPrivacyPolicy}>Chính sách bảo mật</BottomTitle>
              <BottomTitle onClick={openModalTermsOfUse}>Điều khoản sử dụng</BottomTitle>
            </BottomPolicy>

            <BottomSocialNetwork>
              <TitleIntro>Mạng xã hội</TitleIntro>
              <BottomTitle>Facebook</BottomTitle>
              <BottomTitle>Linkedin</BottomTitle>
            </BottomSocialNetwork>
          </motion.div>
          <br />
        </BottomSection>
        <ContentTitleCR>© 2024 Sky Video Chat. Bản quyền thuộc về Sky Video Chat</ContentTitleCR>
      </Container>

      <AnimatePresence>
        {showModalPrivacyPolicy && (
          <ModalBackground>
            <ModalContent
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <PrivacyPolicyContent></PrivacyPolicyContent>
              <ModalButton onClick={closeModalPrivacyPolicy}>Đóng</ModalButton>
            </ModalContent>
          </ModalBackground>
        )}
        {showModalTermsOfUse && (
          <ModalBackground>
            <ModalContent initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <TermsOfUse />
              <ModalButton onClick={closeModalTermsOfUse}>Đóng</ModalButton>
            </ModalContent>
          </ModalBackground>
        )}
      </AnimatePresence>
    </>
  );
}

export default Home;
