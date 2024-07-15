class Actions {
    constructor(scene) {
        this.scene = scene;
    }

    getActions(n = 0) {
        return n === 1 ? this.p1Actions : this.p2Actions;
    }

    createActions() {
        this.actions = [
            {
                name: 'moveLeft',
                movement: -1,
                distance: 220,
                frequency: 0.2,
            },
            {
                name: 'moveRight',
                movement: 1,
                distance: 220,
                frequency: 0.2,
            },
            {
                name: 'attack',
                damage: 2,
                frequency: 0.4
            },
            {
                name: 'defend',
                frequency: 0.1
            }
        ];

        // give a copy to p1
        this.p1Actions = this.actions.map(a => ({ ...a }));
        this.p2Actions = this.actions.map(a => ({ ...a }));
    }
}

export default Actions;