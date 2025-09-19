import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const [show, setShow] = useState(false);

  const transitionNavbar = () => {
    if(window.scrollY > 100){
      setShow(true);
    } else{
      setShow(false);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", transitionNavbar);
    return () => {
      window.removeEventListener("scroll", transitionNavbar);
    };
  }, []);

  return (
    <div>
        <div className={`navbar ${show ? "nav_show" : ""}`}>
          <div className='nav_contents'>
                <div className='navs'>
                    <ul>
                        <li> <Link to= "/" 
                              className={location.pathname === "/" ? "active" : ""}>
                              Home</Link></li>
                        <li> <Link to= "/Hostels"
                              className={location.pathname === "/Hostels" ? "active" : ""}>
                              Hostels</Link></li>
                        <li> <Link to= "/Bookings"
                              className={location.pathname === "/Bookings" ? "active" : ""}>
                              Bookings</Link></li>
                        <li> <Link to= "/ContactUs"
                              className={location.pathname === "/ContactUs" ? "active" : ""}>
                                Contact Us</Link></li>
                    </ul>
                </div>
                <div className='nav_login'>
                    <h2><Link to="/Login">Login</Link></h2>
                    <button><Link to="/Register" className='register-btn'>Register</Link></button>
                </div>
          </div>
            
        </div>

    </div>
  )
}

export default Navbar
