import {Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import {HiHome} from 'react-icons/hi'
import {BsBagFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = () => {
  const navigate = useNavigate();

  const removeToken = () => {
    Cookies.remove('jwt_token');
    return navigate("/login",{replace:true});
  }

  return (
    <div className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo-image"
        />
      </Link>

      <div className="lg-header-container">
        <ul className="header-list-container">
          <Link to="/" className="link">
            <li className="header-list-item">Home</li>
          </Link>
          <Link to="/Jobs" className="link">
            <li className="header-list-item">Jobs</li>
          </Link>
        </ul>
        <button
          type="button"
          onClick={removeToken}
          className="logout-lg-button"
        >
          Logout
        </button>
      </div>
      <ul className="sm-header-container">
        <li className="sm-header-list1">
          <Link to="/">
            <HiHome size={25} color="#ffffff" />
          </Link>
        </li>
        <li className="sm-header-list2">
          <Link to="/jobs">
            <BsBagFill size={25} color="#ffffff" />
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={removeToken}
            className="logout-sm-button"
          >
            <FiLogOut size={25} color="#ffffff" />
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Header
