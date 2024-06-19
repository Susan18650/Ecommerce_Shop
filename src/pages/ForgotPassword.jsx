import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cursor from '../components/Cursor/cursor';

import '../styles/pages/scss/_forgot-password.scss'


const ForgotPassword = () => {

    const [email, setEmail] = useState('');

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    const handleForgotPassword = async () => {
        try {
            if (!email) {
                toast.warning("Please enter your Email",  { autoClose: 3000, theme: "dark" });
                return;
            }
    
            const response = await fetch(`${gBASE_URL}/auth/forgot-password`,  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                toast.success("Password reset link has been sent to your Email",  { autoClose: 3000, theme: "dark" });
            } else if (response.status === 429) {
                toast.warning("Exceeded number of password reset requests for today",  { autoClose: 3000, theme: "dark" });
            } else {
                toast.warning("Email does not exist or was entered incorrectly",  { autoClose: 3000, theme: "dark" });
            }
        } catch (error) {
            // xử lí sau
        }
    };
    
    return (
        <div className="forgot-password-area pt-100 pb-100">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-12 ms-auto me-auto">
                        <div className="forgot-password-wrapper">
                            <div className="forgot-password-container">
                                <p>Forgot Your Password</p>
                                <div className='des'>Enter your email and we'll send you instructions on how to change your password.</div>
                                <div className="forgot-password-form">
                                    <form>
                                        <input
                                            type="text"
                                            name="email"
                                            placeholder="Your account Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <div className="button-box">
                                            <button className="col-12" type="button" onClick={handleForgotPassword}>
                                                <span>Request password reset</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div>Go back to <Link to="/login-register" className='go-back'>Login page</Link></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
            <Cursor/>
        </div>
    )
}

export default ForgotPassword