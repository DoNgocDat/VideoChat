import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './page/Home';
import LoginPage from './page/Login';
import ForgotPassword from './page/ForgotPassword';
import AuthenAccount from './page/AuthenAccount';
import ResetPassword from './page/ResetPassword';
import CreateClass from './page/CreateClass';
import RegisterPage from './page/Register';
import WaitingRoom from "./page/WaitingRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/authen-account" element={<AuthenAccount/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/create-class" element={<CreateClass/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/waiting-room" element={<WaitingRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
