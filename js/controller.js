//in functie de dificultate, piesele se vor schimba in pozitii corecta la viteza mai mica - functie recursiva. am folosit setTimeout pentru ca nu imi arata rezultatul real time
function switchPiecesAndDrawChanges(i, temporaryPositions) {
    setTimeout(function () {
        minPosition = getMinPositionOfRemaining(i, temporaryPositions);
        if (positionArray[i].positionNumber != minPosition) {
            switchPieces(positionArray[i].positionNumber, minPosition);
            checkIfPuzzleIsSolved();
            drawCanvas();
        }

        if (i == PIECESNR - 1) {
            solved = true;
            drawCanvas();
            isLoading = false;
            solvedBackgroundAudio.pause();
            solvedBackgroundAudio.currentTime = 0;
        }

        i++;

        if (i != PIECESNR) {
            switchPiecesAndDrawChanges(i, temporaryPositions);
        }

        if (DIFFICULTY >= 2 && DIFFICULTY < 5) {
            timeBetweenSwitches = 500;
        } else if (DIFFICULTY >= 5 && DIFFICULTY < 8) {
            timeBetweenSwitches = 200;
        } else if (DIFFICULTY >= 8 && DIFFICULTY < 12) {
            timeBetweenSwitches = 30;
        } else if (DIFFICULTY >= 12 && DIFFICULTY < 14) {
            timeBetweenSwitches = 1;
        } else {
            timeBetweenSwitches = 0.0001;
        }
    }, timeBetweenSwitches);

}

//intoarce pozitia piesei cu care trebuie schimbata in canvas piese de pe pozitia n-1 (apelata in ordine crescatoare);
function getMinPositionOfRemaining(n, temporaryPositions) {
    var minPosition;

    var min = Number.MAX_VALUE;
    for (var i = n; i < PIECESNR; i++) {
        if (temporaryPositions[i].piece.pieceNumber < min && temporaryPositions[i].piece.pieceNumber != -1) {
            min = temporaryPositions[i].piece.pieceNumber;
            minPosition = i;
        }
    }

    temporaryPositions[minPosition].piece.pieceNumber = -1;
    return minPosition;
}


function adjustOffset() {
    var canvasOffset = $("#myCanvas").offset();
    offsetX = Math.round(canvasOffset.left);
    offsetY = Math.round(canvasOffset.top);
}

//proiectul utilizeaza vectorul pozitiilor (numarul este crescator) si vectorul pieselor cu lungime, latime si coordonate colt stanga sus, in momentul acesta puzzle-ul este rezolvate
function initArrays() {
    pieceArray = new Array();
    positionArray = new Array();
    for (i = 0; i < PIECESNR; i++) {
        pieceArray[i] = new Piece();
        pieceArray[i].pieceNumber = i;
        positionArray[i] = new Position();
        positionArray[i].positionNumber = i;
        positionArray[i].piece = pieceArray[i];
    }

    for (i = 0; i < DIFFICULTY; i++) {
        for (j = 0; j < DIFFICULTY; j++) {
            var index = j + (i * DIFFICULTY);
            var widthXCoordinates = j * pieceWidth;
            var heightYCoordinates = i * pieceHeight;
            positionArray[index].x = widthXCoordinates;
            positionArray[index].y = heightYCoordinates;
            pieceArray[index].x = widthXCoordinates;
            pieceArray[index].y = heightYCoordinates;
        }
    }
}

function loadImage() {
    isLoading = true;
    solved = false;
    image.onload = function () {
        arrangePuzzle();
    }
}
//amesteca piesele, verifica daca toate piesele sunt in pozitiile potrivite si deseneaza noul canvas, cu piesele modificate
function arrangePuzzle() {
    shufflePuzzle();
    checkIfPuzzleIsSolved();
    drawCanvas();
    isLoading = false;
}

//amesteca piesele folosind un vector secundar de valori selectate la intamplare, iar pentru a nu se crea duplicate pozitia nou aleasa este intotdeauna unica
function shufflePuzzle() {
    var randomPieces = new Array();
    var randomPosition;

    for (var i = 0; i < PIECESNR; i++) {
        randomPosition = Math.floor(Math.random() * PIECESNR);

        while (i == randomPosition || randomPieces.indexOf(randomPosition) != -1) {
            randomPosition = Math.floor(Math.random() * PIECESNR);
        }
        randomPieces.push(randomPosition);
    }

    for (var i = 0; i < PIECESNR; i++) {
        positionArray[i].piece = pieceArray[randomPieces[i]];
    }
}

