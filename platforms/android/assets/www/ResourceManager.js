function getNumColour(colourString)
{
    if (difficulty === 'mlgpro' || difficulty === 'rekt') {
        if (colourString === 'positive')
            return getInverse(0x5555ff);
        if (colourString === 'negative')
            return getInverse(0xff3333);
        if (colourString === 'neut')
            return getInverse(0xeeeeee);
    }
    else {
        if (colourString === 'positive')
            return 0x5555ff;
        if (colourString === 'negative')
            return 0xff3333;
        if (colourString === 'neut')
            return 0xeeeeee;
    }
}

function getTextColour(colourString)
{
    if (difficulty === 'mlgpro' || difficulty === 'rekt') {
        if (colourString === 'positive')
            return getInverse(0x7777ff);
        if (colourString === 'negative')
            return getInverse(0xff6666);
        if (colourString === 'neut')
            return getInverse(0xeeeeee);
    }
    else {
        if (colourString === 'positive')
            return 0x7777ff;
        if (colourString === 'negative')
            return 0xff6666;
        if (colourString === 'neut')
            return 0xeeeeee;
    }
}

function getColour(colourString)
{
    if (difficulty === 'mlgpro' || difficulty === 'rekt') {
        if (colourString === 'background')
            return getInverse('#182d3b');
        if (colourString === 'blue')
            return getInverse(0x5555ff);
        if (colourString === 'red')
            return getInverse(0xff3333);
        if (colourString === 'white')
            return getInverse(0xeeeeee);
        if (colourString === 'green')
            return getInverse(0x33ff33);
        if (colourString === 'gold')
            return getInverse(0xffd700);
        if (colourString === 'platinum')
            return getInverse(0xe5e4e2);
    } else {
        if (colourString === 'background')
            return '#182d3b';
        if (colourString === 'blue')
            return 0x5555ff;
        if (colourString === 'red')
            return 0xff3333;
        if (colourString === 'white')
            return 0xeeeeee;
        if (colourString === 'green')
            return 0x33ff33;
        if (colourString === 'gold')
            return 0xffd700;
        if (colourString === 'platinum')
            return 0xe5e4e2;
    }
}

function getInverse(colour)
{
    var r = Phaser.Color.getRed(colour);
    var g = Phaser.Color.getGreen(colour);
    var b = Phaser.Color.getBlue(colour);

    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    return Phaser.Color.getColor(r,g,b)
}
function playClickSound()
{
    if (sound) {
        var rand = Math.random();
        if (rand < 0.25)
            clickSoundArray[0].play();
        else if (rand < 0.5)
            clickSoundArray[1].play();
        else if (rand < 0.75)
            clickSoundArray[2].play();
        else clickSoundArray[3].play();
    }
}


function playStartGameSound()
{
    if (sound) {
        startSound.play();
    }
}

function playWinSound()
{
    if (sound) {
        winSound.play();
    }
}

function playBackSound()
{
    if (sound) {
        backSound.play();
    }
}
var music;
function PlayMusic() {
    if (sound)
    {
        if (music === null || !music.isPlaying) {
            music.play();
            music.onStop.add(PlayMusic, this);
        }
    }
}
function StopMusic()
{
    music.stop();
}

var strings = [
    '... CAN THESE PETTY HUMANS EVEN ALIGN THEIR GLORBON NODES? UNLIKELY ...',
    '... A TRIVIAL ACHIEVEMENT. BARELY WORTH OUR NOTICE ...',
    '... IF THEY SEEK TO IMPRESS US IT WILL TAKE A LOT MORE THAN THAT ...',
    '... REMINDS ME OF ORIENTATION AT THE GLORBON ACADEMY ...',
    "... WHAT'S FOR DINNER? ...",
    '... IT IS IMPRESSIVE THAT THESE HUMANS MADE IT THIS FAR, BUT IT IS STILL NOTHING ...',
    '... DID YOU CATCH THAT EPISODE OF HOW I MET YOUR GLORBON? ...',
    "... JET FUEL CAN'T MELT STEEL BEAMS ...",
    '... GLORBON MASTER RACE ...',
    '... ZZZ ...',
    '... OH LOOK! THE HUMAN IS TRYING AGAIN! ...',
    '... Sound On Off Images: Aaron Burke (itmatters.mobi) ...',
    '... Some sounds by David McKee (ViRiX) soundcloud.com/virix ...',
    '... BlueBeat 01" Copyright 2007 ERH http://www.freesound.org/people/ERH/ ...\n... License: http://creativecommons.org/licenses/by/3.0/...',
    '... 3.141592653589793238462643383 ...',
    '... 2.718281828459045235360287471 ...',
    '... WE COME IN PEACE, SEEKING GOLD AND SLAVES ...',
    "... IF YOU CAN'T CONVINCE THEM, CONFUSE THEM ...",
    "... IF AT FIRST YOU DON'T SUCCEED, DESTROY ALL EVIDENCE THAT YOU TRIED ..."]

function getRandomFlavourText()
{
    var rand = Math.round(Math.random() * strings.length);
    return strings[rand];
}