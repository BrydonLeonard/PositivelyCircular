
ModifierCircles = { negColCircle: null, timerCircle: null, randomBaseCircle: null, useAllCircle:null, multiplier:null };
var ModifierState = {
    BackCircle:null,
    create: function () {
        graphics = game.add.graphics(0, 0);
        ModifierCircles.negColCircle = makeTwoLineCircle();
        ModifierCircles.timerCircle = makeTwoLineCircle();
        ModifierCircles.randomBaseCircle = makeTwoLineCircle();
        ModifierCircles.useAllCircle = makeTwoLineCircle();
        ModifierCircles.multiplier = makeTwoLineCircle();


        var newPos = findValidModifierPos(0);
        var text2;
        if (difficulty.negativeColour)
            text2 = "INVERTED";
        else text2 = "NORMAL"
        ModifierCircles.negColCircle.create(newPos.x, newPos.y, 50, getInverse(getColour('red')), "COLOURS", text2, cycleNegState);

        newPos = findValidModifierPos(1);
        text2 = difficulty.timer.toString();
        ModifierCircles.timerCircle.create(newPos.x, newPos.y, 50, getColour('gold'), "TIMER", text2, cycleTimed);

        newPos = findValidModifierPos(2);
        if (difficulty.randomBase)
            text2 = "RANDOM";
        else text2 = "10";
        ModifierCircles.randomBaseCircle.create(newPos.x, newPos.y, 50, getColour('green'), "BASE", text2, cycleBaseRand);

        newPos = findValidModifierPos(3);
        if (difficulty.MustUseAll)
            text2 = "ON";
        else text2 = "OFF";
        ModifierCircles.useAllCircle.create(newPos.x, newPos.y, 50, getColour('blue'), "USE ALL", text2, cycleUseAll);

        newPos = findValidModifierPos(4);
        text2 = difficulty.multiplier.toString();
        ModifierCircles.multiplier.create(newPos.x, newPos.y, 70, getColour('platinum'), "MULTIPLIER", text2);

        game.input.onDown.add(ModifierCircles.negColCircle.onClick, game);
        game.input.onDown.add(ModifierCircles.timerCircle.onClick, game);
        game.input.onDown.add(ModifierCircles.randomBaseCircle.onClick, game);
        game.input.onDown.add(ModifierCircles.useAllCircle.onClick, game);

        this.BackCircle = makeBackButton();
        this.BackCircle.create();

        game.input.onDown.add(this.BackCircle.onClick, game);

        UpdateModifier();
    },
    update:function()
    {
        graphics.clear();

        this.BackCircle.draw();
        ModifierCircles.negColCircle.update();
        ModifierCircles.timerCircle.update();
        ModifierCircles.randomBaseCircle.update();
        ModifierCircles.useAllCircle.update();

        ModifierCircles.negColCircle.draw();
        ModifierCircles.timerCircle.draw();
        ModifierCircles.randomBaseCircle.draw();
        ModifierCircles.useAllCircle.draw();
        ModifierCircles.multiplier.draw();

    }
}
function  findValidModifierPos(num)
{
    var newPos = { x: Math.random() * (game.width - 100 * radScale) + 50 * radScale, y: Math.random() * (game.height - 150 * radScale) + 50 * radScale };
    var valid = false;
    while (!valid && num > 0)
    {
        newPos = { x: Math.random() * (game.width - 100 * radScale) + 50 * radScale, y: Math.random() * (game.height - 150 * radScale) + 50 * radScale };
        valid = true;
        var compLine = new Phaser.Line(newPos.x, newPos.y, ModifierCircles.negColCircle.x, ModifierCircles.negColCircle.y);
        if (compLine.length < 120 * radScale)
            valid = false;
        if (valid && num > 1)
        {
            compLine = new Phaser.Line(newPos.x, newPos.y, ModifierCircles.timerCircle.x, ModifierCircles.timerCircle.y);
            if (compLine.length < 120 * radScale)
                valid = false;
            if (valid && num > 2)
            {
                compLine = new Phaser.Line(newPos.x, newPos.y, ModifierCircles.randomBaseCircle.x, ModifierCircles.randomBaseCircle.y);
                if (compLine.length < 120 * radScale)
                    valid = false;
                if (valid && num > 3)
                {
                    compLine = new Phaser.Line(newPos.x, newPos.y, ModifierCircles.useAllCircle.x, ModifierCircles.useAllCircle.y);
                    if (compLine.length < 150 * radScale)
                        valid = false;
                }
            }
        }
    }
    return newPos;
}
function cycleNegState(){
    difficulty.negativeColour = !difficulty.negativeColour;
    if (difficulty.negativeColour)
        ModifierCircles.negColCircle.text2.text = "INVERTED";
    else ModifierCircles.negColCircle.text2.text = "NORMAL";
    LoadHighScoreFromConfig();
    UpdateModifier()
}
function cycleBaseRand()
{
    difficulty.randomBase = !difficulty.randomBase;
    if (difficulty.randomBase)
        ModifierCircles.randomBaseCircle.text2.text = "RANDOM";
    else ModifierCircles.randomBaseCircle.text2.text = "10";
    LoadHighScoreFromConfig();
    UpdateModifier()
}
function cycleTimed()
{
    if (difficulty.timer < 300)
        difficulty.timer += 60;
    else difficulty.timer = 60;
    ModifierCircles.timerCircle.text2.text = difficulty.timer.toString();
    LoadHighScoreFromConfig();
    UpdateModifier()
}

function cycleUseAll()
{
    difficulty.MustUseAll = !difficulty.MustUseAll;
    if (difficulty.MustUseAll)
        ModifierCircles.useAllCircle.text2.text = "ON";
    else ModifierCircles.useAllCircle.text2.text = "OFF";
    LoadHighScoreFromConfig();
    UpdateModifier()

}

function UpdateModifier()
{
    var mult = 1;
    mult *= 6-(difficulty.timer / modifierContributions.timer);
    if (difficulty.negativeColour)
        mult *= modifierContributions.negative;
    if (difficulty.randomBase)
        mult *= modifierContributions.randomBase;
    if (difficulty.MustUseAll)
        mult *= modifierContributions.MustUseAll;
    difficulty.multiplier = mult;
    ModifierCircles.multiplier.text2.text = difficulty.multiplier.toString();
}

function UpdateModifierNoButton()
{
    var mult = 1;
    mult *= 6 - (difficulty.timer / modifierContributions.timer);
    if (difficulty.negativeColour)
        mult *= modifierContributions.negative;
    if (difficulty.randomBase)
        mult *= modifierContributions.randomBase;
    if (difficulty.MustUseAll)
        mult *= modifierContributions.MustUseAll;
    difficulty.multiplier = mult;
}

function StartModifierState() {
    game.state.start('modifier');
}