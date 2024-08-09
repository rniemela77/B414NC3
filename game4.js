class Demo extends Phaser.Scene {
    preload() {
        this.load.image('particle', '/circle.png');
    }

    create() {
        // Create a line graphic
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(25, 0xffffff, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(width, 0);
        this.graphics.closePath();
        this.graphics.strokePath();

        // Move line to the bottom of the screen
        this.graphics.y = height;

        // Line moves upwards
        this.tweens.add({
            targets: this.graphics,
            y: 0,
            duration: 15000,
            repeat: -1,
        });

        // Create a group of particles with physics enabled
        this.particles = this.physics.add.group({
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 1,
        });

        // Create particles on user click
        this.input.on('pointerdown', (pointer) => {
            let elements = [
                { name: 'air', color: 0x0000ff },
                { name: 'earth', color: 0x00ff00 },
                { name: 'fire', color: 0xff0000 },
                { name: 'water', color: 0xffff00 },
            ];
            let element = elements[Math.floor(Math.random() * elements.length)];

            const angles = 2;
            for (let i = 0; i < angles; i++) {
                this.createParticle(pointer.x, pointer.y, i * 360 / angles, element);
            }
        });

        // Add collision detection between particles
        this.physics.add.collider(this.particles, this.particles, (particle1, particle2) => {
            console.log('Particles collided!');
            // particle1.setTint(0xffffff);
            // particle2.setTint(0xffffff);

            // winning matchups (air > earth > water > fire > air)
            let matchups = {
                0x0000ff: 0x00ff00,
                0x00ff00: 0xff0000,
                0xff0000: 0xffff00,
                0xffff00: 0x0000ff,
            };

            // Check if particles are of the same element
            if (particle1.tintTopLeft === particle2.tintTopLeft) {
                console.log('Same element');
                return;
            }

            // Check if particles are of the same element
            if (matchups[particle1.tintTopLeft] === particle2.tintTopLeft) {
                console.log('Winning matchup');
                // particle1.destroy();
                particle2.destroy();
            } else {
                console.log('Losing matchup');
                // particle1.setTint(0x000000);
                // particle2.setTint(0x000000);
            }
        });
    }

    createParticle(x, y, angle, element) {
        // Create a particle
        let particle = this.particles.create(x, y, 'particle');
        // move them slightly apart
        particle.x += Math.cos(angle * Math.PI / 180) * 25;
        particle.y += Math.sin(angle * Math.PI / 180) * 25;
        particle.setScale(1);
        particle.setCircle(25);
        particle.setTint(element.color);

        // Set velocity toward the specified angle
        let velocity = 300;
        particle.setVelocity(
            Math.cos(angle * Math.PI / 180) * velocity,
            Math.sin(angle * Math.PI / 180) * velocity
        );

        return particle;
    }
}

let width = window.innerWidth * window.devicePixelRatio;
let height = window.innerHeight * window.devicePixelRatio;

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: width,
    height: height,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
    scene: Demo,
    backgroundColor: '#808080',
};

var game = new Phaser.Game(config);
