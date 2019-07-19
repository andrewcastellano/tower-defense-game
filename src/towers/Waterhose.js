// Waterhose class definition
var waterhose = new Phaser.Class({ 
    Extends: Phaser.GameObjects.Image,
    initialize: function Waterhose(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'waterhose');
        this.range = 0;
        this.damage = 0;
        this.pos = [0, 0];
        this.cost = 25;
    },
    place: function() {
        //definition for the place function
    },
    getEnemyInRange: function () {
        //definition for finding enemy in range
    },
    fire: function() {
        //definition for the fire function
    },
    update: function() {
        //definition for the update function
    }
});