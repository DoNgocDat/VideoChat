import styled from "styled-components";
import logoSky from '../../images/logo-sky.png';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';

// Header styles
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

// Table and page content styles
const ContentWrapper = styled.div`
    margin-top: 80px;
    padding: 20px;
`;

const SelectClass = styled.select`
    padding: 10px;
    margin-bottom: 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 15px;
    border: 1px solid #ddd;
    background-color: #fff;
`;

const TableWrapper = styled.div`
    overflow-x: auto;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const Title = styled.h2`
    color: #0288D1;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const Th = styled.th`
    padding: 12px;
    border: 1px solid #ddd;
    background-color: #0288D1;
    color: white;
    text-align: center;
    min-width: 120px;

    &:first-child {
        position: sticky;
        left: 0;
        z-index: 3; /* Ensure it stays above all other content */
        background-color: #0288D1;
    }

    &:nth-child(2) {
        position: sticky;
        left: 130px;
        z-index: 3;
        background-color: #0288D1;
    }
`;

const Td = styled.td`
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
    white-space: nowrap;
    min-width: 120px;

    &:first-child {
        position: sticky;
        left: 0;
        z-index: 2; /* Lower than the header, but above other cells */
        background-color: #f9f9f9;
    }

    &:nth-child(2) {
        position: sticky;
        left: 130px;
        z-index: 2;
        background-color: #f9f9f9;
    }
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

function Attendance() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const handlePersonalInformation = () => {
        navigate('/personal-information'); // Assuming there's a page for attendance
    };

    // Mock data for multiple classes with more dates
    const classData = {
        "Class 1": {
            dates: ["2024-11-01", "2024-11-02", "2024-11-03", "2024-11-04", "2024-11-05", "2024-11-06", "2024-11-07"],
            students: [
                { accountName: 'user1', fullName: 'Nguyen Van A', attendance: ['✓', '✓', 'X', '✓', 'X', '✓', 'X'] },
                { accountName: 'user2', fullName: 'Tran Thi B', attendance: ['✓', 'X', '✓', 'X', '✓', 'X', '✓'] },
                { accountName: 'user3', fullName: 'Tran Thi C', attendance: ['✓', 'X', '✓', 'X', '✓', 'X', '✓'] },
                { accountName: 'user4', fullName: 'Tran Thi D', attendance: ['✓', 'X', '✓', 'X', '✓', 'X', '✓'] },
                { accountName: 'user5', fullName: 'Tran Thi E', attendance: ['✓', 'X', '✓', 'X', '✓', 'X', '✓'] },
                { accountName: 'user6', fullName: 'Tran Thi F', attendance: ['✓', 'X', '✓', 'X', '✓', 'X', '✓'] },
            ],
        },
        "Class 2": {
            dates: ["2024-11-01", "2024-11-02", "2024-11-03", "2024-11-04", "2024-11-05", "2024-11-06", "2024-11-07"],
            students: [
                { accountName: 'user3', fullName: 'Le Van C', attendance: ['X', '✓', '✓', '✓', 'X', 'X', '✓'] },
                { accountName: 'user4', fullName: 'Pham Thi D', attendance: ['✓', '✓', '✓', 'X', '✓', '✓', '✓'] },
            ],
        },
        "Class 3": {
            dates: ["2024-11-01", "2024-11-02", "2024-11-03", "2024-11-04", "2024-11-05", "2024-11-06", "2024-11-07"],
            students: [
                { accountName: 'user5', fullName: 'Tran Van E', attendance: ['✓', 'X', 'X', '✓', 'X', '✓', 'X'] },
                { accountName: 'user6', fullName: 'Nguyen Thi F', attendance: ['✓', '✓', '✓', '✓', '✓', 'X', '✓'] },
            ],
        },
    };

    const [selectedClass, setSelectedClass] = useState("");

    const handleReturnHome = () => {
        navigate('/');
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

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
                        <MenuItem onClick={handlePersonalInformation}>
                            <FaClipboardList /> Thông tin cá nhân
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <FaSignOutAlt /> Đăng xuất
                        </MenuItem>
                    </DropdownMenu>
                </HeaderRight>
            </RouteLink>

            <ContentWrapper>
                <Title>Điểm Danh</Title>

                <SelectClass onChange={handleClassChange} value={selectedClass}>
                    <option value="">Chọn mã lớp</option>
                    {Object.keys(classData).map((className) => (
                        <option key={className} value={className}>
                            {className}
                        </option>
                    ))}
                </SelectClass>

                {selectedClass && (
                    <TableWrapper>
                        <Table>
                            <thead>
                                <tr>
                                    <Th>Tên tài khoản</Th>
                                    <Th>Họ tên</Th>
                                    {classData[selectedClass].dates.map((date, index) => (
                                        <Th key={index}>{date}</Th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {classData[selectedClass].students.map((data, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <Td>{data.accountName}</Td>
                                        <Td>{data.fullName}</Td>
                                        {data.attendance.map((status, colIndex) => (
                                            <Td key={colIndex}>{status}</Td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableWrapper>
                )}
            </ContentWrapper>
        </>
    );
}

export default Attendance;