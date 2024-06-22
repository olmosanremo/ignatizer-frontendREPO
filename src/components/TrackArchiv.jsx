// import React, { useState } from 'react';
// import DrawingCanvas from './DrawingCanvas';
// import ModeDropdown from './ModeDropdown';
// import NameInput from './NameInput';
//
// const Track = ({ mode, color, onSave, onDelete, trackId, order }) => {
//     const [selectedMode, setSelectedMode] = useState('Ionisch'); // Default-Auswahl für das Dropdown-Menü
//     const [canvasName, setCanvasName] = useState(''); // Zustand für den Canvas-Namen
//     const [points, setPoints] = useState([]); // Zustand für die gezeichneten Punkte
//
//     const handleModeSelect = (mode) => {
//         setSelectedMode(mode);
//     };
//
//     const handleNameChange = (name) => {
//         setCanvasName(name);
//     };
//
//     const handleSavePoints = (newPoints) => {
//         setPoints(newPoints);
//     };
//
//     const saveDrawing = async () => {
//         const data = {
//             name: canvasName, // Canvas-Name in die zu speichernden Daten aufnehmen
//             points: points,
//             mode: selectedMode, // Den ausgewählten Modus hinzufügen
//             id: trackId, // Track-ID hinzufügen
//             order: order, // Position des Tracks hinzufügen
//         };
//
//         onSave(data);
//     };
//
//     return (
//         <div className="track">
//             <ModeDropdown selectedMode={selectedMode} onSelectMode={handleModeSelect} />
//             <NameInput name={canvasName} onNameChange={handleNameChange} />
//             <DrawingCanvas mode={mode} color={color} onSave={handleSavePoints} />
//             <button onClick={saveDrawing}>Save Drawing</button>
//             <button onClick={() => onDelete(trackId)}>Delete Track</button>
//         </div>
//     );
// };
//
// export default Track;



import React from 'react';
import DrawingCanvas from './DrawingCanvas';

const Track = ({ trackId, mode, color, onSave, onDelete, onUpdatePoints }) => {
    return (
        <div className="track">
            <DrawingCanvas mode={mode} color={color} onUpdatePoints={onUpdatePoints} />
            <input type="text" placeholder="Track Name" />
            <button onClick={() => onSave({ id: trackId, points: [] })}>Save Drawing</button>
            <button onClick={() => onDelete(trackId)}>Delete Track</button>
        </div>
    );
};

export default Track;

