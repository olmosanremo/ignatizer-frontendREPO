import React from 'react';

const ColorButton = ({ color, onSelectColor }) => {
    return (
        <button
            style={{ backgroundColor: color, width: '50px', height: '50px', margin: '5px' }}
            onClick={() => onSelectColor(color)}
        />
    );
};

export default ColorButton;
