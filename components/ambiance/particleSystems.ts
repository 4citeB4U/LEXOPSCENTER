
// A simple particle base class
class Particle {
    x: number;
    y: number;
    size: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    initialLife: number;

    constructor(x: number, y: number, size: number, vx: number, vy: number, color: string, life: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.initialLife = life;
    }

    isDead() {
        return this.life <= 0;
    }
}

// --- Ember/Fire System ---
class EmberParticle extends Particle {
    update() {
        this.life--;
        this.vy *= 0.99; // Slows down as it rises
        this.vx += (Math.random() - 0.5) * 0.2; // Wiggle
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.life / this.initialLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

export const createFireSystem = (canvas: HTMLCanvasElement) => {
    let particles: EmberParticle[] = [];
    const update = (ctx: CanvasRenderingContext2D) => {
        // Emit new particles
        if (Math.random() > 0.5) {
            const x = Math.random() * canvas.width;
            const y = canvas.height;
            const size = Math.random() * 3 + 1;
            const vx = Math.random() - 0.5;
            const vy = -(Math.random() * 2 + 1);
            const color = `hsl(${Math.random() * 30 + 10}, 100%, 50%)`;
            const life = Math.random() * 60 + 120;
            particles.push(new EmberParticle(x, y, size, vx, vy, color, life));
        }

        // Update and draw existing particles
        particles = particles.filter(p => !p.isDead());
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
    };
    return { update };
};

// --- Stardust/Starfield System ---
class StarParticle extends Particle {
    initialX: number;
    constructor(x: number, y: number, size: number, vx: number, vy: number, color: string, life: number) {
        super(x, y, size, vx, vy, color, life);
        this.initialX = life; // Use life to store canvas.width for reset
    }
    update() {
        this.x += this.vx;
        if (this.x < 0) this.x = this.initialX; 
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export const createStarfieldSystem = (canvas: HTMLCanvasElement) => {
    let particles: StarParticle[] = [];
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5;
        const vx = -(Math.random() * 0.5 + 0.1); // Move left
        const color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
        particles.push(new StarParticle(x, y, size, vx, 0, color, canvas.width));
    }

    const update = (ctx: CanvasRenderingContext2D) => {
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
    };
    return { update };
};

// --- Digital Rain/Matrix System ---
export const createDigitalRainSystem = (canvas: HTMLCanvasElement) => {
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}';

    const update = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    };
    return { update };
};

// --- Snowfall System ---
class SnowParticle extends Particle {
    initialX: number;
    initialY: number;

    constructor(x: number, y: number, size: number, vx: number, vy: number, color: string, life: number, canvasWidth: number) {
        super(x, y, size, vx, vy, color, life);
        this.initialX = canvasWidth;
        this.initialY = life; // Use life to store canvas.height
    }

    update() {
        this.y += this.vy;
        this.x += this.vx;

        if (this.y > this.initialY) {
            this.y = 0;
            this.x = Math.random() * this.initialX;
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

export const createSnowfallSystem = (canvas: HTMLCanvasElement) => {
    let particles: SnowParticle[] = [];
    for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2 + 1;
        const vy = Math.random() * 1 + 0.5;
        const vx = (Math.random() - 0.5) * 0.5;
        particles.push(new SnowParticle(x, y, size, vx, vy, 'white', canvas.height, canvas.width));
    }

    const update = (ctx: CanvasRenderingContext2D) => {
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
    };
    return { update };
};
