import React, { useState, useEffect } from 'react';
import './App.css';
import ColorButton from './components/ColorButton';
import Track from './components/Track';
import Synthesizer from './components/Synthesizer';
import ControlButtons from './components/ControlButtons';
import * as Tone from 'tone';

function App() {
    const [tracks, setTracks] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentColor, setCurrentColor] = useState('black');
    const [tempo, setTempo] = useState(120); // Tempo-Status hinzufügen

    useEffect(() => {
        if (tracks.length === 0) {
            addTrack();
        }
        Tone.Transport.bpm.value = tempo; // Tempo beim Start setzen
    }, [tempo]);

    const addTrack = () => {
        setTracks([...tracks, { id: Date.now(), points: [], mode: 'lock' }]);
    };

    const togglePlayPause = async () => {
        await Tone.start(); // Ensure the AudioContext is started
        console.log('Transport started');
        if (isPlaying) {
            Tone.Transport.pause();
        } else {
            Tone.Transport.start();
        }
        setIsPlaying(!isPlaying);
    };

    const stopPlayback = () => {
        console.log('Stopping transport');
        Tone.Transport.stop();
        Tone.Transport.cancel(); // Hiermit werden alle geplanten Events gelöscht
        Tone.Transport.position = 0;
        setIsPlaying(false);
    };

    const allPoints = tracks.flatMap(track => track.points);

    console.log('All points for synthesizer: ', allPoints);

    return (
        <div className="App">
            <button onClick={addTrack}>Add New Track</button>
            <div>
                {['red', 'green', 'blue', 'orange', 'purple', 'yellow'].map((color) => (
                    <ColorButton key={color} color={color} onSelectColor={setCurrentColor} />
                ))}
            </div>
            <div>
                <label>
                    Tempo:
                    <input
                        type="number"
                        value={tempo}
                        onChange={(e) => setTempo(Number(e.target.value))}
                    />
                </label>
            </div>
            <ControlButtons
                isPlaying={isPlaying}
                onTogglePlayPause={togglePlayPause}
                onStop={stopPlayback}
            />
            <div className="tracks-container">
                {tracks.map((track) => (
                    <Track
                        key={track.id}
                        track={track}
                        isPlaying={isPlaying}
                        currentColor={currentColor}
                        onUpdateTrack={(updatedTrack) => {
                            setTracks(tracks.map(t => t.id === updatedTrack.id ? updatedTrack : t));
                        }}
                    />
                ))}
            </div>
            {allPoints.length > 0 && (
                <Synthesizer points={allPoints} isPlaying={isPlaying} />
            )}
        </div>
    );
}

export default App;
