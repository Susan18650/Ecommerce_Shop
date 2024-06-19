import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";


const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const goToBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const listenToScroll = () => {
    let heightToHidden = window.innerHeight / 2;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHidden) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  return (
    <Wrapper>
      {isVisible && (
        <div className="top-btn" onClick={goToBtn}>
          <MdKeyboardDoubleArrowUp className="top-btn--icon"/>
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .top-btn {
    font-size: 3rem;
    width: 3.5rem;
    height: 3.5rem;
    color: #fff;
    background-color: #591c80;
    border-radius: 50%;
    position: fixed;
    bottom: 5rem;
    right: 1rem;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &--icon {
      animation: gototop 1.2s linear infinite alternate-reverse;
    }

    @keyframes gototop {
      0% {
        transform: translateY(-0.3rem);
      }
      100% {
        transform: translateY(0.5rem);
      }
    }

    @media (max-width: 767px) {
      font-size: 2rem;
      width: 2.5rem;
      height: 2.5rem;
      bottom: 3rem;
    }
  }
`;


export default GoToTop;