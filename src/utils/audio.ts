// Enhanced Web Audio API synthesizer for notification sounds

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

export type NotificationSoundType = 'complete' | 'start' | 'break' | 'achievement';

export function playNotificationSound(type: NotificationSoundType = 'complete') {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;

    if (type === 'complete') {
        // Pleasant "Singing Bowl" completion sound
        playChime(now, 392.00, 0.3, 3.0);    // G4 - root
        playChime(now + 0.1, 493.88, 0.2, 2.5);  // B4 - third
        playChime(now + 0.2, 587.33, 0.15, 2.0); // D5 - fifth
        playChime(now + 0.3, 783.99, 0.1, 1.5);  // G5 - octave

    } else if (type === 'start') {
        // Gentle ascending ping
        playTone(now, 523.25, 0.08, 0.15, 'sine');      // C5
        playTone(now + 0.08, 659.25, 0.08, 0.15, 'sine'); // E5
        playTone(now + 0.16, 783.99, 0.1, 0.2, 'sine');  // G5

    } else if (type === 'break') {
        // Soft descending tone (relaxation)
        playTone(now, 659.25, 0.15, 0.4, 'sine');       // E5
        playTone(now + 0.15, 523.25, 0.12, 0.35, 'sine'); // C5
        playTone(now + 0.3, 392.00, 0.1, 0.3, 'sine');   // G4

    } else if (type === 'achievement') {
        // Triumphant fanfare
        playTone(now, 523.25, 0.2, 0.15, 'triangle');     // C5
        playTone(now + 0.1, 659.25, 0.2, 0.15, 'triangle'); // E5
        playTone(now + 0.2, 783.99, 0.25, 0.2, 'triangle'); // G5
        playTone(now + 0.35, 1046.5, 0.3, 0.25, 'triangle'); // C6
    }
}

// Helper: Play a single tone
function playTone(
    startTime: number,
    frequency: number,
    duration: number,
    volume: number,
    waveType: OscillatorType = 'sine'
) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.1);
}

// Helper: Play a singing bowl / bell chime
function playChime(startTime: number, frequency: number, volume: number, decay: number) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    // Gentle attack, long decay
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + decay);

    oscillator.start(startTime);
    oscillator.stop(startTime + decay + 0.1);

    // Add overtone for richness
    const overtone = audioContext.createOscillator();
    const overtoneGain = audioContext.createGain();
    overtone.connect(overtoneGain);
    overtoneGain.connect(audioContext.destination);

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(frequency * 2.01, startTime); // Slight detuning for natural bell sound

    overtoneGain.gain.setValueAtTime(0, startTime);
    overtoneGain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.02);
    overtoneGain.gain.exponentialRampToValueAtTime(0.001, startTime + decay * 0.7);

    overtone.start(startTime);
    overtone.stop(startTime + decay + 0.1);
}
