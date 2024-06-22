import React, { useRef, useEffect, useState } from 'react';

const DrawingCanvas = ({ mode, color, onUpdatePoints }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const startDrawing = (event) => {
        setIsDrawing(true);
        draw(event);
    };

    const endDrawing = () => {
        setIsDrawing(false);
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        // Update points only after drawing ends
        onUpdatePoints(points);
    };

    const draw = (event) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        let x, y;
        if (event.touches) {
            x = event.touches[0].clientX - rect.left;
            y = event.touches[0].clientY - rect.top;
        } else {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }

        context.lineWidth = mode === 'write' ? 2 : 10;
        context.strokeStyle = mode === 'write' ? color : 'white';

        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);

        if (mode === 'write') {
            setPoints((prevPoints) => {
                const newPoints = [...prevPoints, { x, y, color }];
                return newPoints;
            });
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        points.forEach((point) => {
            context.beginPath();
            context.arc(point.x, point.y, 1, 0, Math.PI * 2);
            context.fillStyle = point.color;
            context.fill();
        });
    }, [points]);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ border: '1px solid black' }}
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={endDrawing}
            onTouchMove={draw}
        />
    );
};

export default DrawingCanvas;
