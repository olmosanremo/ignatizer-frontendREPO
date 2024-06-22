import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const DrawingCanvas = ({ trackId, mode, isPlaying, points, onUpdatePoints, currentColor, drawMode }) => {
    const [lines, setLines] = useState(points);
    const [newLine, setNewLine] = useState(null);
    const isDrawing = useRef(false);

    const handleMouseDown = () => {
        if (mode === 'lock' || isPlaying) return;
        isDrawing.current = true;
        const pos = stageRef.current.getPointerPosition();
        setNewLine({ points: [pos.x, pos.y], color: currentColor });
    };

    const handleMouseMove = () => {
        if (!isDrawing.current || mode === 'lock' || isPlaying || !newLine) return;
        const stage = stageRef.current;
        const point = stage.getPointerPosition();
        const updatedLine = { ...newLine, points: newLine.points.concat([point.x, point.y]) };
        setNewLine(updatedLine);
    };

    const handleMouseUp = () => {
        if (!isDrawing.current || !newLine) return;
        const smoothedLine = smoothLine(newLine.points);
        setLines([...lines, { ...newLine, points: smoothedLine }]);
        setNewLine(null);
        isDrawing.current = false;
        onUpdatePoints([...lines, { ...newLine, points: smoothedLine }]);
    };

    const smoothLine = (points) => {
        const smoothedPoints = [];
        const length = points.length;

        for (let i = 0; i < length - 2; i += 2) {
            const x1 = points[i];
            const y1 = points[i + 1];
            const x2 = points[i + 2];
            const y2 = points[i + 3];

            smoothedPoints.push(x1, y1);

            for (let j = 1; j <= 5; j++) {
                const t = j / 5;
                const x = x1 + t * (x2 - x1);
                const y = y1 + t * (y2 - y1);
                smoothedPoints.push(x, y);
            }
        }
        smoothedPoints.push(points[length - 2], points[length - 1]);

        return smoothedPoints;
    };

    const stageRef = useRef(null);

    useEffect(() => {
        setLines(points);
    }, [points]);

    return (
        <Stage
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            ref={stageRef}
            style={{ border: '1px solid black' }}
        >
            <Layer>
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={line.points}
                        stroke={line.color}
                        strokeWidth={2}
                        tension={0.5} // Using tension to create smooth curves
                        lineCap="round"
                        globalCompositeOperation={
                            drawMode === 'erase' ? 'destination-out' : 'source-over'
                        }
                    />
                ))}
                {newLine && (
                    <Line
                        points={newLine.points}
                        stroke={newLine.color}
                        strokeWidth={2}
                        tension={0.5} // Using tension to create smooth curves
                        lineCap="round"
                        globalCompositeOperation={
                            drawMode === 'erase' ? 'destination-out' : 'source-over'
                        }
                    />
                )}
            </Layer>
        </Stage>
    );
};

export default DrawingCanvas;
