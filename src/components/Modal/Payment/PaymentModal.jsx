import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stepper,
    Step,
    StepLabel,
    MenuItem,
    Select,
    FormControl,
    TextField,
    InputLabel
} from '@mui/material';

import useUserData from '../../../hooks/useUserData';
import { getLocaltion } from '../../../actions/location.action';
import Cookies from 'js-cookie';

const cssString = `
.success-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%; /* Chiếm toàn bộ chiều rộng của modal */
}

.success-animation {
    width: 400px; /* Kích thước ban đầu */
    margin: 35px auto; /* Căn giữa */
}

/* Sử dụng media queries để điều chỉnh kích thước khi màn hình thu nhỏ */
@media screen and (max-width: 600px) {
    .success-animation {
        width: 80%; /* Kích thước mới khi màn hình thu nhỏ */
    }
}
.checkmark {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #4bb71b;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #4bb71b;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    position:relative;
    top: 5px;
    right: 5px;
   margin: 0 auto;
}
.checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #4bb71b;
    fill: #fff;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
 
}

.checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
    100% {
        stroke-dashoffset: 0;
    }
}

@keyframes scale {
    0%, 100% {
        transform: none;
    }

    50% {
        transform: scale3d(1.1, 1.1, 1);
    }
}

@keyframes fill {
    100% {
        box-shadow: inset 0px 0px 0px 30px #4bb71b;
    }
}
:root {
	--delay: 0;
	--duration: 800ms;
	--iterations: 1;
}
/* •·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•·•· */


.reveal-text,
.reveal-text::after {
	animation-delay: var(--animation-delay, 2s);
	animation-iteration-count: var(--iterations, 1);
	animation-duration: var(--duration, 800ms);
	animation-fill-mode: both;
	animation-timing-function: cubic-bezier(0.0, 0.0, 0.2, 1);
}

.reveal-text {
	--animation-delay: var(--delay, 0);
	--animation-duration: var(--duration, 800ms);
	--animation-iterations: var(--iterations, 1);
	position: relative;
	font-size: 30px;
	animation-name: clip-text;
	color: #FFF;
	white-space: nowrap;
	cursor: default;
	
	&::after {
		content: "";
		position: absolute;
		z-index: 999;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #f2f98b;
		transform: scaleX(0);
		transform-origin: 0 50%;
		pointer-events: none;
		animation-name: text-revealer;
	}
	
}


@keyframes clip-text {
	from {
		clip-path: inset(0 100% 0 0);
	}
	to {
		clip-path: inset(0 0 0 0);
	}
}


@keyframes text-revealer {
	
	0%, 50% {
		transform-origin: 0 50%;
	}
	
	60%, 100% {
		transform-origin: 100% 50%;		
	}

	
	60% {
		transform: scaleX(1);
	}
	
	100% {
		transform: scaleX(0);
	}
}`

const steps = ['Customer Information', 'Delivery Address'];

