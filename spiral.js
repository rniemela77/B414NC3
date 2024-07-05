
// Fountain

class Demo extends Phaser.Scene {
    preload() {
        this.load.image('particle', '/circle.png');
    }

    create() {
        this.createTriangleSpiral(width / 2 - 50, height / 2 - 100, 100);
    }

    createTriangleSpiral(a, b, c) {
        const graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0a3a00 } });

        let triangle = new Phaser.Geom.Triangle.BuildEquilateral(a, b, c);

        const points = Phaser.Geom.Triangle.Decompose(triangle);

        let angle = 0;

        while (angle < Math.PI * 2) {
            Phaser.Geom.Triangle.Offset(triangle, Math.cos(angle) * 15, Math.sin(angle) * 15);

            Phaser.Geom.Triangle.Rotate(triangle, Math.PI / 20);

            Phaser.Geom.Triangle.Decompose(triangle, points);

            angle += Math.PI / 20;
        }

        graphics.strokePoints(points);

        // after 1s
        this.time.delayedCall(1000, () => {
            graphics.clear();
            

            // modify the triangle
            triangle = new Phaser.Geom.Triangle.BuildEquilateral(a + 100, b - 5, c - 5);

            // change color
            graphics.lineStyle(2, 0x333333);

            // draw the triangle
            graphics.strokePoints(points);

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
            debug: true,
        },
    },
    scene: Demo,
    backgroundColor: 0x777777
};

var game = new Phaser.Game(config);