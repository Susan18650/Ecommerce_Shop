import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import "../../styles/pages/scss/_header.scss"
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const NavbarSection = () => {

  const [isActive, setIsActive] = useState(false);
  const [fix, setFix] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Lấy giá trị đăng nhập từ cookie khi component được mount
    const isLoggedFromCookie = Cookies.get('isLogged');
    setIsLogged(isLoggedFromCookie === 'true'); // Chuyển đổi từ chuỗi sang boolean
  }, []);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItemsCount(storedItems.length);
    // Lắng nghe sự thay đổi của key 'cartUpdated'
}, [localStorage.getItem('cartUpdated')]);

  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  const removeActive = () => {
    setIsActive(false)
  }

  window.addEventListener("scroll", function () {
    if (this.window.scrollY > 100) {
      setFix(true)
    }
    else {
      setFix(false)
    }
  })
  const handleSignInClick = () => {
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = '/login-register';
    }, 1500);
  };
  const handleCartClick = () => {
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = '/cart';
    }, 1500);
  };
  const handleUserAvatarClick = () => {
    const userDropdown = document.querySelector('.User-Dropdown');
    userDropdown.classList.toggle('U-open');
  };
  const handleLogout = () => {
    const cookiesToRemove = ['isLogged', 'accessToken', 'refreshToken', 'username', '_id'];
    cookiesToRemove.forEach(cookie => Cookies.remove(cookie));
    toast.success("Logout Success", { autoClose: 2500, theme: "dark" });
    setTimeout(() => {
      window.location.reload();
  }, 2500);
  };
  
  const cssString = `
  li,
  a {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 300;
  }

.User-area {
  position: relative;
  z-index: 100;
  cursor: pointer;
}
  `
  return (
    <div className="App">
      <style>{cssString}</style>
      <header className={fix ? `${styles.activenav}` : ""}>

        <nav className={`${styles.navbar}`}>

          <Link to="/" className={`${styles.logo}`}>E-Comm. </Link>

          <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
            <li onClick={removeActive}>
              <Link to="/" className={`${styles.navLink}`}>Home</Link>
            </li>
            <li onClick={removeActive}>
              <a href='#' className={`${styles.navLink}`}>About</a>
            </li>
            <li onClick={removeActive}>
              <Link to="/products" className={`${styles.navLink}`}>Shop</Link>
            </li>
            <li onClick={removeActive}>
              <a href='/contact' className={`${styles.navLink}`}>Contact</a>
            </li>
            <div className="navbar d-flex cart-account flex-nowrap flex-row justify-content-center" style={{ width: '100px' }}>
              <Link to="/check-order" className="nav-icon position-relative text-decoration-none">
                <i className="fa-sharp fa-solid fa-box-check"></i>
              </Link>
              <Link onClick={handleCartClick} className="nav-icon position-relative text-decoration-none">
                <i className="fa fa-fw fa-cart-arrow-down text-dark mr-1" />
                <span className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark cart-page-direct">
                  {cartItemsCount}
                </span>
              </Link>
              <div className="User-area">
                <div className="User-avtar" onClick={handleUserAvatarClick}>
                  <i className="fa fa-fw fa-user text-dark mr-3" />
                </div>

                {isLogged ? ( // Sử dụng giá trị đăng nhập từ cookie để hiển thị nội dung tương ứng
                  <div className="User-Dropdown">
                    <li>
                      <Link style={{ fontSize: "15px" }} to={"/my-account"}>
                        My account
                      </Link>
                    </li>
                    <li style={{ fontSize: "15px" }} onClick={handleLogout}>Log out</li>
                  </div>
                ) : (
                  <div className="User-Dropdown">
                    <ul>
                      <li>
                        <Link onClick={handleSignInClick}>Sign In</Link>
                      </li>
                      <li>
                        <Link onClick={handleSignInClick}>
                          Register
                        </Link>
                      </li>
                      <li>
                      </li>
                    </ul>
                  </div>
                )}

              </div>
            </div>
          </ul>

          <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`} onClick={toggleActiveClass}>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
          </div>
        </nav>

      </header>
      <ToastContainer containerId="navbarSectionToast" />
    </div>
  );
}

export default NavbarSection;