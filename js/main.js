var game = new Phaser.Game(1200, 600);
var dice, player1Dices =[],player2Dices =[], pawn;
var gameSceneW= 450, gameSceneH=600;
var gameSceneOriginX = (1000-gameSceneW)/2 , gameSceneOriginY=50;
var stepText;
var turnText;
var player1ScoreText;
var player2ScoreText;
var colorPickers = [];
var previousStep;


var initGrille = {
    cols: 9,
    rows: 10,
    // from left
    //index 1: tile color 0 = no-color , 1=red, 2=yellow, 3=black, 4=green, 5=bleu *-1 p2
    //index 2: pawn id,  0= empty,  1=red, 2=yellow, 3=black, 4=green, 5=bleu * -1 = P2
    //index 3: bonus, 0 = empty

    matrix: [
        [-1,-1,0], [0,0,0], [-2,-2,0], [0,0,0], [-3,-3,0], [0,0,0], [-4,-4,0], [0,0,0], [-5,-5,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,3], [0,0,0], [0,0,1], [0,0,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,3],
        [0,0,2], [0,0,0], [0,0,1], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,1], [0,0,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
        [0,0,1], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,3],
        [1,1,0], [0,0,0], [2,2,0], [0,0,0], [3,3,0], [0,0,0], [4,4,0], [0,0,0], [5,5,0],
    ]

};

var grille = {
    cols: 9,
    rows: 10,
    // from left
    //index 1: tile color 0 = no-color , 1=red, 2=yellow, 3=black, 4=green, 5=bleu *-1 p2
    //index 2: pawn id,  0= empty,  1=red, 2=yellow, 3=black, 4=green, 5=bleu * -1 = P2
    //index 3: bonus, 0 = empty

    matrix: [
        [-1,-1,0], [0,0,0], [-2,-2,0], [0,0,0], [-3,-3,0], [0,0,0], [-4,-4,0], [0,0,0], [-5,-5,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,3], [0,0,0], [0,0,1], [0,0,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,3],
        [0,0,2], [0,0,0], [0,0,1], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,1], [0,0,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
        [0,0,1], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,3],
        [1,1,0], [0,0,0], [2,2,0], [0,0,0], [3,3,0], [0,0,0], [4,4,0], [0,0,0], [5,5,0],
    ]

};

//movesLeft for each color
//index 0 red
//index 1 yellow
//index 2 black
//index 3 green
//index 4 bleu

//step =0 if at throwingDices phase =1 if at selecting colors phase =2 if at coloring tiles phase =3 if at moving pawn phase =6 kill bonus
var context = {
    "grille" : grille,
    "movesLeft" : [0,0,0,0,0],
    "currentPlayer" : 0,
    "step" : 0,
    "choosedColor" : 0,
    "pawnMovesLeft" : 2,
    "deletedColors" : [],
    "player1Score" : 0,
    "player2Score" : 0,
    "isDoubleTurn" : false
};



