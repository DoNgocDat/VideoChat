import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from './page/Home';
import styles from './App.module.css';
import logoSky from './images/logo-sky.png'

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav className={styles.routeLink}>
          <div className={styles.headerleft}>
            <img src={logoSky} alt="Logo Sky" className={styles.logo} /> <br />
            <Link to="/" className={styles.link}>SKY VIDEO CHAT</Link>
          </div>

          <div className={styles.headerright}>
              <button className={styles.btnregister}>Đăng ký</button>
              <button className={styles.btnlogin}>Đăng nhập</button>
          </div>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;