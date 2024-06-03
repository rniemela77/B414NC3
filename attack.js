class Attack {
    constructor(scene) {
        this.scene = scene;
        this.game = scene.game;
        this.physics = scene.physics;
        this.add = scene.add;
        this.colors = scene.colors;
        this.time = scene.time;
        this.colors = scene.colors;
        this.p1units = scene.p1units;
        this.p2units = scene.p2units;
        this.unit = scene.unit;
        this.tweens = scene.tweens;
    }

    whiteLine(unit, target) {
        // attack
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xffffff, 1);
        graphics.beginPath();
        graphics.moveTo(unit.x, unit.y);
        graphics.lineTo(target.x, target.y);
        graphics.closePath();
        graphics.strokePath();

        // damage
        target.health -= unit.attack;

        this.time.addEvent({
            delay: 100,
            callback: () => {
                graphics.destroy();

                // this.time.addEvent({
                // delay: unit.attackSpeed,
                // callback: () => {
                unit.isFiring = false;
                // }
                // });
            }
        });
    }

    createWhiteSplash(unit) {
        // create white circle
        const whiteSplash = this.add.circle(unit.x, unit.y, unit.radius, 0xffffff);
        whiteSplash.setDepth(2);

        this.time.addEvent({
            delay: 50,
            callback: () => {
                whiteSplash.destroy();
            }
        });
    }

    meleeAttack(unit, target) {
        const arcSize = 8;
        const arcAngle = 180;
        const color = 0xff8899; // pink

        // a white arc at the unit in the direction of the target
        const arc = this.add.arc(unit.x, unit.y, arcSize, 0, arcAngle, false, color);

        // arc rotation faces target
        arc.rotation = Phaser.Math.Angle.Between(unit.x, unit.y, target.x, target.y) - Math.PI / 2;

        // move arc to target
        arc.x += Math.cos(arc.rotation) * unit.radius;
        arc.y += Math.sin(arc.rotation) * unit.radius;

        // set origin to center of arc
        arc.setOrigin(1.7, -0.7);

        // damage
        target.health -= unit.attack;

        // destroy arc
        this.time.addEvent({
            delay: 150,
            callback: () => {
                arc.destroy();

                this.time.addEvent({
                    delay: unit.attackSpeed,
                    callback: () => {
                        unit.isFiring = false;
                    }
                });
            }
        });
    }

    longRangeAttack(unit, target) {
        const projectile = this.add.circle(unit.x, unit.y, 5, 0xff07f0);
        projectile.setDepth(2);

        // move projectile to target
        this.tweens.add({
            targets: projectile,
            x: target.x,
            y: target.y,
            duration: 200,
            onComplete: () => {
                projectile.destroy();
            }
        });

        // damage
        target.health -= unit.attack;

        this.time.addEvent({
            delay: unit.attackSpeed,
            callback: () => {
                unit.isFiring = false;
            }
        });
    }
}

export default Attack;