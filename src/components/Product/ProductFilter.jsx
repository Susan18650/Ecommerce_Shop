import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { fetchFilterData } from '../../actions/filter.action';
import { getDataItem } from '../../actions/product.action';
import { RESET_PAGE_FILTER } from '../../constants/constant';
import { debounce } from 'lodash'

const ProductFilter = () => {
  const dispatch = useDispatch();

  const [category, setCategory] = useState(null)

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  const { page, pageFilter, limit, filterFields } = useSelector((reduxData) => reduxData?.dataReducer);

  // const options = [
  //   { label: 'A-Z', value: 'name_asc' },
  //   { label: 'Z-A', value: 'name_desc' },
  //   { label: 'Low to high price', value: 'promotionPrice_asc' },
  //   { label: 'High to low price', value: 'promotionPrice_desc' }
  // ];

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_PRODUCT_DATABASE_URL}/category`);
      const data = await response.json();
      if (response.ok) {
        setCategory(data.data);
      } else {
        // console.log('Error fetching category', data)
      }
    } catch (error) {
      // console.log('Error fetching category', error)
    }
  }
  useEffect(() => {
    fetchCategory()
  }, [])

  // search by input
  const debouncedSearchTerm = useCallback(
    debounce((nextValue) => {
      if (nextValue || selectedCategories.length > 0) {
        dispatch(fetchFilterData(nextValue, selectedCategories, '', '', pageFilter, limit));
        dispatch({
          type: RESET_PAGE_FILTER,
          pageFilter: 1
        })
      } else {
        dispatch(getDataItem(page, limit));
      }
    }, 1000),
    [selectedCategories] // will be created only once initially
  );

  const handleSearch = (event) => {
    const { value: nextValue } = event.target;
    setSearchTerm(nextValue);
    debouncedSearchTerm(nextValue);
    dispatch({
      type: RESET_PAGE_FILTER,
      pageFilter: 1
    });
  };
  // search by price
  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
    dispatch({
      type: RESET_PAGE_FILTER,
      pageFilter: 1
    });
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
    dispatch({
      type: RESET_PAGE_FILTER,
      pageFilter: 1
    });
  };
  const handleApplyClick = () => {
    if (minPrice && maxPrice && minPrice > maxPrice) {
      toast.error('Min price should not be greater than max price', { autoClose: 3000, theme: "dark" });
    } else if (minPrice || maxPrice) {
      dispatch(fetchFilterData(searchTerm, selectedCategories, minPrice, maxPrice, pageFilter, limit));
      dispatch({
        type: RESET_PAGE_FILTER,
        pageFilter: 1
      });
    } else {
      toast.error('Please enter a price', { autoClose: 3000, theme: "dark" });
    }
  };
  useEffect(() => {
    if (!minPrice && !maxPrice) {
      dispatch(getDataItem(page, limit));
    }
  }, [minPrice, maxPrice]);

  // search by checkbox (category)
  const handleCheckboxChange = (event) => {
    const { checked, id } = event.target;
    if (checked) {
      setSelectedCategories(prev => [...prev, id]);
    } else {
      setSelectedCategories(prev => prev.filter(category => category !== id));
    }
    dispatch({
      type: RESET_PAGE_FILTER,
      pageFilter: 1
    });
  };

  useEffect(() => {
    if (selectedCategories.length > 0 || searchTerm || minPrice || maxPrice) {
      dispatch(fetchFilterData(searchTerm, selectedCategories, minPrice, maxPrice, pageFilter, limit));
      dispatch({
        type: RESET_PAGE_FILTER,
        pageFilter: 1
      })
    } else {
      dispatch(getDataItem(page, limit));
    }
  }, [selectedCategories, filterFields.name, filterFields.minPrice, filterFields.maxPrice, dispatch]);

  const handleClearAll = () => {
    // Reset all the states
    setSearchTerm('');
    setSelectedCategories([]);
    setMinPrice(null);
    setMaxPrice(null);
  
    // Reset the page to 1
    dispatch({
      type: RESET_PAGE_FILTER,
      pageFilter: 1
    });
  
    // Fetch the data with default parameters
    dispatch(getDataItem(1, limit));
  
    // Clear all the checkboxes
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
  };
  

  const cssString = `
    *{
        margin: 0 ;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
      }
      .wrapper{
        width: 320px;
        height: auto;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 10px;
        padding: 15px 25px 40px;
      }
      hr {
          display: block;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          margin-left: auto;
          margin-right: auto;
          border-style: inset;
          border-width: 1px;
        }
        .pro-sidebar-search {
            .pro-sidebar-search-form {
              position: relative;
              input {
                font-size: 14px;
          
                height: 43px;
                padding: 2px 55px 2px 18px;
          
                color: #000;
                border: 1px solid #e6e6e6;
                background: transparent none repeat scroll 0 0;
              }
            }
          }
      .price-input{
        width: 100%;
        display: flex;
        margin: 30px 0 20px;
      }
      .price-input .field{
        display: flex;
        width: 100%;
        height: 45px;
        align-items: center;
      }
      .price-input .separator{
        width: 130px;
        display: flex;
        font-size: 19px;
        align-items: center;
        justify-content: center;
      }
      
      /* h6 tag */
      h6 {
          margin-top: 10px;
          font-size: 15px;
          font-weight: 500;
          line-height: 24px;

      }
      /* checkbox for filter types */
      .checkbox-filter-category{
          margin-top: 20px;
      }
      .checkbox-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
      }
      .checkbox-item label {
        padding-left: 20px;
        color: #000000;
        font-size: 14px;
        font-family: 'Poppins', sans-serif;
      }
      .checkmark-input {
        /* change default input is hidden */
        -webkit-appearance: none; 
        appearance: none;   
        width: 20px;
        height: 20px;
      }
      input[type="checkbox"].checkmark-input {
        border-radius: 3px;
      }
      .checkmark-input::before {
        display: block;
        content: "";
        width: 14px;
        height: 14px;
        transition: 120ms transform ease-in-out;
        box-shadow: inset 14px 14px #333;
      }
      
      /* Styling to checkmark */
      input[type="checkbox"].checkmark-input::before {
        transform-origin: bottom left;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        transform: scale(0);
      }
      
      /* CHECKBOX - Black BG & White check mark */
      .checkmark-input:checked {
        background-color: #333;
      }
      
      .checkmark-input::before {
        box-shadow: inset 14px 14px #fff;
      }
      
      /* show only checkbox checked */
      input[type="checkbox"].checkmark-input:checked::before{
        transform: scale(1);
      }
      .select-menu {
        max-width: 330px;
        margin: 50px auto;
      }
      .select-menu .select-btn {
        display: flex;
        height: 55px;
        background: #fff;
        padding: 20px;
        font-size: 14px;
        font-weight: 400;
        border-radius: 8px;
        align-items: center;
        cursor: pointer;
        justify-content: space-between;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      }
      .select-menu .options {
        visibility: hidden;
        position: absolute;
        width: 270px;
        overflow-y: auto;
        max-height: 295px;
        padding: 10px;
        margin-top: 10px;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        animation-name: fadeInDown;
        -webkit-animation-name: fadeInDown;
        animation-duration: 0.35s;
        animation-fill-mode: both;
        -webkit-animation-duration: 0.35s;
        -webkit-animation-fill-mode: both;
      }
      .select-menu .options .option {
        display: flex;
        height: 55px;
        cursor: pointer;
        padding: 0 8px;
        border-radius: 8px;
        align-items: center;
        background: #fff;
      }
      .select-menu .options .option:hover {
        background: #f2f2f2;
      }

      .select-menu .options .option .option-text {
        font-size: 16px;
        color: #333;
      }
      .select-menu.active .options {
        display: block;
        visibility: visible;
        opacity: 0;
        z-index: 10;
        animation-name: fadeInUp;
        -webkit-animation-name: fadeInUp;
        animation-duration: 0.4s;
        animation-fill-mode: both;
        -webkit-animation-duration: 0.4s;
        -webkit-animation-fill-mode: both;
      }
      
      @keyframes fadeInUp {
        from {
          transform: translate3d(0, 30px, 0);
        }
        to {
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }
      }
      @keyframes fadeInDown {
        from {
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }
        to {
          transform: translate3d(0, 20px, 0);
          opacity: 0;
        }
      }
    `
  return (
    <div>
      <div className="wrapper">
        <style>{cssString}</style>
        <div className="sidebar-widget">
          <h6 className="pro-sidebar-title">Search </h6>
          <div className="pro-sidebar-search mb-10 mt-25">
            <div className="pro-sidebar-search-form">
              <input
                type="text"
                placeholder="Search here..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        <hr />
        <h6>Price Range</h6>
        <div className="price-input">
          <div className="field">
            <TextField
              margin="dense"
              id="input-min"
              name="input-min"
              className="input-min"
              InputProps={{
                inputProps: { min: 0 }
              }}
              onKeyDown={(event) => {
                if (event.key === '-') {
                  event.preventDefault();
                }
              }}
              label="$ From"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleMinPriceChange}
            />
          </div>
          <div className="separator">-</div>
          <div className="field">
            <TextField
              margin="dense"
              id="input-max"
              name="input-max"
              className="input-max"
              InputProps={{
                inputProps: { min: 0 }
              }}
              onKeyDown={(event) => {
                if (event.key === '-') {
                  event.preventDefault();
                }
              }}
              label="$ From"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          <button className="btn btn-primary mb-10" style={{ width: "120px", backgroundColor: "rgb(238, 77, 45)", border: "none", fontSize: "14px" }} onClick={handleApplyClick}>Apply</button>
        </div>
        <hr />
        <h6>Category</h6>
        <div className='checkbox-filter-category'>
          {category?.map((category) => (
            <div key={category._id} className="checkbox-item">
              <input type='checkbox' className='checkmark-input' id={category.name} onChange={handleCheckboxChange} />
              <label htmlFor={category.name}>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</label>
            </div>
          ))}
        </div>
        <hr className='mt-9' />
        <div className='d-flex justify-content-center'>
          <button className="btn btn-primary mb-10" style={{ width: "120px", backgroundColor: "rgb(238, 77, 45)", border: "none", fontSize: "14px" }} onClick={handleClearAll}>Clear All</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
export default ProductFilter;
