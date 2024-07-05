
// Fountain

class Demo extends Phaser.Scene {
    preload() {
        this.load.image('particle', '/circle.png');
    }

    create() {
        const actions = [
            {
                action: 'moveLeft',
                movement: -1,
            },
            {
                action: 'moveRight',
                movement: 1,
            },
            {
                action: 'attack',
            }
        ];

        this.p1health = 100;
        this.p2health = 100;

        // show health
        this.p1healthText = this.add.text(10, 10, `${this.p1health}`, { fontSize: 24 });
        this.p2healthText = this.add.text(10, 40, `${this.p2health}`, { fontSize: 24 });

        this.p1actionText = this.add.text(10, 70, `P1:`, { fontSize: 24 });
        this.p2actionText = this.add.text(10, 100, `P2:`, { fontSize: 24 });

        this.p1unit = this.physics.add.sprite(width / 2, height / 2, 'particle');
        this.p2unit = this.physics.add.sprite(width / 2, height / 2 + 100, 'particle');
        this.p2unit.setTint(0xff0000);

        // drag
        this.p1unit.setDrag(100);
        this.p2unit.setDrag(100);

        const doAction = (unit, txt, targetHealth, unitHpTxt) => {
            // pick a random action
            const { action } = Phaser.Math.RND.pick(actions);

            const moveDistance = 120;

            let newText = '';



            if (action === 'moveLeft') {
                newText = `*move left*`;

                // move perpendicular to the target
                let target = unit === this.p1unit ? this.p2unit : this.p1unit;
                let perp = new Phaser.Math.Vector2(target.y - unit.y, unit.x - target.x).normalize().scale(moveDistance);

                unit.setVelocity(perp.x, perp.y);
            } else if (action === 'moveRight') {
                newText = `*move right*`;

                // move perpendicular to the target
                let target = unit === this.p1unit ? this.p2unit : this.p1unit;
                let perp = new Phaser.Math.Vector2(target.y - unit.y, unit.x - target.x).normalize().scale(moveDistance);

                unit.setVelocity(-perp.x, -perp.y);
            } else if (action === 'attack') {
                newText = `*attack*`;

                // shoot bullet from unit to target
                let target = unit === this.p1unit ? this.p2unit : this.p1unit;
                let bullet = this.physics.add.sprite(unit.x, unit.y, 'particle');
                let angle = Phaser.Math.Angle.Between(unit.x, unit.y, target.x, target.y);
                let bulletSpeed = 100;
                bullet.setTint(0x00ff00);
                bullet.setAcceleration(0, 0);
                bullet.setVelocity(Math.cos(angle) * bulletSpeed, Math.sin(angle) * bulletSpeed);
                bullet.setCollideWorldBounds(true);
                bullet.setScale(0.1);

                // if bullet collides
                this.physics.add.collider(bullet, target, (bullet, target) => {
                    bullet.destroy();

                    if (targetHealth === this.p1health) {
                        this.p1health -= 20;
                    } else {
                        this.p2health -= 20;
                    }
                });
            }


            txt.setText(txt.text + '\n' + newText);

            unitHpTxt.setText(`${targetHealth}`);
        }

        // every 1s
        this.time.addEvent({
            delay: 500,
            callback: () => {
                Math.random() > 0.5 ?
                    doAction(this.p1unit, this.p1actionText, this.p2health, this.p1healthText) :
                    doAction(this.p2unit, this.p2actionText, this.p1health, this.p2healthText)
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
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            // debug: true,
        },
    },
    scene: Demo,
    backgroundColor: 0x777777
};

var game = new Phaser.Game(config);