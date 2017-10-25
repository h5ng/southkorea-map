import React from 'react';

const Navigation = ({changeArea}) => {
    return (
        <input type="text" onKeyPress={(e) => {
            if(e.key === 'Enter') {
                changeArea(e.target.value);
            }
        }} />
    )
};

export default Navigation;