//daca toata piesele sunt in pozitiile corecte (1 la 1, 2 la 2 ...)  puzzle-ul este rezolvat
function checkIfPuzzleIsSolved() {
    var piecesSolved = 0;
    for (var i = 0; i < PIECESNR; i++) {
        if (positionArray[i].positionNumber == positionArray[i].piece.pieceNumber) {
            piecesSolved++;
        }
    }
    if (piecesSolved == PIECESNR) {
        solved = true;
    }
}

function drawCanvas() {
    clearCanvas();
    drawPieces();
}

//sterge continutul actual al canvasului si il inlocuieste cu un fundal de culoare albastra
function clearCanvas() {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    context.fillStyle = "#66c2ff";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

//desenarea efectiva a dreptunghiurilor, tratand cazurile cand piesa este in curs de schimbare
function drawPieces() {
    for (var i = 0; i < PIECESNR; i++) {
        var position = positionArray[i];
        var piece = positionArray[i].piece;
        var movingPiece;

        if (fromPiece != i) {
            context.drawImage(image, piece.x, piece.y, pieceWidth, pieceHeight,
                position.x, position.y, pieceWidth, pieceHeight);
        } else {
            movingPiece = piece;
        }

        if (solved == false) {
            drawBorder();
        }

        if (movingPiece != null) {
            var centerX = mouseX - pieceWidth / 2;
            var centerY = mouseY - pieceHeight / 2;
            context.drawImage(image, movingPiece.x, movingPiece.y, pieceWidth, pieceHeight,
                centerX, centerY, pieceWidth, pieceHeight);
        }
    }
}

//desenaza in jurul dreptunghiurilor puzzle-ului o linie neagra de separare
function drawBorder() {
    context.lineWidth = 2;
    context.strokeStyle = "#000000";
    context.beginPath();

    var tempWidth;
    var tempHeight;
    for (var i = 1; i < DIFFICULTY; i++) {
        tempWidth = pieceWidth * i;

        context.moveTo(tempWidth, 0);
        context.lineTo(tempWidth, 0);
        context.lineTo(tempWidth, canvas.height);

        tempHeight = pieceHeight * i;

        context.moveTo(0, tempHeight);
        context.lineTo(0, tempHeight);
        context.lineTo(canvas.width, tempHeight);
    }

    context.stroke();
}

//cand se apasa pe un dreptunghi, se selecteaza piesa corespunzatoarea si se deseneaza pe canvas astfel incat cursorul se va afla la intersectia diagonalelor dreptunghiului
function mouseDown(event) {
    if (solved == false && isLoading == false) {
        holdedPieceAudio.play();
        mouseX = event.clientX - offsetX;
        mouseY = event.clientY - offsetY;
        fromPiece = getCurrentPiece(mouseX, mouseY);
        drawCanvas();
    }
}

function getCurrentPiece(x, y) {
    var i = 0;
    var tempPieceWidth = pieceWidth;
    while (x >= tempPieceWidth) {
        i++;
        tempPieceWidth += pieceWidth;
    }

    var j = 0;
    var tempPieceHeight = pieceHeight;
    while (y >= tempPieceHeight) {
        j++;
        tempPieceHeight += pieceHeight;
    }

    var pieceIndex = i + (j * DIFFICULTY);

    return pieceIndex;
}

function mouseMove(event) {
    if (solved == false && isLoading == false) {
        mouseX = event.clientX - offsetX;
        mouseY = event.clientY - offsetY;
        drawCanvas();
    }
}

//schimbul de piese in momentul in care se face drop la piesa peste o alta piesa, marcand faptul ca nicio piesa nu mai este acum selectata
function mouseUp(event) {
    if (solved == false && isLoading == false) {
        releasedPieceAudio.play();
        mouseX = event.clientX - offsetX;
        mouseY = event.clientY - offsetY;
        toPiece = getCurrentPiece(mouseX, mouseY);

        switchPieces(fromPiece, toPiece);
        fromPiece = -1;

        checkIfPuzzleIsSolved();
        drawCanvas();

        if (solved) {
            puzzleFinishedAudio.play();
        }
    }
}

//schimbare de piese intre pozitiile din vector, folosind variabila auxiliara
function switchPieces(fromSlot, toSlot) {
    var tempPiece = positionArray[toSlot].piece;
    positionArray[toSlot].piece = positionArray[fromSlot].piece;
    positionArray[fromSlot].piece = tempPiece;
}


//marcheaza faptul ca nu este nicio piesa selectata
function mouseOut(event) {
    fromPiece = -1;
    if (!isLoading) {
        drawCanvas();
    }
}
