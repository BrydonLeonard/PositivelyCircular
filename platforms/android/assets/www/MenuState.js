var MenuPlayButton;
var MenuScoreCircle;
var MenuHelpButton;
var MenuDifficultyButton;
var MenuHiscoreCircle;
var flavourText;
var soundButton;

var MainMenu = {
    create:function()
    {
        PlayMusic();

        game.stage.backgroundColor = getColour('background');

        flavourText = game.add.bitmapText(game.width / 2, game.height - 2, 'mecha', getRandomFlavourText(), 20);
        flavourText.anchor.set(0.5, 1);
        flavourText.align = 'center';

        if (sound)
            soundButton = game.add.sprite(5, 5, 'soundOn');
        else soundButton = game.add.sprite(5, 5, 'soundOff');
        soundButton.scale = { x: 0.5, y: 0.6 };

        graphics = game.add.graphics(0, 0);
        MenuPlayButton = makeMenuPlayButton();
        MenuPlayButton.create(Math.random() * (game.width - 300) + 150, Math.random() * (game.height - 300) + 150);

        var scorePos = findValidScorePosition();
        MenuScoreCircle = makeMenuScoreCircle();
        MenuScoreCircle.create(scorePos.x, scorePos.y);

        var helpPos = findValidHelpPosition();
        MenuHelpButton = makeMenuHelpCircle();
        MenuHelpButton.create(helpPos.x, helpPos.y);

        var difficultyPos = findValidDiffPos();
        MenuDifficultyButton = makeMenuDifficultyButton();
        MenuDifficultyButton.create(difficultyPos.x, difficultyPos.y);


        game.input.onDown.add(MenuDifficultyButton.onClick, game);
        game.input.onDown.add(MenuPlayButton.onClick, game);
        game.input.onDown.add(MenuHelpButton.onClick, game);

        game.input.onDown.add(checkSoundClick, this);


    },
    update:function()
    {
        graphics.clear();
        MenuScoreCircle.draw();
        MenuHelpButton.update();
        MenuHelpButton.draw();
        MenuDifficultyButton.update();
        MenuDifficultyButton.draw();
        MenuPlayButton.update();
        MenuPlayButton.draw();
    }
}

function findValidScorePosition()
{
    var newPos;
    var valid = false;
    var compLine;
    while (!valid)
    {
        valid = true;
        newPos = { x: Math.random() * (game.width - 90) + 45, y: Math.random() * (game.height - 150) + 45 };
        compLine = new Phaser.Line(newPos.x, newPos.y, MenuPlayButton.x, MenuPlayButton.y);
        if (compLine.length < 140)
            valid = false;
    }
    return newPos;
}

function findValidHelpPosition()
{
    var newPos;
    var valid = false;
    var compLine;
    while (!valid) {
        valid = true;
        newPos = { x: Math.random() * (game.width - 90) + 45, y: Math.random() * (game.height - 150) + 45 };
        compLine = new Phaser.Line(newPos.x, newPos.y, MenuPlayButton.x, MenuPlayButton.y);
        if (compLine.length < 140)
            valid = false;

        compLine = new Phaser.Line(newPos.x, newPos.y, MenuScoreCircle.x, MenuScoreCircle.y);
        if (compLine.length < 80)
            valid = false;
    }
    return newPos;
}

function findValidDiffPos()
{
    var newPos;
    var valid = false;
    var compLine;
    while (!valid) {
        valid = true;
        newPos = { x: Math.random() * (game.width - 90) + 45, y: Math.random() * (game.height - 150) + 45 };
        compLine = new Phaser.Line(newPos.x, newPos.y, MenuPlayButton.x, MenuPlayButton.y);
        if (compLine.length < 140)
            valid = false;

        compLine = new Phaser.Line(newPos.x, newPos.y, MenuScoreCircle.x, MenuScoreCircle.y);
        if (compLine.length < 80)
            valid = false;

        compLine = new Phaser.Line(newPos.x, newPos.y, MenuHelpButton.x, MenuHelpButton.y);
        if (compLine.length < 80)
            valid = false;
    }
    return newPos;
}
function startMenuState()
{
    game.state.start('menuState');
}

function checkSoundClick()
{
    var mouseLine = new Phaser.Line(game.input.x, game.input.y, soundButton.x, soundButton.y);
    if (mouseLine.length < soundButton.width)
    {
        if (sound) {
            soundButton.destroy();
            soundButton = game.add.sprite(5, 5, 'soundOff');
            soundButton.scale = { x: 0.5, y: 0.6 };
            sound = false;
            StopMusic();
        } else {
            soundButton.destroy();
            soundButton = game.add.sprite(5, 5, 'soundOn');
            soundButton.scale = { x: 0.5, y: 0.6 };
            sound = true;
            PlayMusic();
        }
    }
}