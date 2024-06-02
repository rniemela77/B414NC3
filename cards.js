class Cards {
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
        this.energy = scene.energy;
        this.events = scene.events;
    }

    createCards() {
        const cards = [
            {
                id: 1,
                name: 'Spawn White Liner',
                cost: 25,
            },
            {
                id: 2,
                name: 'Spawn Tank',
                cost: 10,
            },
            {
                id: 3,
                name: '+ ATK',
                cost: 10,
                statModifications: {
                    attack: 20,
                }
            },
            {
                id: 4,
                name: '+ HP',
                cost: 10,
                statModifications: {
                    health: 100,
                }
            },
            {
                id: 5,
                name: '+ SPD',
                cost: 10,
                statModifications: {
                    speed: 20,
                }
            },
            {
                id: 6,
                name: '+ RNG',
                cost: 10,
                statModifications: {
                    range: 50,
                }
            }
        ]

        // create 3 buttons in center of screen
        const padding = 20;
        const margin = 2;
        const fontSize = 30;

        // shuffle cards
        cards.sort(() => Math.random() - 0.5);

        cards.forEach((card, i) => {
            if (i >= 3) return;

            const button = this.add.rectangle(
                this.game.config.width / 2,
                this.game.config.height / 1.2,
                240,
                200,
                this.colors.border
            );
            button.setInteractive();
            button.setDepth(1);
            button.width = 240;
            button.height = 200;



            // center the button
            button.x = this.game.config.width / 2;
            // put 3 cards in center of screen
            button.x += (i - 1) * (button.width + margin);


            // add text to button
            const buttonText = this.add.text(
                button.x - button.width / 2 + padding,
                button.y - button.height / 2 + padding,
                card.name,
                { fill: '#00ff00' }
            );
            buttonText.setBackgroundColor('#000000');
            buttonText.setFontSize(fontSize);
            buttonText.setWordWrapWidth(button.width - padding * 2);
            buttonText.setAlign('center');
            buttonText.setScrollFactor(0);
            buttonText.setDepth(10);


            // cost
            const cost = this.add.text(
                buttonText.x - 35,
                buttonText.y - 35,
                card.cost,
                { fill: '#00ccff' }
            );
            cost.setBackgroundColor('#000000');
            cost.setFontSize(fontSize);
            cost.setPadding(padding / 5);
            cost.setScrollFactor(0);
            cost.setDepth(10);

            // on click
            button.on('pointerdown', () => {
                // if enough resource
                if (this.energy.current >= card.cost) {
                    this.energy.current -= card.cost;

                    // if card is spawn unit
                    if (card.name.includes('Spawn')) {
                        this.scene.createUnit(1, card.id);
                    } else {
                        this.scene.buffUnits(1, card.statModifications);
                    }
                }
            });

            // on update
            this.events.on('update', () => {
                if (this.energy.current >= card.cost) {
                    buttonText.setColor('#00ff00');
                } else {
                    buttonText.setColor('#ff0000');
                }
            });
        });
    }
}

export default Cards;