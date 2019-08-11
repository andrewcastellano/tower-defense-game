<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.15.1/dist/phaser-arcade-physics.min.js"></script>
    <!-- Scenes -->
    <script src="./src/scenes/TitlePage.js"></script>
    <script src="./src/scenes/NewGame.js"></script>
    <script src="./src/scenes/GameBase.js"></script>
    <script src="./src/scenes/Easy.js"></script>
    <script src="./src/scenes/LoadGame.js"></script>
    <script src="./src/scenes/SaveGame.js"></script>
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
        scene: [ TitlePage, NewGame, Easy, LoadGame, SaveGame ]
    };

    var game = new Phaser.Game(config);

    </script>

</body>
</html>