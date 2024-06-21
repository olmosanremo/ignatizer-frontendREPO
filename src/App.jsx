import React, { useState } from 'react';
import './App.css';
import ToggleButton from './components/ToggleButton';
import DrawingCanvas from './components/DrawingCanvas';
import ColorButton from './components/ColorButton';

function App() {
    const [mode, setMode] = useState('write');
    const [color, setColor] = useState('black');

    const handleToggle = (newMode) => {
        setMode(newMode);
    };

    const handleColorSelect = (selectedColor) => {
        setColor(selectedColor);
    };

    return (
        <div className="App">
            <ToggleButton onToggle={handleToggle} />
            <div>
                {['red', 'green', 'blue', 'orange', 'purple', 'yellow'].map((color) => (
                    <ColorButton key={color} color={color} onSelectColor={handleColorSelect} />
                ))}
            </div>
            <DrawingCanvas mode={mode} color={color} />
        </div>
    );
}

export default App;
