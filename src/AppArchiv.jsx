import React, { useState, useEffect } from 'react';
import './App.css';
import ToggleButton from './components/ToggleButton';
import ColorButton from './components/ColorButton';
import Track from './components/Track';
import Synthesizer from './components/Synthesizer';
import ControlButtons from './components/ControlButtons';
import axios from 'axios';
import * as Tone from 'tone';

function App() {
    const [mode, setMode] = useState('write');
    const [color, setColor] = useState('red');
    const [tracks, setTracks] = useState([]);
    const [currentTrackPoints, setCurrentTrackPoints] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (tracks.length === 0) {
            addTrack();
        }
    }, []);

    const handleToggle = (newMode) => {
        setMode(newMode);
    };

    const handleColorSelect = (selectedColor) => {
        setColor(selectedColor);
    };

    const addTrack = () => {
        setTracks([...tracks, { id: Date.now(), savedId: null, order: tracks.length }]);
    };

    const saveDrawing = async (data) => {
        try {
            const response = await axios.post('http://your-backend-url/synthdata', data);
            setTracks((prevTracks) =>
                prevTracks.map((track) =>
                    track.id === data.id ? { ...track, savedId: response.data._id } : track
                )
            );
        } catch (error) {
            console.error('Error saving data', error);
        }
    };

    const deleteTrack = async (id) => {
        const trackToDelete = tracks.find((track) => track.id === id);
        if (trackToDelete.savedId) {
            try {
                await axios.delete(`http://your-backend-url/synthdata/${trackToDelete.savedId}`);
                setTracks(tracks.filter((track) => track.id !== id));
            } catch (error) {
                console.error('Error deleting data', error);
            }
        } else {
            setTracks(tracks.filter((track) => track.id !== id));
        }
    };

    const togglePlayPause = async () => {
        await Tone.start(); // Ensure AudioContext is started
        if (isPlaying) {
            Tone.Transport.pause();
        } else {
            Tone.Transport.start();
        }
        setIsPlaying(!isPlaying);
    };

    const stopPlayback = () => {
        Tone.Transport.stop();
        Tone.Transport.position = 0; // Set position to the beginning
        setIsPlaying(false);
    };

    return (
        <div className="App">
            <ToggleButton onToggle={handleToggle} />
            <div>
                {['red', 'green', 'blue', 'orange', 'purple', 'yellow'].map((color) => (
                    <ColorButton key={color} color={color} onSelectColor={handleColorSelect} />
                ))}
            </div>
            <button onClick={addTrack}>Add New Track</button>
            <ControlButtons
                isPlaying={isPlaying}
                onTogglePlayPause={togglePlayPause}
                onStop={stopPlayback}
            />
            <div className="tracks-container">
                {tracks.map((track, index) => (
                    <Track
                        key={track.id}
                        trackId={track.id}
                        mode={mode}
                        color={color}
                        order={index}
                        onSave={(data) => {
                            saveDrawing(data);
                            setCurrentTrackPoints(data.points);
                        }}
                        onDelete={deleteTrack}
                        onUpdatePoints={setCurrentTrackPoints}
                    />
                ))}
            </div>
            {currentTrackPoints.length > 0 && <Synthesizer points={currentTrackPoints} isPlaying={isPlaying} />}
        </div>
    );
}

export default App;
