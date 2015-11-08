/// <reference path="phaser.js" />

function makeCircle()
{
    var newCircle = {};
    newCircle.x;
    newCircle.y;
    newCircle.scale;
    newCircle.radius;
    newCircle.waveState;
    newCircle.text;
    newCircle.goldRing = false;
    newCircle.currentColour;
    newCircle.mustWave;
    newCircle.currentlyWaving;
    newCircle.circleStyle = { outer: 5, inner: 2, wave: 2, innerPerc: 0.8}
    newCircle.circleActive = true;

    newCircle.waveTween;
    newCircle.animationTween;
    newCircle.textTween;
    
    newCircle.disappear = function()
    {
        newCircle.animationTween = game.add.tween(newCircle).to({ scale: 0 }, 800, Phaser.Easing.Back.In, true);
        newCircle.circleActive = false;
        newCircle.stopWaving();
        newCircle.mustwave = false;
        
        newCircle.textTween = game.add.tween(newCircle.text).to({ alpha: 0 }, 600, Phaser.Easing.Exponential.In, true);
    }


    newCircle.init = function(x, y, radius,colour, wave, waveAtStart, text)
    {
        newCircle.waveState = 0;
        newCircle.x = x;
        newCircle.y = y;
        newCircle.radius = radius;
        newCircle.mustWave = wave;
        newCircle.text = game.add.bitmapText(x, y, 'mecha', text, 20);
        newCircle.text.align = 'center';
        newCircle.text.anchor.set(0.5);
        newCircle.waving = false;

        newCircle.currentColour = colour;
        newCircle.text.tint = colour;
        newCircle.scale = 0;
        newCircle.animationTween = game.add.tween(newCircle).to({ scale: 1 }, 800 + Math.random() * 600, Phaser.Easing.Elastic.Out, true);
        if (waveAtStart) {
            newCircle.animationTween.onComplete.add(newCircle.startWaving, newCircle);
        }
    }

    newCircle.startWaving = function()
    {
        if (newCircle.mustWave && !newCircle.waving) {
            newCircle.waving = true;
            newCircle.waveState = 0;
            newCircle.waveTween = game.add.tween(newCircle).to({ waveState: 1 }, 2000, Phaser.Easing.Cubic.Out, true, 0, -1);
        }
    }

    newCircle.stopWaving = function()
    {
        newCircle.waving = false;
        if (newCircle.waveTween != null)
            newCircle.waveTween.repeat = 0;
    }
    newCircle.draw = function()
    {
        if (!newCircle.goldRing) {
            graphics.beginFill(newCircle.currentColour, 0);
            graphics.lineStyle(newCircle.circleStyle.outer, newCircle.currentColour, 1);
            graphics.drawCircle(newCircle.x, newCircle.y, newCircle.radius * 2 * newCircle.scale);
            graphics.lineStyle(newCircle.circleStyle.inner, newCircle.currentColour, 1);
            graphics.drawCircle(newCircle.x, newCircle.y, newCircle.radius * 2 * newCircle.circleStyle.innerPerc * newCircle.scale);
            graphics.lineStyle(newCircle.circleStyle.wave, newCircle.currentColour, 1 - newCircle.waveState);
            if (newCircle.waving)
                graphics.drawCircle(newCircle.x, newCircle.y, newCircle.radius * 2 * (1 + newCircle.waveState * 2));
            graphics.endFill();
        }
        else {
            graphics.beginFill(newCircle.currentColour, 0);
            graphics.lineStyle(newCircle.circleStyle.outer, getColour('gold'), 1);
            graphics.drawCircle(newCircle.x, newCircle.y, newCircle.radius * 2 * newCircle.scale);
            graphics.lineStyle(newCircle.circleStyle.inner, newCircle.currentColour, 1);
            graphics.drawCircle(newCircle.x, newCircle.y, newCircle.radius * 2 * 0.8 * newCircle.scale);
            graphics.lineStyle(newCircle.circleStyle.wave, getColour('gold'), 1 - newCircle.waveState);
            if (newCircle.waving)
                graphics.drawCircle(newCircle.x, newCircle.y, newCircle.radius * 2 * (1 + newCircle.waveState * 2));
            graphics.endFill();
        }
    }
    return newCircle;
}
function makeNumberCircle()
{
    var newCircle = makeCircle();
    newCircle.val;
    newCircle.mouseOver;
    newCircle.multiplier;
    newCircle.state = 0;
    newCircle.mult = 1;

    
    newCircle.create = function(x,y,radius,val, multChance, base)
    {
        newCircle.init(x, y, radius, getNumColour('neut'), true, false, val.toString(base));
        newCircle.val = val;
        newCircle.multChance = multChance;
        newCircle.state = 0;
        newCircle.mouseOver = false;

        if (Math.random() < multChance)
        {
            newCircle.mult = 2;
            newCircle.goldRing = true;
        }
    }

    newCircle.update = function()
    {
        if (newCircle.circleActive) {
            var line = new Phaser.Line(game.input.x, game.input.y, newCircle.x, newCircle.y);
            if (line.length < newCircle.radius) {
                if (!newCircle.mouseOver) {
                    newCircle.scale += 0.1;
                    newCircle.animationTween = game.add.tween(newCircle).to({ scale: 1 }, 200, Phaser.Easing.Back.Out, true);
                }
                newCircle.mouseOver = true;
            } else newCircle.mouseOver = false;
        }
    }

    newCircle.onClick = function(){       
		var line = new Phaser.Line(game.input.x, game.input.y, newCircle.x, newCircle.y);
		if (line.length < newCircle.radius && newCircle.circleActive) {
			playClickSound();
			newCircle.scale -= 0.1;
			newCircle.animationTween = game.add.tween(newCircle).to({ scale: 1 }, 200, Phaser.Easing.Back.Out, true);
			newCircle.cycleState();
		}
    }

    newCircle.getActiveValue = function()
    {
        return newCircle.state * newCircle.val;
    }

    newCircle.cycleState = function()
    {
        if (newCircle.state === 0)
        {
            newCircle.state = 1;
            newCircle.currentColour = getNumColour('positive');
            newCircle.text.tint = getTextColour('positive');
            newCircle.startWaving();
        }
        else if (newCircle.state === 1)
        {
            newCircle.state = -1;
            newCircle.currentColour = getNumColour('negative');
            newCircle.text.tint = getTextColour('negative');
        }
        else if (newCircle.state = -1)
        {
            newCircle.state = 0;
            newCircle.currentColour = getNumColour('neut');
            newCircle.text.tint = getTextColour('neut');
            newCircle.stopWaving();
            if (difficulty === 'rekt')
                newCircle.disappear();
        }
    }
    return newCircle;
}
function makeObjectiveCircle()
{
    var newCircle = makeCircle();
    newCircle.mouseOver;
    newCircle.active;
    newCircle.val;
    newCircle.clickText;
    newCircle.subtractor = 2;
    newCircle.subTween;

    newCircle.create = function(val, base)
    {
        newCircle.active = false;
        newCircle.init(game.width / 2, game.height / 2, 50, getNumColour('neut'), true, true, val.toString(base));
        newCircle.text.fontSize = 40;
    }

    newCircle.activate = function()
    {
        newCircle.active = true;
        newCircle.startWaving();
        newCircle.currentColour = getColour('green');
        newCircle.animationTween = game.add.tween(newCircle).to({ scale: 1.2 }, 1000, Phaser.Easing.Cubic.Out, true, 0, -1);
        newCircle.animationTween.yoyo(true, 0);
        newCircle.textTween = game.add.tween(newCircle.text).to({ y: game.height / 2 - 10 }, 500, Phaser.Easing.Cubic.Out, true);
        newCircle.clickText = game.add.bitmapText(newCircle.x, newCircle.y + 5, 'mecha', 'CLICK', 23);
        newCircle.clickText.anchor.set(0.5, 0);
        newCircle.clickText.tint = getColour('white');
    }

    newCircle.update = function()
    {
        if (newCircle.circleActive) {
            if (newCircle.active) {
                var MouseLine = new Phaser.Line(game.input.x, game.input.y, newCircle.x, newCircle.y)
                {
                    if (MouseLine.length < newCircle.radius) {
                        if (!newCircle.mouseOver) {
                            newCircle.subtractor = 1.9;
                            newCircle.subTween = game.add.tween(newCircle).to({ subtractor: 2 }, 200, Phaser.Easing.Cubic.Out, true);
                        }
                        newCircle.mouseOver = true;
                    }
                    else newCircle.mouseOver = false;
                }
            }
        }
        if (newCircle.active)
        {
            newCircle.circleStyle.innerPerc = 0.8 * (newCircle.subtractor - newCircle.scale);
        }
    }

    newCircle.onClick = function()
    {   
		var line = new Phaser.Line(game.input.x, game.input.y, newCircle.x, newCircle.y);
		if (line.length < newCircle.radius && newCircle.circleActive) {
			newCircle.scale -= 0.1;
			newCircle.animationTween = game.add.tween(newCircle).to({ scale: 1 }, 200, Phaser.Easing.Back.Out, true);
			startGameState();
		}
	}
    return newCircle;
}

