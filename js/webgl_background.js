
function hero_main() {
    let hero_mousex = 0;
    let hero_mousey = 0;    

    const herocanvas = document.getElementById("hero-canvas")
    const mouselayer = document.getElementById("inputDetect")
    herocanvas.width = 1920
    herocanvas.height = 1080
    const herogl = herocanvas.getContext("webgl2");
    if(herogl == null) {
        //fail silently, we're just gonna cry and fallback to the image :(
        return;
    }
    herogl.clearColor(0,0,0,1);
    herogl.clear(herogl.COLOR_BUFFER_BIT);
    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using
    // for aVertexPosition and look up uniform locations.

    let s = new sprite(herocanvas,herogl);
    let d = new dynamic(herocanvas,herogl);

    mouselayer.addEventListener("mousemove", function (evt) {
        var mousePos = getMousePos(mouselayer, evt);
        hero_mousex = mousePos.x/herocanvas.getBoundingClientRect().width;
        hero_mousey = mousePos.y/herocanvas.getBoundingClientRect().height;
        
    }, false);
        // Draw the scene repeatedly
    function render(now) {
        

        // positions[12] = lerp(positions[12],(mousex*2)-1,0.01);
        // positions[13] = lerp(positions[13],1-(mousey*2),0.01);

        // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.colors);

        // gl.useProgram(shaderProgram);

        // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
        d.render(hero_mousex,hero_mousey)

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}
window.addEventListener('load',hero_main,false);