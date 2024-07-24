class Demo extends Phaser.Scene {
    preload() {
        this.load.image('particle', '/circle.png');
    }

    create() { // rock emoji: 🪨, paper emoji: 📄, scissors emoji: ✂️
        this.options = [
            { name: '🪨', beats: ['✂️'] },
            { name: '📄', beats: ['🪨'] },
            { name: '✂️', beats: ['📄'] },
        ]

        this.players = [
            { name: 'Player 1', score: 0 },
            { name: 'Player 2', score: 0 },
        ];

        this.resultPauseDuration = 1000;

        // show square
        const timer = this.add.rectangle(
            width / 2,
            height / 2,
            50,
            50,
            0x000000
        ).setStrokeStyle(50, 0xffffff);

        // tween
        this.tweens.add({
            targets: timer,
            scaleX: 0,
            scaleY: 0,
            duration: 1000,
            ease: 'Linear',
            // repeat/loop infinitely
            repeat: -1,
            
        });


        // create buttons
        this.p1buttons = this.createButtonsForPlayer(1);
        this.p2buttons = this.createButtonsForPlayer(2);

        // create choices
        this.p1choice = null;
        this.p2choice = null;
        this.result = null;

        // add click event to each button
        [this.p1buttons, this.p2buttons].forEach((playerButtons, playerIndex) => {
            playerButtons.forEach((btn, btnIndex) => {
                this.addClickEvent(btn, playerIndex, btnIndex);
            });
        });

        // when this.p1choice and this.p2choice are both set, get the result
        this.time.addEvent({
            delay: this.resultPauseDuration,
            callback: () => {
                console.log('timer.')
                if (this.p1choice && this.p2choice) {
                    this.result = this.getResult(this.p1choice, this.p2choice);
                    
                    const displayedResult = this.displayResult();
                    // wait for 2 seconds before resetting the choices

                    this.time.delayedCall(this.resultPauseDuration, () => {
                        displayedResult.destroy();
                        this.p1choice = null;
                        this.p2choice = null;
                        this.result = null;
                    });
                }
            },
            loop: true,
        });
    }

    displayResult() {
        // set the color based on the result
        let color;
        if (this.result === 'win') {
            color = '#00ff00';
        }
        else if (this.result === 'lose') {
            color = '#ff0000';
        }
        else {
            color = '#ffffff';
        }

        // display the result
        const text = this.add.text(
            100,
            200,
            `1.${this.p1choice.name} 2.${this.p2choice.name} = You ${this.result}`,
            {
                fontSize: 30,
                color,
            }
        );

        return text;
    }

    addClickEvent(btn, playerIndex, btnIndex) {
        btn.on('pointerdown', () => {
            if (playerIndex === 0) {
                this.p1choice = this.options[btnIndex];
            }
            else {
                this.p2choice = this.options[btnIndex];
            }
        });
    }

    addListenersToButtons(buttons, choice) {
        // add click event to each button
        buttons.forEach((z, i) => {
            console.log(z);
            z.on('pointerdown', () => {
                console.log('button clicked');
            });
        });
    }

    selectBtn(index) {
        // = this.options[index];
    }

    createButtonsForPlayer(playerNumber) {
        // create 3 buttons for rock, paper, scissors
        const buttons = this.options.map((option, i) => {
            // create squares for buttons. each square is 1/3 of the width of the screen
            const btn = this.add.rectangle(
                i * width / 3 + width / 6,
                playerNumber === 1 ? height * 0.75 : height * 0.25,
                width / 3,
                width / 3,
                0xffffff
            ).setOrigin(0.5, 0.5)
                .setStrokeStyle(20, 0x000000)
                .setInteractive();

            // add text to the squares
            const text = this.add.text(
                i * width / 3 + width / 6,
                playerNumber === 1 ? height * 0.75 : height * 0.25,
                option.name,
                {
                    fontSize: 100,
                }
            ).setOrigin(0.5, 0.5);

            return btn;
        });

        return buttons;
    }


    getResult(playerOption, computerOption) {
        // get the result
        return (playerOption === computerOption) 
        ? 'tie' 
        : playerOption.beats.includes(computerOption.name) 
        ? 'win' 
        : 'lose';
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