import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '../components/Header/header';
import { Content } from '../components/Content/Content';
import { Footer } from '../components/Footer/footer';
import GoToTop from '../components/scroll-to-top';
import Testimonials from '../components/testimonials/Testimonials';
import Cursor from '../components/Cursor/cursor';
const Homepage = () => {
    return (
        <div className="app">
            <Header />
            <Routes>
                <Route path="*" element={<Content />} />
            </Routes>
            <br />
            <br />
            <Testimonials/>
            <GoToTop />
            {/* <Cursor/> */}
            <Footer />
        </div>
    );
};

export default Homepage;
