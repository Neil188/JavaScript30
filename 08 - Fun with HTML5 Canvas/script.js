
const canvas = document.querySelector("#draw");

if (canvas.getContext) {

    // create a 2d rendering context to work on
    const ctx = canvas.getContext("2d");

    const MAXLINEWIDTH = 100;
    const MINLINEWIDTH = 1;

    // resize canvas to fit window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Set starting colour
    ctx.strokeStyle = "#BADA55";
    // when line ends, or joins another line,
    // round off edges instead of squaring
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    // start with thick lines
    ctx.lineWidth = 100;
    // set blend mode
    ctx.globalCompositeOperation = "multiply";

    // only draw when this flag is set to true
    let isDrawing = false;

    // store starting point
    let lastX = 0;
    let lastY = 0;

    let hue = 0;
    let direction = true;

    const draw = (e) => {
        // stop the fn from running when not moused down
        if (!isDrawing) return;

        // change stroke style to give pen different colours
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

        // create a new path
        ctx.beginPath();
        // start point
        ctx.moveTo(lastX, lastY);
        // end point
        ctx.lineTo(e.offsetX, e.offsetY);
        // draw the shape
        ctx.stroke();

        // reset starting point
        [lastX, lastY] = [e.offsetX,e.offsetY];
        // if hue > 360 it will auto recalculate,
        // to get a value betweeen 0 - 360, but this just keeps it clean
        hue = hue >=360 ? 0 : hue + 1;

        // check if increasing or decreasing line width
        if (ctx.lineWidth >= MAXLINEWIDTH
                 || ctx.lineWidth <= MINLINEWIDTH) {
            direction = !direction
        }
        // update linewidth
        ctx.lineWidth += (direction) ? 1 : -1;
    }

    const handleMouseDown = e => {
        isDrawing = true;
        // get start position
        [lastX, lastY] = [e.offsetX,e.offsetY];
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => isDrawing = false);
    // check if mouse has left the canvas
    canvas.addEventListener("mouseout", () => isDrawing = false);
} else {
    console.error('Sorry canvas is not supported in this browser!');
};