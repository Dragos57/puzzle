function Piece() {
    var pieceNumber;
    var x; // coordonata width
    var y; // coordonata height
}

function Position() {
    var Piece;
    var positionNumber;
    var x; // coordonata width
    var y; // coordonata height
}

//variabilele asociate sunetelor pe actiuni
var solvedBackgroundAudio;
var holdedPieceAudio;
var releasedPieceAudio;
var puzzleFinishedAudio;

//vectori de pozitii si de piese
var pieceArray = new Array();
var positionArray = new Array();

//inaltimea si latimea dreptunghiurilor, se vor schimba in functie de dificultate si de imagine
var pieceWidth;
var pieceHeight;

var solved = false;

//coordonatele cursorului mouse-ului
var mouseX = 0;
var mouseY = 0;

//variabila in miscare
var fromPiece = -1;
//variabila asupra careia se lasa dreptunghiul
var toPiece = 0;
var image = new Image();

var dragAndDrop = false;
var DIFFICULTY = 3;
var PIECESNR = DIFFICULTY * DIFFICULTY;
var isLoading = false;
var timeBetweenSwitches;
var canvas;
var context;
var offsetX = 0;
var offsetY = 0;
