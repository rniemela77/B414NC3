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

        console.log(buttonLocation);
        // create controls for player
        // for each action
        actions.forEach(action => {
            // if the action has a distance
            if (action.distance) {
                const distanceOptions = [-50, 50];

                distanceOptions.forEach(distance => {
                // create a button that will add 50 to distance
                let button = this.scene.add.text(
                    buttonLocation.x,
                    buttonLocation.y,
                    `${action.action}(${action.distance}) ${distance}`,
                    {
                        fontSize: 24,
                        backgroundColor: player === this.scene.p1unit
                            ? '#0000ff'
                            : '#ff0000',
                    }
                );

                button.setInteractive();
                // make text deleteable
                button.on('pointerdown', () => {
                    action.distance += distance;

                    // clear text
                    button.setText('');

                    // set new text
                    button.setText(`${action.action}: ${action.distance}`);
                });

                buttonLocation.y += 40;
            });
            }

            // if the action has damage
        });
    }
}

export default Controls;