var mainState = {

    preload: function() {
        game.stage.backgroundColor = '#71c5cf';
        game.load.spritesheet('dices-red', 'assets/Dices/Dices-Red.png', 50, 50, 6);
        game.load.spritesheet('dices-blue', 'assets/Dices/Dices-blue.png', 50, 50, 6);
        game.load.spritesheet('dices-green', 'assets/Dices/Dices-green.png', 50, 50, 6);
        game.load.spritesheet('dices-gray', 'assets/Dices/Dices-gray.png', 50, 50, 6);
        game.load.spritesheet('dices-yellow', 'assets/Dices/Dices-yellow.png', 50, 50, 6);

        // load grid boxes
        game.load.image('bird', 'assets/bird.png');
        game.load.image('bird-red', 'assets/bird-red.png');
        game.load.image('bird-yellow', 'assets/bird-yellow.png');
        game.load.image('bird-green', 'assets/bird-green.png');
        game.load.image('bird-blue', 'assets/bird-blue.png');
        game.load.image('bird-gray', 'assets/bird-gray.png');

        // load blured grid boxes
        game.load.image('bird1', 'assets/box/bird.png');
        game.load.image('bird-red1', 'assets/box/bird-red.png');
        game.load.image('bird-yellow1', 'assets/box/bird-yellow.png');
        game.load.image('bird-green1', 'assets/box/bird-green.png');
        game.load.image('bird-blue1', 'assets/box/bird-blue.png');
        game.load.image('bird-gray1', 'assets/box/bird-gray.png');


        game.load.image('throw', 'assets/throw.png');
        game.load.image('state-box', 'assets/stateBox.png');
        game.load.image('restart', 'assets/restart.png');


        // load pawns
        game.load.image('pawn-gray', 'assets/Pawns/pawn-gray.png');
        game.load.image('pawn-green', 'assets/Pawns/pawn-green.png');
        game.load.image('pawn-yellow', 'assets/Pawns/pawn-yellow.png');
        game.load.image('pawn-blue', 'assets/Pawns/pawn-blue.png');
        game.load.image('pawn-red', 'assets/Pawns/pawn-red.png');

        // load PawnsContour
        game.load.image('pawn-gray1', 'assets/PawnsContour/pawn-gray.png');
        game.load.image('pawn-green1', 'assets/PawnsContour/pawn-green.png');
        game.load.image('pawn-yellow1', 'assets/PawnsContour/pawn-yellow.png');
        game.load.image('pawn-blue1', 'assets/PawnsContour/pawn-blue.png');
        game.load.image('pawn-red1', 'assets/PawnsContour/pawn-red.png');


        //load colorPicker
        game.load.image('marker-red','assets/markers/markerRed.png');
        game.load.image('marker-yellow','assets/markers/markerYellow.png');
        game.load.image('marker-blue','assets/markers/markerBlue.png');
        game.load.image('marker-gray','assets/markers/markerGray.png');
        game.load.image('marker-green','assets/markers/markerGreen.png');

        //load bonuses
        game.load.image('bonus1','assets/Bonus/bonus1.png');
        game.load.image('bonus2','assets/Bonus/bonus2.png');
        game.load.image('bonus3','assets/Bonus/bonus3.png');

    },



    create: function() {

        /*if(!game.device.desktop) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }*/

        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;


        game.add.sprite(850, 200, 'state-box');

        var restartButton = game.add.sprite(80, 200, 'restart');
        restartButton.inputEnabled=true;
        restartButton.events.onInputDown.add(this.restartGame, this);
        game.add.sprite(80, 240, 'restart');
        game.add.sprite(80, 280, 'restart');
        game.add.sprite(80, 320, 'restart');

        updateText();
        updateScoreText();

        this.labelPlayer1 = game.add.text(20, 10, "Player 1", { font: "30px Arial", fill: "#ffffff" });
        this.labelPlayer2 = game.add.text(20, 550, "Player 2", { font: "30px Arial", fill: "#ffffff" });








        this.gridUpdate();
        this.initializeDices();


        var throwSprit1 = game.add.sprite(750, 560, 'throw');
        throwSprit1.inputEnabled = true;
        throwSprit1.events.onInputDown.add(this.throwPlayer1Dices, this);
        var throwSprit2 = game.add.sprite(750, 10, 'throw');
        throwSprit2.inputEnabled = true;
        throwSprit2.events.onInputDown.add(this.throwPlayer2Dices, this);

    },



    update: function() {

    },



    restartGame: function() {
        game.state.start('main');
    },

    // generate a dice on click
    generateDice: function(sprite){
        var rand = Math.floor(Math.random() * 6);
        sprite.frame = rand;
        return rand;
    },


    gridUpdate: function(){


        for (var r = 0; r < grille.rows; r++) {
            for (var c = 0; c < grille.cols; c++) {


                var index = r * grille.cols + c;

                //index 1 0: no-color, 1=red, 2=yellow, 3=black, 4=green, 5=bleu
                //index 2: pawn id,  0= empty,  1=red, 2=yellow, 3=black, 4=green, 5=bleu * -1 = P2
                //index 3: bonus, 0 = empty


                var image;
                switch(grille.matrix[index][0]) {
                    case 0:
                        image = this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY,'bird');
                        break;
                    case 1:
                        image = this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-red');
                        break;
                    case 2:
                        image = this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-yellow');
                        break;
                    case 3:
                        image = this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-gray');
                        break;
                    case 4:
                        image = this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-green');
                        break;
                    case 5:
                        image = this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-blue');
                        break;
                    case -1:
                        image = this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-red1');
                        break;
                    case -2:
                        image = this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-yellow1');
                        break;
                    case -3:
                        image = this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-gray1');
                        break;
                    case -4:
                        image = this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-green1');
                        break;
                    case -5:
                        image = this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-blue1');
                        break;


                }
                const a = r;
                const b = c;
                image.inputEnabled = true;
                image.events.onInputDown.add(function () {
                    onTileClicked(a,b);
                },this);

                switch(grille.matrix[index][1]) {



                    //index 2: pawn id,  0= empty,  1=red, 2=yellow, 3=black, 4=green, 5=bleu * -1 = P2

                    case 1:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-red');
                        break;
                    case 2:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-yellow');
                        break;
                    case 3:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-gray');
                        break;
                    case 4:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-green');
                        break;
                    case 5:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-blue');
                        break;

                    case -1:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-red1');
                        break;
                    case -2:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-yellow1');
                        break;
                    case -3:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-gray1');
                        break;
                    case -4:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-green1');
                        break;
                    case -5:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-blue1');
                        break;
                }

                switch(grille.matrix[index][2]) {



                    //index 2: pawn id,  0= empty,  1=red, 2=yellow, 3=black, 4=green, 5=bleu * -1 = P2

                    case 1:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bonus1');
                        break;
                    case 2:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bonus2');
                        break;
                    case 3:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bonus3');
                        break;

                }




            }
        }


    },

    initializeDices: function(){

        // itinialize player2's dices
        var rand =0;
        //1=red, 2=yellow, 3=black, 4=green, 5=bleu * -1 = P2
        var dice =[];
        dice[0] = game.add.sprite(gameSceneOriginX, 0, 'dices-red');
        dice[0].frame=rand;
        //  Enables all kind of input actions on this image (click, etc)
        //dice[0].inputEnabled = true;
        //dice[0].events.onInputDown.add(this.generateDice, this);
        player2Dices.push(dice[0]);


        dice[1] = game.add.sprite(gameSceneOriginX+2*50, 0, 'dices-yellow');
        dice[1].frame=rand;
        //  Enables all kind of input actions on this image (click, etc)
        //dice[1].inputEnabled = true;
        //dice[1].events.onInputDown.add(this.generateDice, this);
        player2Dices.push(dice[1]);


        dice[2] = game.add.sprite(gameSceneOriginX+4*50, 0, 'dices-gray');
        dice[2].frame=rand;
        //  Enables all kind of input actions on this image (click, etc)
        //dice[2].inputEnabled = true;
        //dice[2].events.onInputDown.add(this.generateDice, this);
        player2Dices.push(dice[2]);


        dice[3] = game.add.sprite(gameSceneOriginX+6*50, 0, 'dices-green');
        dice[3].frame=rand;
        //  Enables all kind of input actions on this image (click, etc)
        //dice[3].inputEnabled = true;
        //dice[3].events.onInputDown.add(this.generateDice, this);
        player2Dices.push(dice[3]);


        dice[4] = game.add.sprite(gameSceneOriginX+8*50, 0, 'dices-blue');
        dice[4].frame=rand;
        //  Enables all kind of input actions on this image (click, etc)
        //dice[4].inputEnabled = true;
        //dice[4].events.onInputDown.add(this.generateDice, this);
        player2Dices.push(dice[4]);

        // itinialize player1's dices
        //_____________________________________________________________________

        //this.generateDice(i*50,550);

        dice[5] = game.add.sprite(gameSceneOriginX, 550, 'dices-red');
        dice[5].frame=rand;
        //  Enables all kind of input actions on this image (click, etc)
        //dice[5].inputEnabled = true;
        //dice[5].events.onInputDown.add(this.generateDice, this);
        player1Dices.push(dice[5]);


        dice[6] = game.add.sprite(gameSceneOriginX+2*50, 550, 'dices-yellow');
        dice[6].frame=rand;
        //  Enables all kind of input actions on this image (click, etc)
        //dice[6].inputEnabled = true;
        //dice[6].events.onInputDown.add(this.generateDice, this);
        player1Dices.push(dice[6]);


        dice[7] = game.add.sprite(gameSceneOriginX+4*50, 550, 'dices-gray');
        dice[7].frame=rand;
        //  Enables all kind of input actions on this image (click, etc)
        //dice[7].inputEnabled = true;
        //dice[7].events.onInputDown.add(this.generateDice, this);
        player1Dices.push(dice[7]);


        dice[8] = game.add.sprite(gameSceneOriginX+6*50, 550, 'dices-green');
        dice[8].frame=rand;
        //  Enables all kind of input actions on this image (click, etc)
        //dice[8].inputEnabled = true;
        //dice[8].events.onInputDown.add(this.generateDice, this);
        player1Dices.push(dice[8]);


        dice[9] = game.add.sprite(gameSceneOriginX+8*50, 550, 'dices-blue');
        dice[9].frame=rand;
        //  Enables all kind of input actions on this image (click, etc)
        //dice[9].inputEnabled = true;
        //dice[9].events.onInputDown.add(this.generateDice, this);
        player1Dices.push(dice[9]);


    },

    initializePawns: function(){

        // itinialize player2's pawns
        for (var i=0; i<grille.cols; i++){
            if(i%2==0){

                pawn = game.add.sprite(gameSceneOriginX+i*50, 50, 'pawn');

                //  Enables all kind of input actions on this image (click, etc)
                pawn.inputEnabled = true;

                //dice.events.onInputDown.add(this.generateDice, this);
                //dices.push(dice);
            }

        }

        // itinialize player1's pawns
        for (var i=0; i<grille.cols; i++){
            if(i%2==0){

                pawn = game.add.sprite(gameSceneOriginX+i*50, 500, 'pawn');


                //  Enables all kind of input actions on this image (click, etc)
                pawn.inputEnabled = true;

                //pawn.events.onInputDown.add(this.generateDice, this);
                //pawn.push(dice);
            }

        }

    },

    throwPlayer1Dices: function(){
        if (context.step===0&&context.currentPlayer===0)
        {
            for (var i=0; i<player1Dices.length; i++){
                context.movesLeft[i]= this.generateDice(player1Dices[i])+1;
            }
            updateStep(context.step+1);
            updateColorPicker();
        }
    },

    throwPlayer2Dices: function(){
        if (context.step===0&&context.currentPlayer===1)
        {
            for (var i=0; i<player2Dices.length; i++){
                context.movesLeft[i]= this.generateDice(player2Dices[i])+1;
            }
            updateStep(context.step+1);
            updateColorPicker();
        }
    }





};



