import React from 'react';

const ControlButtons = ({ isPlaying, onTogglePlayPause, onStop }) => {
    return (
        <div>
            <button onClick={onTogglePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={onStop}>Stop</button>
        </div>
    );
};

export default ControlButtons;
