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
    context.grille.matrix[x*context.grille.cols+y][0] = color;
    var moveIndex = getMoveIndexFromColor(color);
    context.movesLeft[moveIndex]--;
}

function getElementAt(i,j,grille) {
    return grille.matrix[i*grille.cols+j];
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
