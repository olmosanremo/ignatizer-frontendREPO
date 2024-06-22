import React, { useEffect } from 'react';
import * as Tone from 'tone';

const Synthesizer = ({ points, isPlaying }) => {
    useEffect(() => {
        if (!isPlaying) {
            console.log('Stopping transport');
            Tone.Transport.stop();
            Tone.Transport.cancel(); // Hiermit werden alle geplanten Events gelöscht
            return;
        }

        const synths = {
            red: new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.1, release: 1 } }).toDestination(),
            green: new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.1, release: 1 } }).toDestination(),
            blue: new Tone.Synth({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.1, release: 1 } }).toDestination(),
            orange: new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.1, release: 1 } }).toDestination(),
            purple: new Tone.Synth({
                oscillator: { type: 'fmsquare', modulationType: 'sine', modulationIndex: 3, harmonicity: 3.4 },
                envelope: { attack: 0.1, release: 1 }
            }).toDestination(),
            yellow: new Tone.Synth({
                oscillator: { type: 'amsine2', harmonicity: 1.5, modulationIndex: 2 },
                envelope: { attack: 0.1, release: 1 }
            }).toDestination()
        };

        const playNote = (time, note, color) => {
            console.log(`Playing note: ${note} at time: ${time} with color: ${color}`);
            synths[color].triggerAttack(note, time);
            Tone.Transport.schedule((time) => {
                synths[color].triggerRelease(time);
            }, time + 0.5);
        };

        const scheduleNotes = () => {
            const now = Tone.context.currentTime; // Use Tone.context.currentTime
            const maxX = 800; // Canvas width
            const totalTime = 60; // Total time in seconds for the animation to play (1 minute)

            let lastTime = now;
            points.forEach((line, index) => {
                console.log(`Processing line ${index}: `, line);
                const color = line.color;
                for (let i = 0; i < line.points.length; i += 2) {
                    const x = line.points[i];
                    const y = line.points[i + 1];
                    const pitch = getPitchFromY(y);
                    const timeOffset = (x / maxX) * totalTime;
                    const note = pitch;

                    console.log(`Scheduled note: ${note} at time offset: ${timeOffset} with color: ${color}`);

                    if (now + timeOffset > lastTime) {
                        Tone.Transport.schedule((time) => {
                            playNote(time, note, color);
                        }, now + timeOffset);
                        lastTime = now + timeOffset;
                    }
                }
            });

            Tone.Transport.start();
        };

        scheduleNotes();

        return () => {
            Tone.Transport.cancel(); // Entfernt alle geplanten Events beim Verlassen der Komponente
            Object.values(synths).forEach(synth => synth.dispose());
        };
    }, [points, isPlaying]);

    const getPitchFromY = (y) => {
        const minY = 0;
        const maxY = 600; // Canvas height
        const minNote = 48; // C3
        const maxNote = 84; // C6
        const noteNumber = Math.floor(((maxY - y) / maxY) * (maxNote - minNote) + minNote);
        const note = Tone.Frequency(noteNumber, "midi").toNote();
        console.log(`Converted y: ${y} to note: ${note}`);
        return note;
    };

    return null;
};

export default Synthesizer;
