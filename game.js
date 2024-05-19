class Demo extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/player.png');
    }

    create() {
        this.players = [
            {
                id: 1,
                x: 100,
                y: 100,
                sprite: this.physics.add.sprite(100, 100, 'player')
            }
        ]

        this.players.forEach(player => {
            player.sprite.setCollideWorldBounds(true);
            player.sprite.setInteractive();
            player.sprite.on('pointerdown', () => {
                this.selectedPlayer = player;
            });
        }

        );

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
            // debug: true,
        },
    },
    scene: Demo,
    backgroundColor: 0x111111,
};

var game = new Phaser.Game(config);

// 