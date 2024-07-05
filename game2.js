
// Fountain

class Demo extends Phaser.Scene {
    preload() {
        this.load.image('particle', '/circle.png');
    }

    createFountain(direction) {
        // point it up
        const angle = Phaser.Math.RadToDeg(direction);
        const angleAmount = 50;

        let speed = 130;


        // particles are blue circles
        const emitter = this.add.particles(width / 2, height / 2, 'particle', {
            angle: { min: angle - angleAmount, max: angle + angleAmount },
            speed: { min: speed, max: speed },
            lifespan: 9000,
            gravityY: -50 * Math.sin(direction),
            quantity: 0.00001,
            bounce: 2,
            bounds: new Phaser.Geom.Rectangle(0, 0, width, height),
            // alpha: { start: 1, end: 0 },
            scale: { start: 0.1, end: 0.1 },
            // color
            tint: { start: 0x111, end: 0x222 },
            // blendMode: 
        });

        // after 2 seconds, update speewd to 0
        this.time.delayedCall(2000, () => {
            // speed = 0;
            // emitter.setSpeed(speed);

        });

        return emitter;
    }

    createIntersection(start, end) {
        // create line from start to mouse
        const line1 = new Phaser.Geom.Line(start.x, start.y, end.x, end.y);
        const line1style = this.add.graphics().lineStyle(5, 0x000).strokeLineShape(line1);


        // opposite
        const line2 = new Phaser.Geom.Line(start.x, start.y, start.x - (end.x - start.x), start.y - (end.y - start.y));
        const line2style = this.add.graphics().lineStyle(5, 0xfff).strokeLineShape(line2);

        // find angle between start and mouse
        const line3angle = Phaser.Geom.Line.Angle(line1) - Math.PI / 2;

        // create new line (same distance as line1) from start to angle
        const line3 = new Phaser.Geom.Line(start.x, start.y, start.x + Math.cos(line3angle) * Phaser.Geom.Line.Length(line1), start.y + Math.sin(line3angle) * Phaser.Geom.Line.Length(line1));
        const line3style = this.add.graphics().lineStyle(5, 0xff0000).strokeLineShape(line3);

        // create new line (same distance as line1) from start to angle
        const line4angle = Phaser.Geom.Line.Angle(line1) + Math.PI / 2;
        const line4 = new Phaser.Geom.Line(start.x, start.y, start.x + Math.cos(line4angle) * Phaser.Geom.Line.Length(line1), start.y + Math.sin(line4angle) * Phaser.Geom.Line.Length(line1));
        const line4style = this.add.graphics().lineStyle(5, 0x00ff00).strokeLineShape(line4);


        // animate lines
        const lines = [line1style, line2style, line3style, line4style];
        lines.forEach((line) => {
            this.tweens.add({
                targets: line,
                alpha: 0.5,
                duration: 200,
                ease: 'Linear',
                repeat: 0,
                yoyo: false,
                onComplete: () => {
                    line.destroy();
                }
            });
        });
    }

    createFractal(start) {
        // get mouse position on mouse move
        this.input.on('pointermove', (pointer) => {
            // create line from start to mouse
            this.createIntersection(start, pointer);

            this.createIntersection(pointer, {x: pointer.x, y: height / 2});
        });
    }

    create() {
        // const up = this.createFountain(Phaser.Math.DegToRad(-90));
        // const down = this.createFountain(Phaser.Math.DegToRad(90));

        // on user click
        this.input.on('pointerdown', (pointer) => {

        });

        // get middle of screen
        const middle = new Phaser.Geom.Point(width / 2, height / 2);

        this.createFractal(middle);

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
    backgroundColor: 0x777777
};

var game = new Phaser.Game(config);

// 