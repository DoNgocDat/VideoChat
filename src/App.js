import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './page/Home';
import LoginPage from './page/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
