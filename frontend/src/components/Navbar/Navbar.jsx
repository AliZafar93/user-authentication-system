import "./Navbar.css";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import piaLogo from "../../assets/pia-logo.png";

const Navbar = () => {

  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [crewOpen, setCrewOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!adminPanelOpen && !modulesOpen && !crewOpen && !reportsOpen) return;
    
    const handleClick = (e) => {
      if (!e.target.closest(".dropdown")) {
        setAdminPanelOpen(false);
        setModulesOpen(false);
        setCrewOpen(false);
        setReportsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [adminPanelOpen, modulesOpen, crewOpen, reportsOpen])
  
  const DropdownItem = ({ children, onClick }) => {
    return (
      <div
      onClick={onClick}
      className="dropdown-item"
      >
        {children}
      </div>
    );
  }
  
  const handleNavigate = (path) => {
    navigate(path);
    setAdminPanelOpen(false);
    setModulesOpen(false);
    setCrewOpen(false);
    setReportsOpen(false);
  };

  return (
    <nav className='navbar'>
      <ul className="nav-links">
        <li>
          <Link
            to="/Home"
            className='logo'
          >
            <img src={piaLogo} alt="PIA-Logo" />
          </Link>
        </li>
        <li>
          <Link
            to="/Home"
            className='link-style'
            onMouseOver={(e) => (e.target.style.backgroundColor = '#e6f0ec')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'unset')}
          >
            Home
          </Link>
        </li>
        <li className="dropdown">
          <button
            className='link-style'
            onClick={() => {
              setAdminPanelOpen((open) => !open);
              setModulesOpen(false);
              setCrewOpen(false);
              setReportsOpen(false);
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#e6f0ec')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'unset')}
          >
            Admin Panel &#9662;
          </button>
          { adminPanelOpen && (
            <div className="dropdown-menu">
              <DropdownItem onClick={() => handleNavigate("/LoginPage")}>Login Page</DropdownItem>
              <DropdownItem onClick={() => handleNavigate("/SignupPage")}>Signup Page</DropdownItem>              
            </div>
          )}
        </li>
        <li className="dropdown">
          <button
            className='link-style dropdown'
            onClick={() => {
              setModulesOpen((open) => !open);
              setAdminPanelOpen(false);
              setCrewOpen(false);
              setReportsOpen(false);
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#e6f0ec')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'unset')}
          >
            Modules &#9662;
          </button>
          { modulesOpen && (
            <div className="dropdown-menu">
              <DropdownItem onClick={() => handleNavigate("/FlightInfo")}>Upload/View Flights Schedule</DropdownItem>
              <DropdownItem onClick={() => handleNavigate("/routes")}>View Routes (Graphical_Pairing)</DropdownItem>
              <DropdownItem onClick={() => handleNavigate("/schedule-changes")}>Flight Schedule Changes</DropdownItem>
              <DropdownItem onClick={() => handleNavigate("/crew-assignment")}>Crew Assignment</DropdownItem>
              <DropdownItem onClick={() => handleNavigate("/crewSchedule")}>View Crew Schedules</DropdownItem>
              <DropdownItem onClick={() => handleNavigate("/crew-rules")}>Crew Rules Management</DropdownItem>
            </div>
          )}
        </li>
        <li className="dropdown">
          <button
            className='link-style dropdown'
            onClick={() => {
              setCrewOpen((open) => !open);
              setAdminPanelOpen(false);
              setModulesOpen(false);
              setReportsOpen(false);
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#e6f0ec')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'unset')}
          >
            Crew &#9662;
          </button>
          { crewOpen && (
            <div className="dropdown-menu">
              <DropdownItem onClick={() => handleNavigate("/CrewInfo")}>Crew Information</DropdownItem>
              <DropdownItem onClick={() => handleNavigate("/CrewPairing")}>Crew Pairing</DropdownItem>
              <DropdownItem onClick={() => handleNavigate("/CrewScheduling")}>Crew Scheduling</DropdownItem>
            </div>
          )}
        </li>
        <li className="dropdown">
          <button
            className='link-style dropdown'
            onClick={() => {
              setReportsOpen((open) => !open);
              setAdminPanelOpen(false);
              setModulesOpen(false);
              setCrewOpen(false);
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#e6f0ec')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'unset')}
          >
            Reports &#9662;            
          </button>
          { reportsOpen && (
            <div className="dropdown-menu">
              <DropdownItem onClick={() => handleNavigate("/flight-reports")}>Flight Reports</DropdownItem>
              <DropdownItem onClick={() => handleNavigate("/crew-reports")}>Crew Reports</DropdownItem>
            </div>
          )}
        </li>
        <li>
          <Link
            to="/Analytics"
            className='link-style'
            onMouseOver={(e) => (e.target.style.backgroundColor = '#e6f0ec')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'unset')}
          >
            Analytics
          </Link>
        </li>
      </ul>

      <div className="logout-btn">
        <button onClick={() => handleNavigate("/LoginPage")}>Log Out</button>
      </div>
    </nav>
  );
}

export default Navbar;


// Working
{/* <button
          className='link-style dropdown-btn dropdown'
          onClick={() => {
            setCrewOpen((open) => !open);
            setAdminPanelOpen(false);
            setModulesOpen(false);
            setReportsOpen(false);
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#e6f0ec')}
          onMouseOut={(e) => (e.target.style.backgroundColor = 'unset')}
        >
          Crew &#9662;
          { crewOpen && (
            <div className="dropdown-menu">
              <DropdownItem onClick={() => handleNavigate("/CrewInfo")}>Crew Information</DropdownItem>
              <DropdownItem onClick={() => handleNavigate("/CrewPairing")}>Crew Pairing</DropdownItem>
              <DropdownItem onClick={() => handleNavigate("/CrewScheduling")}>Crew Scheduling</DropdownItem>
            </div>
          )}
        </button> */}