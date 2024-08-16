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
        this.ball.setScale(4);

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

                if (this.pointer.x > width / 3 && this.pointer.x < width * 2 / 3) {
                    this.pointer.setTint(0x00ff00);
                    let circle = this.add.circle(this.pointer.x, this.pointer.y, 10, 0x5588ff);
                circle.setAlpha(0.5);


                this.tweens.add({
                    targets: circle,
                    alpha: 0,
                    scaleX: Math.random() * 40 + 15,
                    scaleY: Math.random() * 40 + 15,


                    duration: 100,
                    onComplete: () => {
                        circle.destroy();
                    }
                });
                }
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
        this.lane.fillRect(width / 3, 0, width / 3, height);
        this.lane.setDepth(-1);
        this.lane.setAlpha(0.5);

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
        default: 'matter',
    },
    scene: Demo,
    backgroundColor: '#8ccff',
};

var game = new Phaser.Game(config);
