<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.15.1/dist/phaser-arcade-physics.min.js"></script>
    <!-- Scenes -->
    <script src="./src/scenes/TitlePage.js"></script>
    <script src="./src/scenes/NewGame.js"></script>
    <script src="./src/scenes/GameBase.js"></script>
    <script src="./src/scenes/Easy.js"></script>
    <script src="./src/scenes/Medium.js"></script>
    <script src="./src/scenes/Hard.js"></script>
    <!-- Enemies -->
    <script src="./src/enemies/Enemy.js"></script>
    <script src="./src/enemies/Robot.js"></script>
    <script src="./src/enemies/Toaster.js"></script>
    <script src="./src/enemies/WashingMachine.js"></script>
    <!-- Towers -->
    <script src="./src/towers/Waterhose.js"></script>    
    <script src="./src/towers/SignalDisruptor.js"></script>
    <script src="./src/towers/Laser.js"></script>
    <!-- Projectiles -->
    <script src="./src/projectiles/Waterdrop.js"></script>
    <script src="./src/projectiles/Laserbeam.js"></script>
    <script src="./src/projectiles/RadioWave.js"></script>
    <!-- Misc -->
    <script src="./src/Gamestate.js"></script>
</head>
<body style="background:#202020">

    <script>
    var config = {
        type: Phaser.AUTO,
        width: 1050,
        height: 390,
        physics: {
            default: 'arcade',
        },
		backgroundColor: '#130f40',
        scene: [ NewGame, Easy, Medium, Hard ]
    };

    var game = new Phaser.Game(config);

    </script>

</body>
</html>

