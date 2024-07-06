
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

            const moveDistance = 220;

            let target = unit === this.p1unit ? this.p2unit : this.p1unit;

            let newText = '';

            if (action === 'moveLeft' || action === 'moveRight') {
                newText = action;

                const centerX = unit === this.p1unit ? this.p2unit.x : this.p1unit.x;
                const centerY = unit === this.p1unit ? this.p2unit.y : this.p1unit.y;

                // find current angle between unit and center
                let angle = Phaser.Math.Angle.Between(unit.x, unit.y, centerX, centerY);

                // move angle by 15 degrees
                angle += action === 'moveLeft' ? 9 : -9;
                const x = centerX + Math.cos(angle) * moveDistance;
                const y = centerY + Math.sin(angle) * moveDistance;

                this.tweens.add({
                    targets: unit,
                    x: x,
                    y: y,
                    duration: 1000,
                    ease: 'Power2',
                    yoyo: false,
                    repeat: 0,
                });
            } else if (action === 'attack') {
                newText = `*attack*`;

                // create line from unit to target
                let graphics = this.add.graphics();
                const lineTarget = { x: target.x, y: target.y };
                graphics.lineStyle(2, 0xff0000);
                graphics.beginPath();
                graphics.moveTo(unit.x, unit.y);
                graphics.lineTo(target.x, target.y);
                graphics.strokePath();
                graphics.alpha = 0;
                graphics.setDepth(-1);              
                

                //fade line in from 0 to 1
                this.tweens.add({
                    targets: graphics,
                    alpha: 1,
                    duration: 500,
                    ease: 'Power2',
                    yoyo: false,
                    repeat: 0,
                    onComplete: () => {
                        // make line white
                        graphics.lineStyle(200, 0xffffff);
                        graphics.beginPath();
                        graphics.moveTo(unit.x, unit.y);
                        graphics.lineTo(lineTarget.x, lineTarget.y);
                        graphics.strokePath();

                        // if line graphic hits target
                        if (Phaser.Geom.Intersects.LineToRectangle(new Phaser.Geom.Line(unit.x, unit.y, lineTarget.x, lineTarget.y), target.getBounds())) {

                            // create white circle that expands and fades out
                            let circle = this.add.circle(target.x, target.y, 40, 0xffffff);
                            circle.setAlpha(1);
                            // after 0.1s
                            this.time.addEvent({
                                delay: 100,
                                callback: () => {
                                    this.tweens.add({
                                        targets: circle,
                                        scale: 5,
                                        alpha: 0,
                                        duration: 500,
                                        ease: 'Power2',
                                        yoyo: false,
                                        repeat: 0,
                                        onComplete: () => {
                                            circle.destroy();
                                        },
                                    });
                                },
                                loop: false,
                            });
                            

                            if (targetHealth === this.p1health) {
                                this.p1health -= 20;
                            } else {
                                this.p2health -= 20;
                            }
                        }


                        // fade line out
                        this.tweens.add({
                            targets: graphics,
                            alpha: 0,
                            duration: 500,
                            ease: 'Power2',
                            yoyo: false,
                            repeat: 0,
                            onComplete: () => {
                                graphics.destroy();
                            },
                        });
                    }
                });


                return;
                // shoot bullet from unit to target
                // let target = unit === this.p1unit ? this.p2unit : this.p1unit;
                // let bullet = this.physics.add.sprite(unit.x, unit.y, 'particle');
                // let angle = Phaser.Math.Angle.Between(unit.x, unit.y, target.x, target.y);
                // let bulletSpeed = 400;
                // bullet.setTint(0x00ff00);
                // bullet.setVelocity(Math.cos(angle) * bulletSpeed, Math.sin(angle) * bulletSpeed);
                // bullet.setCollideWorldBounds(true);
                // bullet.setScale(0.1);
                // target.setImmovable(true);

                // if bullet collides
                this.physics.add.collider(bullet, target, (bullet, target) => {
                    bullet.destroy();

                    if (targetHealth === this.p1health) {
                        this.p1health -= 20;
                    } else {
                        this.p2health -= 20;
                    }
                });

                // if bullet hits the wall
                this.physics.world.on('worldbounds', (body) => {
                    if (body.gameObject === bullet) {
                        bullet.destroy();
                    }
                });
            }

            txt.setText(txt.text + '\n' + newText);

            unitHpTxt.setText(`${targetHealth}`);
        }

        let turn = 0;
        // every 1s
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                // if (turn % 2 === 0) {
                doAction(this.p1unit, this.p1actionText, this.p2health, this.p1healthText)
                // } else {
                doAction(this.p2unit, this.p2actionText, this.p1health, this.p2healthText)
                // }

                // turn++;
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