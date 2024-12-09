import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './page/Home';
import LoginPage from './page/login/Login';
import ForgotPassword from './page/forgotpassword/ForgotPassword';
import AuthenAccount from './page/AuthenAccount';
import ResetPassword from './page/ResetPassword/ResetPassword';
import CreateClass from './page/CreateClass/CreateClass';
import RegisterPage from './page/register/Register';
import PersonalInformation from './page/PersonnalInformation/PersonalInformation'
import WaitingRoom from "./page/WaitingRoom/WaitingRoom";
import ClassRoom from "./page/ClassRoom";
import Attendance from "./page/Attendance/Attendance";
import { SocketProvider } from "./page/socketContext";
import { useParams } from 'react-router-dom';

const WithSocketProvider = ({ Component }) => {
  const params = useParams();
  const classCode = params?.classCode; // Kiểm tra an toàn
  console.log("classCode:", classCode); // Debug để kiểm tra classCode

  if (!classCode) {
    return <div>Không có classCode được cung cấp!</div>;
  }  return (
      <SocketProvider classCode={classCode}>
          <Component />
      </SocketProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/authen-account" element={<AuthenAccount/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/create-class" element={<CreateClass/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/personal-information" element={<PersonalInformation/>}/>
        {/* <Route path="/waiting-room/:classCode" element={<WaitingRoom/>} />
        <Route path="/classroom/:classCode" element={<ClassRoom/>}/> */}
        {/* Các route cần SocketProvider */}
        <Route 
          path="/waiting-room/:classCode" 
          element={<WithSocketProvider Component={WaitingRoom} />}
          />
        <Route 
          path="/classroom/:classCode" 
          element={<WithSocketProvider Component={ClassRoom} />}
        />
        <Route path="/attendance" element={<Attendance/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
