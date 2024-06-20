import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, useTheme, Collapse } from '@mui/material';
import styled from '@emotion/styled';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import NavbarSection from "../components/navbar/navbar";
import { Footer } from "../components/Footer/footer";
import Cursor from "../components/Cursor/cursor";
import { getLocaltion } from "../actions/location.action";
import '../styles/pages/scss/_my-account.scss'
import { tokens } from "../theme"

import useUserData from "../hooks/useUserData";
import { CustomerOrderModal } from '../components/Modal/customerOrder/customerOrderModal';

const MyAccount = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { palette } = useTheme();

    const userData = useUserData();
    const [formData, setFormData] = useState({});

    const userId = Cookies.get('_id');
    const accessToken = Cookies.get('accessToken');

    // avatar part
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [oldImageId, setOldImageId] = useState(null);

    const [isLogged, setIsLogged] = useState(false);

    const [customerData, setCustomerData] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // order part
    const [selectedOrderDate, setSelectedOrderDate] = useState(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
    const [selectedOrderCost, setSelectedOrderCost] = useState(null);
    const [selectedOrderDiscount, setSelectedOrderDiscount] = useState(null);

    const [customerOrders, setCustomerOrders] = useState([]);
    const [isOrderContainerVisible, setIsOrderContainerVisible] = useState(false);

    const [orderModal, setOrderModal] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confirmNewPassword, setConfirmNewPassword] = useState();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getLocaltion());
    }, [dispatch]);

    const cities = useSelector(state => state.locationReducer.cities);

    // Lấy giá trị đăng nhập từ cookie khi component được mount
    useEffect(() => {
        const isLoggedFromCookie = Cookies.get('isLogged');
        setIsLogged(isLoggedFromCookie === 'true'); // Chuyển đổi từ chuỗi sang boolean
    }, []);

    // avatar load
    useEffect(() => {
        // Kiểm tra xem userData.avatarUrl có phải là ID hay không
        if (userData.avatarUrl && userData.avatarUrl.length === 24) {
            // Nếu phải, gọi API để lấy URL của ảnh
            fetch(`${gBASE_URL}/image/${userData.avatarUrl}`)
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    setAvatarUrl(url);
                    setOldImageId(userData.avatarUrl); // Lưu ID của ảnh cũ
                })
                .catch(error => console.error(error));
        } else {
            // Nếu không phải, chỉ cần sử dụng URL hiện tại
            setAvatarUrl(userData.avatarUrl);
        }
    }, [userData]);

    // get customer information
    useEffect(() => {
        if (userData?.customers?.length > 0) {
            Promise.all(userData?.customers?.map(id =>
                fetch(`${gBASE_URL}/customers/${id}`)
                    .then(response => response.json())
                    .then((data) => {
                        const customer = data.data;
                        const fullAddress = `${customer.address},\n${customer.ward},\n${customer.district},\n${customer.city}`;
                        return {
                            id: customer._id,
                            fullName: customer.fullName,
                            phone: customer.phone,
                            email: customer.email,
                            address: fullAddress
                        };
                    })
            ))
                .then(customerArray => setCustomerData(customerArray))
                .catch(error => console.error('Error fetching customer data:', error));
        }
    }, [userData.customers]);

    // get customer order
    const fetchCustomerOrders = (customerId) => {
        const selectedCustomer = customerData.find(customer => customer.id === customerId);
        setSelectedCustomer(selectedCustomer);
        fetch(`${gBASE_URL}/order/${customerId}`)
            .then(response => response.json())
            .then((data) => {
                return data.data.map(order => {
                    // Chuyển đổi ngày giờ từ ISO 8601 sang định dạng dễ đọc
                    const orderDate = new Date(order.orderDate).toLocaleString();
                    return {
                        id: order._id,
                        orderDate: orderDate,
                        voucher: order.voucher,
                        status: order.status,
                        cost: order.cost
                    };
                });
            })
            .then(orderArray => {
                setCustomerOrders(orderArray);
                setIsOrderContainerVisible(true); // Đặt ở đây
                setTimeout(() => {
                    setIsOrderContainerVisible(false);
                }, 60000);
            })
            .catch(error => console.error('Error fetching customer orders:', error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Check if the file size is more than 5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error('The file size should not exceed 5MB.', { autoClose: 3000, theme: "dark" });
            return;
        }
        const formData = new FormData();
        formData.append('image', file);

        axios.post(`${gBASE_URL}/upload`, formData)
            .then(response => {
                const imageId = response.data.data;
                setAvatarUrl(imageId);
                handleUpdateAvatar(imageId);
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    toast.error('An image with the same name and dimensions already exists!', { autoClose: 3000, theme: "dark" });
                } else {
                    console.error(error);
                }
            });
    };

    const handleUpdateAvatar = (imageId) => {
        const userId = Cookies.get("_id");
        const accessToken = Cookies.get("accessToken");

        axios.put(`${gBASE_URL}/user/${userId}`, { avatarUrl: imageId }, {
            headers: {
                "x-access-token": accessToken
            }
        })
            .then(response => {
                if (response.status === 200) {
                    toast.success('Avatar updated successfully', { autoClose: 2000, theme: "dark" });
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                    if (oldImageId) {
                        // Nếu có ảnh cũ, xóa nó
                        axios.delete(`${gBASE_URL}/image/${oldImageId}`, {
                            headers: {
                                "x-access-token": accessToken
                            }
                        })
                            .catch(error => console.error(error));
                    }
                } else {
                    throw new Error('Update failed');
                }
            })
            .catch(error => {
                toast.warning('Update failed. Please try again.', { autoClose: 3000, theme: "dark" });
            });
    };

    const handleSubmit = async () => {
        if (Object.keys(formData).length === 0) {
            // Nếu không có thông tin mới, hiển thị cảnh báo
            toast.error("Please enter new information before continuing", { autoClose: 3000, theme: "dark" });
            return;
        }
        try {
            const response = await fetch(`${gBASE_URL}/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success('Update Successfully', { autoClose: 3000, theme: "dark" });
                // Đặt lại formData với giá trị city, district, ward giữ nguyên
                setFormData({
                    city: formData.city,
                    district: formData.district,
                    ward: formData.ward,
                });
            } else {
                toast.warning('Update failed. Please try again.', { autoClose: 3000, theme: "dark" });
            }
        } catch (error) {

        }
    };

    // change password
    const changePassword = async () => {
        try {
            if (!oldPassword) {
                toast.warning("Please enter old password!", { autoClose: 3000, theme: "dark" });
                return;
            }

            if (!newPassword || !confirmNewPassword) {
                toast.warning("Please enter new password!", { autoClose: 3000, theme: "dark" });
                return;
            }

            if (newPassword !== confirmNewPassword) {
                toast.warning("The new password and confirmation password do not match!", { autoClose: 3000, theme: "dark" });
                return;
            }

            const id = Cookies.get('_id');
            const response = await fetch(`${gBASE_URL}/auth/change-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, newPassword, id }),
            });

            if (response.ok) {
                toast.success("Your password has been change successfully", { autoClose: 2500, theme: "dark" });
                setTimeout(() => {
                    window.location.reload();
                }, 2500);
            } else if (response.status === 401) {
                toast.warning("The old password you entered is incorrect", { autoClose: 3000, theme: "dark" });
            } else if (response.status === 409) {
                toast.warning("The new password must be different from the old password", { autoClose: 3000, theme: "dark" });
            } else {
                toast.warning("An error occurred while resetting your password", { autoClose: 3000, theme: "dark" });
            }
        } catch (error) {
            toast.warning("An error occurred while resetting your password", { autoClose: 3000, theme: "dark" });
        }
    }

    const customerColumns = [
        { field: "fullName", headerName: "Full Name", flex: 1 },
        { field: "phone", headerName: "Phone", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        {
            field: "action",
            headerName: "Action",
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <>
                        <Button
                            style={{ maxWidth: "35px", fontSize: "12px", maxHeight: "30px", backgroundColor: "#a749ff", color: "white" }}
                            onClick={() => fetchCustomerOrders(params.row.id)}
                        >
                            Details
                        </Button>
                    </>
                )
            }
        },
    ];

    const Small = styled("small")(({ bgcolor }) => ({
        height: 15,
        color: "#fff",
        padding: "2px 8px",
        borderRadius: "4px",
        background: bgcolor,
        boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
    }));

    const renderStatusCell = (params) => {
        const status = params.value;
        let statusText;
        let bgColor;
        switch (status) {
            case "pending":
                statusText = "Pending";
                bgColor = palette.warning.dark;
                break;
            case "processing":
                statusText = "Processing";
                bgColor = palette.info.main;
                break;
            case "cancelled":
                statusText = "Cancelled";
                bgColor = palette.error.main;
                break;
            case "completed":
                statusText = "Completed";
                bgColor = palette.secondary.main;
                break;
            default:
                statusText = "Unknown";
                bgColor = "#000000";
        }

        return <Small bgcolor={bgColor}>{statusText}</Small>;
    };

    const orderColumns = [
        { field: "orderDate", headerName: "Order Date", flex: 1 },
        { field: "status", headerName: "Status", flex: 1, renderCell: renderStatusCell },
        { field: "cost", headerName: "Cost ($)", flex: 1, renderCell: (params) => { return `$${params.value.toFixed(2)}`; } },
        {
            field: "action",
            headerName: "Action",
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <>
                        <Button
                            variant="contained"
                            color="error"
                            style={{ maxWidth: "35px", fontSize: "12px", maxHeight: "30px" }}
                            onClick={() => {
                                const selectedOrder = customerOrders.find(order => order.id === params.row.id);
                                setSelectedOrderDate(selectedOrder.orderDate);
                                setSelectedOrderStatus(selectedOrder.status);
                                setSelectedOrderCost(selectedOrder.cost);
                                setSelectedOrderDiscount(selectedOrder.voucher ? selectedOrder.voucher.discount : 0);
                                setOrderModal(true);
                                setOrderId(params.row.id);
                            }}
                        >
                            Details
                        </Button>
                    </>
                )
            }
        },
    ];

    const cssString = `
    .avatar-upload {
      position: relative;
      max-width: 205px;
      .avatar-edit {
          position: absolute;
          right: 12px;
          z-index: 1;
          top: 10px;
          input {
              display: none;
              + label {
                  display: inline-block;
                  width: 34px;
                  height: 34px;
                  margin-bottom: 0;
                  border-radius: 100%;
                  background: #FFFFFF;
                  border: 1px solid transparent;
                  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
                  cursor: pointer;
                  font-weight: normal;
                  transition: all .2s ease-in-out;
                  &:hover {
                      background: #f1f1f1;
                      border-color: #d6d6d6;
                  }
                  &:after {
                      content: "\f040";
                      font-family: 'FontAwesome';
                      color: #757575;
                      position: absolute;
                      top: 18px; /* default 10px */
                      left: 18px;
                      right: 0;
                      text-align: center;
                      margin: auto;
                  }
              }
          }
      }
      .avatar-preview {
          width: 192px;
          height: 192px;
          position: relative;
          border-radius: 100%;
          border: 6px solid orange;
          box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
          > div {
              width: 100%;
              height: 100%;
              border-radius: 100%;
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center;
          }
      }
  }`
    return (
        <Fragment>
            <NavbarSection />
            <div className="myaccount-area pb-80 pt-100">
                <div className="container">
                    <div className="row">
                        <div className="ms-auto me-auto col-lg-9">
                            <div className="myaccount-wrapper">
                                <Accordion defaultActiveKey="0">
                                    <Accordion.Item eventKey="0" className="single-my-account mb-20">
                                        <Accordion.Header className="panel-heading">
                                            <span>1 .</span> Your account information{" "}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {isLogged ? (
                                                <div className="myaccount-info-wrapper">
                                                    <div className="account-info-wrapper">
                                                        <h4>My Account Information</h4>
                                                        <h5>Your Personal Details</h5>
                                                    </div>
                                                    <div className="row">
                                                        <Box sx={{ gridColumn: "span 4" }} display="flex" justifyContent="center" alignItems="center">
                                                            <style>{cssString}</style>
                                                            <div className="avatar-upload">
                                                                <div className="avatar-edit">
                                                                    <input type='file' id="imageUpload" accept="image/*" onChange={handleFileChange} />
                                                                    <label htmlFor="imageUpload"></label>
                                                                </div>
                                                                <div className="avatar-preview">
                                                                    <div id="imagePreview" style={{ backgroundImage: `url(${avatarUrl})` }}>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Box>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="user-info">
                                                                <label>First Name</label>
                                                                <input type="text" name="firstName" defaultValue={userData.firstName} onChange={handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="user-info">
                                                                <label>Last Name</label>
                                                                <input type="text" name="lastName" defaultValue={userData.lastName} onChange={handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 col-md-12">
                                                            <div className="user-info">
                                                                <label>Email Address</label>
                                                                <input type="email" name="email" defaultValue={userData.email} disabled onChange={handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 col-md-12">
                                                            <div className="user-info">
                                                                <label>Your Address</label>
                                                                <input type="text" name="address" defaultValue={userData.address} onChange={handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 col-md-6">
                                                            <div className="user-info">
                                                                <label>Telephone</label>
                                                                <input type="text" name="phoneNumber" defaultValue={userData.phoneNumber} onChange={handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="user-info">
                                                                <label>City</label>
                                                                <select name="city" value={formData.city || userData.city || ''} onChange={handleChange}>
                                                                    <option value="" disabled>{userData.city ? userData.city : 'Please choose'}</option>
                                                                    {cities.map(city => (
                                                                        <option key={city.Id} value={city.Name}>{city.Name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="user-info">
                                                                <label>District</label>
                                                                <select name="district" value={formData.district || userData.district || ''} onChange={handleChange}>
                                                                    <option value="" disabled>{userData.district ? userData.district : 'Please choose'}</option>
                                                                    {cities.find(city => city.Name === formData.city)?.Districts.map(district => (
                                                                        <option key={district.Id} value={district.Name}>{district.Name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="user-info">
                                                                <label>Ward</label>
                                                                <select name="ward" value={formData.ward || userData.ward || ''} onChange={handleChange}>
                                                                    <option value="" disabled>{userData.ward ? userData.ward : 'Please choose'}</option>
                                                                    {cities.find(city => city.Name === formData.city)?.Districts.find(district => district.Name === formData.district)?.Wards.map(ward => (
                                                                        <option key={ward.Id} value={ward.Name}>{ward.Name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="user-info">
                                                                <label>Zipcode</label>
                                                                <input type="text" name="zipCode" defaultValue={userData.zipCode} onChange={handleChange} />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="submit-update-btn">
                                                        <div className="submit-btn">
                                                            <button type="button" onClick={handleSubmit}>Continue</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='d-flex justify-content-center' style={{ color: "#676767a7" }}>
                                                    <h6>You are not logged in. Login <span><Link to="/login-register" style={{ color: "rgb(238, 77, 45)", textDecoration: "none" }}>Now</Link></span>.</h6>
                                                </div>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1" className="single-my-account mb-20">
                                        <Accordion.Header className="panel-heading">
                                            <span>2 .</span> Your Order Information{" "}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {isLogged ? (
                                                <div className="myaccount-info-wrapper">
                                                    <div className="account-info-wrapper">
                                                        <h4>My Order Information</h4>
                                                        <h5>Your Order Details</h5>
                                                    </div>
                                                    {/* customer part  */}
                                                    <div className="row">
                                                        {userData?.customers.length > 0 ? (
                                                            <>
                                                                <div><b>All Customers</b></div>
                                                                <Box
                                                                    height="auto"
                                                                    sx={{
                                                                        "& .MuiDataGrid-root": {
                                                                            border: "none",
                                                                        },
                                                                        "& .MuiDataGrid-cell": {
                                                                            borderBottom: "none",
                                                                        },
                                                                        "& .name-column--cell": {
                                                                            color: colors.greenAccent[300],
                                                                        },
                                                                        "& .MuiDataGrid-columnHeaders": {
                                                                            backgroundColor: colors.blueAccent[700]
                                                                        },
                                                                        "& .MuiDataGrid-virtualScroller": {
                                                                            backgroundColor: colors.primary[400],
                                                                        },
                                                                        "& .MuiCheckbox-root": {
                                                                            color: `${colors.greenAccent[200]} !important`,
                                                                        },
                                                                    }}
                                                                >
                                                                    <DataGrid disableColumnMenu rows={customerData} columns={customerColumns} hideFooterPagination hideFooterSelectedRowCount />
                                                                </Box>
                                                            </>
                                                        ) :
                                                            (
                                                                <div className='text-center'>
                                                                    <p><b>No customer information has been created yet</b></p>
                                                                </div>
                                                            )
                                                        }

                                                    </div>
                                                    <hr />
                                                    <Collapse in={isOrderContainerVisible}>
                                                        <div className="order-container row">
                                                            <div><b>All Order Of Customer</b></div>
                                                            <Box
                                                                height="auto"
                                                                sx={{
                                                                    "& .MuiDataGrid-root": {
                                                                        border: "none",
                                                                    },
                                                                    "& .MuiDataGrid-cell": {
                                                                        borderBottom: "none",
                                                                    },
                                                                    "& .name-column--cell": {
                                                                        color: colors.greenAccent[300],
                                                                    },
                                                                    "& .MuiDataGrid-columnHeaders": {
                                                                        backgroundColor: colors.blueAccent[700]
                                                                    },
                                                                    "& .MuiDataGrid-virtualScroller": {
                                                                        backgroundColor: colors.primary[400],
                                                                    },
                                                                    "& .MuiCheckbox-root": {
                                                                        color: `${colors.greenAccent[200]} !important`,
                                                                    },
                                                                }}
                                                            >
                                                                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                                                                    <DataGrid autoHeight disableColumnMenu rows={customerOrders} columns={orderColumns} hideFooterPagination hideFooterSelectedRowCount />
                                                                </div>
                                                            </Box>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                            ) : (
                                                <div className='d-flex justify-content-center' style={{ color: "#676767a7" }}>
                                                    <h6>You are not logged in. Login <span><Link to="/login-register" style={{ color: "rgb(238, 77, 45)", textDecoration: "none" }}>Now</Link></span>.</h6>
                                                </div>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2" className="single-my-account mb-20">
                                        <Accordion.Header className="panel-heading">
                                            <span>3 .</span> Change your password
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {isLogged ? (<div className="myaccount-info-wrapper">
                                                <div className="account-info-wrapper">
                                                    <h4>Change Password</h4>
                                                    <h5>Your Password</h5>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-12 col-md-12">
                                                        <div className="user-info" style={{ position: 'relative' }}>
                                                            <label>Password</label>
                                                            <input
                                                                type={showOldPassword ? "text" : "password"}
                                                                style={{ paddingRight: '40px' }}
                                                                onChange={(e) => setOldPassword(e.target.value)}
                                                            />
                                                            <div
                                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                                                style={{
                                                                    color: "#788394",
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    right: '10px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {showOldPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12">
                                                        <div className="user-info" style={{ position: 'relative' }}>
                                                            <label>New Password</label>
                                                            <input
                                                                type={showNewPassword ? "text" : "password"}
                                                                style={{ paddingRight: '40px' }}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                            />
                                                            <div
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                style={{
                                                                    color: "#788394",
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    right: '10px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12">
                                                        <div className="user-info" style={{ position: 'relative' }}>
                                                            <label>Confirm New Password</label>
                                                            <input
                                                                type={showConfirmNewPassword ? "text" : "password"}
                                                                style={{ paddingRight: '40px' }}
                                                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                            />
                                                            <div
                                                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                                                style={{
                                                                    color: "#788394",
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    right: '10px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {showConfirmNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="submit-update-btn">
                                                    <div className="submit-btn">
                                                        <button type="submit" onClick={changePassword}>Continue</button>
                                                    </div>
                                                </div>
                                            </div>) :
                                                (
                                                    <div className='d-flex justify-content-center' style={{ color: "#676767a7" }}>
                                                        <h6>You are not logged in. Login <span><Link to="/login-register" style={{ color: "rgb(238, 77, 45)", textDecoration: "none" }}>Now</Link></span>.</h6>
                                                    </div>
                                                )}

                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <Footer />
            {/* <Cursor /> */}
            <CustomerOrderModal open={orderModal} onClose={() => setOrderModal(false)} customer={selectedCustomer} orderDate={selectedOrderDate} orderStatus={selectedOrderStatus} orderCost={selectedOrderCost} orderDiscount={selectedOrderDiscount} orderId={orderId} />
        </Fragment>
    )
}
export default MyAccount;