import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import '../styles/pages/scss/_reset-password.scss'
import Cursor from '../components/Cursor/cursor';
import NavbarSection from '../components/navbar/navbar';
import { Footer } from '../components/Footer/footer';

export const ResetPassword = () => {
    const navigate = useNavigate()

    const { id, token } = useParams();

    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${gBASE_URL}/auth/reset-password/${id}/${token}`);
                if (!response.ok) {
                    navigate('/token-error');
                }
            } catch (error) {
                console.error(error);
                navigate('/token-error');
            }
        };

        verifyToken();
    }, [id, token, navigate]);

    const handleSubmit = async () => {
        try {
            if (!password || !confirmPassword) {
                toast.warning("Please enter your new password and confirm it", { autoClose: 3000, theme: "dark" });
                return;
            }

            if (password !== confirmPassword) {
                toast.warning("The new password and confirmation password do not match", { autoClose: 3000, theme: "dark" });
                return;
            }

            const response = await fetch(`${gBASE_URL}/auth/reset-password/${id}/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                toast.success("Your password has been reset successfully, navigate to login page now", { autoClose: 2500, theme: "dark" });
                setTimeout(() => {
                    navigate('/login-register');
                }, 2500);
            } else if (response.status === 410) {
                toast.warning("An error occurred while resetting your password or this link is expired", { autoClose: 3000, theme: "dark" });
            } else {
                toast.warning("An error occurred while resetting your password", { autoClose: 3000, theme: "dark" });
            }
        } catch (error) {
            toast.warning("An error occurred while resetting your password", { autoClose: 3000, theme: "dark" });
        }
    }

    return (
        <>
            <NavbarSection />
            <div className="reset-password-area pt-100 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 ms-auto me-auto">
                            <div className="reset-password-wrapper">
                                <div className="reset-password-container">
                                    <p>Reset Your Password</p>
                                    <div className="reset-password-form">
                                        <form>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    style={{ paddingRight: '40px' }}
                                                    name="password"
                                                    placeholder="Enter New Password"
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <div
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{
                                                        color: "#788394",
                                                        position: 'absolute',
                                                        top: '50%',
                                                        right: '10px',
                                                        transform: 'translateY(-110%)', 
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </div>
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    style={{ paddingRight: '40px' }}
                                                    name="password"
                                                    placeholder="Enter New Password"
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                                <div
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    style={{
                                                        color: "#788394",
                                                        position: 'absolute',
                                                        top: '50%',
                                                        right: '10px',
                                                        transform: 'translateY(-110%)', 
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </div>
                                            </div>
                                            <div className="button-box">
                                                <button className="col-12" type="button" onClick={handleSubmit}>
                                                    <span>Reset Password</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
                <ToastContainer />
                <Cursor />
            </div>
        </>
    )
}
