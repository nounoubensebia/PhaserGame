function canBeColored(x, y, color, context) {
    var matrix = context.grille.matrix;
    if (getElementAt(x,y,context.grille)[1]===1)
    {
        return false;
    }
    else
    {
        var colorOnTile = getElementAt(x,y,context.grille)[0];
        if (colorOnTile===color)
        {
            return false;
        }
        else
        {
            var tab = getAdjacentTilesColors(context.grille,x,y);
            var found = false;
            for (var i=0;i<tab.length;i++)
            {
                if (tab[i]===color)
                {
                    found = true;
                }
            }

            if (found===false)
            {
                console.log("found == false");
                return false;
            }
            else
            {
                var moveIndex = getMoveIndexFromColor(color);
                if (colorOnTile !==0)
                {
                    return context.movesLeft[moveIndex] >= 2;
                }
                else
                {
                    return context.movesLeft[moveIndex] >= 1;
                }
            }

        }

    }
}

function getMoveIndexFromColor(color) {
    var moveIndex;
    if (color>0)
    {
        moveIndex = color-1;
    }
    else
    {
        moveIndex = -1*color-1;
    }
    return moveIndex;
}

function color(x, y, color, context) {
    var moveIndex = getMoveIndexFromColor(color);
    if (getElementAt(x,y,context.grille)[0]!==0)
    {
        //console.log("is"+getElementAt(x,y,context.grille));
        context.movesLeft[moveIndex]-=2;
    }
    else
    {
        context.movesLeft[moveIndex]--;
    }
    context.grille.matrix[x*context.grille.cols+y][0] = color;

}

function movePawn(x, y, color, context) {
    var pawnLocation = getPawnLocation(color,context.grille);
    context.grille.matrix[pawnLocation.x*context.grille.cols+pawnLocation.y][1]=0;
    context.grille.matrix[x*context.grille.cols+y][1]=color;
}

function canPawnMove(x, y,color,context) {

    if (getElementAt(x,y,context.grille)[0]!==color&&getElementAt(x,y,context.grille)[0]!==-1*color)
    {
        return false;
    }
    if (getElementAt(x,y,context.grille)[1]!==0)
    {
        return false;
    }
    else
    {
        var tab = getAdjacentTilesPawns(context.grille,x,y);
        var found = false;
        for (var i=0;i<tab.length;i++)
        {
            if (tab[i]===color)
            {
                found = true;
            }
        }
        return found;
    }
}

function getElementAt(i,j,grille) {
    return grille.matrix[i*grille.cols+j];
}



function getPawnLocation(color,grille) {
    for (var i = 0;i<grille.rows;i++)
    {
        for (var j=0;j<grille.cols;j++)
        {
            if (getElementAt(i,j,grille)[1]===color)
            {
                return {"x" : i
                    ,"y" : j};
            }
        }
    }
}

function getAdjacentTilesPawns(grille, i, j) {
    var tab = [];
    if (i+1<grille.rows)
    {
        tab.push(getElementAt(i+1,j,grille)[1]);
    }
    if (j+1<grille.cols)
    {
        tab.push(getElementAt(i,j+1,grille)[1]);
    }
    if (i+1<grille.rows&&j+1<grille.cols)
    {
        tab.push(getElementAt(i+1,j+1,grille)[1]);
    }
    if (i-1>=0)
    {
        tab.push(getElementAt(i-1,j,grille)[1]);
    }
    if (j-1>=0)
    {
        tab.push(getElementAt(i,j-1,grille)[1]);
    }
    if (i-1>=0&&j-1>=0)
    {
        tab.push(getElementAt(i-1,j-1,grille)[1]);
    }
    if (i-1>=0&&j+1<grille.cols)
    {
        tab.push(getElementAt(i-1,j+1,grille)[1]);
    }
    if (i+1<grille.rows&&j-1>=0)
    {
        tab.push(getElementAt(i+1,j-1,grille)[1]);
    }
    return tab;
}

function getAdjacentTilesColors(grille, i, j) {
    var tab = [];
    if (i+1<grille.rows)
    {
        tab.push(getElementAt(i+1,j,grille)[0]);
    }
    if (j+1<grille.cols)
    {
        tab.push(getElementAt(i,j+1,grille)[0]);
    }
    if (i+1<grille.rows&&j+1<grille.cols)
    {
        tab.push(getElementAt(i+1,j+1,grille)[0]);
    }
    if (i-1>=0)
    {
        tab.push(getElementAt(i-1,j,grille)[0]);
    }
    if (j-1>=0)
    {
        tab.push(getElementAt(i,j-1,grille)[0]);
    }
    if (i-1>=0&&j-1>=0)
    {
        tab.push(getElementAt(i-1,j-1,grille)[0]);
    }
    if (i-1>=0&&j+1<grille.cols)
    {
        tab.push(getElementAt(i-1,j+1,grille)[0]);
    }
    if (i+1<grille.rows&&j-1>=0)
    {
        tab.push(getElementAt(i+1,j-1,grille)[0]);
    }
    return tab;
}

function isPawnAtEnd(pawn,context) {
    if (pawn<0)
    {
        return getPawnLocation(pawn, context.grille).x === (context.grille.rows) - 1;
    }
    else
    {
        return getPawnLocation(pawn, context.grille).x === 0;
    }
}

function existsToBeColored(color, context) {
    for (var i=0;i<context.grille.rows;i++)
    {

        for (var j=0;j<context.grille.cols;j++)
        {
            console.log("i : "+i+"j : "+j);
            if (canBeColored(i,j,color,context))
            {
                return true;
            }
        }
    }
    return false;
}

function deletePawn(pawn,context) {
    var ob = getPawnLocation(pawn,context.grille);
    context.grille.matrix[ob.x*context.grille.cols+ob.y][1]=0;
    mainState.gridUpdate();
}
