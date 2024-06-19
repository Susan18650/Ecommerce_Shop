import React, { useEffect, useRef, useState } from "react";
import './cursor.css';

const Cursor = () => {
  const cursor = useRef(null);
  const cursorinner = useRef(null);
  const links = useRef(null);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
      if (window.innerWidth > 768) {
        cursor.current.style.opacity = '0.5';
        cursorinner.current.style.opacity = '0.5';
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const isMobile = windowSize <= 768;
    const isTablet = windowSize > 768 && windowSize <= 1024;
    const cursorEl = cursor.current;
    const cursorinnerEl = cursorinner.current;
    links.current = document.querySelectorAll('a, button');

    if (isMobile) {
      let touchX = 0, touchY = 0, posX = 0, posY = 0;

      const animateTouch = () => {
        posX += (touchX - posX) / 5;
        posY += (touchY - posY) / 5;

        cursorEl.style.transform = `translate3d(calc(${posX}px - 50%), calc(${posY}px - 50%), 0)`;
        cursorinnerEl.style.left = posX + 'px';
        cursorinnerEl.style.top = posY + 'px';

        requestAnimationFrame(animateTouch);
      }

      requestAnimationFrame(animateTouch);

      const handleTouchMove = (e) => {
        const touch = e.touches[0];
        touchX = touch.clientX;
        touchY = touch.clientY;
      };

      const handleTouchEnd = () => {
        cursorEl.classList.remove('click');
        cursorinnerEl.classList.remove('cursorinnerhover');
        cursorEl.style.opacity = '0';
        cursorinnerEl.style.opacity = '0';
      };

      const handleTouchStart = () => {
        cursorEl.classList.add('click');
        cursorinnerEl.classList.add('cursorinnerhover');
        cursorEl.style.opacity = '0.5';
        cursorinnerEl.style.opacity = '0.5';
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }else if (isTablet) {
      let touchX = 0, touchY = 0, posX = 0, posY = 0;

      const animateTouch = () => {
        posX += (touchX - posX) / 5;
        posY += (touchY - posY) / 5;

        cursorEl.style.transform = `translate3d(calc(${posX}px - 50%), calc(${posY}px - 50%), 0)`;
        cursorinnerEl.style.left = posX + 'px';
        cursorinnerEl.style.top = posY + 'px';

        requestAnimationFrame(animateTouch);
      }

      requestAnimationFrame(animateTouch);

      const handleTouchMove = (e) => {
        const touch = e.touches[0];
        touchX = touch.clientX;
        touchY = touch.clientY;
      };

      const handleTouchEnd = () => {
        cursorEl.classList.remove('click');
        cursorinnerEl.classList.remove('cursorinnerhover');
        cursorEl.style.opacity = '0';
        cursorinnerEl.style.opacity = '0';
      };

      const handleTouchStart = () => {
        cursorEl.classList.add('click');
        cursorinnerEl.classList.add('cursorinnerhover');
        cursorEl.style.opacity = '0.5';
        cursorinnerEl.style.opacity = '0.5';
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
     else {
      let mouseX = 0, mouseY = 0, posX = 0, posY = 0;

      const animate = () => {
        posX += (mouseX - posX) / 5;
        posY += (mouseY - posY) / 5;

        cursorEl.style.transform = `translate3d(calc(${posX}px - 50%), calc(${posY}px - 50%), 0)`;
        cursorinnerEl.style.left = posX + 'px';
        cursorinnerEl.style.top = posY + 'px';

        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);

      const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };

      const handleMouseDown = () => {
        cursorEl.classList.add('click');
        cursorinnerEl.classList.add('cursorinnerhover');
      };

      const handleMouseUp = () => {
        cursorEl.classList.remove('click');
        cursorinnerEl.classList.remove('cursorinnerhover');
      };

      const handleMouseOver = () => {
        cursorEl.classList.add('hover');
      };

      const handleMouseLeave = () => {
        cursorEl.classList.remove('hover');
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);

      links.current.forEach(link => {
        link.addEventListener('mouseover', handleMouseOver);
        link.addEventListener('mouseleave', handleMouseLeave);
      });

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);

        links.current.forEach(link => {
          link.removeEventListener('mouseover', handleMouseOver);
          link.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    }
  }, [windowSize]);

  return (
    <>
      <div className="cursor" ref={cursor}></div>
      <div className="cursor2" ref={cursorinner}></div>
    </>
  );
};

export default Cursor;
