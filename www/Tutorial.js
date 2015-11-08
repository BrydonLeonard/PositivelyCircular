var tutTemp = null;
var Tutorial = {
    main:null,
    back: null,
    time:null,
    create:function()
    {
        graphics = game.add.graphics(0, 0);
        var text1 = "WELCOME TO POSITIVELY CIRCULAR";
        var text2 = "CLICK";
        this.RedisplayMain(text1, text2, Tutorial.ShowAddCircle);
        this.back = makeBackButton();
        this.back.create();
        game.input.onDown.add(this.back.onClick, game);
    },
    update: function ()
    {
        graphics.clear();
        this.back.update();
        this.back.draw();

        this.main.update();
        this.main.draw();

        if (tutTemp != null)
        {
            try{
                tutTemp.update();
            }catch(e){}
            tutTemp.draw();
        }

    },
    RedisplayMain: function(text1, text2, func)
    {
        if (Tutorial.main != null) {
            Tutorial.main.circleActive = false;
            Tutorial.main.text.destroy();
            Tutorial.main.text2.destroy();
        }
        Tutorial.main = makeTwoLineCircle();
        Tutorial.main.create(game.width / 2, game.height / 3, game.width / 2 / radScale, getColour('platinum'), text1, text2, func);
        game.input.onDown.add(this.main.onClick, game);
    },
    ShowAddCircle: function ()
    {
        Tutorial.RedisplayMain("THIS IS A NODE", "CLICK ON IT TO CHANGE ITS POLARITY\nBLUE IS ADDING\nRED IS SUBTRACTING", Tutorial.ExplainSum);

        tutTemp = makeNumberCircle();
        tutTemp.create(game.width / 2, game.height * 4 / 5, 25, 10, 0.0001, 10);
        game.input.onDown.add(tutTemp.onClick);
    },
    ExplainSum: function()
    {
        Tutorial.RedisplayMain("YOU WANT THE SUM\nOF NODES TO REACH THE OBJECTIVE.", "THE OBJECTIVE IS THE BIG NUMBER\nIN THE MIDDLE", Tutorial.ShowGold);
       

        game.input.onDown.remove(Tutorial.ExplainSum, game);
        Tutorial.main.changeFunc(Tutorial.ShowTotal, game);
        game.input.onDown.add(Tutorial.main.onClick);

    },
    ShowGold:function()
    {
        Tutorial.RedisplayMain("GOLD RINGS", "THESE NODES DOUBLE YOUR SCORE", Tutorial.ShowBase);

        tutTemp.goldRing = true;

        game.input.onDown.remove(Tutorial.ShowGold, game);
        Tutorial.main.changeFunc(Tutorial.ShowBase, game);
        game.input.onDown.add(Tutorial.main.onClick, game);
    },
    ShowBase : function()
    {
        Tutorial.RedisplayMain("THOSE ARE THE BASICS", "LEARN THE REST AS YOU PLAY", startMenuState);

        game.input.onDown.remove(Tutorial.ShowBase, game);
        Tutorial.main.changeFunc(startMenuState, game);
        game.input.onDown.add(Tutorial.main.onClick, game);

        tutTemp.text.destroy;
        tutTemp = null;
    }

}

function StartTutorial()
{
    tutTemp = null;
    game.state.start('Tutorial');
}