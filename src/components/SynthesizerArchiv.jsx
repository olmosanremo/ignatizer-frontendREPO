import React, { useEffect } from 'react';
import * as Tone from 'tone';

const Synthesizer = ({ points, isPlaying }) => {
    useEffect(() => {
        if (!isPlaying) {
            Tone.Transport.cancel();
            return;
        }

        const synths = {
            red: new Tone.Synth({ oscillator: { type: 'sine' } }).toDestination(),
            green: new Tone.Synth({ oscillator: { type: 'triangle' } }).toDestination(),
            blue: new Tone.Synth({ oscillator: { type: 'sawtooth' } }).toDestination(),
            orange: new Tone.Synth({ oscillator: { type: 'square' } }).toDestination(),
            purple: new Tone.Synth({
                oscillator: { type: 'fmsquare', modulationType: 'sine', modulationIndex: 3, harmonicity: 3.4 }
            }).toDestination(),
            yellow: new Tone.Synth({
                oscillator: { type: 'amsine2', harmonicity: 1.5, modulationIndex: 2 }
            }).toDestination()
        };

        const playNote = (time, note, color) => {
            synths[color].triggerAttackRelease(note, "8n", time);
        };

        const scheduleNotes = () => {
            const now = Tone.now();
            const maxX = 800; // Canvas width
            const totalTime = 10; // Total time in seconds for the animation to play

            let lastTime = 0;
            points.forEach((point) => {
                const pitch = getPitchFromY(point.y);
                const timeOffset = (point.x / maxX) * totalTime;
                const note = pitch;
                const color = point.color;

                if (timeOffset > lastTime) {
                    Tone.Transport.schedule((time) => {
                        playNote(time, note, color);
                    }, now + timeOffset);
                    lastTime = timeOffset;
                }
            });

            Tone.Transport.start();
        };

        scheduleNotes();

        return () => {
            Tone.Transport.cancel();
            Object.values(synths).forEach(synth => synth.dispose());
        };
    }, [points, isPlaying]);

    const getPitchFromY = (y) => {
        const minY = 0;
        const maxY = 600; // Canvas height
        const minNote = 48; // C3
        const maxNote = 84; // C6
        const noteNumber = Math.floor(((maxY - y) / maxY) * (maxNote - minNote) + minNote);
        return Tone.Frequency(noteNumber, "midi").toNote();
    };

    return null;
};

export default Synthesizer;