function onTileClicked (a,b) {

    if (context.step===2)
    {
        if (canBeColored(a,b,context.choosedColor,context))
        {
            color(a,b,context.choosedColor,context);
            if (!existsToBeColored(context.choosedColor,context))
            {
                updateStep(3);
                mainState.gridUpdate();
                return;
            }
        }
        if (context.movesLeft[getMoveIndexFromColor(context.choosedColor)]===0)
        {
            updateStep(context.step+1);
            mainState.gridUpdate();
            return;
        }
    }

    if (context.step===3)
    {
        if (canPawnMove(a,b,context.choosedColor,context))
        {
            movePawn(a,b,context.choosedColor,context);
            context.pawnMovesLeft--;
            if (isDoubleBonus(a,b,context))
            {
                context.isDoubleTurn=true;
                context.grille.matrix[context.grille.cols*a+b][2]=0;
            }
            if (isKillBonus(a,b,context))
            {
                context.grille.matrix[context.grille.cols*a+b][2]=0;
                updateStep(6);
                mainState.gridUpdate();
                if (context.pawnMovesLeft===0)
                {
                    previousStep=0;
                }
                else
                {
                    previousStep=3;
                }
                return;
            }
            if (pawnExistsMove(context.choosedColor,context))
            {
                if (isPawnAtEnd(context.choosedColor,context))
                {
                    removeColorFromGame(context.choosedColor);
                    if (context.currentPlayer===0)
                    {
                        updateScore(context.player1Score+1,context.player2Score);
                    }
                    else
                    {
                        updateScore(context.player1Score,context.player2Score+1);
                    }
                    changeTurn();
                    updateStep(0);
                }
                else
                {
                    if (context.pawnMovesLeft===0)
                    {
                        changeTurn();
                        updateStep(0);
                    }
                }
            }
            else
            {
                changeTurn();
                updateStep(0);
            }
        }

    }

    if (context.step===6)
    {
        var s = getElementAt(a,b,context.grille)[1];
        if (s>0&&context.currentPlayer===1)
        {
            movePawnToInitialLocation(s,context,initGrille);
            updateStep(previousStep);
        }
        if (s<0&&context.currentPlayer===0)
        {
            movePawnToInitialLocation(s,context,initGrille);
            updateStep(previousStep);
        }
    }
    mainState.gridUpdate();

    //console.log("i am clicked x = "+x+" y = "+y);
}

