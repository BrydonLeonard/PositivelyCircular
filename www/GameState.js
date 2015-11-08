var circles;
var objective;
var scoreCircle;
var scoreMode;
var modeCircle;
var backCircle;
var base;
var baseCircle;
var timer = { timer: null, time: 0 };
var timerCircle;

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
        timerCircle = null;

        SetupModifiers();

        modeCircle.text.fontSize = 35 * radScale;
        backCircle = makeBackButton();
        backCircle.create();

        game.input.onDown.add(backCircle.onClick, game);


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

            circles[i].create(newPos.x, newPos.y, 25, Math.round(Math.random() * 50) + 1, difficulty.multChance, base);
        }

        objective.val = 0;
        objective.won = false;

        var randNum;
        while (objective.val === 0) {
            if (!difficulty.MustUseAll) {
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
            }
            else
            {
                for (var i = 0; i < circles.length; i++)
                {
                    randNum = Math.random();
                    if (randNum < 0.5)
                        objective.val += circles[i].val;
                    else objective.val -= circles[i].val;
                    game.input.onDown.add(circles[i].onClick, circles[i]);
                }
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

        if (difficulty.randomBase)
            baseCircle.draw();

        if (difficulty.timed) 
            timerCircle.draw();

        if (!objective.won) 
            this.CheckWin();
        
    },
    CheckWin: function () {
        if (SumCircles() === objective.val) {
            if ((difficulty.MustUseAll && usedAllCircles()) || (!difficulty.MustUseAll)) {
                objective.won = true;
                objective.circle.activate();
                scoreCircle = makeCircle();
                scoreCircle.init(game.width / 2, game.height - 15 * radScale, 50, getColour('green'), true, true, '+' + CalcScore().toString());
                scoreCircle.text.fontSize = 25 * radScale;
                totalScore += CalcScore();
                playWinSound();
                backCircle.disappear();
                if (difficulty.randomBase)
                    baseCircle.disappear();
                if (difficulty.timed)
                    timerCircle.disappear();
                modeCircle.disappear();
                for (var i = 0; i < circles.length; i++) {
                    if (circles[i].getActiveValue() === 0)
                        circles[i].disappear();
                    circles[i].circleActive = false;
                }
            }
        }
    }
}

function usedAllCircles()
{
    for (var i = 0; i < circles.length; i++)
        if (circles[i].getActiveValue() === 0)
            return false;
    return true;
}

function CalcScore()
{
    var count = 0;
    var mult = difficulty.multiplier;
    if (!difficulty.MustUseAll) {
        for (var i = 0; i < circles.length; i++) {
            if (circles[i].getActiveValue() != 0) {
                count++;
                mult *= circles[i].mult;
            }
        }

        if (scoreMode === 'less')
            return (10 - count) * mult;
        else return (count * mult);
    } else {
        if (usedAllCircles())
            return 10 * mult;
        else return 0;
    }
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
        newPos = {x:Math.random()*(game.width-100 * radScale)+50 * radScale, y:Math.random()*(game.height-150 * radScale)+50 * radScale};
        testLine = new Phaser.Line(newPos.x, newPos.y, game.width/2, game.height/2);
        if (testLine.length < 75 * radScale)
        {
            valid = false;
        }
        for (var i = 0 ; i < circles.length; i++)
        {
            testLine = new Phaser.Line(newPos.x, newPos.y, circles[i].x, circles[i].y);
            if (testLine.length < 50 * radScale)
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

function processTimer()
{
    if (!objective.won) {
        if (timer.time <= 0 && (!objective.won || !objective.continue)) {
            GameOver();
        } else
            timer.time--;
    }
    timerCircle.text.text = timer.time.toString();
}

function GameOver()
{
    for (var i = 0; i < circles.length; i++){
        circles[i].disappear();
        circles[i].circleActive = false;
    }

    if (!objective.won || !objective.continue)
    {
        if (scoreCircle != null && scoreCircle.text != null) {
            objective.circle.clickText.destroy();
            scoreCircle.text.destroy();
        }
    }

    objective.circle.activateBack();
    backCircle.disappear();
    if (difficulty.randomBase)
        baseCircle.disappear();
    if (difficulty.timed)
        timerCircle.disappear();
    modeCircle.disappear();
    scoreCircle = makeCircle();
    if (topScore < totalScore) {
        objective.circle.text.text = "HISCORE";
        objective.circle.text.size = 40 * radScale;
        topScore = totalScore;
        objective.circle.text.tint = getColour('gold');
        objective.circle.clickText.tint = getColour('gold');
        objective.circle.currentColour = getColour('white');
    }
    else objective.circle.text.text = "SCORE";
    objective.won = true;
}

function SetupModifiers()
{
    var nextModPos = 35;
    
    modeCircle = makeCircle();
    if (!difficulty.MustUseAll) {
        if (Math.random() < 0.5) {
            modeCircle.init(game.width - nextModPos * radScale, game.height - 35 * radScale, 25, getColour('blue'), false, false, '-');
            modeCircle.text.anchor.set(0.5, 0.57);
            scoreMode = 'less';
            nextModPos += 65;
        } else {
            modeCircle.init(game.width - nextModPos * radScale, game.height - 35 * radScale, 25, getColour('blue'), false, false, '+');
            modeCircle.text.anchor.set(0.5, 0.57);
            scoreMode = 'more';
            nextModPos += 65;
        }
    } else {
        modeCircle.init(game.width - nextModPos * radScale, game.height - 35 * radScale, 25, getColour('blue'), false, false, '+');
        modeCircle.text.anchor.set(0.5, 0.57);
        scoreMode = 'more';
        nextModPos += 65;
    }

    if (difficulty.randomBase) {
        base = Math.ceil(Math.random() * 15+1);
        baseCircle = makeCircle();
        baseCircle.init(game.width - nextModPos * radScale, game.height - 35 * radScale, 25, getColour('blue'), false, false, base.toString());
        nextModPos += 65;
    } else base = 10;

    if (difficulty.timed)
    {
        game.time.events.loop(1000, processTimer, game);
        timerCircle = makeCircle();
        timerCircle.init(game.width - nextModPos * radScale, game.height - 35 * radScale, 25, getColour('blue'), false, false, timer.time.toString());
        timerCircle.text.tint = getColour('blue');
    }
}

