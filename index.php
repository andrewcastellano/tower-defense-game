<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.15.1/dist/phaser-arcade-physics.min.js"></script>
    <script src="./src/scenes/NewGame.js"></script>
    <script src="./src/scenes/Easy.js"></script>
    <script src="./src/enemies/Enemy.js"></script>
    <script src="./src/enemies/Robot.js"></script>
    <script src="./src/enemies/Toaster.js"></script>
    <script src="./src/enemies/WashingMachine.js"></script>
    <script src="./src/towers/Waterhose.js"></script>
<<<<<<< HEAD
    <script src="./src/projectiles/Waterdrop.js"></script>
=======
>>>>>>> 7c9ebeb9577a5375e501bde3380198dbb2b7d036
    <script src="./src/Gamestate.js"></script>
</head>
<body>

    <script>
    var config = {
        type: Phaser.AUTO,
        width: 900,
        height: 390,
        physics: {
            default: 'arcade',
        },
        backgroundColor: 'rgba(0,0,255,0.5)',
        scene: [ NewGame, Easy ]
    };

    var game = new Phaser.Game(config);

    </script>

</body>
</html>