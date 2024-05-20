class Demo extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/player.png');
    }

    create() {
        this.colors = {
            // bg 0x777777
            map: 0xaaaaaa,
            border: 0x555555,
        };

        this.units = this.physics.add.group();
        this.p1units = this.physics.add.group();
        this.p2units = this.physics.add.group();

        const baseStyles = {
            distance: config.width / 3,
            radius: config.width / 30,
            range: config.width / 5,
            attack: Math.random() * 100,
        }

        const bases = [
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

        bases.forEach((base) => {
            const art = this.add.circle(base.x, base.y, baseStyles.radius, this.colors.border);
            const baseUnit = this.physics.add.image(base.x, base.y, 'player');
            const range = this.add.circle(base.x, base.y, baseStyles.range, this.colors.border);
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

            


            // range.setAlpha(0.1);
            range.setStrokeStyle(2, 0x0000ff, 0.2);
            // fill alpha
            range.setFillStyle(0x0000ff, 0.03);

            baseUnit.health = 500;
            baseUnit.attack = Math.random() * 100;
            baseUnit.body.setSize(baseStyles.radius * 2, baseStyles.radius * 2);
            baseUnit.body.setCircle(baseStyles.radius);
            base.unitGroup.add(baseUnit);

            baseUnit.healthbar = this.add.graphics();
            const baseUnitHealthbar = baseUnit.healthbar;
            this.events.on('update', () => {
                if (baseUnit.active) {
                    baseUnitHealthbar.clear();
                    baseUnitHealthbar.fillStyle(0x00ff00, 1);
                    baseUnitHealthbar.fillRect(baseUnit.x - baseUnit.health / 2, baseUnit.y - baseUnit.height * 2, baseUnit.health, 10);
                    baseUnitHealthbar.fillStyle(0xff0000, 1);
                } else {
                    baseUnitHealthbar.clear();
                }
            });
        });


        // // circle base
        // const p1base = this.add.circle(this.game.config.width / 3, this.game.config.height / 3, baseStyles.radius, this.colors.border);
        // const p2base = this.add.circle(this.game.config.width / 1.5, this.game.config.height / 1.5, baseStyles.radius, this.colors.border);
        // // physics
        // this.p1base = this.physics.add.image(this.game.config.width / 3, this.game.config.height / 3, 'player');
        // this.p2base = this.physics.add.image(this.game.config.width / 1.5, this.game.config.height / 1.5, 'player');

        // // physics hitbox larger
        // this.p1base.body.setSize(200, 200);
        // this.p2base.body.setSize(200, 200);

        // this.p1base.health = 1000;
        // this.p2base.health = 1000;
        // this.p1base.attack = Math.random() * 100;
        // this.p2base.attack = Math.random() * 100;

        // this.p2units.add(this.p1base);
        // this.p1units.add(this.p2base);

        // // on update healthbar
        // this.p1base.healthbar = this.add.graphics();
        // this.p2base.healthbar = this.add.graphics();
        // this.p1base.healthbar.fillStyle(0x00ff00, 1);
        // this.p2base.healthbar.fillStyle(0x00ff00, 1);
        // this.p1base.healthbar.fillRect(this.p1base.x, this.p1base.y - 50, 100, 10);
        // this.p2base.healthbar.fillRect(this.p2base.x, this.p2base.y - 50, 100, 10);
        // const p1baseHealthbar = this.p1base.healthbar;
        // const p2baseHealthbar = this.p2base.healthbar;
        // this.events.on('update', () => {
        //     // if active
        //     if (this.p1base.active) {
        //         p1baseHealthbar.clear();
        //         p1baseHealthbar.fillStyle(0x00ff00, 1);
        //         p1baseHealthbar.fillRect(this.p1base.x - this.p2base.health / 4, this.p1base.y - 50, this.p1base.health, 10);
        //         p1baseHealthbar.fillStyle(0xff0000, 1);
        //     } else {
        //         p1baseHealthbar.clear();
        //     }
        //     if (this.p2base.active) {
        //         p2baseHealthbar.clear();
        //         p2baseHealthbar.fillStyle(0x00ff00, 1);
        //         p2baseHealthbar.fillRect(this.p2base.x - this.p2base.health / 1.5, this.p2base.y + 50, this.p2base.health, 10);
        //         p2baseHealthbar.fillStyle(0xff0000, 1);
        //     } else {
        //         p2baseHealthbar.clear();
        //     }
        // });


        // every 50ms,
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                // find closest p2 unit near p1 base
                let closestUnit = null;
                let closestDistance = 600;
                this.p2units.getChildren().forEach((unit) => {
                    // return;
                    const distance = Phaser.Math.Distance.Between(this.p1base.x, this.p1base.y, unit.x, unit.y);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestUnit = unit;

                        // fire projectile
                        const projectile = this.physics.add.image(this.p1base.x, this.p1base.y, 'player');
                        projectile.setDisplaySize(40, 40);
                        projectile.setBodySize(80, 80);
                        projectile.setCollideWorldBounds(true);

                        // fire at closest unit
                        this.physics.moveToObject(projectile, unit, 400);

                        // if collides
                        this.physics.add.collider(projectile, this.p1units, (projectile, unit) => {
                            projectile.destroy();
                            unit.health -= this.p1base.attack;
                        });
                    }
                });
            },
            loop: true
        });




        // every 2 sec
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                // if (Math.random() > 0.9) {
                this.createUnit(1);
                // } else {
                // this.createUnit(2);
                // }
            },
            loop: true
        });



        // create buttons at bottom of screen
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
        unit.body.setSize(400, 400);
        unit.body.setCircle(200);
        
        unit.x = playerN % 2 === 0 ? this.p1base.x : this.p2base.x;
        unit.y = playerN % 2 === 0 ? this.p1base.y : this.p2base.y;

        // range
        unit.range = this.add.circle(unit.x, unit.y, 500, this.colors.border);
        unit.range.setAlpha(0.1);
        unit.range.setStrokeStyle(2, 0x0000ff, 0.2);
        unit.range.setFillStyle(0x0000ff, 0.03);

        // healthbar
        unit.healthbar = this.add.graphics();
        unit.healthbar.fillStyle(0x00ff00, 1);
        unit.healthbar.fillRect(unit.x, unit.y - 50, 100, 10);
        const unitHealthbar = unit.healthbar;
        unitHealthbar.fillStyle(0x00ff00, 1);
        unitHealthbar.fillRect(unit.x, unit.y - 50, 100, 10);
        this.events.on('update', () => {
            // if active
            if (unit.active) {
                unit.range.x = unit.x;
                unit.range.y = unit.y;
                unitHealthbar.clear();
                unitHealthbar.fillStyle(0x00ff00, 1);
                unitHealthbar.fillRect(unit.x, unit.y - 50, unit.health, 10);
                unitHealthbar.fillStyle(0xff0000, 1);
            } else {
                unitHealthbar.clear();
            }
        });

        // add to player group
        if (playerN === 1) {
            this.p2units.add(unit);
        } else {
            this.p1units.add(unit);
        }
        // send to top left or bottom right
        const direction = playerN % 2 === 0 ? 1 : -1;
        const speed = 600;
        unit.setVelocityX(speed * direction + Math.random() * 300 - 150);
        unit.setVelocityY(speed * direction);

        unit.isDestroyable = true;
        unit.health = 100;
        unit.attack = 10;
        unit.attackSpeed = 400;

        console.log(this.p1units.getLength(), this.p2units.getLength());

        // collision
        const collider = this.physics.add.collider(this.p2units, this.p1units, (unit1, unit2) => {
            unit1.setVelocityX(0);
            unit1.setVelocityY(0);
            unit2.setVelocityX(0);
            unit2.setVelocityY(0);

            // remove collider
            collider.destroy();

            // create event
            const event = this.time.addEvent({
                delay: unit1.attackSpeed,
                callback: () => {
                    if (unit1.health > 0) {
                        unit1.health -= unit2.attack;
                    }
                    // if (unit2.health > 0) {
                    // unit2.health -= unit1.attack;
                    // }


                    console.log(unit1.health, unit2.health);

                    // line between units
                    const graphics = this.add.graphics();
                    graphics.lineStyle(2, 0xffffff, 1);
                    graphics.beginPath();
                    graphics.moveTo(unit1.x, unit1.y);
                    graphics.lineTo(unit2.x, unit2.y);
                    graphics.closePath();
                    graphics.strokePath();

                    setTimeout(() => {
                        graphics.lineStyle(5, 0x0000ff, 0.5);
                        graphics.beginPath();
                        graphics.moveTo(unit1.x, unit1.y);
                        graphics.lineTo(unit2.x, unit2.y);
                        graphics.closePath();
                        graphics.strokePath();
                    }, 50);

                    // destroy line
                    setTimeout(() => {
                        graphics.destroy();

                        // if (unit1.health <= 0 && unit1?.isDestroyable) {
                        if (unit1.health <= 0) {
                            unit1.destroy();
                            event.remove();
                        }
                        if (unit2.health <= 0) {
                            unit2.destroy();
                            event.remove();
                        }
                    }, 200);
                },
                loop: true
            });
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