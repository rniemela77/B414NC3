class Ui {
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
        this.energy = scene.energy;
    }

    createBar() {
        // create a bar that spans from 0 to width
        const fullBar = this.add.rectangle(0, 0, this.game.config.width, 100, this.colors.border);
        fullBar.setOrigin(0, 0);

        let currentBar = this.add.rectangle(0, 0, 50, 100, this.colors.resource, 0.5);
        currentBar.setOrigin(0, 0);
        this.energy.current = 10;


        // every 0.2s
        this.time.addEvent({
            delay: 200,
            callback: () => {
                if (this.energy.current >= this.energy.max) {
                    this.energy.current = this.energy.max;
                }
                // increase bar amount
                this.energy.current += 2;

                // update currentBar. (100% max width)
                currentBar.width = this.game.config.width * (this.energy.current / 100);
            },
            loop: true
        });
    }
}

export default Ui;