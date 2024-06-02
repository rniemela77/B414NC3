import Base from './base.js';
import Unit from './unit.js';
import Attack from './attack.js';
import Cards from './cards.js';
import Ui from './ui.js';

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
        this.unit = new Unit(this);
        this.attack = new Attack(this);

        this.energy = {
            current: 0,
            max: 100,
        };

        this.colors = {
            // bg 0x777777
            map: 0xaaaaaa,
            border: 0x555555,
            resource: 0x1111ff,
        };

        this.units = this.physics.add.group();
        this.p1units = this.physics.add.group();
        this.p2units = this.physics.add.group();

        // create bases
        this.base.createBase(1);
        this.base.createBase(2);

        // periodically spawn units
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                // const player = Math.random() > 0.5 ? 1 : 2;
                // this.createUnit(player, 1);

                this.createUnit(1, 1);
                this.createUnit(2, 1);
            },
            loop: true
        });

        this.ui = new Ui(this);
        this.cards = new Cards(this);
        
        this.ui.createBar();
        this.cards.createCards();
    }

    createUnit(playerN, unitId) {
        const unit = this.add.circle(0, 0, 5, 0xffffff);

        unit.typeId = unitId;

        unit.ownedBy = playerN;

        // GROUP
        if (unit.ownedBy === 1) {
            this.p1units.add(unit);
        } else {
            this.p2units.add(unit);
        }

        // give unit stats
        if (unitId === 1) {
            this.unit.whiteLiner(unit);
        } else if (unitId === 2) {
            this.unit.tank(unit);
        }

        // unit size
        unit.radius = unit.size;
        this.physics.add.existing(unit);
        unit.body.setSize(unit.radius * 2, unit.radius * 2);
        unit.body.setCircle(unit.radius * 1.5);
        unit.body.setOffset(-unit.radius / 2, -unit.radius / 2);

        unit.fillColor = unit.ownedBy === 1 ? 0xff0000 : 0x0000ff;


        // SPAWN
        const playerBaseLocation = unit.ownedBy === 1 ? this.base.p1base : this.base.p2base;
        unit.x = playerBaseLocation.x;
        unit.y = playerBaseLocation.y;

        // if p1unit, move to right
        if (unit.ownedBy === 1) {
            // unit.x += 100;
            unit.x += Math.random() * 100 + 100;
        } else {
            // unit.x -= 100;
            unit.x -= Math.random() * 100 + 100;
        }

        // RANGE
        this.makeVisionRangeCircle(unit);
        this.makeAttackRangeCircle(unit);

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

    buffUnits(playerN, statModifications) {
        const playerUnits = playerN === 1 ? this.p1units : this.p2units;
        playerUnits.getChildren().forEach(unit => {

            if (statModifications) {
                Object.keys(statModifications).forEach(stat => {
                    unit[stat] += statModifications[stat];
                });

                // make unit glow
                unit.fillColor = 0xffff00;
                this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        // undo color
                        unit.fillColor = unit.ownedBy === 1 ? 0xff0000 : 0x0000ff;

                        // undo stat
                        Object.keys(statModifications).forEach(stat => {
                            unit[stat] -= statModifications[stat];
                        });
                    }
                });
            }
            // unit.attack += 5;
            // unit.health += 100;
            // unit.range += 150;
            // unit.body.setSize(100, 100);
            // unit.body.setCircle(50);
        });
    }

    makeVisionRangeCircle(unit) {
        unit.visionRangeCircle = this.add.circle(0, 0, unit.visionRange, 0x553333);
        unit.visionRangeCircle.setStrokeStyle(2, 0x553333, 0.1);
        unit.visionRangeCircle.setFillStyle(0x553333, 0);

        this.events.on('update', () => {
            if (unit.active) {
                unit.visionRangeCircle.x = unit.x;
                unit.visionRangeCircle.y = unit.y;
            } else {
                unit.visionRangeCircle.destroy();
            }
        });
    }

    makeAttackRangeCircle(unit) {
        unit.rangeCircle = this.add.circle(0, 0, unit.range, 0x578333);
        unit.rangeCircle.setStrokeStyle(2, 0x335588, 0.2);
        unit.rangeCircle.setFillStyle(0x553333, 0);
        this.physics.add.existing(unit.rangeCircle);
        unit.rangeCircle.body.setSize(unit.range * 2, unit.range * 2);
        unit.rangeCircle.body.setCircle(unit.range);
        // make body debug invisible
        unit.rangeCircle.debugShowBody = false;
        unit.rangeCircle.body.debugShowBody = false;

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

                    // this.time.addEvent({
                    // delay: 200,
                    // callback: () => {
                    // unit.healthbarDamage.clear();
                    // currentHealth = unit.health;
                    // }
                    // });

                    unit.healthbarDamage.fillRect(unit.x - unit.health / 5, unit.y - unit.body.height / 1.5, 40 * (unit.health / 100), 5);
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
                unit.body.setVelocityX(0);
                unit.body.setVelocityY(0);
            } else {
                // move toward closest unit
                let closestUnit = null;
                let closestDistance = unit.visionRange;
                const enemyUnits = unit.ownedBy === 1 ? this.p2units : this.p1units;
                enemyUnits.getChildren().forEach(unit2 => {
                    if (!unit2.active) return;

                    const distance = Phaser.Math.Distance.Between(unit.x, unit.y, unit2.x, unit2.y);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestUnit = unit2;
                    }
                });
                // if there is a closest unit, move towards it
                if (closestUnit) {
                    const angleToUnit = Phaser.Math.Angle.Between(unit.x, unit.y, closestUnit.x, closestUnit.y);
                    velocityX = speed * Math.cos(angleToUnit);
                    velocityY = speed * Math.sin(angleToUnit);
                }

                unit.body.setVelocityX(velocityX);
                unit.body.setVelocityY(velocityY);
            }
        });
    }

    unitCanAttack(unit) {
        const enemyUnits = unit.ownedBy === 1 ? this.p2units : this.p1units;

        // on update
        this.events.on('update', () => {
            if (!unit.active) return;
            if (unit.isFiring) return;

            // if overlapping enemyUnits, attack
            let closestUnit = null;
            this.physics.overlap(unit.rangeCircle, enemyUnits, (unit1, unit2) => {
                unit.isFiring = true;

                closestUnit = unit2;
            });

            if (unit.isFiring && closestUnit) {
                if (unit.typeId === 1) {
                    this.attack.whiteLine(unit, closestUnit);
                } else if (unit.typeId === 2) {
                    this.attack.meleeAttack(unit, closestUnit);
                }


                this.attack.createWhiteSplash(closestUnit);

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