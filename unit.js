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
        this.p1base = scene.p1base;
        this.p2base = scene.p2base;
    }

    makeTower(unit) {
        unit.radius = this.game.config.width / 30;

        unit.body.setSize(unit.radius * 2, unit.radius * 2);
        unit.body.setCircle(unit.radius);
        

        unit.speed = 0;
        unit.range = unit.radius * 5;
        unit.attackSpeed = 1000;
        unit.attack = 45;
        unit.health = 1000;

        unit.visionRange = unit.range;
    }

    whiteLiner(unit) {
        unit.health = 30;
        unit.attack = 10;
        unit.attackSpeed = 800;
        unit.range = 500;
        unit.speed = 25;

        unit.size = 20;
        unit.visionRange = 400;

        unit.body.debugShowBody = false;
    }

     tank(unit) {
        unit.health = 500;
        unit.attack = 100;
        unit.attackSpeed = 100;
        unit.range = 30;
        unit.speed = 25;

        unit.size = 30;
        unit.visionRange = 400;

        unit.body.debugShowBody = false;
     }

     longRanger(unit) {
        unit.health = 100;
        unit.attack = 20;
        unit.attackSpeed = 1000;
        unit.range = 400;
        unit.speed = 20;

        unit.size = 25;
        unit.visionRange = 500;

        unit.body.debugShowBody = false;
     }

     runner(unit) {
        unit.health = 150;
        unit.attack = 15;
        unit.attackSpeed = 300;
        unit.range = 50;
        unit.speed = 150;

        unit.size = 12;
        unit.visionRange = 400;

        unit.body.debugShowBody = false;
     }
}

export default Unit;