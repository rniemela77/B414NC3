
// Fountain

class Demo extends Phaser.Scene {
    preload() {
        this.load.image('particle', '/circle.png');
    }

    create() {
        // base line
        const baseLine = new Phaser.Geom.Line(width / 2, 0, width / 2, height);
        this.add.graphics().lineStyle(5, 0x000).strokeLineShape(baseLine);


        // player is a rectangle
        this.player = this.add.rectangle(width / 2, height / 2, 1, height, 0x369);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // physics
        this.player.body.setDrag(100000, 0);
        this.player.body.setBounce(0.5, 0.5);

        // create button 2
        const gravityForce = 0;
        this.button1 = this.createButton(0, -gravityForce, 'keydown-A');
        this.button2 = this.createButton(width, gravityForce, 'keydown-D');



        // every 0.1s
        for (let i = 0; i < 40; i++) {
            // traditional sin wave
            const amplitude = 100;
            const frequency = 3
            
            const xPos = i * width / 40;
            const yPos = height / 2 + Math.sin(i / frequency) * amplitude;
            // set gravity to 0 
            this.physics.world.gravity.x = 0;
            // create ball
            const ball = this.add.sprite(xPos, yPos, 'particle');
            ball.setScale(0.5);
            // sin wave
            // physics
            this.physics.add.existing(ball);

            ball.body.setBounce(1, 1);
            ball.body.setCollideWorldBounds(true);
            ball.body.setVelocity(500, 50);
        }
    }

    createButton(xPos, gravityAmt, keycode) {
        const button = this.add.rectangle(xPos, height / 2, width / 2, height, 0x369);
        button.setInteractive();
        button.setAlpha(0.1);

        const pressButton = () => {
            this.physics.world.gravity.x += gravityAmt;

            // opacity animation
            button.setAlpha(0.15);
            button.setFillStyle(0x999);
            this.tweens.add({
                targets: button,
                alpha: 0.1,
                duration: 100,
            });

            console.log(this.physics.world.gravity.x, gravityAmt)
        }

        // when press A or pointer down=
        this.input.keyboard.on(keycode, () => {
            pressButton();
        });

        button.on('pointerdown', () => {
            pressButton();
        });

        return button
    }

    update() {
        // the width of the player is increased the further it is from the center
        // this.player.body.width = 1+ Math.abs(this.player.x - width / 2) / 10;
        // this.player.width = 1 + Math.abs(this.player.x - width / 2) / 10;
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
            gravity: { y: 0, x: -100 },
            debug: true,
        },
    },
    scene: Demo,
    backgroundColor: 0x777777
};

var game = new Phaser.Game(config);