function makeBackButton()
{
    var newCircle = makeCircle();
    var mouseOver = false;

    newCircle.create = function()
    {
        newCircle.init(50, game.height - 50, 25, getColour('red'), false, false, '<');
        newCircle.text.fontSize = 35;
        newCircle.text.anchor.set(0.5, 0.57);
    }

    newCircle.update = function()
    {
        var MouseLine = new Phaser.Line(game.input.x, game.input.y, newCircle.x, newCircle.y);
        if (MouseLine.length < newCircle.radius)
        {
            if (!newCircle.mouseOver)
            {
                newCircle.scale += 0.1;
                newCircle.animationTween = game.add.tween(newCircle).to({scale:1}, 200, Phaser.Easing.Back.Out, true);
            }newCircle.mouseOver = true;
        }else newCircle.mouseOver = false;
        
    }
    newCircle.onClick = function(){            
		var line = new Phaser.Line(game.input.x, game.input.y, newCircle.x, newCircle.y);
		if (line.length < newCircle.radius && newCircle.circleActive) {
            playBackSound();
            startMenuState();
        }
    }

    return newCircle;
}
function makeMenuPlayButton()
{
    var newCircle = makeCircle();
    newCircle.mouseOver = false;

    newCircle.create = function(x,y)
    {
        newCircle.init(x, y, 80, getColour('blue'), true, true, 'PLAY');
        newCircle.circleStyle.outer = 10;
        newCircle.circleStyle.inner = 6;
        newCircle.circleStyle.wave = 5;

        newCircle.text.fontSize = 40;
    }
    newCircle.update = function()
    {
        var mouseLine = new Phaser.Line(newCircle.x, newCircle.y, game.input.x, game.input.y);
        if (mouseLine.length < newCircle.radius) {
            if (!newCircle.mouseOver) {
                newCircle.scale += 0.05;
                newCircle.animationTween = game.add.tween(newCircle).to({ scale: 1 }, 200, Phaser.Easing.Cubic.Out, true);
            } newCircle.mouseOver = true;
        }
        else newCircle.mouseOver = false;
    }

    newCircle.onClick = function()
    {       
		var line = new Phaser.Line(game.input.x, game.input.y, newCircle.x, newCircle.y);
		if (line.length < newCircle.radius && newCircle.circleActive) {
            playStartGameSound();
            newCircle.scale -= 0.05;
            newCircle.animationTween = game.add.tween(newCircle).to({ scale: 1 }, 200, Phaser.Easing.Cubic.In, true);
            startGameState();
        }
    }
    return newCircle;
}
function makeMenuScoreCircle()
{
    var newCircle = makeCircle();

    newCircle.create = function(x,y)
    {
        newCircle.init(x, y, 40, getColour('gold'), true, true, totalScore.toString());
        newCircle.text.fontSize = 30;
    }
    return newCircle;
}
function makeMenuHelpCircle()
{
    var newCircle = makeCircle();
    newCircle.mouseOver = false;

    newCircle.create = function(x,y)
    {
        newCircle.init(x, y, 40, getColour('white'), true, true, '???');
    }

    newCircle.update = function()
    {
        var MouseLine = new Phaser.Line(game.input.x, game.input.y, newCircle.x, newCircle.y);
        if (MouseLine.length < newCircle.radius) {
            if (!newCircle.mouseOver) {
                newCircle.scale += 0.1;
                newCircle.animationTween = game.add.tween(newCircle).to({ scale: 1 }, 200, Phaser.Easing.Cubic.Out, true);
            } newCircle.mouseOver = true;
        } else newCircle.mouseOver = false;
    }

    newCircle.onClick = function () {            
		var line = new Phaser.Line(game.input.x, game.input.y, newCircle.x, newCircle.y);
		if (line.length < newCircle.radius && newCircle.circleActive) {
            playClickSound();
            newCircle.scale -= 0.05;
            newCircle.animationTween = game.add.tween(newCircle).to({ scale: 1 }, 200, Phaser.Easing.Cubic.In, true);
            window.open("Assets/Tutorial/tut.PNG");
        }
    }
    return newCircle;
}

