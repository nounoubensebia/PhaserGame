var game = new Phaser.Game(1000, 600);
var dice, dices =[], pawn;
var gameSceneW= 450, gameSceneH=600;
var gameSceneOriginX = (1000-gameSceneW)/2 , gameSceneOriginY=50;

var grille = {
            cols: 9,
            rows: 10,
            // from left
            //index 1: tile color 0 = no-color , 1=red, 2=yellow, 3=black, 4=green, 5=bleu
            //index 2: pawn id,  0= empty,  1=red, 2=yellow, 3=black, 4=green, 5=bleu * -1 = P2
            //index 1: bonus, 0 = empty

            matrix: [
                [0,-1,0], [0,0,0], [0,-2,0], [0,0,0], [0,-3,0], [0,0,0], [0,-4,0], [0,0,0], [0,-5,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0],
                [0,1,0], [0,0,0], [0,2,0], [0,0,0], [0,3,0], [0,0,0], [0,4,0], [0,0,0], [0,5,0],
            ]

        };


var mainState = {

    preload: function() {
        game.stage.backgroundColor = '#71c5cf';
        game.load.spritesheet('dices', 'assets/Dices.png', 50, 50, 6);
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.image('pawn', 'assets/pawn.png');



    },



    create: function() {
        /*if(!game.device.desktop) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }*/

        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

        this.gridUpdate();
        this.initializeDices();
        //this.initializePawns();
        },



    update: function() {

    },



    restartGame: function() {
        game.state.start('main');
    },

    // generate a dice con click
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

                switch(grille.matrix[index][0]) {
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
                }

                switch(grille.matrix[index][1]) {

                    case 0:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'bird');
                        break;
                    case 1:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn');
                        break;
                    case 2:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn');
                        break;
                    case 3:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn');
                        break;
                    case 4:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn');
                        break;
                    case 5:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn');
                        break;

                    case -1:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn');
                        break;
                    case -2:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn');
                        break;
                    case -3:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn');
                        break;
                    case -4:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn');
                        break;
                    case -5:
                        this.add.image(gameSceneOriginX + c*50, r*50+gameSceneOriginY, 'pawn');
                        break;
                }


                switch(grille.matrix[index][2]) {
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
                }

            }
        }


    },

    initializeDices: function(){

    // itinialize player2's dices
        for (var i=0; i<grille.cols; i++){
            if(i%2==0){
                //this.generateDice(i*50,0);


                var rand = Math.floor(Math.random() * 6);
                dice = game.add.sprite(gameSceneOriginX+i*50, 0, 'dices');
                dice.frame=rand;

                //  Enables all kind of input actions on this image (click, etc)
                dice.inputEnabled = true;

                dice.events.onInputDown.add(this.generateDice, this);
                dices.push(dice);
            }

        }

        // itinialize player1's dices
        for (var i=0; i<grille.cols; i++){
            if(i%2==0){
                //this.generateDice(i*50,550);
                var rand = Math.floor(Math.random() * 6);
                dice = game.add.sprite(gameSceneOriginX+i*50, 550, 'dices');
                dice.frame=rand;

                //  Enables all kind of input actions on this image (click, etc)
                dice.inputEnabled = true;

                dice.events.onInputDown.add(this.generateDice, this);
                dices.push(dice);
            }

        }

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

    }


};

game.state.add('main', mainState);
game.state.start('main');
