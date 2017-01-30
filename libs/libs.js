function onCanvasDrop(evt) {
    var files = evt.dataTransfer.files;
    if (files.length == 1) {
        var file = files[0];
        if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
            var reader = new FileReader();
            reader.onload = function (evt) {
                image.src = evt.target.result;
                canvas.width = image.width;
                canvas.height = image.height;
                dragAndDrop = true;

                pieceWidth = canvas.width / DIFFICULTY;
                pieceHeight = canvas.height / DIFFICULTY;
                adjustOffset();
                initArrays();
                loadImage();
            };
            reader.readAsDataURL(file);
        }				
    } else {
        alert("You can only upload one picture!")
    }
    evtPreventDefault(evt);
}

function evtPreventDefault(evt) {
    evt.preventDefault();
}

function adjustOffset() {
    var canvasOffset = $("#myCanvas").offset();
    offsetX = Math.round(canvasOffset.left);
    offsetY = Math.round(canvasOffset.top);
}

/**
 window.addEventListener("resize", myFunction);
 function myFunction() {
            adjustOffset();
        }
 */