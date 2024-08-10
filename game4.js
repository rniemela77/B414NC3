class Demo extends Phaser.Scene {
    preload() {
        this.load.image('particle', '/circle.png');
    }


    create() {
        // this.createRisingLine();

        // this.createParticleGroup();

        this.createHourglassParticles();
    }

    createRisingLine() {
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
    }

    createParticleGroup() {
        // Create a group of particles with physics enabled
        this.particles = this.physics.add.group({
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 1,
        });

        // Create particles on user click
        this.input.on('pointerdown', (pointer) => {
            let elements = [
                { name: 'air', color: 0xffffff },
                { name: 'earth', color: 0x000000 },
                { name: 'fire', color: 0xff0000 },
                { name: 'water', color: 0x0000ff },
            ];
            let element = elements[Math.floor(Math.random() * elements.length)];

            const angles = 4;
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
                air: 'earth',
                earth: 'water',
                water: 'fire',
                fire: 'air',
            };
            let matchupColors = {
                air: 0xffffff,
                earth: 0x000000,
                water: 0x0000ff,
                fire: 0xff0000,
            };

            let element1 = particle1.tintTopLeft;
            let element2 = particle2.tintTopLeft;

            if (matchups[element1] === element2) {
                particle1.setTint(matchupColors[element1]);
                particle2.setTint(matchupColors[element2]);
            }
        });
    }

    createHourglassParticles() {
        // turn off debug
        this.physics.world.drawDebug = false;

        this.gravity = 50;
        this.particles = this.physics.add.group({
            key: 'particle',
            repeat: 200,
            setXY: {
                x: 100,
                y: 100,
                stepX: 50,
                stepY: 50,
            },
            bounceX: 0.5,  // Set bounce on X axis
            bounceY: 0.5,  // Set bounce on Y axis
            // Set drag on X and Y axis
            dragX: 5, // this makes the particles slow down over time
            dragY: 5, // higher number = faster slow down

            collideWorldBounds: true,  // Ensure particles collide with world bounds
            gravityY: 0, // Set default gravity for all particles
        });

        this.particles.children.entries.forEach((particle, index) => {
            particle.setScale(0.3);
            particle.setCircle(25);
            particle.x = width / 2 + Phaser.Math.Between(-100, 100);
            particle.y = height / 2 + Phaser.Math.Between(-100, 100);
            particle.setCollideWorldBounds(true);

            if (index % 2 === 0) {
                particle.setTint(0xffffff);
                particle.body.gravity.y = this.gravity;
            } else {
                particle.setTint(0x000000);
                particle.body.gravity.y = -this.gravity;
            }

            // on colliding with edge, shrink the particle
            particle.onWorldBounds = true;
            particle.body.onWorldBounds = true;
            particle.body.world.on('worldbounds', (body) => {
                // make particle slightly smaller
                body.gameObject.setScale(body.gameObject.scaleX * 0.998);
            });
        });

        this.physics.add.collider(this.particles, this.particles);

        // show timer
        this.timeText = this.add.text(10, 10, 'Time: 0', {
            font: '32px Arial',
            fill: '#ffffff',
        });
        this.timerTime = 0;
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timerTime++;
                this.timeText.setText('Time: ' + this.timerTime);
                // this.gravity *= 0.9;
                if (this.gravity < 50) {
                    // this.gravity = 50;
                }
                this.particles.children.entries.forEach((particle, index) => {
                    if (index % 2 === 0) {
                        particle.body.gravity.y = this.gravity;
                    } else {
                        particle.body.gravity.y = -this.gravity;
                    }

                    if (particle.scaleX < 0.1) {
                        // particle.destroy();

                        // restore the particle
                        return;
                        particle.x = width / 2;
                        particle.y = height / 2;
                        particle.scaleX = 0.5;
                        particle.scaleY = 0.5;
                    }
                    // add 1 particle
                    // this.particles.create(particle.x, particle.y, 'particle').setScale(0.5).setCircle(25).setCollideWorldBounds(true);
                });
            },
            callbackScope: this,
            loop: true,
        });
    }

    createParticle(x, y, angle, element) {
        // Create a particle
        let particle = this.particles.create(x, y, 'particle');
        // move them slightly apart
        particle.x += Math.cos(angle * Math.PI / 180) * 50;
        particle.y += Math.sin(angle * Math.PI / 180) * 50;
        particle.setScale(1.5);
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
