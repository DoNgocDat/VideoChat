import styled from "styled-components";
import { motion } from "framer-motion";
import Banner from '../images/banner.jpg';
import Content from '../images/content.png';

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

const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

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

function Home() {
    return (
        <>
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
                            <TitleIntro>liên hệ</TitleIntro>
                            <ContentTitle>Email: support@skyvideochat.com</ContentTitle>
                            <ContentTitle>Số điện thoại: +84 123 456 789</ContentTitle>
                        </BottomContact>

                        <BottomPolicy>
                            <TitleIntro>chính sách</TitleIntro>
                            <ContentTitle>Chính sách bảo mật</ContentTitle>
                            <ContentTitle>Điều khoản sử dụng</ContentTitle>
                        </BottomPolicy>

                        <BottomSocialNetwork>
                            <TitleIntro>mạng xã hội</TitleIntro>
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