function changeTurn() {
    if (context.isDoubleTurn)
    {
        context.isDoubleTurn=false;
    }
    else
    {
        context.currentPlayer = 1-context.currentPlayer;
    }
}

function chooseColor(choosenColor) {
    if (context.step===1)
    {
        context.choosedColor = choosenColor;
        updateStep(context.step+1);
    }
    updateColorPicker();
}

function removeColorFromGame(color) {
    context.deletedColors.push(color);
    updateColorPicker();
    deletePawn(color,context);
}

function isColorEnabled(color) {
    if (context.currentPlayer===0)
    {
        return !context.deletedColors.includes(color);
    }
    else
    {
        return !context.deletedColors.includes(-color);
    }
}

function updateColorPicker() {
    var y = 0;
    if (context.step===1)
    {
        if (isColorEnabled(1)) {
            colorPickers[0] = game.add.sprite(gameSceneOriginX + 470, y * 50 + 150, 'bird-red');
            colorPickers[0].inputEnabled = true;
            colorPickers[0].events.onInputDown.add(function () {
                if (context.currentPlayer === 0)
                    chooseColor(1);
                else
                    chooseColor(-1);
            });
            y++;
        }
        else
        {
            if (colorPickers.length>0&&colorPickers[0]!==null)
                colorPickers[0].destroy();
        }
        if (isColorEnabled(2))
        {
            colorPickers[1] = game.add.sprite(gameSceneOriginX+470,y*50+150,'bird-yellow');
            colorPickers[1].inputEnabled = true;
            colorPickers[1].events.onInputDown.add(function () {
                if (context.currentPlayer===0)
                    chooseColor(2);
                else
                    chooseColor(-2);
            });
            y++;
        }
        else
        {
            if (colorPickers.length>0&&colorPickers[1]!==null)
                colorPickers[1].destroy();
        }
        if (isColorEnabled(3))
        {
            colorPickers[2] = game.add.sprite(gameSceneOriginX+470,y*50+150,'bird-gray');
            colorPickers[2].inputEnabled = true;
            colorPickers[2].events.onInputDown.add(function () {
                if (context.currentPlayer===0)
                    chooseColor(3);
                else
                    chooseColor(-3);
            });
            y++;
        }
        else
        {
            if (colorPickers.length>0&&colorPickers[2]!==null)
                colorPickers[2].destroy();
        }
        if (isColorEnabled(4))
        {
            colorPickers[3] = game.add.sprite(gameSceneOriginX+470,y*50+150,'bird-green');
            colorPickers[3].inputEnabled = true;
            colorPickers[3].events.onInputDown.add(function () {
                if (context.currentPlayer===0)
                    chooseColor(4);
                else
                    chooseColor(-4);
            });
            y++;
        }
        else
        {
            if (colorPickers.length>0&&colorPickers[3]!==null)
                colorPickers[3].destroy();
        }
        if (isColorEnabled(5))
        {
            colorPickers[4] = game.add.sprite(gameSceneOriginX+470,y*50+150,'bird-blue');
            colorPickers[4].inputEnabled = true;
            colorPickers[4].events.onInputDown.add(function () {
                if (context.currentPlayer===0)
                    chooseColor(5);
                else
                    chooseColor(-5);
            });
            y++;
        }
        else
        {
            if (colorPickers.length>0&&colorPickers[4]!==null)
                colorPickers[4].destroy();
        }
    }
    else
    {
        if (colorPickers.length>0)
            for (var i = 0;i<5;i++)
            {
                colorPickers[i].destroy();
            }
    }
}

