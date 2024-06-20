import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.min.js';
import { ToastContainer, toast } from 'react-toastify';

import Cursor from '../components/Cursor/cursor'
import Breadcrumb from '../components/BreadCrumb/breadCrumb'
import NavbarSection from '../components/navbar/navbar'
import { Footer } from '../components/Footer/footer'


export const Contact = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    const breadcrumbItems = [
        { name: "Home", url: "/" },
        { name: "Create Contact", url: "/contact" }
    ];

    const validateEmail = (email) => {
        const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return re.test(String(email).toLowerCase());
    }

    const submitButton = async () => {
        try {
            if (!name || !email) {
                toast.warning("Please enter your Name and Email", { autoClose: 3000, theme: "dark" });
                return;
            }

            if (!validateEmail(email)) {
                toast.error('Email is not valid. Please check again', { autoClose: 3000, theme: "dark" });
                return;
            }

            const response = await fetch(`${gBASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });
            if (response.ok) {
                // xử lý
                toast.success("The support request has been sent, please check your email", { autoClose: 3000, theme: "dark" });
            } else {
                toast.warning("Failed to send request, please try again later", { autoClose: 3000, theme: "dark" });
            }
            setTimeout(() => {
                navigate('/')
            }, 3000);
        } catch (error) {
            // xử lí lỗi server
            toast.warning("Failed to send request, please try again later", { autoClose: 3000, theme: "dark" });
        }
    };

    const cssString = `
    .cont{
        max-width: 70%;
        height: auto;
        padding: 10px 10px;
        margin: 5vh auto;
        background: #fff;
        border-radius: 8px;
      }
      
      .form{ width: 100%; height: 100%; }
      
      .contact-title, .input-name, .input-email{ 
        text-align: center;
        display: block;
      }
      
      .contact-title{ 
        color: black;
        font-weight: bold;
        font-size: 20px;
        margin: 30px auto;
      }
      
      .input-name, .input-email {
        text-align: center;
        width: 85%;
        height: 45px;
        border: none;
        border-radius: 5px;
        margin: auto;
        font-weight: lighter;
        margin-bottom: 30px;
      }

      .input-name, .input-email { background: #ecf0f1; }
      .button-box {
        display: flex;
        justify-content: center;
        button {
          background-color: #c7c7c7;
          border: medium none;
          color: #333;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          line-height: 1;
          padding: 11px 30px;
          text-transform: uppercase;
          transition: all 0.3s ease 0s;
          max-width: 200px; /* chiều rộng tối đa là 200px */
          width: 50%;
          &:hover {
            background-color: #a749ff;
            color: #fff;
          }
        }
      }
    }
    `

    return (
        <>
            <NavbarSection />
            <Breadcrumb items={breadcrumbItems} />
            <style>{cssString}</style>
            <div className="cont">
                <div className="form">
                    <form>
                        <p className='contact-title'>CONTACT US</p>
                        <input type="text" className="input-name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="text" className="input-email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <div className="button-box">
                            <button type="button" onClick={submitButton}>
                                <span>SEND</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
            {/* <Cursor /> */}
            <Footer />
        </>
    )
}
