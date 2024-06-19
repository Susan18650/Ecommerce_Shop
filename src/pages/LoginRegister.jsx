import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Cookies from 'js-cookie';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


import '../styles/pages/scss/_login-register.scss'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

import Cursor from '../components/Cursor/cursor';
import NavbarSection from '../components/navbar/navbar';
import { Footer } from '../components/Footer/footer';

const LoginRegister = () => {
    const navigate = useNavigate();
    const [activeKey, setActiveKey] = useState('login');
    const [isLogged, setIsLogged] = useState(false);

    // login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // register
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const gREQUEST_STATUS_OK = 200;
    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;
    const handleLogin = async () => {
        try {
            if (!username || !password) {
                toast.warning('Please enter both username and password.', { autoClose: 3000, theme: "dark" });
                return;
            }

            const response = await fetch(`${gBASE_URL}/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === gREQUEST_STATUS_OK) {
                const data = await response.json();
                const refreshToken = data.refreshToken;
                const accessToken = data.accessToken;
                const userId = data._id;
                Cookies.set('refreshToken', refreshToken, { expires: 1 });
                Cookies.set('accessToken', accessToken, { expires: 1 });
                Cookies.set('username', username, { expires: 1 })
                Cookies.set('_id', userId, { expires: 1 })

                setIsLogged(true);
                Cookies.set('isLogged', true, { expires: 1 });

                Swal.fire({
                    icon: "success",
                    timer: 2500,
                    title: "Login Successfully!",
                });
                setTimeout(() => {
                    navigate('/');
                }, 2500);
            } else {
                setIsLogged(false);
                Cookies.remove('isLogged');
                toast.warning('Login failed. Please check your credentials.', { autoClose: 3000, theme: "dark" });
            }
        } catch (error) {
            setIsLogged(false);
            Cookies.remove('isLogged');
        }
    };

    const handleRegister = async () => {
        if (!newUsername || !newEmail || !newPassword || !confirmPassword) {
            toast.warning('Please enter your information.', { autoClose: 3000, theme: "dark" });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.warning("Password and Confirm Password must match", { autoClose: 3000, theme: "dark" });
            return;
        }
        const data = {
            username: newUsername,
            email: newEmail,
            password: newPassword,
        };
        try {
            const response = await fetch(`${gBASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    icon: "success",
                    timer: 2500,
                    title: "Sign Up Successfully!",
                    text: "Please check your Email.",
                });
                setTimeout(() => {
                    setActiveKey('login');
                }, 2500);
            } else if (response.status === 400 && responseData.message === "Username existed") {
                Swal.fire({
                    icon: "error",
                    title: "Username already exists",
                    text: "Please choose another username.",
                });
            } else if (response.status === 409 && responseData.message === "Email already registered") {
                Swal.fire({
                    icon: "error",
                    timer: 2000,
                    title: "Email already exists",
                    text: "Email is registered with another account.",
                });
            } else if (response.status === 404) {
                Swal.fire({
                    icon: "error",
                    timer: 2000,
                    title: "Email already exists",
                    // text: "Email is registered with another account.",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Signup failed",
                    text: "Please try again.",
                });
            }
        } catch (error) {
            // console.error("Error during signup:", error);
            Swal.fire({
                icon: "error",
                title: "Signup failed",
                text: "Please try again.",
            });
        }
    }
    useEffect(() => {
        if (activeKey === 'login') {
            setNewUsername('');
            setNewEmail('');
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [activeKey]);

    return (
        <div>
            <NavbarSection />
            <div className="login-register-area pt-100 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 col-md-12 ms-auto me-auto">
                            <div className="login-register-wrapper">
                                <Tab.Container defaultActiveKey={activeKey} activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                                    <Nav variant="pills" className="login-register-tab-list">
                                        <Nav.Item>
                                            <Nav.Link eventKey="login">
                                                <h4>Login</h4>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="register">
                                                <h4>Register</h4>
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="login">
                                            <div className="login-form-container">
                                                <div className="login-register-form">
                                                    <form>
                                                        <div style={{ position: 'relative' }}>
                                                            <input
                                                                type="text"
                                                                name="user-name"
                                                                placeholder="Username"
                                                                value={username}
                                                                onChange={(e) => setUsername(e.target.value)}
                                                            />
                                                            <input
                                                                type={showPassword ? "text" : "password"}
                                                                style={{ paddingRight: '40px' }}
                                                                name="user-password"
                                                                placeholder="Password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                            />
                                                            <div
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                style={{
                                                                    color: "#788394",
                                                                    position: 'absolute',
                                                                    top: '57%',
                                                                    right: '10px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                            </div>
                                                        </div>
                                                        <div className="button-box">
                                                            <div className="login-toggle-btn">
                                                                <input type="checkbox" id='remember-me' />
                                                                <label htmlFor='remember-me' className="ml-2">Remember me</label>
                                                                <Link to="/forgot-password">
                                                                    Forgot Password?
                                                                </Link>
                                                            </div>
                                                            <button type="button" onClick={handleLogin}>
                                                                <span>Login</span>
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="register">
                                            <div className="login-form-container">
                                                <div className="login-register-form">
                                                    <form>
                                                        <input
                                                            type="text"
                                                            name="user-name"
                                                            placeholder="Username"
                                                            value={newUsername}
                                                            onChange={(e) => setNewUsername(e.target.value)}
                                                        />
                                                        <input
                                                            name="user-email"
                                                            placeholder="Email"
                                                            type="email"
                                                            value={newEmail}
                                                            onChange={(e) => setNewEmail(e.target.value)}
                                                        />
                                                        <div style={{ position: 'relative' }}>
                                                            <input
                                                                type={showNewPassword ? "text" : "password"}
                                                                style={{ paddingRight: '40px' }}
                                                                name="user-password"
                                                                placeholder="Password"
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                            />
                                                            <div
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                style={{
                                                                    color: "#788394",
                                                                    position: 'absolute',
                                                                    transform: 'translateY(-250%)',
                                                                    right: '10px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                            </div>
                                                            <input
                                                                type={showConfirmNewPassword ? "text" : "password"}
                                                                style={{ paddingRight: '40px' }}
                                                                name="confirm-password"
                                                                placeholder="Confirm Password"
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                            />
                                                            <div
                                                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                                                style={{
                                                                    color: "#788394",
                                                                    position: 'absolute',
                                                                    top: '57%',
                                                                    right: '10px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {showConfirmNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                            </div>
                                                        </div>
                                                        <div className="button-box">
                                                            <button onClick={handleRegister} type="button">
                                                                <span>Register</span>
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <Cursor />
            <Footer />
        </div>
    );
}

export default LoginRegister;
