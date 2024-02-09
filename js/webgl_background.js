var squareRotation = 0.0;
var visibility = 1.0;
var squarepos = -250;
var animation = false;

function rad(number) {
    return number * (Math.PI/180);
}

function drawScene(gl, canvas) {

}
const positions = [
    -1,1,0.0,
    -1,-1,0.0,
    1,-1,0.0,
    1,1,0.0
];
const faceColors = [
    0,0,1, 1,0,0, 0,1,0, 1,0,1
];
let mousex = 0;
let mousey = 0;

const indices = [3,2,1,3,1,0];
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function initBuffers(gl) {



    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    var colorBuffer = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(faceColors), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        indices: indexBuffer,
        colors: colorBuffer,

    };
}
function loadShader(gl, shadertype, source) {
    const shader = gl.createShader(shadertype);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Failed while compiling " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
    }
    return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function isPowerOf2(width) {
    return(width & (width-1)) == 0;
}

function main() {


    const canvas = document.getElementById("hero-canvas")
    const mouselayer = document.getElementById("inputDetect")

    const gl = canvas.getContext("webgl");

    if(gl == null) {
        //fail silently, we're just gonna cry and fallback to the image :(
        return;
    }

    const vsSource = `
    attribute vec4 coordinates;
    attribute vec3 aColor;

    uniform vec2 mouse;

    varying highp vec3 vColor;

    void main() {
      gl_Position = coordinates;
      vColor = aColor;
    }
  `;

    const fsSource = `
    varying highp vec3 vColor;
    uniform highp vec2 mouse;

    uniform sampler2D uSampler;

    void main() {
      gl_FragColor = vec4(vColor.r,vColor.g,vColor.b,1);
    }
  `;
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    gl.useProgram(shaderProgram);
    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using
    // for aVertexPosition and look up uniform locations.
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            colors: gl.getAttribLocation(shaderProgram, "color"),
        },
        uniformLocations: {
            mouse: gl.getUniformLocation(shaderProgram, 'mouse'),        
        },
    };

    const buffers = initBuffers(gl);
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(coord);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
    
    var color = gl.getAttribLocation(shaderProgram, "aColor");

    gl.vertexAttribPointer(color, 3, gl.FLOAT, false,0,0) ;
    gl.enableVertexAttribArray(color);

    var then = 0;

    mouselayer.addEventListener("mousemove", function (evt) {
        var mousePos = getMousePos(mouselayer, evt);
        mousex = mousePos.x/canvas.getBoundingClientRect().width;
        mousey = mousePos.y/canvas.getBoundingClientRect().height;
        console.log(mousex+" " + mousey);
        
    }, false);
        // Draw the scene repeatedly
    function render(now) {

        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        gl.clearColor(0.5, 0.5, 0.2, 0.9);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0,0,canvas.width,canvas.height);
        gl.useProgram(shaderProgram);
        gl.uniform2f(programInfo.uniformLocations.mouse,
            mousex,mousey);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);

    
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}
window.onload = main;