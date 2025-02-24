const dynamic_vsSource = `
    attribute vec2 coordinates;
    attribute vec3 aColor;

    uniform vec2 mouse;

    varying highp vec3 vColor;

    void main() {
      gl_Position = vec4(coordinates.x,coordinates.y, 0.0, 1.0);
      vColor = aColor;
    }
`;

const dynamic_fsSource = `
    varying highp vec3 vColor;
    uniform highp vec2 mouse;
    uniform highp float time;
    
    void main() {
      gl_FragColor = vec4(vColor.x/2.0,vColor.y-cos(time/2000.0)/2.0,vColor.z+sin(time/1000.0)/2.0,1.0);
    }
`;
//this is the class file for the dynamic thingy that shows on the center of the page
class dynamic {
    gl;
    VAO = 0;
    VBO = 0;
    vertices = [
        -1,-1, 0,0,1,
        -1,1,  1,0,0,
        0,0,   0,1,0,
        
        -1,-1, 0,0,1,
        1,-1,  1,0,1,
        0,0,   0,1,0,

        1,-1,  1,0,1,
        1,1,   0,1,1,
        0,0,   0,1,0,

        -1,1,  1,0,0,
        1,1,   0,1,1,
        0,0,   0,1,0,
    ];
    constructor(canvas,gl) {
        this.gl = gl;
        this.canvas = canvas;
        this.shaderProgram = initShaderProgram(this.gl, dynamic_vsSource, dynamic_fsSource);
        this.gl.useProgram(this.shaderProgram);
        this.VAO = this.gl.createVertexArray();
        this.VBO = this.gl.createBuffer();
        this.gl.bindVertexArray(this.VAO)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.VBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(this.vertices),this.gl.DYNAMIC_DRAW)
        
        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0,2,this.gl.FLOAT,false,5*4,0)
        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(1,3,this.gl.FLOAT,false,5*4,2*4)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindVertexArray(null);
        
        //below was my first attempt at translating C into javascript,
        //thanks bad webthis.gl tutorials and shoutouts to mozilla
        
        // this.positionBuffer = this.gl.createBuffer();
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions),this.gl.STATIC_DRAW);
    
        // this.indexBuffer = this.gl.createBuffer();
        // this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    
        // this.textureBuffer = this.gl.createBuffer ();
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(faceColors), this.gl.STATIC_DRAW);
        
        // // Bind vertex buffer object
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        // // Bind index buffer object
        // this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // this.coord = this.gl.getAttribLocation(this.shaderProgram, "coordinates");

        // // point an attribute to the currently bound VBO
        // this.gl.vertexAttribPointer(this.coord, 3, this.gl.FLOAT, false, 0, 0);

        // this.gl.enableVertexAttribArray(this.coord);

        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        
        // this.color = this.gl.getAttribLocation(this.shaderProgram, "texCoord");

        // this.gl.vertexAttribPointer(this.color, 3, this.gl.FLOAT, false,0,0) ;

        // this.gl.enableVertexAttribArray(this.color);


    }
    render(x,y) {
        this.gl.useProgram(this.shaderProgram);
        for(var i = 0; i < 4; i++) {
            this.vertices[10+i*15] = lerp(this.vertices[10+i*15],(x*2)-1,0.05)
            this.vertices[11+i*15] = lerp(this.vertices[11+i*15],1-(y*2),0.05)  
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.VBO);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER,0,new Float32Array(this.vertices),this.vertices)

        this.gl.uniform1f(this.gl.getUniformLocation(this.shaderProgram, 'time'),
        Date.now()-starttime);

        this.gl.bindVertexArray(this.VAO)

        // this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.drawArrays(this.gl.TRIANGLES, 0,12);

    }
    
}