function makeMenuDifficultyButton()
{
    var newCircle = makeCircle();
    newCircle.mouseOver = false;

    newCircle.create = function(x,y)
    {
        newCircle.init(x, y, 40, getColour('red'), true, true, difficulty);
        newCircle.text.fontSize = 25;
        newCircle.text.tint = getColour('red');
    }

    newCircle.update = function()
    {
        var mouseLine = new Phaser.Line(newCircle.x, newCircle.y, game.input.x, game.input.y);
        if (mouseLine.length < 40) {
            if (!newCircle.mouseOver) {
                newCircle.scale += 0.1;
                newCircle.animationTween = game.add.tween(newCircle).to({ scale: 1 }, 200, Phaser.Easing.Cubic.Out, true);
            } newCircle.mouseOver = true;
        } else newCircle.mouseOver = false;
    }

    newCircle.onClick = function()
    {       
		var line = new Phaser.Line(game.input.x, game.input.y, newCircle.x, newCircle.y);
		if (line.length < newCircle.radius && newCircle.circleActive) {
            playClickSound();
            newCircle.scale -= 0.05;
            newCircle.animationTween = game.add.tween(newCircle).to({ scale: 1 }, 200, Phaser.Easing.Cubic.In, true);
            CycleDifficulty();
            newCircle.text.text = difficulty;
            newCircle.text.tint = getColour('red');
        }
    }
    return newCircle;
}

function CycleDifficulty()
{
    if (difficulty === 'noob')
        difficulty = 'pro';
    else if (difficulty === 'pro')
        difficulty = 'mlgpro';
    else if (difficulty === 'mlgpro')
        difficulty = 'rekt'
    else if (difficulty === 'rekt')
        difficulty = 'noob';
}