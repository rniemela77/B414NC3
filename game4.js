class Demo extends Phaser.Scene {
    preload() {
        this.load.image('particle', '/circle.png');
    }


    create() {
        this.matter.world.setGravity(0, 0.5);
        this.matter.world.setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        // Create a ball that will bounce off walls
        this.ball = this.matter.add.image(420, 100, 'particle', null, {
            shape: 'circle',
            friction: 0,        // No friction
            frictionAir: 0,     // No air resistance
            restitution: 1,     // Perfectly elastic collision
            density: 1,         // Control mass as needed
            mass: 1,            // Set mass for the ball
        });
        this.ball.setVelocity(1, 1);

        this.pointer = null;

        this.input.on('pointerdown', (pointer) => {
            if (this.pointer) {
                this.pointer.destroy();
                this.pointer = null;
                this.matter.world.removeConstraint(this.constrainty);
                return;
            }
            this.pointer = this.matter.add.image(pointer.x, pointer.y, 'ball', null, {
                shape: 'circle',
                friction: 1,
                restitution: 0.6
            });

            this.pointer.setIgnoreGravity(true);
            this.pointer.setStatic(true);

            let distance = Phaser.Math.Distance.Between(this.ball.x, this.ball.y, pointer.x, pointer.y);
            this.constrainty = this.matter.add.constraint(this.ball, this.pointer, distance, 0.5, {
                stiffness: 0.1,  // Increase stiffness for more responsive swings
                damping: 0.1,  // Add damping to reduce jitteriness
            });
        });

        // on mousemove
        this.input.on('pointermove', (pointer) => {
            if (this.pointer) {
                this.pointer.setPosition(pointer.x, pointer.y);
            }
        });


        
        
        
        
        // LINE
        this.liney = new Phaser.Geom.Line(0, 0, 0, 0);
        this.graphics = this.add.graphics();
        this.events.on('update', () => {
            this.graphics.clear();
            if (this.pointer) {
                this.liney.setTo(this.ball.x, this.ball.y, this.pointer.x, this.pointer.y);
                this.graphics.lineStyle(2, 0xffffff, 1);
                this.graphics.strokeLineShape(this.liney);
            }
        });

        // create cyan square area
        this.lane = this.add.graphics();
        this.lane.fillStyle(0x00ffff, 1);
        this.lane.fillRect(width * 0.2, 0, width * 0.55, height);
        this.lane.setDepth(-1);
        this.lane.setAlpha(0.2);

        // move the lane
        // this.tweens.add({
        //     targets: this.lane,
        //     x: width * 0.1,
        //     scaleX: 0.9,
        //     duration: 1000,
        //     yoyo: true,
        //     repeat: -1,
        //     ease: 'Sine.easeInOut',
        // });

        // every 0.2s
        this.timerAmount = 1;
        this.timerDisplay = this.add.text(10, 50, 'Time: 0', {
            font: '32px Arial',
            fill: '#ffffff',
        });
        this.scoreDisplay = this.add.text(10, 10, 'Score: 0', {
            font: '32px Arial',
            fill: '#ffffff',
        });
        this.score = 1;
        this.scorePctDisplay = this.add.text(width - 150, 90, 'Score: 0%', {
            font: '32px Arial',
            fill: '#ffffff',
        });
        this.time.addEvent({
            delay: 200,
            callback: () => {
                if (this.pointer) {
                    this.scorePctDisplay.setText('Score: ' + Math.floor(this.score / this.timerAmount * 100) + '%');

                    this.timerAmount++;
                    this.timerDisplay.setText('Time: ' + this.timerAmount);

                    // check the lane
                    if (this.pointer.x > width * 0.2 && this.pointer.x < width * 0.75) {
                        this.score++;
                        this.scoreDisplay.setText('Score: ' + this.score);
                    }

                }
            },
            loop: true,
        });
        this.time.addEvent({
            delay: 200,
            callback: () => {
                //
            }
        });



        // Create a square that will move and bounce around the screen
        // const square = this.matter.add.image(200, 200, 'square', null, {
        //     shape: {
        //         type: 'rectangle',
        //         width: 30,   // Set the size of the square
        //         height: 30,
        //     },
        //     friction: 0,        // No friction
        //     frictionAir: 0,     // No air resistance
        //     restitution: 1,     // Perfectly elastic collision
        //     angle: 45,          // Set the initial angle of the square
        // density: 1,         // Control mass as needed
        // mass: 1,            // Set mass for the square

        // }).setScale(5).setOrigin(0.5).setBounce(1, 1);

        // Initial velocity to make it move
        // square.setVelocity(4, 4);



        // if square touches world bounds, destroy it


        // this.square.setIgnoreGravity(true);

        // add a constraint between the square and ballA
        // this.constrainty2 = this.matter.add.constraint(ballA, this.square, 100, 0.5, {
        //     stiffness: 0.0001,  // Increase stiffness for more responsive swings
        //     damping: 0.001,  // Add damping to reduce jitteriness
        // });

        // set velocity on square
        // this.square.setVelocity(20, 10)
        //     .setFriction(0, 0)
        //     .setBounce(1, 1)
        //     .setIgnoreGravity(true)
        //     .setFrictionAir(0, 0);



        // this.createRisingLine();

        // this.createParticleGroup();

        // this.createHourglassParticles();

        // create a group of particles
        // let flowers = this.physics.add.group({
        //     key: 'particle',
        //     repeat: 10,
        //     setXY: {
        //         x: 100,
        //         y: 100,
        //         stepX: 50,
        //         stepY: 50,
        //     },
        //     bounceX: 1,
        //     bounceY: 1,
        //     collideWorldBounds: true,
        // });



        return;

        // create a group of flowers
        this.flowers = this.physics.add.group({
            // key: 'particle',
            // repeat: 0,
            // setXY: {
            //     x: 100,
            //     y: 100,
            //     stepX: 50,
            //     stepY: 50,
            // },
            bounceX: 1,
            bounceY: 1,
            collideWorldBounds: true,
            // setCircle: 25,
        });
        this.flowers.children.entries.forEach((flower) => {
            flower.setCircle(25);
        });
        this.physics.add.collider(this.flowers, this.flowers);

        // create flower on click
        this.input.on('pointerdown', (pointer) => {
            this.createFloatingFlower(pointer);
        });
    }

    createFloatingFlower(pointer) {
        const flower = this.physics.add.image(pointer.x, pointer.y, 'particle')
            .setBounce(1, 1)
            .setScale(2)
            .setCircle(25)
            .setCollideWorldBounds(true);

        // add it to the group
        this.flowers.add(flower);


        // make it bounce off other flowers
        this.physics.add.collider(this.flowers, flower);

        const cursor = this.add.image(0, 0, 'particle').setVisible(false);

        let moving = false;

        this.input.on('pointerup', (pointer2) => {
            if (moving) return;

            // shower cursor
            cursor.copyPosition(pointer2).setVisible(true);

            this.physics.moveToObject(flower, cursor, 400);

            moving = true;
        });
    }

    createSwingingGame() {
        this.matter.world.setGravity(0, 2);
        this.matter.world.setBounds();

        const ballA = this.matter.add.image(420, 100, 'ball', null, {
            shape: 'circle',
            friction: 0,
            restitution: 1,
            density: 2,
            mass: 0.01,
        });

        this.input.on('pointerdown', (pointer) => {
            this.ballB = this.matter.add.image(pointer.x, pointer.y, 'ball', null, {
                shape: 'circle',
                friction: 1,
                restitution: 0.6
            });

            this.ballB.setIgnoreGravity(true);
            this.ballB.setStatic(true);

            let distance = Phaser.Math.Distance.Between(ballA.x, ballA.y, pointer.x, pointer.y);
            this.constrainty = this.matter.add.constraint(ballA, this.ballB, distance, 0.5, {
                stiffness: 0.1,  // Increase stiffness for more responsive swings
                damping: 0.1,  // Add damping to reduce jitteriness
            });
        });

        this.input.on('pointerup', () => {
            ballA.setIgnoreGravity(false);

            // Destroy the constraint to release the ball
            if (this.constrainty) {
                this.matter.world.removeConstraint(this.constrainty);
                this.constrainty = null;
            }

            this.ballB.destroy();

        });

        // Add an updraft every few seconds
        this.time.addEvent({
            delay: 1000,  // Every 2 seconds
            callback: () => {
            },
            loop: true,
        });
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
            dragX: 0, // this makes the particles slow down over time
            dragY: 0, // higher number = faster slow down

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

// smaller one, square
let smaller = width < height ? width : height;


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
        // default: 'arcade',
        default: 'matter',

        // arcade: {
        //     gravity: { y: 0 },
        //     debug: true,
        // },
    },
    scene: Demo,
    backgroundColor: '#808080',
};

var game = new Phaser.Game(config);
