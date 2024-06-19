import React, {useEffect} from 'react'
import '../styles/pages/tokenError.css'
import Cursor from '../components/Cursor/cursor';

export const TokenError = () => {
    useEffect(() => {
        const body = document.getElementsByClassName("verify-reset-token-error-page")[0];
        const intervalId = setInterval(createStar, 100);

        function createStar() {
            let right = Math.random() * 500;
            const top = Math.random() * window.innerHeight;
            const star = document.createElement('div');
            star.classList.add('star');
            body.appendChild(star);
            star.style.top = `${top}px`;

            const starIntervalId = setInterval(runStar, 10);

            function runStar() {
                if (right >= window.innerWidth) {
                    star.remove();
                    clearInterval(starIntervalId);
                }
                right += 3;
                star.style.right = `${right}px`;
            }
        }

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    return (
        <div className='verify-reset-token-error-page'>
            <div className="text">
                <div>ERROR</div>
                <h1>410</h1>
                <hr />
                <div>Link has Expired. Back to <a href="/">HomePage</a></div>
            </div>
            <div className="astronaut">
                <img src="https://images.vexels.com/media/users/3/152639/isolated/preview/506b575739e90613428cdb399175e2c8-space-astronaut-cartoon-by-vexels.png" alt="" className="src" />
            </div>
            <Cursor/>
        </div>
    )
}
