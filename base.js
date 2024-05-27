class Base {
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

        this.p1base = null;
        this.p2base = null;

        this.bases = [
            {
                distance: this.game.config.width / 3,
                x: this.game.config.width / 3,
                y: this.game.config.height / 3,
                color: 0xff0000,
                radius: this.game.config.width / 30,
                p: 1
            },
            {
                distance: this.game.config.width / 3,
                x: this.game.config.width / 1.5,
                y: this.game.config.height / 1.5,
                color: 0x0000ff,
                radius: this.game.config.width / 30,
                p: 2
            }
        ]
    }


    createBase(player) {
        const base = this.bases.find(b => b.p === player);

        const art = this.add.circle(base.x, base.y, base.radius, base.color);
        const baseUnit = this.physics.add.image(base.x, base.y, 'player');
        baseUnit.p = base.p;

        // add to unit group
        if (base.p === 1) {
            this.scene.p1units.add(baseUnit);
            this.p1base = baseUnit;
        } else {
            this.scene.p2units.add(baseUnit);
            this.p2base = baseUnit;
        }

        this.scene.unit.makeTower(baseUnit);

        


        this.scene.giveUnitHealthbar(baseUnit);
        this.scene.makeAttackRangeCircle(baseUnit);
        this.scene.makeVisionRangeCircle(baseUnit);

        baseUnit.setImmovable(true);

        this.baseCanAttack(baseUnit);
    }

    baseCanAttack(base) {
        this.time.addEvent({
            delay: base.attackSpeed,
            callback: () => {
                const enemyUnits = base.p === 1 ? this.scene.p2units : this.scene.p1units;

                // get closest
                if (!enemyUnits.getChildren().length) return;
                let closestUnit = null;
                let closestDistance = base.range;
                enemyUnits.getChildren().forEach(unit => {
                    if (!unit.active) return;

                    const distance = Phaser.Math.Distance.Between(base.x, base.y, unit.x, unit.y);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestUnit = unit;
                    }
                });
                if (!closestUnit) return;

                // fire projectile
                const projectile = this.physics.add.image(base.x, base.y, 'player');
                projectile.body.setSize(6, 6);
                projectile.body.setCircle(3);
                projectile.setDisplaySize(16, 16);

                // fire at closest unit
                this.physics.moveToObject(projectile, closestUnit, 400);

                // if collides
                this.physics.add.collider(projectile, enemyUnits, (projectile, unit) => {
                    projectile.destroy();
                    unit.health -= base.attack;
                });
            },
            loop: true
        });
    }
}

export default Base;