// Lightweight Canvas Confetti generator (0 dependencies)

export const launchConfetti = () => {
    try {
        let canvas = document.getElementById('confetti-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'confetti-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        const width = (canvas.width = window.innerWidth);
        const height = (canvas.height = window.innerHeight);

        const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];
        const particles = Array.from({ length: 70 }).map(() => ({
            x: width * (0.3 + Math.random() * 0.4),
            y: height * 0.4,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.9) * 12,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 6 + Math.random() * 6,
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 12,
            opacity: 1
        }));

        let animationFrame;
        const render = () => {
            ctx.clearRect(0, 0, width, height);
            let active = 0;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.35; // gravity
                p.rotation += p.vRot;
                p.opacity -= 0.012;

                if (p.opacity > 0) {
                    active++;
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
                    ctx.restore();
                }
            });

            if (active > 0) {
                animationFrame = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, width, height);
                cancelAnimationFrame(animationFrame);
            }
        };

        render();
    } catch {
        // Fallback gracefully
    }
};
