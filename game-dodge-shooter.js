// Description: A game where two units move around and attack each other
import Controls from "./scripts/controls.js";
import Actions from "./scripts/actions.js";
import Unit from "./scripts/unit.js";

class Demo extends Phaser.Scene {
    preload() {
        this.load.image('particle', '/circle.png');
    }

    create() {
        this.width = width;
        this.height = height;

        this.actions = new Actions(this);
        this.actions.createActions();

        this.p1shields = this.physics.add.group();
        this.p2shields = this.physics.add.group();

        // Create unit
        this.unit1 = new Unit(this, 1);
        this.unit2 = new Unit(this, 2);

        // console.log(this.unit1.unit);
        // this.controls = new Controls(this);

        // this.controls.createControls(this.p1unit, this.p1Actions);
        // this.controls.createControls(this.p2unit, this.p2Actions);

        const doAction = (unit, actions, target) => {
            // pick a random action based on frequency
            let action = Phaser.Math.RND.weightedPick(
                actions.map(a => a), // actions
                actions.map(a => a.frequency) // frequencies
            );

            if (action.name === 'moveLeft' || action.name === 'moveRight') {
                unit.move(
                    action.name === 'moveLeft' ? -1 : 1,
                    action.distance,
                    target.unit
                );
            } else if (action === 'attack') {
                return;

                // create red line
                let graphics = this.add.graphics();
                const lineTarget = { x: target.x, y: target.y };
                graphics.lineStyle(2, 0xff0000);
                graphics.beginPath();
                graphics.moveTo(unit.x, unit.y);
                graphics.lineTo(target.x, target.y);
                graphics.strokePath();
                graphics.alpha = 0;
                graphics.setDepth(-1);


                // fade red line in
                this.tweens.add({
                    targets: graphics,
                    alpha: 1,
                    duration: 500,
                    ease: 'Power2',
                    yoyo: false,
                    repeat: 0,
                    onComplete: () => {

                        // shoot bullet
                        let bullet = this.physics.add.sprite(unit.x, unit.y, 'particle');
                        let angle = Phaser.Math.Angle.Between(unit.x, unit.y, target.x, target.y);
                        let bulletSpeed = 400;
                        bullet.setVelocity(Math.cos(angle) * bulletSpeed, Math.sin(angle) * bulletSpeed);
                        bullet.setCollideWorldBounds(true);
                        bullet.setScale(0.2);

                        // bullet scales up and fades out
                        this.tweens.add({
                            targets: bullet,
                            scale: 1.5,
                            alpha: 0,
                            duration: 2000,
                            ease: 'Power2',
                            yoyo: false,
                            repeat: 0,
                            onComplete: () => {
                                bullet.destroy();
                            }
                        });

                        // if bullet collides with target
                        this.physics.add.collider(bullet, target, (bullet, target) => {
                            bullet.destroy();

                            if (target === this.p1unit) {
                                this.unitHealth.p1health -= damage;
                            } else {
                                this.unitHealth.p2health -= damage;
                            }

                            // hit marker
                            let circle = this.add.circle(target.x, target.y, 40, 0xffffff);
                            circle.setAlpha(1);
                            this.tweens.add({
                                targets: circle,
                                scale: 1,
                                alpha: 0,
                                duration: 100,
                                ease: 'Bounce.easeOut', // 'Cubic', 'Elastic', 'Bounce', 'Back
                                yoyo: false,
                                repeat: 0,
                                onComplete: () => {
                                    circle.destroy();
                                },
                            });
                        });

                        // fade red line out
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
            }
            // DEFEND
            else if (action === 'defend') {
                return;
                // create shield around unit
                let shield = this.add.circle(unit.x, unit.y, 70, 0x5555ff);
                shield.setAlpha(0.2);
                shield.setDepth(-1);
                this.physics.add.existing(shield);
                shield.body.setCircle(70);
                shield.body.setImmovable(true);



                // add to shield group
                if (unit === this.unit1) {
                    this.p1shields.add(shield);
                } else {
                    this.p2shields.add(shield);
                }


                // after 2s, shield disappears
                this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        // fade shield out
                        this.tweens.add({
                            targets: shield,
                            alpha: 0,
                            // size
                            scale: 0.2,
                            duration: 300,
                            ease: 'Power2',
                            yoyo: false,
                            repeat: 0,

                            onComplete: () => {
                                shield.destroy();
                            }
                        });
                    },
                    loop: false,
                });
            }
        }

        let turn = 0;
        // every 1s
        this.time.addEvent({
            delay: 300,
            callback: () => {
                doAction(this.unit1, this.actions.getActions(1), this.unit2)
                doAction(this.unit2, this.actions.getActions(2), this.unit1)

                // if (turn % 2 === 0) {
                // doAction(this.unit.p1unit, this.unit.p2health, this.unit.p1healthText)

                // } else {
                // doAction(this.unit.p2unit, this.unit.p1health, this.unit.p2healthText)
                // }

                turn++;
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
            debug: true,
        },
    },
    scene: Demo,
    backgroundColor: 0x777777
};

var game = new Phaser.Game(config);