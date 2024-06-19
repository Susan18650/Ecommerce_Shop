import React from 'react';
import './Breadcrumb.css';

const Breadcrumb = ({ items }) => {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className="breadcrumb-separator"> &gt;&gt; </span>}
                        {item.url ? <a className="breadcrumb-link" href={item.url}>{item.name}</a> : <span className="breadcrumb-text">{item.name}</span>}
                    </React.Fragment>
                ))}
            </ol>
        </nav>
    );
}

export default Breadcrumb;
