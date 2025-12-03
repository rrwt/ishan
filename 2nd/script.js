const PARTY_DATE = new Date('2026-01-04T13:00:00');

class ConfettiSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#FFD93D', '#FF8C00', '#E53935', '#4CAF50', '#2196F3', '#9C27B0'];
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -10,
            size: Math.random() * 10 + 5,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            speedX: (Math.random() - 0.5) * 8,
            speedY: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        };
    }

    burst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle(x, y);
            particle.speedX = (Math.random() - 0.5) * 15;
            particle.speedY = (Math.random() - 0.5) * 15;
            this.particles.push(particle);
        }
    }

    rain(count = 100) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.particles.push(this.createParticle()), i * 30);
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = this.particles.filter(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.1;
            p.speedX *= 0.99;
            p.rotation += p.rotationSpeed;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
            return p.y < this.canvas.height + 20;
        });

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.update());
        }
    }

    start() {
        this.rain(80);
        this.update();
    }
}

class SoundSystem {
    constructor() {
        this.audioContext = null;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    play(soundName) {
        this.init();
        const soundMethod = this[`play_${soundName}`];
        if (soundMethod) {
            soundMethod.call(this);
        } else {
            this.playGenericHorn();
        }
    }

    play_car() {
        const time = this.audioContext.currentTime;
        this.playCarHonk(time, 0.6);
        this.playCarHonk(time + 0.8, 0.5);
        this.playCarHonk(time + 1.5, 0.4);
    }

    playCarHonk(startTime, duration) {
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(349, startTime);
        osc2.frequency.setValueAtTime(440, startTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, startTime);
        
        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
        gain.gain.setValueAtTime(0.25, startTime + duration - 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + duration);
        osc2.stop(startTime + duration);
    }

    play_truck() {
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, time);
        osc2.frequency.setValueAtTime(185, time);
        
        gain.gain.setValueAtTime(0.01, time);
        gain.gain.linearRampToValueAtTime(0.35, time + 0.1);
        gain.gain.setValueAtTime(0.35, time + 1.7);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        osc.start(time);
        osc2.start(time);
        osc.stop(time + 2);
        osc2.stop(time + 2);
    }

    play_ship() {
        const time = this.audioContext.currentTime;
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc1.type = 'sawtooth';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(80, time);
        osc2.frequency.setValueAtTime(120, time);
        osc1.frequency.linearRampToValueAtTime(75, time + 1.8);
        osc2.frequency.linearRampToValueAtTime(115, time + 1.8);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, time);
        
