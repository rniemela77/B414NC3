// Description: A game where two units move around and attack each other
import UnitHealth from "./scripts/unit-health.js";

class Demo extends Phaser.Scene {
    preload() {
        this.load.image('particle', '/circle.png');
    }

    create() {
        const actions = [
            {
                action: 'moveLeft',
                movement: -1,
                distance: 220,
                frequency: 0.2,
            },
            {
                action: 'moveRight',
                movement: 1,
                distance: 220,
                frequency: 0.2,
            },
            {
                action: 'attack',
                damage: 2,
                frequency: 0.4
            },
            {
                action: 'defend',
                frequency: 0.1
            }
        ];

        this.p1shields = this.physics.add.group();
        this.p2shields = this.physics.add.group();


        // Action history
        this.p1actionText = this.add.text(10, 70, `P1:`, { fontSize: 24 });
        this.p2actionText = this.add.text(10, 100, `P2:`, { fontSize: 24 });

        // Create unit
        this.p1unit = this.physics.add.sprite(width / 2, height / 2, 'particle');
        this.p1unit.body.setCircle(25);
        this.p1unit.setTint(0x0000ff);
        this.p2unit = this.physics.add.sprite(width / 2, height / 2 + 100, 'particle');
        this.p2unit.body.setCircle(25);
        this.p2unit.setTint(0xff0000);
        this.p1unit.setDrag(100);
        this.p2unit.setDrag(100);

        // Create healthbars
        this.unitHealth = new UnitHealth(this);
        this.unitHealth.giveHealthbars(this.p1unit, this.p2unit);

        const doAction = (unit, txt, targetHealth, unitHpTxt) => {
            // pick a random action based on frequency
            let action = Phaser.Math.RND.weightedPick(actions.map(a => a.action), actions.map(a => a.frequency));
            let { distance, damage } = actions.find(a => a.action === action);

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
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;

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

                        // if bullet collides with shield
                        let enemyShield = unit === this.p1unit ? this.p2shields : this.p1shields;
                        this.physics.add.collider(bullet, enemyShield, (bullet, shield) => {
                            bullet.destroy();

                            shield.destroy();
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
                newText = `*defend*`;

                // create shield around unit
                let shield = this.add.circle(unit.x, unit.y, 70, 0x5555ff);
                shield.setAlpha(0.2);
                shield.setDepth(-1);
                this.physics.add.existing(shield);
                shield.body.setCircle(70);
                shield.body.setImmovable(true);



                // add to shield group
                if (unit === this.p1unit) {
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

            txt.setText(txt.text + '\n' + newText);
        }

        let turn = 0;
        // every 1s
        this.time.addEvent({
            delay: 500,
            callback: () => {
                // if (turn % 2 === 0) {
                doAction(this.p1unit, this.p1actionText, this.p2health, this.p1healthText)
                // } else {
                doAction(this.p2unit, this.p2actionText, this.p1health, this.p2healthText)
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