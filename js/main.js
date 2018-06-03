var game = new Phaser.Game(1000, 600);
var dice, player1Dices =[],player2Dices =[], pawn;
var gameSceneW= 450, gameSceneH=600;
var gameSceneOriginX = (1000-gameSceneW)/2 , gameSceneOriginY=50;

var grille = {
            cols: 9,
            rows: 10,
            // from left
            //index 1: tile color 0 = no-color , 1=red, 2=yellow, 3=black, 4=green, 5=bleu *-1 p2
            //index 2: pawn id,  0= empty,  1=red, 2=yellow, 3=black, 4=green, 5=bleu * -1 = P2
            //index 1: bonus, 0 = empty

            matrix: [
                [-1,-1,0], [0,0,0], [-2,-2,0], [0,0,0], [-3,-3,0], [0,0,0], [-4,-4,0], [0,0,0], [-5,-5,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [1,1,0], [0,0,0], [2,2,0], [0,0,0], [3,3,0], [0,0,0], [4,4,0], [0,0,0], [5,5,0],
            ]

        };

//movesLeft for each color
//index 0 red
//index 1 yellow
//index 2 black
//index 3 green
//index 4 bleu

var context = {
  "grille" : grille,
  "movesLeft" : [0,0,0,0,0],
    "currentPlayer" : 0
};



var mainState = {

    preload: function() {
        game.stage.backgroundColor = '#71c5cf';
        game.load.spritesheet('dices-red', 'assets/Dices-Red.png', 50, 50, 6);
        game.load.spritesheet('dices-blue', 'assets/Dices-blue.png', 50, 50, 6);
        game.load.spritesheet('dices-green', 'assets/Dices-green.png', 50, 50, 6);
        game.load.spritesheet('dices-gray', 'assets/Dices-gray.png', 50, 50, 6);
        game.load.spritesheet('dices-yellow', 'assets/Dices-yellow.png', 50, 50, 6);

        game.load.image('bird', 'assets/bird.png');
        game.load.image('bird-red', 'assets/bird-red.png');
        game.load.image('bird-yellow', 'assets/bird-yellow.png');
        game.load.image('bird-green', 'assets/bird-green.png');
        game.load.image('bird-blue', 'assets/bird-blue.png');
        game.load.image('bird-gray', 'assets/bird-gray.png');


        game.load.image('throw', 'assets/throw.png');


        // load pawns
        game.load.image('pawn-gray', 'assets/pawn-gray.png');
        game.load.image('pawn-green', 'assets/pawn-green.png');
        game.load.image('pawn-yellow', 'assets/pawn-yellow.png');
        game.load.image('pawn-blue', 'assets/pawn-blue.png');
        game.load.image('pawn-red', 'assets/pawn-red.png');




    },



    create: function() {
        /*if(!game.device.desktop) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }*/

        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;



        this.labelPlayer1 = game.add.text(20, 10, "Player 1", { font: "30px Arial", fill: "#ffffff" });
        this.labelPlayer2 = game.add.text(20, 550, "Player 2", { font: "30px Arial", fill: "#ffffff" });


        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

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
        this.gridUpdate();
    },



    restartGame: function() {
        game.state.start('main');
    },

    // generate a dice on click
    generateDice: function(sprite){
        var rand = Math.floor(Math.random() * 6);
        sprite.frame = rand;

    },


    gridUpdate: function(){


        for (var r = 0; r < grille.rows; r++) {
            for (var c = 0; c < grille.cols; c++) {


                var index = r * grille.cols + c;

                 //index 1 0: no-color, 1=red, 2=yellow, 3=black, 4=green, 5=bleu
                 //index 2: pawn id,  0= empty,  1=red, 2=yellow, 3=black, 4=green, 5=bleu * -1 = P2
                 //index 3: bonus, 0 = empty

                /*switch(grille.matrix[index][0]) {
                    case 0:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird');
                        break;
                    case 1:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird');
                        break;
                    case 2:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pipe');
                        break;
                    case 3:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird');
                        break;
                    case 4:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pipe');
                        break;
                    case 5:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pipe');
                        break;
                }*/

                switch(grille.matrix[index][0]) {
                    case 0:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY,'bird');
                        break;
                    case 1:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-red');
                        break;
                    case 2:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-yellow');
                        break;
                    case 3:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-gray');
                        break;
                    case 4:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-green');
                        break;
                    case 5:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-blue');
                        break;
                    case -1:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-red');
                        break;
                    case -2:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-yellow');
                        break;
                    case -3:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-gray');
                        break;
                    case -4:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-green');
                        break;
                    case -5:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird-blue');
                        break;


                }

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
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-red');
                        break;
                    case -2:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-yellow');
                        break;
                    case -3:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-gray');
                        break;
                    case -4:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-green');
                        break;
                    case -5:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn-blue');
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
        for (var i=0; i<player1Dices.length; i++){
            this.generateDice(player1Dices[i]);
        }
    },

    throwPlayer2Dices: function(){
        for (var i=0; i<player2Dices.length; i++){
            this.generateDice(player2Dices[i]);
        }
    }





};

game.state.add('main', mainState);
game.state.start('main');
