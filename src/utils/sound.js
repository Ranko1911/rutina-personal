// Native Web Audio API sound generator (0 external dependencies)

export const soundFx = {
    isEnabled: () => {
        try {
            return localStorage.getItem('tasks_sound_enabled') !== 'false';
        } catch {
            return true;
        }
    },

    toggle: () => {
        try {
            const current = soundFx.isEnabled();
            localStorage.setItem('tasks_sound_enabled', String(!current));
            return !current;
        } catch {
            return false;
        }
    },

    playCheck: () => {
        if (!soundFx.isEnabled()) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            // Subtle uplifting two-tone chime
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.08); // G5

            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

            osc.start();
            osc.stop(ctx.currentTime + 0.16);
        } catch {
            // Audio context restricted or unavailable
        }
    },

    playCelebration: () => {
        if (!soundFx.isEnabled()) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'triangle';
                osc.frequency.value = freq;
                const startTime = ctx.currentTime + (idx * 0.09);

                gain.gain.setValueAtTime(0.07, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

                osc.start(startTime);
                osc.stop(startTime + 0.18);
            });
        } catch {
            // Ignore
        }
    }
};
