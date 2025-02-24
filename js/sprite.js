const sprite_vsSource = `
    attribute vec4 vertex; // <vec2 position, vec2 texCoords>

    uniform mat4 model;
    uniform mat4 projection;
    varying highp vec2 vTextureCoord;
    uniform highp vec2 texOffset;
    uniform highp vec2 texScale;

    void main() {
        vTextureCoord = (vertex.zw*texScale)+texOffset;
        gl_Position = projection * model * vec4(vertex.xy, 0.0, 1.0);
    }
`;

const sprite_fsSource = `
    
    uniform sampler2D image;
    varying highp vec2 vTextureCoord;
    uniform highp vec2 texinfo;

    void main() {
      gl_FragColor = texture2D(image,vTextureCoord);
    }
`;
//yes, i know i should load these from a file, but I'm lazy, and this is only for a demo on my site...
//IF YOU'RE A FUTURE HIRERER LOOKING AT THIS: I AM NOT LAZY. IF I WAS HIRED BY YOU I WOULD ACTUALLY DO THE FULL THING FOR REAL ON WHATEVER IM WORKING ON
//i love opengl <3

class sprite {
    quadVAO = 0;
    vbo = 0;
    vertices = [
        // pos      // tex
        0.0, 1.0, 0.0, 1.0,
        1.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 

        0.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 0.0
    ];
    constructor(canvas,gl) {
        this.canvas = canvas;
        this.shaderProgram = initShaderProgram(gl, sprite_vsSource, sprite_fsSource);
        gl.useProgram(this.shaderProgram);
        this.quadVAO = gl.createVertexArray();
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertices),gl.STATIC_DRAW)
        gl.bindVertexArray(this.quadVAO)
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0,4,gl.FLOAT,false,4*4,0)
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

        //below was my first attempt at translating C into javascript,
        //thanks bad webgl tutorials and shoutouts to mozilla
        
        // this.positionBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),gl.STATIC_DRAW);
    
        // this.indexBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
        // this.textureBuffer = gl.createBuffer ();
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(faceColors), gl.STATIC_DRAW);
        
        // // Bind vertex buffer object
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        // // Bind index buffer object
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // this.coord = gl.getAttribLocation(this.shaderProgram, "coordinates");

        // // point an attribute to the currently bound VBO
        // gl.vertexAttribPointer(this.coord, 3, gl.FLOAT, false, 0, 0);

        // gl.enableVertexAttribArray(this.coord);

        // gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        
        // this.color = gl.getAttribLocation(this.shaderProgram, "texCoord");

        // gl.vertexAttribPointer(this.color, 3, gl.FLOAT, false,0,0) ;

        // gl.enableVertexAttribArray(this.color);


    }
    render(canvas,gl,x,y,texture,width,height,texturex,texturey,texture_width,texture_height) {
        gl.useProgram(this.shaderProgram);

        var projectionMatrix = mat4.create();
        mat4.ortho(projectionMatrix, 0.0, canvas.width,canvas.height,0.0,-100.0,100.0)
        const modelViewMatrix = mat4.create();
        
        mat4.translate(modelViewMatrix,modelViewMatrix,[x,y,0]);
        mat4.scale(modelViewMatrix,modelViewMatrix,[width,height,1])
        gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, 'projection'),
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, 'model'),
            false,
            modelViewMatrix);
        gl.uniform2f(gl.getUniformLocation(this.shaderProgram, 'texOffset'),
            texturex,texturey);
        gl.uniform2f(gl.getUniformLocation(this.shaderProgram, 'texScale'),
            texture_width,texture_height);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.bindVertexArray(this.quadVAO)

        // gl.bindTexture(gl.TEXTURE_2D, texture);
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.drawArrays(gl.TRIANGLES, 0,6);

    }
    
}