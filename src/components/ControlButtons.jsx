import React from 'react';

const ControlButtons = ({ onStart, onPause, onStop }) => {
    return (
        <div>
            <button onClick={onStart}>Start</button>
            <button onClick={onPause}>Pause</button>
            <button onClick={onStop}>Stop</button>
        </div>
    );
};

export default ControlButtons;
