var squareRotation = 0.0;
var visibility = 1.0;
var squarepos = -250;
var animation = false;

function rad(number) {
    return number * (Math.PI/180);
}

function drawScene(gl, programInfo, buffers, deltaTime) {
    if(squarepos <= -6.0 && animation) {
        squarepos += 0.185;
    }

    gl.clearColor(0,0,0,visibility);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    gl.clear(gl.COLOR_BUFFER_BIT);

    //Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
}

function initBuffers(gl) {

    const positions = [
        -0.5,0.5,0.0,
        -0.5,-0.5,0.0,
        0.5,-0.5,0.0,
        0.5,0.5,0.0
    ];
    const faceColors = [
        0,0,1, 1,0,0, 0,1,0, 1,0,1
    ];

    const indices = [3,2,1,3,1,0];


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


    const canvas = document.getElementById("canvas")
    const gl = canvas.getContext("webgl");

    if(gl == null) {
        //fail silently, we're just gonna cry and fallback to the image :(
        return;
    }

    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 color

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying vec3 vColor;

    void main() {
        gl_Position = vec4(coordinates, 1.0);
        vColor = color;
    }
  `;

    const fsSource = `
    varying vec3 vColor;
    precision mediump float;

    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
  `;

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using
    // for aVertexPosition and look up uniform locations.
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };

    const buffers = initBuffers(gl);
    const texture = loadTexture(gl, 'cubetexture.jpg');

    var then = 0;

    // Draw the scene repeatedly
    function render(now) {

        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;
        drawScene(gl, programInfo, buffers, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}
window.onload = main;