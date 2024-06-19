import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { ToastContainer, toast } from 'react-toastify';

import notFoundOrder from '../assets/images/website/not-found-order.png'
import Cursor from '../components/Cursor/cursor'
import Breadcrumb from '../components/BreadCrumb/breadCrumb'
import NavbarSection from '../components/navbar/navbar'
import { Footer } from '../components/Footer/footer'


export const CheckOrder = () => {

    const [inputOrder, setInputOrder] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [isError, setIsError] = useState(false);

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    const breadcrumbItems = [
        { name: "Home", url: "/" },
        { name: "Check Order", url: "/check-order" }
    ];

    const submitButton = async () => {
        try {
            if (!inputOrder) {
                toast.warning("Please enter Order ID", { autoClose: 3000, theme: "dark" });
                return;
            }
            const response = await fetch(`${gBASE_URL}/orders/${inputOrder}`);
            if (response.status === 200) {
                // xử lý
                const data = await response.json();
                setOrderData(data.data);
                setIsError(false);
            } else {
                // xử lý lỗi
                setIsError(true);
            }
            setTimeout(() => {
                setOrderData(null);
                setIsError(false);
            }, 60000);
        } catch (error) {
            // xử lí lỗi server
            setIsError(true);
        }
    }


    const cssString = `
    .cont{
        max-width: 80%;
        height: 250px;
        padding: 10px 25px;
        margin: 5vh auto;
        background: #fff;
        border-radius: 8px;
      }
      
      .form{ width: 100%; height: 100%; }
      
      .check-order-title, .input-order{ 
        text-align: center;
        display: block;
      }
      
      .check-order-title{ 
        color: black;
        font-weight: bold;
        font-size: 20px;
        margin: 30px auto;
      }
      
      .input-order {
        text-align: center;
        width: 50%;
        height: 45px;
        border: none;
        border-radius: 5px;
        margin: auto;
        font-weight: lighter;
        margin-bottom: 30px;
      }

      .input-order { background: #ecf0f1; }

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
          &:hover {
            background-color: #a749ff;
            color: #fff;
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
                        <p className='check-order-title'>LOOK UP ORDER INFORMATION</p>
                        <input type="text" className="input-order" placeholder="Enter order code" value={inputOrder} onChange={(e) => setInputOrder(e.target.value)} />
                        <div className="button-box">
                            <button className="col-2" type="button" onClick={submitButton}>
                                <span>SEND</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {orderData || isError ? (
                <div className='check-order-container' style={{ backgroundColor: "#fff", maxWidth: "50%", padding: "10px 25px", margin: "5vh auto", borderRadius: "8px" }}>
                    {isError ? (
                        <div className='not-found-order d-flex justify-content-center flex-col items-center'>
                            <img src={notFoundOrder} style={{ width: "180px" }} alt="Empty Cart" />
                            <p style={{ color: "black", fontSize: "18px", fontWeight: "500", marginTop: "30px" }}>Order code is incorrect</p>
                            <p style={{ color: "black", fontSize: "16px", fontWeight: "300", marginTop: "10px" }}>We couldn't find your order number in the system. Please check your order code again</p>
                        </div>
                    ) : (
                        <div className='found-order block text-center'>
                            <p style={{ color: "black", fontSize: "25px", fontWeight: "500", marginTop: "20px" }}>Order Information</p>
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: "left", paddingLeft: "50px" }}><p>Order ID</p></td>
                                        <td style={{ textAlign: "right", paddingRight: "50px" }}><p>{orderData._id}</p></td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: "left", paddingLeft: "50px" }}><p>Order Date</p></td>
                                        <td style={{ textAlign: "right", paddingRight: "50px" }}><p>{new Date(orderData.orderDate).toLocaleString()}</p></td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: "left", paddingLeft: "50px" }}><p>Order Status</p></td>
                                        <td style={{ textAlign: "right", paddingRight: "50px" }}><p>{orderData.status}</p></td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: "left", paddingLeft: "50px" }}><p>Message</p></td>
                                        <td style={{ textAlign: "right", paddingRight: "50px" }}><p>{orderData.note}</p></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : null}
            <ToastContainer />
            <Cursor />
            <Footer />
        </>
    )
}
