class Unit {
    // constructor(name, health, damage, armor) {
    //     this.name = name;
    //     this.health = health;
    //     this.damage = damage;
    //     this.armor = armor;
    preload() {
        this.load.image('particle', '/circle.png');
    }

    constructor(scene, nPlayer) {
        this.scene = scene;
        this.events = scene.events;
        this.physics = scene.physics;
        this.tweens = scene.tweens;

        this.createUnit(nPlayer);
        this.giveHealthbar(nPlayer);
    }

    move(direction, distance, target) {
        // find current angle between unit and center
        let angle = Phaser.Math.Angle.Between(
            this.unit.x, this.unit.y, 
            target.x, target.y
        );

        // move angle by 15 degrees
        angle += (9 * direction);
        const x = target.x + Math.cos(angle) * distance;
        const y = target.y + Math.sin(angle) * distance;

        this.tweens.add({
            targets: this.unit,
            x: x,
            y: y,
            duration: 1000,
            ease: 'Power2',
            yoyo: false,
            repeat: 0,
        });
    }

    createUnit(nPlayer) {
        this.unit = this.physics.add.sprite(this.scene.width / 2, this.scene.height / 2 + (nPlayer === 1 ? 0 : 100), 'particle');
        this.unit.body.setCircle(25);
        this.unit.setTint(nPlayer === 1 ? 0x0000ff : 0xff0000);
        this.unit.setDrag(100);

        return this.unit;
    }


    giveHealthbar(nPlayer) {
        this.totalHealth = 10;
        this.health = 10;

        //  Health text
        const fontSize = 32;
        let healthTextBg = this.scene.add.text(10, 10, '', { fontSize: fontSize });
        healthTextBg.setLetterSpacing(-10);

        let healthText = this.scene.add.text(10, 10, '', { fontSize: fontSize });
        healthText.setLetterSpacing(-10);

        // on update, put health text above unit
        this.events.on('update', () => {
            [healthTextBg, healthText].forEach((text, i) => {
                text.x = this.unit.x - 50;
                text.y = this.unit.y - 60;

                text.y -= i;
                text.x -= i;
            });

            // create a red | for each health
            healthTextBg.setText('.'.repeat(this.totalHealth));
            healthTextBg.setColor('red');

            // create a green | for each current health
            healthText.setText('.'.repeat(this.health));
            healthText.setColor('limegreen');
        });
    }
}

export default Unit;