        gain.gain.setValueAtTime(0.01, time);
        gain.gain.linearRampToValueAtTime(0.4, time + 0.3);
        gain.gain.setValueAtTime(0.4, time + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + 2);
        osc2.stop(time + 2);
    }

    play_tractor() {
        const time = this.audioContext.currentTime;
        for (let i = 0; i < 16; i++) {
            this.playPutt(time + i * 0.125);
        }
    }

    playPutt(startTime) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, startTime);
        osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.08);
        
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
        
        osc.start(startTime);
        osc.stop(startTime + 0.12);
    }

    play_excavator() {
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'sawtooth';
        osc2.type = 'square';
        osc.frequency.setValueAtTime(42, time);
        osc2.frequency.setValueAtTime(21, time);
        
        osc.frequency.linearRampToValueAtTime(55, time + 0.5);
        osc.frequency.linearRampToValueAtTime(45, time + 1.0);
        osc.frequency.linearRampToValueAtTime(60, time + 1.5);
        osc.frequency.linearRampToValueAtTime(40, time + 2.0);
        
        osc2.frequency.linearRampToValueAtTime(27, time + 0.5);
        osc2.frequency.linearRampToValueAtTime(22, time + 1.0);
        osc2.frequency.linearRampToValueAtTime(30, time + 1.5);
        osc2.frequency.linearRampToValueAtTime(20, time + 2.0);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, time);
        filter.frequency.linearRampToValueAtTime(500, time + 0.5);
        filter.frequency.linearRampToValueAtTime(300, time + 1.0);
        filter.frequency.linearRampToValueAtTime(600, time + 1.5);
        filter.frequency.linearRampToValueAtTime(250, time + 2.0);
        
        gain.gain.setValueAtTime(0.01, time);
        gain.gain.linearRampToValueAtTime(0.35, time + 0.1);
        gain.gain.setValueAtTime(0.35, time + 1.9);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        osc.start(time);
        osc2.start(time);
        osc.stop(time + 2);
        osc2.stop(time + 2);
        
        for (let i = 0; i < 3; i++) {
            this.playBackupBeep(time + 0.2 + i * 0.6);
        }
    }
    
    playBackupBeep(startTime) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(1000, startTime);
        
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.setValueAtTime(0.15, startTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        
        osc.start(startTime);
        osc.stop(startTime + 0.2);
    }

    play_firetruck() {
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.type = 'sine';
        
        for (let i = 0; i < 4; i++) {
            const t = time + i * 0.5;
            osc.frequency.setValueAtTime(650, t);
            osc.frequency.linearRampToValueAtTime(850, t + 0.25);
            osc.frequency.setValueAtTime(650, t + 0.25);
        }
        
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.setValueAtTime(0.25, time + 1.9);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        osc.start(time);
        osc.stop(time + 2);
    }

    play_ambulance() {
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.type = 'sine';
        
        for (let i = 0; i < 4; i++) {
            const t = time + i * 0.5;
            osc.frequency.setValueAtTime(960, t);
            osc.frequency.setValueAtTime(770, t + 0.25);
        }
        
        gain.gain.setValueAtTime(0.22, time);
        gain.gain.setValueAtTime(0.22, time + 1.9);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        osc.start(time);
        osc.stop(time + 2);
    }

    play_police() {
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.type = 'sine';
        
        for (let i = 0; i < 6; i++) {
            const t = time + i * 0.33;
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);
            osc.frequency.exponentialRampToValueAtTime(400, t + 0.30);
        }
        
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.setValueAtTime(0.25, time + 1.9);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        osc.start(time);
        osc.stop(time + 2);
    }

    play_motorcycle() {
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'sawtooth';
        osc2.type = 'square';
        
        osc.frequency.setValueAtTime(80, time);
        osc.frequency.exponentialRampToValueAtTime(250, time + 0.5);
        osc.frequency.setValueAtTime(250, time + 1.2);
        osc.frequency.exponentialRampToValueAtTime(100, time + 2);
        
        osc2.frequency.setValueAtTime(40, time);
        osc2.frequency.exponentialRampToValueAtTime(125, time + 0.5);
        osc2.frequency.setValueAtTime(125, time + 1.2);
        osc2.frequency.exponentialRampToValueAtTime(50, time + 2);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, time);
        filter.frequency.linearRampToValueAtTime(2000, time + 0.5);
        filter.frequency.linearRampToValueAtTime(600, time + 2);
        
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.linearRampToValueAtTime(0.3, time + 0.5);
        gain.gain.linearRampToValueAtTime(0.25, time + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        osc.start(time);
        osc2.start(time);
        osc.stop(time + 2);
        osc2.stop(time + 2);
    }

    play_train() {
        const time = this.audioContext.currentTime;
        this.playWhistle(time, 0.8);
        this.playWhistle(time + 1.0, 0.9);
    }

    playWhistle(startTime, duration) {
        const osc = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'sine';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(440, startTime);
        osc.frequency.linearRampToValueAtTime(420, startTime + duration);
        osc2.frequency.setValueAtTime(554, startTime);
        osc2.frequency.linearRampToValueAtTime(530, startTime + duration);
        
        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.1);
        gain.gain.setValueAtTime(0.25, startTime + duration - 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        osc.start(startTime);
        osc2.start(startTime);
        osc.stop(startTime + duration);
        osc2.stop(startTime + duration);
    }

    play_taxi() {
        const time = this.audioContext.currentTime;
        for (let i = 0; i < 5; i++) {
            this.playHorn(520, 0.2, time + i * 0.4);
        }
    }

    playHorn(freq, dur, startTime) {
        const osc = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'square';
        osc2.type = 'square';
        osc.frequency.setValueAtTime(freq, startTime);
        osc2.frequency.setValueAtTime(freq * 1.5, startTime);
        
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + dur);
        
        osc.start(startTime);
        osc2.start(startTime);
        osc.stop(startTime + dur);
        osc2.stop(startTime + dur);
    }

    play_airplane() {
        const time = this.audioContext.currentTime;
        const noise = this.createNoise(2.5);
        const osc = this.audioContext.createOscillator();
        const filter = this.audioContext.createBiquadFilter();
        const filter2 = this.audioContext.createBiquadFilter();
        const gain = this.audioContext.createGain();
        
        noise.connect(filter);
        osc.connect(filter2);
        filter.connect(gain);
        filter2.connect(gain);
        gain.connect(this.audioContext.destination);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, time);
        filter.frequency.linearRampToValueAtTime(2500, time + 1);
        filter.frequency.linearRampToValueAtTime(1200, time + 2);
        filter.Q.value = 0.5;
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, time);
        osc.frequency.linearRampToValueAtTime(150, time + 1);
        osc.frequency.linearRampToValueAtTime(80, time + 2);
        
        filter2.type = 'lowpass';
        filter2.frequency.setValueAtTime(400, time);
        
        gain.gain.setValueAtTime(0.01, time);
        gain.gain.linearRampToValueAtTime(0.3, time + 0.5);
        gain.gain.setValueAtTime(0.3, time + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        noise.start(time);
        osc.start(time);
        noise.stop(time + 2);
        osc.stop(time + 2);
    }

    play_helicopter() {
        const time = this.audioContext.currentTime;
        for (let i = 0; i < 20; i++) {
            this.playChop(time + i * 0.1);
        }
    }

    playChop(startTime) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, startTime);
        osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.07);
        
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);
        
        osc.start(startTime);
        osc.stop(startTime + 0.09);
    }

    play_rocket() {
        const time = this.audioContext.currentTime;
        const noise = this.createNoise(2.5);
        const osc = this.audioContext.createOscillator();
        const filter = this.audioContext.createBiquadFilter();
        const gain = this.audioContext.createGain();
        
        noise.connect(filter);
        osc.connect(gain);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50, time);
        osc.frequency.exponentialRampToValueAtTime(200, time + 1.5);
        osc.frequency.exponentialRampToValueAtTime(300, time + 2);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, time);
        filter.frequency.exponentialRampToValueAtTime(4000, time + 1.5);
        
        gain.gain.setValueAtTime(0.01, time);
        gain.gain.linearRampToValueAtTime(0.4, time + 0.8);
        gain.gain.setValueAtTime(0.4, time + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        noise.start(time);
        osc.start(time);
        noise.stop(time + 2);
        osc.stop(time + 2);
    }

    play_smallplane() {
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        const gain = this.audioContext.createGain();
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, time);
        
        lfo.type = 'square';
        lfo.frequency.setValueAtTime(25, time);
        lfoGain.gain.setValueAtTime(20, time);
        
        gain.gain.setValueAtTime(0.01, time);
        gain.gain.linearRampToValueAtTime(0.2, time + 0.2);
        gain.gain.setValueAtTime(0.2, time + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        lfo.start(time);
        osc.start(time);
        lfo.stop(time + 2);
        osc.stop(time + 2);
    }

    play_ufo() {
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        const gain = this.audioContext.createGain();
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, time);
        osc.frequency.linearRampToValueAtTime(900, time + 1);
        osc.frequency.linearRampToValueAtTime(500, time + 2);
        
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(6, time);
        lfoGain.gain.setValueAtTime(100, time);
        
        gain.gain.setValueAtTime(0.01, time);
        gain.gain.linearRampToValueAtTime(0.2, time + 0.1);
        gain.gain.setValueAtTime(0.2, time + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        lfo.start(time);
        osc.start(time);
        lfo.stop(time + 2);
        osc.stop(time + 2);
    }

    createNoise(duration) {
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        return noise;
    }

    playGenericHorn() {
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(350, time);
        
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
        
        osc.start(time);
        osc.stop(time + 2);
    }
}

