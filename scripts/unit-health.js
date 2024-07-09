class UnitHealth {
    constructor(scene) {
        console.log('unit health created')
        this.scene = scene;
        this.events = scene.events;
    }

    giveHealthbars(p1unit, p2unit) {
        this.p1health = 10;
        this.p2health = 10;

        // show health
        this.p1healthText = this.scene.add.text(10, 10, `${this.p1health}`, { fontSize: 24 });
        this.p2healthText = this.scene.add.text(10, 40, `${this.p2health}`, { fontSize: 24 });
        // text align center on both
        this.p1healthText.setOrigin(0.5);
        this.p2healthText.setOrigin(0.5);
        this.p1healthText.setLetterSpacing(-8);
        this.p2healthText.setLetterSpacing(-8);

        // on update, put health text above unit
        this.events.on('update', () => {
            this.p1healthText.x = p1unit.x;
            this.p1healthText.y = p1unit.y - 50;

            this.p2healthText.x = p2unit.x;
            this.p2healthText.y = p2unit.y - 50;

            // every 10hp is |
            let p1healthBar = '';
            for (let i = 0; i < this.p1health; i++) {
                p1healthBar += '|';
            }
            this.p1healthText.setText(p1healthBar);
            
            let p2healthBar = '';
            for (let i = 0; i < this.p2health; i++) {
                p2healthBar += '|';
            }
            this.p2healthText.setText(p2healthBar);
        });
    }
}

export default UnitHealth;