import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './page/Home';
import LoginPage from './page/login/Login';
import ForgotPassword from './page/forgotpassword/ForgotPassword';
import AuthenAccount from './page/AuthenAccount';
import ResetPassword from './page/ResetPassword/ResetPassword';
import CreateClass from './page/CreateClass/CreateClass';
import RegisterPage from './page/register/Register';
import PersonalInformation from './page/PersonnalInformation/PersonalInformation'
import WaitingRoom from "./page/WaitingRoom";
import ClassRoom from "./page/ClassRoom";
import Attendance from "./page/Attendance/Attendance";

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
        <Route path="/waiting-room" element={<WaitingRoom/>} />
        <Route path="/classroom/1234567" element={<ClassRoom/>}/>
        <Route path="/attendance" element={<Attendance/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