const PaymentModal = ({ isOpen, onClose, totalPrice, voucherCode }) => {
    const dispatch = useDispatch();
    const userData = useUserData();

    const [activeStep, setActiveStep] = useState(0);

    const cities = useSelector(state => state?.locationReducer?.cities);

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    useEffect(() => {
        dispatch(getLocaltion());
    }, [dispatch]);

    const [customerInfo, setCustomerInfo] = useState({
        fullName: userData.firstName && userData.lastName ? userData.firstName + ' ' + userData.lastName : '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
    });

    const [deliveryAddress, setDeliveryAddress] = useState({
        address: userData.address || '',
        city: cities.find(city => city.Name === userData.city) ? userData.city : "",
        district: cities.find(city => city.Name === userData.city)?.Districts.find(district => district.Name === userData.district) ? userData.district : "",
        ward: cities.find(city => city.Name === userData.city)?.Districts.find(district => district.Name === userData.district)?.Wards.find(ward => ward.Name === userData.ward) ? userData.ward : "",
        message: '',
    });

    useEffect(() => {
        setCustomerInfo({
            fullName: userData.firstName && userData.lastName ? userData.firstName + ' ' + userData.lastName : '',
            email: userData.email || '',
            phone: userData.phoneNumber || '',
        });
        setDeliveryAddress({
            address: userData.address || '',
            city: userData.city || '',
            district: userData.district || '',
            ward: userData.ward || '',
            message: ''
        });
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({
            ...customerInfo,
            [name]: value,
        });
    };

    const handleDeliveryInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryAddress({
            ...deliveryAddress,
            [name]: value,
        });
    }

    const validateEmail = (email) => {
        const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return re.test(String(email).toLowerCase());
    }

    const validatePhoneNumber = (phoneNumber) => {
        const re = /^(\+84|0)\d{9,12}$/;
        return re.test(phoneNumber);
    }

    // back button
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    // next/finish button
    const handleButtonClick = () => {
        if (activeStep === steps.length - 1) {
            handleFinish();
        } else {
            handleNext();
        }
    }

    // next button
    const handleNext = () => {
        if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
            toast.error('Please fill in all personal information fields.', { autoClose: 3000, theme: "dark" });
            return;
        }

        if (!validateEmail(customerInfo.email)) {
            toast.error('Email is not valid. Please check again', { autoClose: 3000, theme: "dark" });
            return;
        }

        if (!validatePhoneNumber(customerInfo.phone)) {
            toast.error('Phone number is not valid. Please check again', { autoClose: 3000, theme: "dark" });
            return;
        }

        // Nếu tất cả thông tin đã được kiểm tra và hợp lệ, tiếp tục đến bước tiếp theo
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    const handleFinish = async () => {
        if (!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.district || !deliveryAddress.ward) {
            toast.error('Please fill in complete address information.', { autoClose: 3000, theme: "dark" });
            return;
        }

        const isLogged = Cookies.get('isLogged');
        const userId = Cookies.get('_id');


        if (isLogged === 'true' && userId) {
            // The user is logged in, create a customer for the user
            const response = await fetch(`${gBASE_URL}/users/${userId}/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: customerInfo.fullName,
                    email: customerInfo.email,
                    phone: customerInfo.phone,
                    district: deliveryAddress.district,
                    city: deliveryAddress.city,
                    ward: deliveryAddress.ward,
                    address: deliveryAddress.address,
                }),
            });

            if (response.ok) {
                // Sau khi gửi thành công thông tin khách hàng, tạo đơn hàng
                const customerData = await response.json();
                const orderData = {
                    cost: totalPrice,
                    note: deliveryAddress.message,
                    voucherCode: voucherCode,
                };

                // Gọi API để tạo đơn hàng cho khách hàng
                const orderResponse = await fetch(`${gBASE_URL}/order/${customerData.data._id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (orderResponse.ok) {
                    // Get order data
                    orderResponse.json().then(async orderData => {
                        const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];

                        let allOrderDetailsCreated = true;
                        // Loop through stored items in the cart
                        for (const item of storedItems) {
                            try {
                                const orderDetailResponse = await fetch(`${gBASE_URL}/order/${orderData.data._id}/orderDetail`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        product: item._id,
                                        quantity: item.quantity,
                                    }),
                                });

                                if (!orderDetailResponse.ok) {
                                    // Handle error when creating order detail
                                    toast.error('An error occurred while creating the order details.', { autoClose: 3000, theme: "dark" });
                                    allOrderDetailsCreated = false;
                                    break;
                                }
                            } catch (error) {
                                allOrderDetailsCreated = false;
                                break;
                            }
                        }
                        if (allOrderDetailsCreated) {
                            setActiveStep(steps.length); // Move to the last step
                            localStorage.removeItem('cartItems');
                            localStorage.removeItem('cartUpdated');
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                        }
                        // After all order details are created, show success message
                        // toast.success('The order has been created successfully.', { autoClose: 3000, theme: "dark" });
                    });
                }
                else {
                    // Xử lý lỗi khi tạo đơn hàng
                    toast.error('An error occurred while creating an order.', { autoClose: 3000, theme: "dark" });
                }
            } else if (response.status === 409) {
                // Xử lý trường hợp xung đột: Thông tin khách hàng đã có sẵn, nhưng cần tạo đơn hàng
                toast.success('Customer information is available, please wait for us to add your order', { autoClose: 2500, theme: "dark" });

                // Lấy thông tin khách hàng hiện có
                const queryParams = [];
                if (response.message && response.message.includes('Email')) {
                    queryParams.push(`email=${customerInfo.email}`);
                } else if (response.message && response.message.includes('Phone number')) {
                    queryParams.push(`phonenumber=${customerInfo.phoneNumber}`);
                } else {
                    queryParams.push(`email=${customerInfo.email}`, `phonenumber=${customerInfo.phoneNumber}`);
                }

                const queryString = queryParams.join('&');

                fetch(`${gBASE_URL}/customers?${queryString}`)
                    .then(async responseGetCustomer => {
                        if (responseGetCustomer.ok) {
                            const customerData = await responseGetCustomer.json();
                            const customerId = customerData.data._id;

                            // Tạo đơn hàng cho khách hàng hiện có
                            fetch(`${gBASE_URL}/order/${customerId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    note: deliveryAddress.message,
                                    cost: totalPrice,
                                    voucherCode: voucherCode,
                                })
                            })
                                .then(async responseOrder => {
                                    if (responseOrder.ok) {
                                        const orderData = await responseOrder.json();
                                        const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];

                                        // Tạo chi tiết đơn hàng cho đơn hàng của khách hàng hiện có
                                        for (const item of storedItems) {
                                            fetch(`${gBASE_URL}/order/${orderData.data._id}/orderDetail`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    product: item._id,
                                                    quantity: item.quantity
                                                })
                                            })
                                                .then(orderDetailResponse => {
                                                    if (orderDetailResponse.ok) {
                                                        // Chi tiết đơn hàng được tạo thành công
                                                        const allOrderDetailsCreated = true; // Giả định tất cả các chi tiết đơn hàng đều được tạo thành công

                                                        if (allOrderDetailsCreated) {
                                                            setActiveStep(steps.length);
                                                            localStorage.removeItem('cartItems');
                                                            localStorage.removeItem('cartUpdated');
                                                            setTimeout(() => {
                                                                window.location.reload();
                                                            }, 3000);
                                                        } else {
                                                            // Not all order details created successfully
                                                            toast.error('Some order details failed to create', { autoClose: 3000, theme: "dark" });
                                                        }
                                                    } else {
                                                        toast.error('An error occurred while creating order detail', { autoClose: 3000, theme: "dark" });
                                                    }
                                                })
                                                .catch(error => {
                                                    toast.error('An error occurred while creating order detail', { autoClose: 3000, theme: "dark" });
                                                });
                                        }
                                    } else {
                                        toast.error('Failed to create order for existing customer', { autoClose: 3000, theme: "dark" });
                                    }
                                })
                                .catch(error => {
                                    toast.error('An error occurred while creating order for existing customer', { autoClose: 3000, theme: "dark" });
                                });
                        } else {
                            toast.error('Failed to retrieve existing customer information', { autoClose: 3000, theme: "dark" });
                        }
                    })
                    .catch(error => {
                        toast.error('An error occurred while retrieving existing customer information', { autoClose: 3000, theme: "dark" });
                    });
            } else if (response.status === 404) {
                // Xử lý trường hợp không tìm thấy: Email không tồn tại
                toast.error('Email does not exist.', { autoClose: 3000, theme: "dark" });
            } else {
                // Xử lý lỗi khi tạo khách hàng
                toast.error('An error occurred while creating the customer.', { autoClose: 3000, theme: "dark" });
            }
        }


        // Gọi API để tạo khách hàng
        else {
            // The user is not logged in, create a customer as usual
            const response = await fetch(`${gBASE_URL}/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: customerInfo.fullName,
                    email: customerInfo.email,
                    phone: customerInfo.phone,
                    district: deliveryAddress.district,
                    city: deliveryAddress.city,
                    ward: deliveryAddress.ward,
                    address: deliveryAddress.address,
                }),
            });

            if (response.ok) {
                // Sau khi gửi thành công thông tin khách hàng, tạo đơn hàng
                const customerData = await response.json();
                const orderData = {
                    cost: totalPrice,
                    note: deliveryAddress.message,
                    voucherCode: voucherCode,
                };

                // Gọi API để tạo đơn hàng cho khách hàng
                const orderResponse = await fetch(`${gBASE_URL}/order/${customerData.data._id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (orderResponse.ok) {
                    // Get order data
                    orderResponse.json().then(async orderData => {
                        const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];

                        let allOrderDetailsCreated = true;
                        // Loop through stored items in the cart
                        for (const item of storedItems) {
                            try {
                                const orderDetailResponse = await fetch(`${gBASE_URL}/order/${orderData.data._id}/orderDetail`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        product: item._id,
                                        quantity: item.quantity,
                                    }),
                                });

                                if (!orderDetailResponse.ok) {
                                    // Handle error when creating order detail
                                    toast.error('An error occurred while creating the order details.', { autoClose: 3000, theme: "dark" });
                                    allOrderDetailsCreated = false;
                                    break;
                                }
                            } catch (error) {
                                allOrderDetailsCreated = false;
                                break;
                            }
                        }
                        if (allOrderDetailsCreated) {
                            setActiveStep(steps.length); // Move to the last step
                            localStorage.removeItem('cartItems');
                            localStorage.removeItem('cartUpdated');
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                        }
                        // After all order details are created, show success message
                        // toast.success('The order has been created successfully.', { autoClose: 3000, theme: "dark" });
                    });
                }
                else {
                    // Xử lý lỗi khi tạo đơn hàng
                    toast.error('An error occurred while creating an order.', { autoClose: 3000, theme: "dark" });
                }
            } else if (response.status === 409) {
                // Xử lý trường hợp xung đột: Thông tin khách hàng đã có sẵn, nhưng cần tạo đơn hàng
                toast.success('Customer information is available, please wait for us to add your order', { autoClose: 3000, theme: "dark" });

                // Lấy thông tin khách hàng hiện có
                const queryParams = [];
                if (response.message && response.message.includes('Email')) {
                    queryParams.push(`email=${customerInfo.email}`);
                } else if (response.message && response.message.includes('Phone number')) {
                    queryParams.push(`phonenumber=${customerInfo.phoneNumber}`);
                } else {
                    queryParams.push(`email=${customerInfo.email}`, `phonenumber=${customerInfo.phoneNumber}`);
                }

                const queryString = queryParams.join('&');

                fetch(`${gBASE_URL}/customers?${queryString}`)
                    .then(async responseGetCustomer => {
                        if (responseGetCustomer.ok) {
                            const customerData = await responseGetCustomer.json();
                            const customerId = customerData.data._id;

                            // Tạo đơn hàng cho khách hàng hiện có
                            fetch(`${gBASE_URL}/order/${customerId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    note: deliveryAddress.message,
                                    cost: totalPrice,
                                    voucherCode: voucherCode,
                                })
                            })
                                .then(async responseOrder => {
                                    if (responseOrder.ok) {
                                        const orderData = await responseOrder.json();
                                        const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];

                                        // Tạo chi tiết đơn hàng cho đơn hàng của khách hàng hiện có
                                        for (const item of storedItems) {
                                            fetch(`${gBASE_URL}/order/${orderData.data._id}/orderDetail`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    product: item._id,
                                                    quantity: item.quantity
                                                })
                                            })
                                                .then(orderDetailResponse => {
                                                    if (orderDetailResponse.ok) {
                                                        // Chi tiết đơn hàng được tạo thành công
                                                        const allOrderDetailsCreated = true; // Giả định tất cả các chi tiết đơn hàng đều được tạo thành công

                                                        if (allOrderDetailsCreated) {
                                                            setActiveStep(steps.length);
                                                            localStorage.removeItem('cartItems');
                                                            localStorage.removeItem('cartUpdated');
                                                            setTimeout(() => {
                                                                window.location.reload();
                                                            }, 3000);
                                                        } else {
                                                            // Not all order details created successfully
                                                            toast.error('Some order details failed to create', { autoClose: 3000, theme: "dark" });
                                                        }
                                                    } else {
                                                        toast.error('An error occurred while creating order detail', { autoClose: 3000, theme: "dark" });
                                                    }
                                                })
                                                .catch(error => {
                                                    toast.error('An error occurred while creating order detail', { autoClose: 3000, theme: "dark" });
                                                });
                                        }
                                    } else {
                                        toast.error('Failed to create order for existing customer', { autoClose: 3000, theme: "dark" });
                                    }
                                })
                                .catch(error => {
                                    toast.error('An error occurred while creating order for existing customer', { autoClose: 3000, theme: "dark" });
                                });
                        } else {
                            toast.error('Failed to retrieve existing customer information', { autoClose: 3000, theme: "dark" });
                        }
                    })
                    .catch(error => {
                        toast.error('An error occurred while retrieving existing customer information', { autoClose: 3000, theme: "dark" });
                    });
            } else if (response.status === 404) {
                // Xử lý trường hợp không tìm thấy: Email không tồn tại
                toast.error('Email does not exist.', { autoClose: 3000, theme: "dark" });
            } else {
                // Xử lý lỗi khi tạo khách hàng
                toast.error('An error occurred while creating the customer.', { autoClose: 3000, theme: "dark" });
            }
        }
    }


    return (
        <Dialog open={isOpen} onClose={onClose}>
            {activeStep === steps.length ? (
                <div className='success-container'>
                    <style>{cssString}</style>
                    <div className="success-animation">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx={26} cy={26} r={25} fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
                    </div>
                    <div className="text-success reveal-text text-center font-medium">
                        <p>Success!</p>
                    </div>
                    <div style={{ fontSize: "18px", color: "black", fontWeight: "400", marginTop: "15px", marginBottom: "30px" }} className="reveal-text text-center">
                        <p>Create new order successfully! <br />Please check your Email</p>
                    </div>
                </div>
            ) : (
                <>
                    <DialogTitle>{steps[activeStep]}</DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <div>
                            {activeStep === 0 && (
                                <div>
                                    <TextField
                                        name="fullName"
                                        label="Full Name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        value={customerInfo.fullName}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        value={customerInfo.email}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        name="phone"
                                        label="Phone Number"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        value={customerInfo.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}
                            {activeStep === 1 && (
                                <div>
                                    <TextField
                                        name="address"
                                        label="Address"
                                        variant="outlined"
                                        value={deliveryAddress.address}
                                        onChange={handleDeliveryInputChange}
                                        fullWidth
                                        margin="normal"
                                        required
                                    />
                                    <FormControl sx={{ mt: "10px" }} fullWidth>
                                        <InputLabel id="city-label">City</InputLabel>
                                        <Select
                                            labelId="city-label"
                                            name="city"
                                            label="City"
                                            value={deliveryAddress.city}
                                            onChange={handleDeliveryInputChange}
                                        >
                                            <MenuItem value="" disabled>Please choose a City</MenuItem>
                                            {cities.map(city => (
                                                <MenuItem key={city.Id} value={city.Name}>{city.Name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ mt: "10px" }} fullWidth>
                                        <InputLabel id="district-label">District</InputLabel>
                                        <Select
                                            labelId="district-label"
                                            name="district"
                                            label="District"
                                            value={deliveryAddress.district}
                                            onChange={handleDeliveryInputChange}
                                        >
                                            <MenuItem value="" disabled>Please choose a District</MenuItem>
                                            {cities.find(city => city.Name === deliveryAddress.city)?.Districts.map(district => (
                                                <MenuItem key={district.Id} value={district.Name}>{district.Name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ mt: "10px" }} fullWidth>
                                        <InputLabel id="ward-label">Ward</InputLabel>
                                        <Select
                                            labelId="ward-label"
                                            name="ward"
                                            label="Ward"
                                            value={deliveryAddress.ward}
                                            onChange={handleDeliveryInputChange}
                                        >
                                            <MenuItem value="" disabled>Please choose a Ward</MenuItem>
                                            {cities.find(city => city.Name === deliveryAddress.city)?.Districts.find(district => district.Name === deliveryAddress.district)?.Wards.map(ward => (
                                                <MenuItem key={ward.Id} value={ward.Name}>{ward.Name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        name="message"
                                        label="Message"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={deliveryAddress.message}
                                        onChange={handleDeliveryInputChange}
                                    />
                                </div>
                            )}
                            <Button disabled={activeStep === 0} onClick={handleBack}>
                                Back
                            </Button>
                            <Button onClick={handleButtonClick}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>

                        </div>
                    </DialogContent>
                </>
            )}
            {/* <DialogActions>
                {activeStep === steps.length ? ( // Check if it's the last step
                    <Button>Close</Button> // Only show the Close button
                ) : (
                    <Button>Cancel</Button> // Show Cancel button for other steps
                )}
            </DialogActions> */}
            {/* 
            <ToastContainer /> */}
        </Dialog>
    );
};

export default PaymentModal;
