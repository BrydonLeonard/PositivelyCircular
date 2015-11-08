var circles;
var objective;
var scoreCircle;
var scoreMode;
var modeCircle;
var backCircle;
var base;
var baseCircle;

var GameState = {
    create:function()
    {
        game.stage.backgroundColor = getColour('background');

        circles = null;
        objective = null;
        scoreCircle = null;
        scoreMode = null;
        modeCircle = null;
        backCircle = null;
        base = null;
        baseCircle = null;
        modeCircle = makeCircle();
        if (Math.random() < 0.5) {
            modeCircle.init(game.width - 50, game.height - 50, 25, getColour('blue'), false, false, '-', 'Calibri');
            modeCircle.text.anchor.set(0.5, 0.57);
            scoreMode = 'less';
        } else {
            modeCircle.init(game.width - 50, game.height - 50, 25, getColour('blue'), false, false, '+', 'Calibri');
            modeCircle.text.anchor.set(0.5, 0.57);
            scoreMode = 'more';
        }
        modeCircle.text.fontSize = 35;
        backCircle = makeBackButton();
        backCircle.create();

        game.input.onDown.add(backCircle.onClick, game);

        if (difficulty != 'noob') {
            base = Math.ceil(Math.random() * 15) + 2;
            baseCircle = makeCircle();
            baseCircle.init(game.width - 125, game.height - 50, 25, getColour('blue'), false, false, base.toString(), 'Calibri');
        } else base = 10;

        var tempCircle;

        objective = {};
        circles = [];

        scoreCircle = null;
        objective.won = true;
        graphics = game.add.graphics(0, 0);
        for (var i = 0; i < 10; i++)
        {
            circles.push(makeNumberCircle());
            var newPos = findValidPos();
            
            var multProb;
            if (difficulty === 'noob')
                multProb = 0.1;
            else if (difficulty === 'pro')
                multProb = 0.15;
            else if (difficulty === 'mlgpro')
                multProb = 0.2;

            circles[i].create(newPos.x, newPos.y, 25, Math.round(Math.random() * 50) + 1, multProb, base);
        }

        objective.val = 0;
        objective.won = false;

        var randNum;
        while (objective.val === 0) {
            for (var i = 0; i < circles.length; i++) {
                randNum = Math.random();
                if (randNum < 0.34) {
                    if (objective.val + circles[i].val < 60)
                        objective.val += circles[i].val;
                }
                else if (randNum < 0.67) {
                    if (objective.val - circles[i].val > -60)
                        objective.val -= circles[i].val;
                }
                game.input.onDown.add(circles[i].onClick, circles[i]);
            }

            objective.val = Math.abs(objective.val);
        }

        objective.circle = makeObjectiveCircle();
        objective.circle.create(objective.val, base);

        game.input.onDown.add(objective.circle.onClick, objective.circle);


    },
    update:function()
    {
        graphics.clear();

        objective.circle.update();
        objective.circle.draw();
        for (var i = 0; i < circles.length; i++)
        {
            circles[i].update();
            circles[i].draw();
        }

        modeCircle.draw();
        backCircle.update();
        backCircle.draw();

        if (objective.won)
            scoreCircle.draw();

        if (difficulty != 'noob')
            baseCircle.draw();

        if (!objective.won)
            this.CheckWin();
    },
    CheckWin: function () {
        if (SumCircles() === objective.val) {
            objective.circle.activate();
            scoreCircle = makeCircle();
            scoreCircle.init(game.width / 2, game.height-15, 50, getColour('green'), true, true, '+' + CalcScore().toString());
            scoreCircle.text.fontSize = 25;
            objective.won = true;
            totalScore += CalcScore();
            playWinSound();
            for (var i = 0; i < circles.length; i++)
            {
                if (circles[i].getActiveValue() === 0)
                    circles[i].disappear();
                circles[i].circleActive = false;
            }
        }
    }
}

function CalcScore()
{
    var count = 0;
    var mult = 1;
    for (var i = 0; i < circles.length; i++)
    {
        if (circles[i].getActiveValue() != 0)
        {
            count++;
            mult *= circles[i].mult;
        }
    }
    
    if (scoreMode === 'less')
        return (10 - count) * mult;
    else return (count * mult);
}

function SumCircles()
{
    var sum = 0;
    for (var i = 0; i < circles.length; i++)
    {
        sum += circles[i].getActiveValue();
    }
    return sum;
}

function findValidPos()
{
    var newPos = {x:0, y:0}
    var valid = false;
    var testLine;
    while (!valid)
    {
        valid = true;
        newPos = {x:Math.random()*(game.width-100)+50, y:Math.random()*(game.height-150)+50};
        testLine = new Phaser.Line(newPos.x, newPos.y, game.width/2, game.height/2);
        if (testLine.length < 75)
        {
            valid = false;
        }
        for (var i = 0 ; i < circles.length; i++)
        {
            testLine = new Phaser.Line(newPos.x, newPos.y, circles[i].x, circles[i].y);
            if (testLine.length < 50)
                valid = false;
        }
    }
    return newPos;
}

function startGameState() {
    playStartGameSound();
    graphics.clear();
    game.state.start('gameState');
}