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
    const [color, setColor] = useState('red'); // Defaultfarbe auf 'red' gesetzt
    const [tracks, setTracks] = useState([]); // Zustand für die Liste der Tracks
    const [currentTrackPoints, setCurrentTrackPoints] = useState([]); // Zustand für aktuelle Trackpunkte
    const [isPlaying, setIsPlaying] = useState(false); // Zustand für die Wiedergabe

    useEffect(() => {
        // Füge beim Initialisieren der App einen Track hinzu, falls noch keiner vorhanden ist
        if (tracks.length === 0) {
            addTrack();
        }
    }, []); // Leer-Array bedeutet, dass dieser Effekt nur einmal beim Initialisieren ausgeführt wird

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
            console.log('Save successful', response.data);
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

    const startPlayback = () => {
        if (!isPlaying) {
            Tone.Transport.start();
            setIsPlaying(true);
        }
    };

    const pausePlayback = () => {
        if (isPlaying) {
            Tone.Transport.pause();
            setIsPlaying(false);
        }
    };

    const stopPlayback = () => {
        Tone.Transport.stop();
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
            <ControlButtons onStart={startPlayback} onPause={pausePlayback} onStop={stopPlayback} />
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
                    />
                ))}
            </div>
            {currentTrackPoints.length > 0 && <Synthesizer points={currentTrackPoints} />}
        </div>
    );
}

export default App;
