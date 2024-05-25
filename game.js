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

        this.baseStyles = {
            distance: config.width / 3,
            radius: config.width / 30,
            range: config.width / 5,
            attack: Math.random() * 100,
            attackSpeed: 1000,
            health: 1000
        }
        this.unitStyles = {
            health: 100,
            attack: 10,
            attackSpeed: 400,
            range: 300
        }

        this.bases = [
            {
                x: this.game.config.width / 3,
                y: this.game.config.height / 3,
                color: 0xff0000,
                p: 1
            },
            {
                x: this.game.config.width / 1.5,
                y: this.game.config.height / 1.5,
                color: 0x0000ff,
                p: 2
            }
        ]

        // create bases
        this.createBases();

        // base/turret attack
        this.makeTurretAttack();

        // periodically spawn units
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                this.createUnit(1);
            },
            loop: true
        });

        this.createButtons();
    }

    createBases() {
        const { bases, baseStyles } = this;
        bases.forEach((base) => {
            const art = this.add.circle(base.x, base.y, baseStyles.radius, this.colors.border);
            const baseUnit = this.physics.add.image(base.x, base.y, 'player');

            // add to unit group
            if (base.p === 1) {
                baseUnit.setTint(0xff0000);
                base.unitGroup = this.p1units;
                this.p1base = baseUnit;
            } else {
                baseUnit.setTint(0x0000ff);
                base.unitGroup = this.p2units;
                this.p2base = baseUnit;
            }
            base.unitGroup = base.p === 1 ? this.p1units : this.p2units;


            baseUnit.health = baseStyles.health;
            baseUnit.range = baseStyles.range;
            baseUnit.attack = baseStyles.attack;
            baseUnit.attackSpeed = baseStyles.attackSpeed;
            baseUnit.body.setSize(baseStyles.radius * 2, baseStyles.radius * 2);
            baseUnit.body.setCircle(baseStyles.radius);
            base.unitGroup.add(baseUnit);

            this.giveUnitHealthbar(baseUnit, base.p);
            this.makeRangeCircle(baseUnit);

            // base is not moved by units
            baseUnit.setImmovable(true);
        });
    }

    makeTurretAttack() {
        this.time.addEvent({
            delay: this.p2base.attackSpeed,
            callback: () => {
                // find closest p2 unit near p1 base
                let closestUnit = null;
                let closestDistance = this.p2base.range;
                this.p2units.getChildren().forEach((unit) => {
                    // return;
                    if (!unit.active) return;
                    const distance = Phaser.Math.Distance.Between(this.p1base.x, this.p1base.y, unit.x, unit.y);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestUnit = unit;

                        // fire projectile
                        const projectile = this.physics.add.image(this.p1base.x, this.p1base.y, 'player');
                        projectile.body.setSize(6, 6);
                        projectile.body.setCircle(3);
                        projectile.setDisplaySize(16, 16);
                        projectile.setTint(0xff0000);

                        // fire at closest unit
                        this.physics.moveToObject(projectile, unit, 400);

                        // if collides
                        this.physics.add.collider(projectile, this.p2units, (projectile, unit) => {
                            projectile.destroy();
                            unit.health -= this.p1base.attack;
                        });
                    }
                });
            },
            loop: true
        });
    }

    createButtons() {
        const button = this.add.text(this.width / 2, this.height - 200, 'Spawn Unit', { fill: '#00ff00' });
        button.setBackgroundColor('#000000');
        button.setPadding(100);
        button.setFontSize(40);
        button.setInteractive();
        button.on('pointerdown', () => {
            this.createUnit(1);
        });
        button.x = game.config.width / 2 - button.width / 2;
        button.y = game.config.height - 300;
        button.setScrollFactor(0);
        button.setDepth(10);
    }

    createUnit(playerN) {
        const unit = this.physics.add.image(0, 0, 'player');

        // GROUP
        if (playerN === 1) {
            this.p2units.add(unit);
        } else {
            this.p1units.add(unit.body);
        }

        // HITBOX
        unit.body.setSize(40, 40);
        unit.body.setCircle(20);

        // STATS
        unit.isDestroyable = true;
        unit.health = 100;
        unit.attack = 30;
        unit.attackSpeed = 400;
        unit.range = 200;
        unit.speed = 400;

        // SPAWN
        unit.x = playerN % 2 === 0 ? this.p1base.x : this.p2base.x;
        unit.y = playerN % 2 === 0 ? this.p1base.y : this.p2base.y;

        // RANGE
        this.makeRangeCircle(unit);

        // HEALTHBAR
        this.giveUnitHealthbar(unit, playerN);

        // MOVEMENT
        this.unitCanMove(playerN, unit);

        // Collision
        this.unitCanAttack(unit);
    }

    makeRangeCircle(unit) {
        unit.rangeCircle = this.physics.add.image(0, 0, 'player');
        unit.rangeCircle.body.setSize(unit.range * 2, unit.range * 2);
        unit.rangeCircle.body.setCircle(unit.range);
        this.physics.add.existing(unit.rangeCircle);

        this.events.on('update', () => {
            // destroy unit
            if (unit.health < 0) {
                unit.rangeCircle.destroy();
            }
            if (unit.active) {
                unit.rangeCircle.x = unit.x;
                unit.rangeCircle.y = unit.y;
            }
        });
    }

    giveUnitHealthbar(unit) {
        unit.healthbar = this.add.graphics();
        unit.healthbar.fillStyle(0x00ff00, 1);
        unit.healthbar.fillRect(unit.x - 20, unit.y - 30, 40, 5);

        this.events.on('update', () => {
            // destroy unit
            if (unit.health < 0) {
                unit.healthbar.clear();
                unit.destroy();
                unit.health = 0;
            }
            if (unit.active) {
                unit.healthbar.clear();
                unit.healthbar.fillStyle(0x00ff00, 1);
                unit.healthbar.fillRect(unit.x - 20, unit.y - 30, 40 * (unit.health / 100), 5);
            }
        });
    }

    unitCanMove(playerN, unit) {
        const direction = playerN % 2 === 0 ? -1 : 1;
        const { speed } = unit;
        let angleToBase = Phaser.Math.Angle.Between(unit.x, unit.y, this.p1base.x, this.p1base.y);
        let velocityX = speed * Math.cos(angleToBase) * direction;
        let velocityY = speed * Math.sin(angleToBase) * direction;

        // make unit not overlap other units. collision.
        this.physics.add.collider(unit, this.p2units, (unit1, unit2) => {
            if (unit1 === unit2) return;

            angleToBase = Phaser.Math.Angle.Between(unit1.x, unit1.y, this.p1base.x, this.p1base.y);
            velocityX = speed * Math.cos(angleToBase) * direction;
            velocityY = speed * Math.sin(angleToBase) * direction;
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
        // on update
        this.events.on('update', () => {
            // attack if in range
            this.physics.overlap(unit.rangeCircle, this.p1units, (unit1, unit2) => {
                if (unit1 === unit2) return;

                unit.isFiring = true;
            });
        });

        // every attackSpeed, attack
        const event = this.time.addEvent({
            delay: unit.attackSpeed,
            callback: () => {
                if (!unit.active) {
                    event.remove();
                    return;
                }

                if (!unit.isFiring) return;


                this.physics.overlap(unit.rangeCircle, this.p1units, (unit1, unit2) => {
                    if (unit1 === unit2) return;

                    unit.isFiring = true;

                    // attack
                    const graphics = this.add.graphics();
                    graphics.lineStyle(1, 0xffffff, 1);
                    graphics.beginPath();
                    graphics.moveTo(unit1.x, unit1.y);
                    graphics.lineTo(unit2.x, unit2.y);
                    graphics.closePath();
                    graphics.strokePath();

                    setTimeout(() => {
                        graphics.lineStyle(20, 0x9999ff, 0.5);
                        graphics.beginPath();
                        graphics.moveTo(unit1.x, unit1.y);
                        graphics.lineTo(unit2.x, unit2.y);
                        graphics.closePath();
                        graphics.strokePath();
                    }, 50);

                    // destroy line
                    setTimeout(() => {
                        graphics.destroy();

                        if (unit1.health <= 0) {
                            event.remove();
                        }
                        if (unit2.health <= 0) {
                            event.remove();
                        }
                    }, 200);

                });
            },
            loop: true
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