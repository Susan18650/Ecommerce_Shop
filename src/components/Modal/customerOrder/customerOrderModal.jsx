import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Slide, Box, useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid } from "@mui/x-data-grid";

import { tokens } from '../../../theme';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CustomerOrderModal = ({ open, onClose, customer, orderDate, orderStatus, orderCost, orderDiscount, orderId }) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [orderDetails, setOrderDetails] = useState([]);

  const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

  const discountedPrice = (orderDiscount === 0 ? 0 : orderCost * (1 - orderDiscount / 100) + 20);

  useEffect(() => {
    if (orderId) {
      fetch(`${gBASE_URL}/order/${orderId}/orderDetail`)
        .then(response => response.json())
        .then((data) => {
          const details = data.data.map(detail => ({
            id: detail._id,
            image: detail.product.imageUrls[0],
            product: detail.product.name,
            price: detail.product.promotionPrice,
            quantity: detail.quantity,
            amount: detail.quantity * detail.product.promotionPrice
          }));
          setOrderDetails(details);
        })
        .catch(error => console.error('Error fetching order details:', error));
    }
  }, [orderId]);

  function renderImageCell(params) {
    if (!params.value) {
      return <img alt={"No Image"} />;
    }

    let imageUrl = params.value;
    const isUrl = imageUrl.startsWith('http') || imageUrl.startsWith('https');

    if (!isUrl) {
      imageUrl = `${gBASE_URL}/image/${imageUrl}`;
    }

    return <img src={imageUrl} alt={params.row.name} style={{ width: "70px", height: "65px", padding: "5px" }} />;
  }

  const orderDetailColumns = [
    { field: "image", headerName: "Image", flex: 1, renderCell: renderImageCell },
    { field: "product", headerName: "Product", flex: 1 },
    { field: "price", headerName: "Price", flex: 1, renderCell: (params) => { return `$${params.value.toFixed(2)}`; } },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1, renderCell: (params) => { return `$${params.value.toFixed(2)}`; } },
  ];

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} keepMounted>
      <DialogTitle className='text-center'>Order Details</DialogTitle>
      <hr />
      <DialogContent
        sx={{
          width: 'auto',
          '& label.Mui-focused': {
            color: colors.grey[100],
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: colors.grey[100],
          }
        }}>
        <div className='customer-information d-flex flex-col' style={{ fontSize: "14px", fontWeight: "400" }}>
          <p><b>Order Date:</b> {orderDate}</p>
          <p><b>Status:</b> {orderStatus}</p>
          <p><b>Name: </b>{customer?.fullName}</p>
          <p><b>Email: </b>{customer?.email}</p>
          <p><b>Phone: </b>{customer?.phone}</p>
          <p><b>Address: </b>{customer?.address}</p>
        </div>
        <hr className='mt-3 mb-3' />
        <div className="row">
          <div className='text-center' style={{ fontSize: "19px", fontWeight: "400" }}><b>Cart</b></div>
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
            <div style={{ maxHeight: '150px', overflow: 'auto' }}>
              <DataGrid disableColumnMenu rows={orderDetails} columns={orderDetailColumns} hideFooterPagination hideFooterSelectedRowCount />
            </div>
          </Box>
        </div>
        <hr className='mb-2' />
        <div style={{ fontSize: "15px", fontWeight: "400" }} className='text-end'>
          <p><b>Discount: </b>${discountedPrice ? discountedPrice.toFixed(2) : '0.00'}</p>
          <hr className='mt-2 mb-2' />
          <p><b>Total Price: </b>${orderCost ? orderCost.toFixed(2) : '0.00'} (+$20 Shipping Fee)</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
