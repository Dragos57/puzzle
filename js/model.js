//initializeaza variabile, bind intre elemente din DOM si variabilele din js
function init(document) {
    image.src = "images/castle.jpg";
    canvas = document.getElementById('myCanvas');

    solvedBackgroundAudio = document.getElementById("solvedBackgroundSong");
    solvedBackgroundAudio.loop = true;

    releasedPieceAudio = document.getElementById("pieceReleasedSource");
    holdedPieceAudio = document.getElementById("pieceHoldSource");
    puzzleFinishedAudio = document.getElementById("puzzleFinishedSource");
    pieceWidth = canvas.width / DIFFICULTY;
    pieceHeight = canvas.height / DIFFICULTY;
    context = canvas.getContext('2d');
    adjustOffset();
    initArrays();
    loadImage();
}

//click listener preluand butonul dupa id, folosind jquery. functia schimba dificultatea si updateaza toate variabilele afectate in acest sens, redesenand imaginea pe canvas
$("#changeDifficulty").click(function () {
    if (!isLoading) {
        var dif = $("#difficulty").val();

        puzzleFinishedAudio.pause();
        puzzleFinishedAudio.currentTime = 0;
        solvedBackgroundAudio.pause();
        solvedBackgroundAudio.currentTime = 0;

        if (dif > 1 && dif < 16) {
            isLoading = true;
            solved = false;
            DIFFICULTY = dif;
            PIECESNR = DIFFICULTY * DIFFICULTY;
            adjustOffset();

            pieceWidth = canvas.width / DIFFICULTY;
            pieceHeight = canvas.height / DIFFICULTY;

            initArrays();
            arrangePuzzle();
        } else {
            alert("The difficulty number must be between 2 and 15");
        }
    }
});


$("#solve").click(function autoSolve() {
    solvedBackgroundAudio.play();
    isLoading = true;
    var minPosition;
    var temporaryPositions = positionArray.slice();

    switchPiecesAndDrawChanges(0, temporaryPositions);
});

$("#switchAudio").click(function switchAudio() {
    var switchAudio = document.getElementById("switchAudio");

    if(!holdedPieceAudio.muted) {
        holdedPieceAudio.muted = true;
        releasedPieceAudio.muted = true;
        solvedBackgroundAudio.muted = true;
        puzzleFinishedAudio.muted = true;
        switchAudio.innerText = "Sound: OFF"
    } else {
        holdedPieceAudio.muted = false;
        releasedPieceAudio.muted = false;
        solvedBackgroundAudio.muted = false;
        puzzleFinishedAudio.muted = false;
        switchAudio.innerText = "Sound: ON"
    }
});
