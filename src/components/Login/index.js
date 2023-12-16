import Cookies from 'js-cookie'
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import './index.css'

const Login =()=> {
    const navigate = useNavigate()
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [result,setResult] = useState(true)
    const [errorMsg,setError] = useState("")
    
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return navigate("/")
    }

    const typeUsername = event => {
        setUsername(event.target.value)
    }

    const typePassword = event => {
        setPassword(event.target.value)
    }

    const submitForm = async event => {
        event.preventDefault()
        const bodyDetails = {username, password}

        const url = 'https://apis.ccbp.in/login'
        const options = {
            method: 'POST',
            body: JSON.stringify(bodyDetails),
        }
        const response = await fetch(url, options)
        const data = await response.json()

        if (response.ok === true) {
            const jwtToken = data.jwt_token
            Cookies.set('jwt_token', jwtToken, {expires: 30});
            return navigate("/")
        } else {
            const errorMsg = data.error_msg
            setResult(false);
            setError(errorMsg)
        }
    }

    return (
      <div className="login-bg-container">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-logo"
          />
          <form onSubmit={submitForm} className="form-container">
            <label htmlFor="username" className="login-input-label">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              className="login-input"
              placeholder="Username"
              value={username}
              onChange={typeUsername}
            />
            <label htmlFor="password" className="login-input-label">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={typePassword}
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {!result && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
}


export default Login
