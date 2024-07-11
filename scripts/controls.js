class Controls {
    constructor(scene) {
        this.scene = scene;
        this.events = scene.events;
    }

    createControls(player, actions) {
        // buttons are near top right
        const buttonLocation = {
            x: 500,
            y: player === this.scene.p1unit ? 50 : 300
        };

        const options = [-0.1, 0.1]

        // create 2 controls per action
        actions.forEach(action => {
            // place text with action name
            const actionName = this.scene.add.text(
                buttonLocation.x - 150,
                buttonLocation.y,
                action.action,
                {
                    fontSize: 24,
                    backgroundColor: player === this.scene.p1unit
                        ? '#0000ff'
                        : '#ff0000',
                }
            );

            options.forEach(option => {
                let button = this.scene.add.text(
                    buttonLocation.x,
                    buttonLocation.y,
                    option,
                    {
                        fontSize: 24,
                        backgroundColor: player === this.scene.p1unit
                            ? '#0000ff'
                            : '#ff0000',
                    }
                );

                // button click
                button.setInteractive();
                button.on('pointerdown', () => {
                    if (action.distance) {
                        action.distance += option * 100;
                    }
                    
                    if (action.damage || action.damage === 0) {
                        action.damage += option * 10;
                    }
                });

                // button text
                this.events.on('update', () => {
                    button.setText(`(${action.distance || action.damage}) ${option}`);
                });

                // place the next action underneath
                buttonLocation.y += button.height;
            });
        });
    }
}

export default Controls;