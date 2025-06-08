import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
// ************* Components *****************
import Navbar from "./components/Navbar/Navbar.jsx";
// **************** Pages *******************
import Login from "./pages/Login/Login.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import Home from "./pages/Home/Home.jsx";
import FlightInfo from "./pages/FlightInfo/FlightInfo.jsx";
import CrewInfo from "./pages/CrewInfo/CrewInfo.jsx";
import CrewPairing from "./pages/CrewPairing/CrewPairing.jsx";
import CrewScheduling from "./pages/CrewScheduling/CrewScheduling.jsx";

// ************* To hide Navbar on certain Pages *******************
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarOnPaths = ["/LoginPage","/SignupPage"];

  return (
    <>
      {!hideNavbarOnPaths.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
}

const Protected = ({ children }) => {
  return localStorage.getItem('token') ? (
    children
  ) : (
    <Navigate to="/LoginPage" />
  );
}

const App = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   navigate('/LoginPage');
  // }, []);

  return (
    <>
      <Router>
        <Layout>
        <div className="routes-container">
          <Routes>
            <Route path='/' element={<Navigate to="/LoginPage" />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/LoginPage' element={<Login />} />
            <Route path='/SignupPage' element={<SignUp />} />
            <Route path='/FlightInfo' element={<FlightInfo />} />
            <Route path='/CrewInfo' element={<CrewInfo />} />
            <Route path='/CrewPairing' element={<CrewPairing />} />
            <Route path='/CrewScheduling' element={<CrewScheduling />} />
          </Routes>
        </div>
        </Layout>
      </Router>
    </>
  );
}

export default App;