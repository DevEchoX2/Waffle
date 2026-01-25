/**
 * Waffle Particle System - Constellation Version
 * Floating white dots connected by thin lines on a deep black background.
 */

(function() {
    // Prevent double initialization
    if (document.getElementById('particle-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    
    // Core positioning and styling
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-1', 
        pointerEvents: 'none',
        background: '#000'
    });

    document.body.style.backgroundColor = 'transparent';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;
    const connectionDistance = 150; // Maximum distance for a connection

    // Check if particles are enabled in settings
    const isEnabled = () => localStorage.getItem('particles-enabled') !== 'false';

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; 
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.5 + 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function setup() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        
        if (!isEnabled()) return;

        // Density calculation
        const count = Math.floor((canvas.width * canvas.height) / 9000);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        if (!isEnabled()) return;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    // Line opacity depends on distance
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (isEnabled()) {
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            drawLines();
        }
        
        animationFrame = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrame);
        setup();
        animate();
    });

    setup();
    animate();
})();
