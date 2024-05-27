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


        unit.range = 400;
        unit.attackSpeed = 1000;
        unit.attack = 45;
        unit.health = 1000;

        unit.visionRange = 400;
    }

    whiteLiner(unit) {
        // HITBOX
        unit.body.setSize(40, 40);
        unit.body.setCircle(20);

        // STATS
        unit.health = 100;
        unit.attack = 10;
        unit.attackSpeed = 1000;
        unit.range = 200;
        unit.speed = 400;

        unit.visionRange = 400;
    }

     tank(unit) {
        // HITBOX
        unit.body.setSize(60, 60);
        unit.body.setCircle(30);

        // STATS
        unit.health = 500;
        unit.attack = 100;
        unit.attackSpeed = 1000;
        unit.range = 20;
        unit.speed = 200;
        
        unit.visionRange = 400;
     }
}

export default Unit;