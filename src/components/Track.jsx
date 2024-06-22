import React, { useState, useEffect } from 'react';
import DrawingCanvas from './DrawingCanvas';

const Track = ({ track, isPlaying, onUpdateTrack, currentColor }) => {
    const [mode, setMode] = useState(track.mode);
    const [drawMode, setDrawMode] = useState('write');
    const [points, setPoints] = useState(track.points);

    const toggleMode = () => {
        const newMode = mode === 'lock' ? 'edit' : 'lock';
        setMode(newMode);
        onUpdateTrack({ ...track, mode: newMode });
    };

    const toggleDrawMode = () => {
        setDrawMode(drawMode === 'write' ? 'erase' : 'write');
    };

    const handleUpdatePoints = (updatedPoints) => {
        setPoints(updatedPoints);
        onUpdateTrack({ ...track, points: updatedPoints });
    };

    useEffect(() => {
        setPoints(track.points);
    }, [track.points]);

    return (
        <div className="track">
            <button onClick={toggleMode}>
                {mode === 'lock' ? 'Edit' : 'Lock'}
            </button>
            <button onClick={toggleDrawMode}>
                {drawMode === 'write' ? 'Erase' : 'Write'}
            </button>
            <DrawingCanvas
                trackId={track.id}
                mode={mode}
                isPlaying={isPlaying}
                points={points}
                currentColor={currentColor}
                drawMode={drawMode}
                onUpdatePoints={handleUpdatePoints}
            />
        </div>
    );
};

export default Track;
