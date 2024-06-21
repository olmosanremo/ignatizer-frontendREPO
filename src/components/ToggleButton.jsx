import React, { useState } from 'react';

const ToggleButton = ({ onToggle }) => {
    const [buttonText, setButtonText] = useState('write');

    const handleClick = () => {
        const newText = buttonText === 'write' ? 'erase' : 'write';
        setButtonText(newText);
        onToggle(newText);
    };

    return (
        <button
            onClick={handleClick}
            onTouchStart={handleClick}
        >
            {buttonText}
        </button>
    );
};

export default ToggleButton;
