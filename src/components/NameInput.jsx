import React from 'react';

const NameInput = ({ name, onNameChange }) => {
    return (
        <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter canvas name"
        />
    );
};

export default NameInput;
