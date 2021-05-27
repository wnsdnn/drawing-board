const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const tools = document.querySelector(".tools");
const size = document.querySelector(".size input");
const colorBtn = document.querySelector(".sub-tool .color_btn");

const savePopup = document.querySelector(".save");
const closeBtn = document.querySelector(".save #close");
const photoBox = document.querySelector(".save .photo-box");
const downloadBtn = document.querySelector(".save #download");
const title = document.querySelector(".save .title")

let drawable = false;
let shapes = undefined;

let rec = {X: 0, Y: 0}
let pos = {X: 0, Y: 0}

const reset = function () {
    [...tools.children].forEach((data) => data.style.background = "#fff");
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    colorBtn.value = "#000000"
    size.value = 3;
    ctx.lineWidth = 1;
    shapes = undefined;

    canvas.removeEventListener("mousedown", drawListener);
    window.removeEventListener("mousemove", drawListener);
    window.removeEventListener("mouseup", drawListener);
    canvas.removeEventListener("mouseenter", drawListener);

    canvas.removeEventListener("mousedown", shapesListener);
    window.removeEventListener("mouseup", shapesListener);
    window.removeEventListener("mousemove", shapesListener);
};

const saveReset = function(){
    photoBox.innerHTML = '';
    title.value ='';
}

const initDraw = function (e) {
    ctx.beginPath();
    drawable = true;
    ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
};

const draw = function (e) {
    ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    ctx.stroke();
};

const drawListener = function (e) {
    switch (e.type) {
        case "mousedown":
            initDraw(e);
            break;
        case "mousemove":
            if (drawable)
                draw(e);
            break;
        case "mouseup":
            drawable = false;
            break;
        case "mouseleave":
            ctx.beginPath();
            break;
    }
};

const downShapes = function (e) {
    ctx.beginPath();
    drawable = true;
    rec.X = e.pageX - canvas.offsetLeft
    rec.Y = e.pageY - canvas.offsetTop
    console.log(rec.X, rec.Y);
};


const moveShapes = function(e){
    if(pos.X !== 0 && pos.Y !== 0)
        if(shapes === "rectangle")
            ctx.clearRect(rec.X, rec.Y, pos.X - rec.X, pos.Y - rec.Y);
    pos = {
        X: e.pageX - canvas.offsetLeft,
        Y: e.pageY - canvas.offsetTop
    }
    if(shapes === "rectangle"){
        ctx.fillRect(rec.X, rec.Y, pos.X - rec.X, pos.Y - rec.Y);
    } else {
        ctx.arc((pos.X - rec.X), (pos.Y - rec.Y), (pos.X - rec.X) / 2, 0, Math.PI * 2);
        ctx.stroke();
    }
}

const upShapes = function(){
    ctx.beginPath();
    pos = {X: 0, Y: 0}
}


const shapesListener = function (e) {
    switch (e.type) {
        case "mousedown":
            downShapes(e);
            break;
        case "mousemove":
            if(drawable)
                moveShapes(e);
            break;
        case "mouseup":
            upShapes();
            drawable = false
            break;
    }
};

reset();

tools.addEventListener("click", function ({ target }) {
    reset();
    target.parentNode.style.background = "#eee";

    switch (target.parentNode.classList[0]) {
        case "pencil":
            window.addEventListener("mousemove", drawListener);
            canvas.addEventListener("mouseleave", drawListener);
            canvas.addEventListener("mousedown", drawListener);
            window.addEventListener("mouseup", drawListener);
            break;
        case "eraser":

            break;
        case "rectangle":
            shapes = "rectangle";
            canvas.addEventListener("mousedown", shapesListener);
            window.addEventListener("mouseup", shapesListener);
            window.addEventListener("mousemove", shapesListener);
            break;
        case "circle":
            shapes = "circle";
            canvas.addEventListener("mousedown", shapesListener);
            window.addEventListener("mouseup", shapesListener);
            window.addEventListener("mousemove", shapesListener);
            break;
    };
});


colorBtn.addEventListener("change", function (){
    ctx.fillStyle = colorBtn.value;
    ctx.strokeStyle = colorBtn.value;
});

size.addEventListener("change", function(){
    ctx.lineWidth = size.value;
});

canvas.addEventListener('contextmenu', function (e){
    e.preventDefault();
    savePopup.classList.toggle("none")
    
    let dataURL = canvas.toDataURL('image/png');
    let imgTag = document.createElement('img');
    imgTag.setAttribute("src", dataURL);
    
    photoBox.append(imgTag);
});

downloadBtn.addEventListener("click", function(){
    let dataURL = canvas.toDataURL('image/png');
    
    let aTag = document.createElement('a');
    aTag.download = title.value;
    aTag.href = dataURL;
    aTag.click();

    closeBtn.click();
})

closeBtn.addEventListener("click", function(){
    savePopup.classList.toggle("none");
    saveReset();
})