function updateStep(newStep) {
    var prevStep = context.step;
    context.step = newStep;

    if (newStep===2)
    {
        if (!existsToBeColored(context.choosedColor,context))
        {
            updateStep(3);
            return;
        }
    }

    if (newStep===3&&prevStep!==6)
    {
        context.pawnMovesLeft = 2;
    }
    updateText();
}

function updateText() {
    if (stepText)
        stepText.destroy();
    if (turnText)
        turnText.destroy();
    if (context.currentPlayer===0)
    {
        turnText = game.add.text(900,230,"Turn player 2");
    }
    else
    {
        turnText = game.add.text(900,230,"Turn player 1");
    }
    switch (context.step)
    {
        case 0: stepText = game.add.text(900,280,"Throw Dice");
            break;
        case 1: stepText = game.add.text(900,280,"Choose color");
            break;
        case 2: stepText = game.add.text(900,280,"color tiles");
            break;
        case 3: stepText = game.add.text(900,280,"move pawn");
            break;
        case 6: stepText = game.add.text(900,280,"Choose an enemy to move it back to its initial position");
            break;
    }
}

function updateScore(newScorePlayer1, newScorePlayer2) {
    context.player1Score = newScorePlayer1;
    context.player2Score = newScorePlayer2;
    if (newScorePlayer1===5)
    {
        alert("player 1 has won");
    }
    else
    {

    }
    if (newScorePlayer2===5)
    {
        alert("player 2 has won");
    }
    else
    {

    }
    updateScoreText();
}

function updateScoreText() {
    if (player1ScoreText)
        player1ScoreText.destroy();
    if (player2ScoreText)
        player2ScoreText.destroy();
    player1ScoreText = game.add.text(20,100,"Score Player 1 : "+context.player1Score);
    player2ScoreText = game.add.text(20,500,"Score Player 2 : "+context.player2Score);
}

game.state.add('main', mainState);
game.state.start('main');


