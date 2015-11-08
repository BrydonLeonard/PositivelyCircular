var IntroState = {
    massiveCircle: null,
    timer:null,
    create:function()
    {
        game.time.events.add(Phaser.Timer.SECOND * 5, checkStartMenu, this.game);
        graphics = game.add.graphics(0, 0);
        game.stage.backgroundColor = getColour('background');
        this.massiveCircle = makeCircle();
        this.massiveCircle.init(400, 400, 350, getColour('blue'), true, true, 'POSITIVELY\nCIRCULAR');
        this.massiveCircle.text.fontSize = 60;
        this.massiveCircle.goldRing = true;
        this.massiveCircle.circleStyle.outer = 40;
        this.massiveCircle.circleStyle.inner = 20;
        this.massiveCircle.circleStyle.wave = 10;
        this.massiveCircle.text.tint = 0xffffff;
    },
    update:function()
    {
        graphics.clear();
        this.massiveCircle.draw();
    }
}

function StartIntroState()
{
    game.state.start('introState');
}

function checkStartMenu()
{
    if (game.load.hasLoaded)
        startMenuState();
    else game.time.events.add(Phaser.Timer.SECOND * 1, checkStartMenu, this.game);
}