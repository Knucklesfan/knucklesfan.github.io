const cube_vsSource = `
    attribute vec3 aPos;
    attribute vec3 aNormal;
    attribute vec2 aTexCoord;

    varying highp vec2 TexCoord;
    varying highp vec3 Normal;
    varying highp vec3 FragPos;

    uniform mat4 model;
    uniform mat4 projection;

    void main() {
        FragPos = vec3(model * vec4(aPos, 1.0));
        Normal = aNormal;  
        TexCoord = vec2(-aTexCoord.y, -aTexCoord.x);
        gl_Position = projection * vec4(FragPos, 1.0);
    }
`;

const cube_fsSource = `
    varying highp vec2 TexCoord;
    varying highp vec3 Normal;
    varying highp vec3 FragPos;

    uniform sampler2D texture1;
    
    uniform highp vec3 lightPos; 
    uniform highp float alpha;

    void main() {
        // ambient
        highp float ambientStrength = 0.0;
        highp vec3 ambient = ambientStrength * vec3(1,1,1);
        
        // diffuse 
        highp vec3 norm = normalize(Normal);
        highp vec3 lightDir = normalize(lightPos - FragPos);
        highp vec3 dir = normalize(vec3(lightPos.x,lightPos.y-5.0,lightPos.z) - lightPos);
        highp float theta = dot(lightDir, normalize(-dir));
        highp float distance    = length(lightPos - FragPos);
        if(length(FragPos) < 20.0) {
            highp float attenuation = 1.0 / (1.0 + 0.09 * distance);
            highp float diff = max(dot(norm, lightDir), 0.0);
            highp vec3 diffuse = vec3(1,1,1);
            ambient  *= attenuation;
            diffuse *= attenuation;
            if(theta > 0.8) {
                diffuse += diff * vec3(1,1,1);
                
                highp vec3 result = (ambient + diffuse) * texture2D(texture1, TexCoord).xyz;
                gl_FragColor = vec4(result, alpha);
            }

            highp vec3 result = (ambient + diffuse) * texture2D(texture1, TexCoord).xyz;
            gl_FragColor = vec4(result, alpha);
        }

    }
`;


class cube {
    quadVAO = 0;
    vbo = 0;
    ebo = 0;
    vertices = [
        -1.0, -1.0, -1.0,  0.0,  0.0, -1.0, 0.0, 0.0,
        1.0, -1.0, -1.0,  0.0,  0.0, -1.0, 0.0, 0.0,
        1.0,  1.0, -1.0,  0.0,  0.0, -1.0, 0.0, 0.0,
        1.0,  1.0, -1.0,  0.0,  0.0, -1.0, 0.0, 0.0,
       -1.0,  1.0, -1.0,  0.0,  0.0, -1.0, 0.0, 0.0,
       -1.0, -1.0, -1.0,  0.0,  0.0, -1.0, 0.0, 0.0,
   
       -1.0, -1.0,  1.0,  0.0,  0.0, 1.0, 0.0, 0.0,
        1.0, -1.0,  1.0,  0.0,  0.0, 1.0, 0.0, 0.0,
        1.0,  1.0,  1.0,  0.0,  0.0, 1.0, 0.0, 0.0,
        1.0,  1.0,  1.0,  0.0,  0.0, 1.0, 0.0, 0.0,
       -1.0,  1.0,  1.0,  0.0,  0.0, 1.0, 0.0, 0.0,
       -1.0, -1.0,  1.0,  0.0,  0.0, 1.0, 0.0, 0.0,
   
       -1.0,  1.0,  1.0, -1.0,  0.0,  0.0, 1.0, 0.0,
       -1.0,  1.0, -1.0, -1.0,  0.0,  0.0, 1.0, 1.0,
       -1.0, -1.0, -1.0, -1.0,  0.0,  0.0, 0.0, 1.0,
       -1.0, -1.0, -1.0, -1.0,  0.0,  0.0, 0.0, 1.0,
       -1.0, -1.0,  1.0, -1.0,  0.0,  0.0, 0.0, 0.0,
       -1.0,  1.0,  1.0, -1.0,  0.0,  0.0, 1.0, 0.0,
   
        1.0,  1.0,  1.0,  1.0,  0.0,  0.0, 1.0, 0.0,
        1.0,  1.0, -1.0,  1.0,  0.0,  0.0, 1.0, -1.0,
        1.0, -1.0, -1.0,  1.0,  0.0,  0.0, 0.0, -1.0,
        1.0, -1.0, -1.0,  1.0,  0.0,  0.0, 0.0, -1.0,
        1.0, -1.0,  1.0,  1.0,  0.0,  0.0, 0.0, 0.0,
        1.0,  1.0,  1.0,  1.0,  0.0,  0.0, 1.0, 0.0,
   
       -1.0, -1.0, -1.0,  0.0, -1.0,  0.0, 0.0, 1.0,
        1.0, -1.0, -1.0,  0.0, -1.0,  0.0, 1.0, 1.0,
        1.0, -1.0,  1.0,  0.0, -1.0,  0.0, 1.0, 0.0,
        1.0, -1.0,  1.0,  0.0, -1.0,  0.0, 1.0, 0.0,
       -1.0, -1.0,  1.0,  0.0, -1.0,  0.0, 0.0, 0.0,
       -1.0, -1.0, -1.0,  0.0, -1.0,  0.0, 0.0, 1.0,
   
       -1.0,  1.0, -1.0,  0.0,  1.0,  0.0, 0.0, 1.0,
        1.0,  1.0, -1.0,  0.0,  1.0,  0.0, 1.0, 1.0,
        1.0,  1.0,  1.0,  0.0,  1.0,  0.0, 1.0, 0.0,
        1.0,  1.0,  1.0,  0.0,  1.0,  0.0, 1.0, 0.0,
       -1.0,  1.0,  1.0,  0.0,  1.0,  0.0, 0.0, 0.0,
       -1.0,  1.0, -1.0,  0.0,  1.0,  0.0, 0.0, 1.0
    ];

constructor(canvas,gl) {
        this.canvas = canvas;
        this.shaderProgram = initShaderProgram(gl, cube_vsSource, cube_fsSource);
        gl.useProgram(this.shaderProgram);

        this.quadVAO = gl.createVertexArray();
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertices),gl.STATIC_DRAW)
        gl.bindVertexArray(this.quadVAO)
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0,3,gl.FLOAT,false,8*4,0)
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1,3,gl.FLOAT,false,8*4,3*4)
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2,2,gl.FLOAT,false,8*4,6*4)

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
    render(canvas,gl,texture,position,rotation,scale,light_pos,alpha,fov=45) {
        gl.useProgram(this.shaderProgram);

        var projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, rad(fov), canvas.width/canvas.height,0.1,1000.0)
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix,modelViewMatrix,position);
        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            rad(rotation[0]),
            [1,0,0]);
        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            rad(rotation[1]),
            [0,1,0]);
        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            rad(rotation[2]),
            [0,0,1]);
        mat4.scale(modelViewMatrix,modelViewMatrix,scale)
        gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, 'projection'),
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, 'model'),
            false,
            modelViewMatrix);
        gl.uniform3f(gl.getUniformLocation(this.shaderProgram, 'lightPos'),
            light_pos[0],light_pos[1],light_pos[2]);
        gl.uniform1f(gl.getUniformLocation(this.shaderProgram, 'alpha'),
            alpha);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.bindVertexArray(this.quadVAO)

        // gl.bindTexture(gl.TEXTURE_2D, texture);
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.drawArrays(gl.TRIANGLES, 0,36);

    }
    
}