class CountdownTimer {
    constructor(targetDate) {
        this.targetDate = targetDate;
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
    }

    update() {
        const now = new Date();
        const diff = this.targetDate - now;

        if (diff <= 0) {
            this.elements.days.textContent = '🎉';
            this.elements.hours.textContent = '🎉';
            this.elements.minutes.textContent = '🎉';
            this.elements.seconds.textContent = '🎉';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        this.elements.days.textContent = String(days).padStart(2, '0');
        this.elements.hours.textContent = String(hours).padStart(2, '0');
        this.elements.minutes.textContent = String(minutes).padStart(2, '0');
        this.elements.seconds.textContent = String(seconds).padStart(2, '0');
    }

    start() {
        this.update();
        setInterval(() => this.update(), 1000);
    }
}

class TrafficLight {
    constructor() {
        this.element = document.getElementById('traffic-light');
        this.lights = {
            red: this.element.querySelector('.red'),
            yellow: this.element.querySelector('.yellow'),
            green: this.element.querySelector('.green')
        };
        this.currentLight = 'red';
        this.partyMode = false;
    }

    setLight(color) {
        Object.values(this.lights).forEach(light => light.classList.remove('active'));
        this.lights[color].classList.add('active');
        this.currentLight = color;
    }

    cycle() {
        const sequence = ['red', 'yellow', 'green'];
        const currentIndex = sequence.indexOf(this.currentLight);
        const nextIndex = (currentIndex + 1) % sequence.length;
        this.setLight(sequence[nextIndex]);

        if (sequence[nextIndex] === 'green' && !this.partyMode) {
            this.partyMode = true;
            document.body.classList.add('party-mode');
            window.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 100);
            window.confetti.update();
            
            setTimeout(() => {
                this.partyMode = false;
                document.body.classList.remove('party-mode');
            }, 5000);
        }
    }

