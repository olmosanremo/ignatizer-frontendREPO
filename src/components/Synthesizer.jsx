import React, { useEffect } from 'react';
import * as Tone from 'tone';

const Synthesizer = ({ points }) => {
    useEffect(() => {
        const synth = new Tone.Synth().toDestination();

        const playNote = (time, note) => {
            synth.triggerAttackRelease(note, "8n", time);
        };

        const scheduleNotes = () => {
            const now = Tone.now();

            points.forEach((point) => {
                const pitch = getPitchFromY(point.y);
                const time = getTimeFromX(point.x);
                const note = `${pitch}${point.color}`; // Farbe zur Unterscheidung der Sounds

                Tone.Transport.schedule((time) => {
                    playNote(time, note);
                }, time + now);
            });

            Tone.Transport.start();
        };

        scheduleNotes();

        return () => {
            Tone.Transport.cancel();
        };
    }, [points]);

    const getPitchFromY = (y) => {
        // Convert y position to pitch (MIDI note number)
        const minY = 0;
        const maxY = 600; // Canvas height
        const minNote = 48; // C3
        const maxNote = 84; // C6
        return Math.floor(((maxY - y) / maxY) * (maxNote - minNote) + minNote);
    };

    const getTimeFromX = (x) => {
        // Convert x position to time
        const minX = 0;
        const maxX = 800; // Canvas width
        const totalTime = 10; // Total time in seconds for the animation to play
        return (x / maxX) * totalTime;
    };

    return null;
};

export default Synthesizer;
