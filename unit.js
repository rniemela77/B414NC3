class Unit {
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
    }

    makeTower(unit) {
        unit.radius = this.game.config.width / 30;

        unit.body.setSize(unit.radius * 2, unit.radius * 2);
        unit.body.setCircle(unit.radius);
        


        unit.range = unit.radius * 5;
        unit.attackSpeed = 1000;
        unit.attack = 45;
        unit.health = 1000;

        unit.visionRange = unit.range;
    }

    whiteLiner(unit) {
        // const size = 40;

        // unit is a white circle
        // const art = this.add.circle(unit.x, unit.y, size / 2, 0xffffff);
        // unit.art = art;


        // HITBOX
        // unit.body.setSize(size, size);
        // unit.body.setCircle(size / 2);

        // STATS
        unit.health = 30;
        unit.attack = 10;
        unit.attackSpeed = 800;
        unit.range = 100;
        unit.speed = 30;

        unit.size = 10;
        unit.visionRange = 400;

        unit.body.debugShowBody = false;
    }

     tank(unit) {
        // STATS
        unit.health = 500;
        unit.attack = 100;
        unit.attackSpeed = 1000;
        unit.range = 30;
        unit.speed = 250;

        unit.size = 20;
        unit.visionRange = 400;

        unit.body.debugShowBody = false;
     }
}

export default Unit;