    init() {
        this.element.addEventListener('click', () => this.cycle());
    }
}

function initVehicleButtons() {
    const buttons = document.querySelectorAll('.vehicle-btn');
    const soundSystem = new SoundSystem();

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const vehicle = btn.dataset.vehicle;
            soundSystem.play(vehicle);
            
            btn.classList.add('honking');
            setTimeout(() => btn.classList.remove('honking'), 300);
            
            const rect = btn.getBoundingClientRect();
            window.confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
            window.confetti.update();
        });
    });

    const paradeVehicles = document.querySelectorAll('.vehicle-parade .vehicle');
    paradeVehicles.forEach(vehicle => {
        vehicle.addEventListener('click', () => {
            const classList = vehicle.className.split(' ');
            const vehicleType = classList.find(c => c !== 'vehicle');
            const soundMap = {
                'car': 'car', 'truck': 'truck', 'ship': 'ship', 'tractor': 'tractor',
                'excavator': 'excavator', 'fire-truck': 'firetruck', 'motorcycle': 'motorcycle',
                'train': 'train', 'taxi': 'taxi', 'police': 'police'
            };
            soundSystem.play(soundMap[vehicleType] || 'car');
        });
    });

    const skyVehicles = document.querySelectorAll('.sky-parade .sky-vehicle');
    skyVehicles.forEach(vehicle => {
        vehicle.addEventListener('click', () => {
            const classList = vehicle.className.split(' ');
            const vehicleType = classList.find(c => c !== 'sky-vehicle');
            const soundMap = {
                'airplane': 'airplane', 'helicopter': 'helicopter', 'rocket': 'rocket',
                'small-plane': 'smallplane', 'ufo': 'ufo'
            };
            soundSystem.play(soundMap[vehicleType] || 'airplane');
            
            const rect = vehicle.getBoundingClientRect();
            window.confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
            window.confetti.update();
        });
    });
}

function initRSVP() {
    const yesBtn = document.getElementById('rsvp-yes');
    const responseDiv = document.getElementById('rsvp-response');

    if (yesBtn) {
        yesBtn.addEventListener('click', () => {
            window.confetti.rain(150);
            window.confetti.update();
            
            setTimeout(() => {
                responseDiv.innerHTML = `<div class="response-message">🎉 ¡Gracias! Te esperamos en la fiesta 🚗💨</div>`;
            }, 500);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('confetti-canvas');
    window.confetti = new ConfettiSystem(canvas);
    
    setTimeout(() => window.confetti.start(), 500);

    const countdown = new CountdownTimer(PARTY_DATE);
    countdown.start();

    const trafficLight = new TrafficLight();
    trafficLight.init();

    initVehicleButtons();
    initRSVP();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.detail-card, .game-section, .rsvp-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            document.body.classList.add('party-mode');
            window.confetti.rain(200);
            window.confetti.update();
            
            const soundSystem = new SoundSystem();
            ['car', 'truck', 'firetruck', 'police', 'train', 'helicopter', 'rocket'].forEach((sound, i) => {
                setTimeout(() => soundSystem.play(sound), i * 400);
            });
            
            konamiIndex = 0;
            setTimeout(() => document.body.classList.remove('party-mode'), 10000);
        }
    } else {
        konamiIndex = 0;
    }
});
