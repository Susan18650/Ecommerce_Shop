import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './content.css';
import { ProductHomepage } from './Product';
const Content = () => {
    return (
        <div className='container'>
            <section className="bg-light">
                <div className="container py-5">
                    <div className="row text-center py-3">
                        <div className="col-lg-6 m-auto">
                            <h1 className="h1">- Latest Product -</h1>
                            <p>
                                Feel free to choose the products you want, because here we have all kinds of devices as well as diverse designs.
                            </p>
                        </div>
                    </div>
                    < ProductHomepage />
                </div>
            </section>
        </div>
    )
}
export { Content };