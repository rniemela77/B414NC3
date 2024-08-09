class Demo extends Phaser.Scene {
    preload() {
        this.load.image('particle', '/circle.png');
    }

    create() {
        this.gravity = 300;
        this.particles = this.physics.add.group({
            key: 'particle',
            repeat: 399,
            setXY: {
                x: 100,
                y: 100,
                stepX: 50,
                stepY: 50,
            },
            bounceX: 0.9,  // Set bounce on X axis
            bounceY: 0.9,  // Set bounce on Y axis
            collideWorldBounds: true,  // Ensure particles collide with world bounds
            gravityY: 0, // Set default gravity for all particles
        });

        this.particles.children.entries.forEach((particle, index) => {
            particle.setScale(0.5);
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
            // debug: true,
        },
    },
    scene: Demo,
    // center between black and white
    backgroundColor: '#808080',
};

var game = new Phaser.Game(config);