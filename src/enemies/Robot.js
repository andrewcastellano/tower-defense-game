// Class for Robots
var Robot = new Phaser.Class({

    Extends: Phaser.GameObjects.Sprite,
    initialize: 
    // Constructor
    function Robot(scene)
    {
        // store enemy image
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'robot_');
        // to follow track path
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        // enemy specific attributes
        this.name = "";
        this.health = 200;
        this.alive = true;
        this.speed = 1/20000;
        this.value = 30;
    },
    // Spawns enemy in at the start of the track path
    spawn: function ()
    {
        // put enemy to start of track path
        this.follower.t = 0;
        
        // get starting coordinates
        path.getPoint(this.follower.t, this.follower.vec);
        
        // move to starting coordinate
        this.setPosition(this.follower.vec.x, this.follower.vec.y);            
    },
    // To be used to receive damage from towers
    takeDamage: function (damange)
    {
        // damage received as a positive value
        this.health -= damage;
        // access if still alive
        if (this.health <= 0){
            this.alive = false;
        }
    },
    // Update function for gameplay
    update: function (time, delta)
    {
        // get new progress through track path
        this.follower.t += this.speed * delta;
        // use progression to find new position coordinate
        path.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        //check if enemy completed track path
        if (this.follower.t >=1)
        {
            //deactivate enemy
            this.setActive(false);
            this.setVisible(false);
            
            //take a life away from player
            gamestate.setLives(gamestate.lives-1);
        }
        // check for death
        if (this.alive === false)
        {
            //deactivate enemy
            this.setActive(false);
            this.setVisible(false);
            //give player the value of the destroyed enemy
            gamestate.money += this.value;
        }
    }
});