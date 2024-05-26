import Base from './base.js';

class Demo extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/player.png');
    }

    create() {
        /*
            click on base to make it fire for x seconds.

            cooldowns/cards?
            - spawn unit
            - fire
            - aura
            - location AOE
            - heal
            - shield
            - speed
            - slow
            - damage
            - range
            - attack speed
            - health 
        */

        this.base = new Base(this);

        this.colors = {
            // bg 0x777777
            map: 0xaaaaaa,
            border: 0x555555,
        };

        this.units = this.physics.add.group();
        this.p1units = this.physics.add.group();
        this.p2units = this.physics.add.group();

        // create bases
        this.base.createBase(1);
        this.base.createBase(2);

        // periodically spawn units
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                const player = Math.random() > 0.5 ? 1 : 2;
                this.createUnit(player);
            },
            loop: true
        });

        this.createButtons();
    }

    createButtons() {
        const fontSize = 30;
        const padding = 10;
        const margin = 4;
        // spawn p1unit button
        const button = this.add.text(this.width / 2, this.height - 200, 'Spawn p1unit', { fill: '#00ff00' });
        button.setBackgroundColor('#000000');
        button.setPadding(padding);
        button.setFontSize(fontSize);
        button.setInteractive();
        button.on('pointerdown', () => {
            this.createUnit(1);
        });
        button.x = 0
        button.y = game.config.height - button.height;
        button.setScrollFactor(0);
        button.setDepth(10);

        // spawn p2unit button
        const button2 = this.add.text(this.width / 2, this.height - 200, 'Spawn p2unit', { fill: '#00ff00' });
        button2.setBackgroundColor('#000000');
        button2.setPadding(padding);
        button2.setFontSize(fontSize);
        button2.setInteractive();
        button2.on('pointerdown', () => {
            this.createUnit(2);
        });
        button2.x = button.width + margin;
        button2.y = game.config.height - button2.height;
        button2.setScrollFactor(0);
        button2.setDepth(10);

        // buff button
        const buffButton = this.add.text(this.width / 2, this.height - 200, 'Buff p1unit', { fill: '#00ff00' });
        buffButton.setBackgroundColor('#000000');
        buffButton.setPadding(padding);
        buffButton.setFontSize(fontSize);
        buffButton.setInteractive();
        buffButton.on('pointerdown', () => {
            this.buffUnits(1);
        });
        buffButton.x = button.width + button2.width + margin * 2
        buffButton.y = game.config.height - buffButton.height;
        buffButton.setScrollFactor(0);
        buffButton.setDepth(10);

        // buff button
        const buffButton2 = this.add.text(this.width / 2, this.height - 200, 'Buff p2unit', { fill: '#00ff00' });
        buffButton2.setBackgroundColor('#000000');
        buffButton2.setPadding(padding);
        buffButton2.setFontSize(fontSize);
        buffButton2.setInteractive();
        buffButton2.on('pointerdown', () => {
            this.buffUnits(2);
        });
        buffButton2.x = button.width + button2.width + buffButton.width + margin * 3
        buffButton2.y = game.config.height - buffButton2.height;
        buffButton2.setScrollFactor(0);
        buffButton2.setDepth(10);
    }

    createUnit(playerN) {
        const unit = this.physics.add.image(0, 0, 'player');
        unit.ownedBy = playerN;

        // GROUP
        if (unit.ownedBy === 1) {
            this.p1units.add(unit);
        } else {
            this.p2units.add(unit);
        }

        // HITBOX
        unit.body.setSize(40, 40);
        unit.body.setCircle(20);

        // STATS
        unit.health = 100;
        unit.attack = 10;
        unit.attackSpeed = 1000;
        unit.range = 200;
        unit.speed = 400;

        // SPAWN
        const thisBase = unit.ownedBy === 1 ? this.base.p1base : this.base.p2base;
        unit.x = thisBase.x;
        unit.y = thisBase.y;

        // RANGE
        this.makeRangeCircle(unit);

        // HEALTHBAR
        this.giveUnitHealthbar(unit);

        // Collision
        this.unitCanAttack(unit);

        // MOVEMENT
        this.unitCanMove(unit);

        // on update
        this.events.on('update', () => {
            if (unit.health <= 0 && unit.active) {
                unit.destroy();
            }
        });
    }

    buffUnits(playerN) {
        const playerUnits = playerN === 1 ? this.p1units : this.p2units;
        playerUnits.getChildren().forEach(unit => {
            unit.attack += 5;
            unit.health += 100;
            unit.range += 150;
            unit.body.setSize(100, 100);
            unit.body.setCircle(50);
            // display size



        });

        // after 2s, revert
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                playerUnits.getChildren().forEach(unit => {
                    unit.attack -= 5;
                    unit.health -= 100;
                    unit.range -= 150;
                });
            }
        });
    }

    makeRangeCircle(unit) {
        unit.rangeCircle = this.physics.add.image(0, 0, 'player');
        unit.rangeCircle.body.setSize(unit.range * 2, unit.range * 2);
        unit.rangeCircle.body.setCircle(unit.range);
        this.physics.add.existing(unit.rangeCircle);

        this.events.on('update', () => {
            if (unit.active) {
                unit.rangeCircle.x = unit.x;
                unit.rangeCircle.y = unit.y;
            } else {
                unit.rangeCircle.destroy();
            }
        });
    }

    giveUnitHealthbar(unit) {
        unit.healthbar = this.add.graphics();
        unit.healthbar.fillStyle(0x00ff00, 1);

        unit.healthbarDamage = this.add.graphics();
        unit.healthbarDamage.fillStyle(0xff0000, 1);

        // healthbar is centered
        unit.healthbar.fillRect(unit.x - 20, unit.y - unit.body.height / 1.5, 40 * (unit.health / 100), 5);

        let currentHealth = unit.health;

        this.events.on('update', () => {
            if (unit.health < 0) {
                unit.health = 0;
            }
            if (unit.active) {

                // show red for damage taken
                unit.healthbarDamage.clear();
                if (unit.health < currentHealth) {
                    unit.healthbarDamage.fillStyle(0xff0000, 1);
                    unit.healthbarDamage.fillRect(unit.x - currentHealth / 5, unit.y - unit.body.height / 1.5, 40 * (currentHealth / 100), 5);
                    unit.healthbarDamage.setDepth(1);

                    this.time.addEvent({
                        delay: 200,
                        callback: () => {
                            unit.healthbarDamage.clear();
                            currentHealth = unit.health;
                        }
                    });
                }

                // update current health
                unit.healthbar.clear();
                unit.healthbar.fillStyle(0x00ff00, 1);
                unit.healthbar.fillRect(unit.x - unit.health / 5, unit.y - unit.body.height / 1.5, 40 * (unit.health / 100), 5);
                unit.healthbar.setDepth(2);
            } else {
                unit.healthbar.destroy();
                unit.healthbarDamage.destroy();
            }
        });
    }

    unitCanMove(unit) {
        const playerUnits = unit.ownedBy === 1 ? this.p1units : this.p2units;
        const { speed } = unit;
        const enemyBase = unit.ownedBy === 1 ? this.base.p2base : this.base.p1base;
        let angleToBase = Phaser.Math.Angle.Between(unit.x, unit.y, enemyBase.x, enemyBase.y);
        let velocityX = speed * Math.cos(angleToBase);
        let velocityY = speed * Math.sin(angleToBase);

        // make unit not overlap other units
        this.physics.add.collider(unit, playerUnits, (unit1, unit2) => {
            if (unit1 === unit2) return;

            angleToBase = Phaser.Math.Angle.Between(unit1.x, unit1.y, enemyBase.x, enemyBase.y);
            velocityX = speed * Math.cos(angleToBase);
            velocityY = speed * Math.sin(angleToBase);
        });

        // every frame, move if not firing
        this.events.on('update', () => {
            if (!unit.active) return;

            if (unit.isFiring) {
                unit.setVelocityX(0);
                unit.setVelocityY(0);
            } else {
                unit.setVelocityX(velocityX);
                unit.setVelocityY(velocityY);
            }
        });
    }

    unitCanAttack(unit) {
        const enemyUnits = unit.ownedBy === 1 ? this.p2units : this.p1units;

        // on update
        this.events.on('update', () => {
            if (!unit.active) return;

            // if already attacking, do nothing
            if (unit.isFiring) return;

            // if overlapping enemyUnits, attack
            let closestUnit = null;
            this.physics.overlap(unit.rangeCircle, enemyUnits, (unit1, unit2) => {
                unit.isFiring = true;

                closestUnit = unit2;
            });

            if (unit.isFiring && closestUnit) {
                // attack
                const graphics = this.add.graphics();
                graphics.lineStyle(1, 0xffffff, 1);
                graphics.beginPath();
                graphics.moveTo(unit.x, unit.y);
                graphics.lineTo(closestUnit.x, closestUnit.y);
                graphics.closePath();
                graphics.strokePath();

                // damage
                closestUnit.health -= unit.attack;

                this.time.addEvent({
                    delay: 100,
                    callback: () => {
                        graphics.destroy();

                        this.time.addEvent({
                            delay: unit.attackSpeed,
                            callback: () => {
                                unit.isFiring = false;
                            }
                        });
                    }
                });

            }
        });
    }


    update() {
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