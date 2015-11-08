var clickSoundArray = [];
var music;
var startSound;
var winSound;
var backSound;

var SetupState = {
    preload:function()
    {		
	
        game.load.bitmapFont('mecha', 'Assets/Font/mecha_0.png', 'Assets/Font/mecha.xml');

        game.load.image('soundOn', 'Assets/soundButton/soundOnWhite.png');
        game.load.image('soundOff', 'Assets/soundButton/soundOffWhite.png');


        game.load.audio('click1', 'Assets/sfx/click/Click_Electronic_01.mp3');
        game.load.audio('click2', 'Assets/sfx/click/Click_Electronic_02.mp3');
        game.load.audio('click3', 'Assets/sfx/click/Click_Electronic_03.mp3');
        game.load.audio('click4', 'Assets/sfx/click/Click_Electronic_05.mp3');

        clickSoundArray.push(game.add.audio('click1'));
        clickSoundArray.push(game.add.audio('click2'));
        clickSoundArray.push(game.add.audio('click3'));
        clickSoundArray.push(game.add.audio('click4'));

        game.load.audio('win', 'Assets/sfx/win/flagreturn.wav');
        game.load.audio('start_game', 'Assets/sfx/start/flagdrop.wav');
        game.load.audio('back', 'Assets/sfx/back/acid5.wav');

        game.load.audio('music', 'Assets/music/ERH BlueBeat 01 [loop].ogg');


        startSound = game.add.audio('start_game');
        winSound = game.add.audio('win');
        backSound = game.add.audio('back');
    },
    create:function()
    {
		game.input.maxPointers = 1;
        game.stage.disableVisibilityChange = true;
		game.input.onDown.add(game.scale.startFullScreen, game);

        if (!this.game.device.desktop)
        {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(480, 260, 800, 1920);
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.scale.forceOrientation(true, false);
            game.scale.setResizeCallback(game.gameResized, this);
        }
		
        music = game.add.audio('music');
        StartIntroState();
    }
}
