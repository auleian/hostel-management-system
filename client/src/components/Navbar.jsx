import { Link } from 'react-router-dom';

function Navbar() {
    
  return (
    <div>
        <div className='nav_contents'>
          <div className='nav_elements'>
            <ul>
                <li> <link to= "/" className=''>Home</link></li>
                <li> <link to= "/Hostels" className=''>Hostels</link></li>
                <li> <Link to= "/Bookings" className=''>Bookings</Link></li>
                <li> <Link to= "/Contact" className=''>Contact</Link></li>      
            </ul>
          </div>
            <div className='nav_logo'>
              <h1><Link to="/Login">Login</Link></h1>
              <button><Link to="/Register" className=''>Register</Link></button>
            </div>

        </div>

      
    </div>
  )
}

export default Navbar
