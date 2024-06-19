import React from "react";

const cssString = `
/* FOOTER */
.footer {
	width: 100%;
	background: #00121b;
	display: block;
 }

 .inner-footer {
	 width: 95%;
	 margin: auto;
	 padding: 30px 10px;
	 display: flex;
	 flex-wrap: wrap;
	 box-sizing: border-box;
	 justify-content: center;
 }

.footer-items {
	width: 25%;
	padding: 10px 20px;
	box-sizing: border-box;
	color: #fff;
}

.footer-items p {
	font-size: 16px;
	text-align: justify;
	line-height: 25px;
	color: #fff;
}

.footer-items h1 {
	color: #fff;
}

.border1 {
	height: 3px;
	width: 40px;
	background: #ff9800;
	color: #ff9800;
	background-color: #ff9800;
	border: 0px;
}

.footer-items ul {
	list-style: none;
	color: #fff;
	font-size: 15px;
	letter-spacing: 0.5px;	
 }

 .footer-items ul a {
	text-decoration: none;
	outline: none;
	color: #fff;
	transition: 0.3s;
}

.footer-items ul a:hover {
	color: #ff9800;
}

.footer-items ul li {
	margin: 10px 0;
	height: 25px;
}

.footer-items li i {
	margin-right: 20px;
}

.social-media {
	width: 100%;
	color: #fff;
	text-align: center;
	font-size: 20px;
}

.social-media a {
	text-decoration: none;
}

.social-media i {
	height: 25px;
	width: 25px;
	margin: 20px 10px;
	padding: 4px;
	color: #fff;
	transition: 0.5s;
}

.social-media i:hover {
	transform: scale(1.5);
}

.footer-bottom {
	padding: 10px;
	background: #00121b;
	color: #fff;
	font-size: 12px;
	text-align: center;
}

/* for tablet mode view */

@media screen and (max-width: 1275px) {
	.footer-items {
		width: 50%;
	}
}

/* for mobile screen view */

@media screen and (max-width: 660px) {
	.footer-items {
		width: 100%;
	}
}

/* you can toggle the media screen view accordingly by changing the (max-width: px) to your convenience */

/* Thanks to Computer Conversations */

`
const Footer = () => {
  return (
    <>
    <style>{cssString}</style>
      <div className="footer">
        <div className="inner-footer">
          {/*  for company name and description */}
          <div className="footer-items">
            <h1>E-Comm</h1>
            <p>Top ranking of shopping websites most trusted by customers.</p>
          </div>
          {/*  for quick links  */}
          <div className="footer-items">
            <h3>Quick Links</h3>
            <div className="border1" /> {/*for the underline */}
            <ul>
              <a href="/"><li>Home</li></a>
              <a href="/products"><li>Product</li></a>
              <a href="/contact"><li>Contact</li></a>
              <a href="/"><li>About Us</li></a>
            </ul>
          </div>
          {/*  for some other links */}
          <div className="footer-items">
            <h3>Others</h3>
            <div className="border1" />  {/*for the underline */}
            <ul>
              <a href="#"><li>Shop</li></a>
			  <a href="#"><li>Team</li></a>
              <a href="#"><li>Services</li></a>
              <a href="#"><li>Portfolio</li></a>
            </ul> 
          </div>
          {/*  for contact us info */}
          <div className="footer-items">
            <h3>Contact us</h3>
            <div className="border1" />
            <ul>
              <li><i className="fa fa-map-marker" aria-hidden="true" />E-Comm, Anytown</li>
              <li><i className="fa fa-phone" aria-hidden="true" />+84-12345678</li>
              <li><i className="fa fa-envelope" aria-hidden="true" />E-comm@gmail.com</li>
            </ul>
            {/*   for social links */}
            <div className="social-media">
              <a href="#"><i className="fab fa-instagram" /></a>
              <a href="#"><i className="fab fa-facebook" /></a>
              <a href="#"><i className="fab fa-google-plus-square" /></a>
            </div>
          </div>
        </div>
        {/*   Footer Bottom start  */}
        <div className="footer-bottom">
          Copyright © E-Comm {new Date().getFullYear()}.
        </div>
      </div>
    </>

  );
};

export { Footer };
