function coverflow_main() {
    let mousex = 0;
    let mousey = 0;
    let buttonLeftSize = 1;
    let buttonRightSize = 1;
    let selection = 0
    let hoveringLeftButton = false;
    let hoveringRightButton = false;
    let subTransition = 0;

    let coverflow_images = [
        ["images/coverflow_images/knfn.png",4/3],
        ["images/coverflow_images/reflections.png",1],
        ["images/coverflow_images/inevitability.png",4/3],
        ["images/coverflow_images/inevitability.png",4/3],
        ["images/coverflow_images/inevitability.png",4/3],

    ]    
    coverflow_textures = []
    const canvas = document.getElementById("coverflow-canvas")
    const mouselayer = document.getElementById("coverflow-inputDetect")
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height
    const gl = canvas.getContext("webgl2");
    console.log(canvas.style.width,canvas.style.height)
    if(gl == null) {
        //fail silently, we're just gonna cry and fallback to the image :(
        return;
    }
    for(let i = 0; i < coverflow_images.length; i++) {
        coverflow_textures.push(loadTexture(gl,coverflow_images[i][0]));
    }
    let background_texture = loadTexture(gl,"images/coverflow_assets/coverflowbackground.png");
    let button_texture = loadTexture(gl,"images/coverflow_assets/coverflowarrow.png");
    let floor_texture = loadTexture(gl,"images/coverflow_assets/coverflowfloor.png");

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using
    // for aVertexPosition and look up uniform locations.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let s = new sprite(canvas,gl);
    let p = new plane(canvas,gl);
    let c = new cube(canvas,gl);
    // let a = new dynamic(canvas,gl);

    mouselayer.addEventListener("mousemove", function (evt) {
        var mousePos = getMousePos(mouselayer, evt);
        mousex = mousePos.x;
        mousey = mousePos.y;
        hoveringRightButton = mousex>canvas.width-128&&(mousey>(canvas.height/2)-32 && mousey<(canvas.height/2)+32);
        hoveringLeftButton = mousex<128&&(mousey>(canvas.height/2)-32 && mousey<(canvas.height/2)+32);
    }, false);

    mouselayer.addEventListener("mousedown",function (evt) {
        var mousePos = getMousePos(mouselayer, evt);
        mousex = mousePos.x;
        mousey = mousePos.y;
        if(hoveringLeftButton) {
            if(selection-1 < 0) {
                subTransition += coverflow_textures.length;
                selection = coverflow_textures.length-1
            }
            else {
                subTransition += -1;
                selection--;
            }

        }
        if(hoveringRightButton) {
            if(selection+1 >= coverflow_images.length) {
                subTransition += -coverflow_textures.length;
                selection = 0
            }
            else {
                subTransition += 1;

                selection++;    
            }
        }
        
    }, false)
        // Draw the scene repeatedly
    function render(now) {
        
        if (subTransition != 0) {
            let lerpval = lerp(subTransition,0,0.05);
            if(Math.abs(lerpval) < 0.0001) {
                subTransition = 0;
            }
            else {
                subTransition = lerpval;
            }
        }
        console.log(hoveringRightButton)
        if(hoveringLeftButton && buttonLeftSize < 1.2) {
            buttonLeftSize = lerp(buttonLeftSize,1.2,0.05)
            if(buttonLeftSize > 1.199) {
                buttonLeftSize = 1.2
            }
        }
        else if(!hoveringLeftButton && buttonLeftSize > 1) {
            buttonLeftSize = lerp(buttonLeftSize,1,0.05)
            if(buttonLeftSize < 1.001) {
                buttonLeftSize = 1
            }
        }
        if(hoveringRightButton && buttonRightSize < 1.2) {
            buttonRightSize = lerp(buttonRightSize,1.2,0.05)
            if(buttonRightSize > 1.199) {
                buttonRightSize = 1.2
            }
        }
        else if(!hoveringRightButton && buttonRightSize > 1) {
            buttonRightSize = lerp(buttonRightSize,1,0.05)
            if(buttonRightSize < 1.001) {
                buttonRightSize = 1
            }

        }

        if(hoveringLeftButton || hoveringRightButton) {
            mouselayer.style.cursor = "pointer"
        }
        else {
            mouselayer.style.cursor = "default"

        }
        let groundHeight = -1
        transitionAbs = Math.abs(subTransition)
        let fov = canvas.height>canvas.width?45:30
        gl.clearColor(0.5, 0.5, 0.2, 0.9);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0,0,canvas.width,canvas.height);
        s.render(canvas,gl,0,0,background_texture,canvas.width,canvas.height,0,0,1,1);
        gl.enable(gl.DEPTH_TEST)
        for(let i = 0; i < coverflow_textures.length; i++) {
            let equation = i+selection*-1+subTransition
            let x = -8.0+(Math.cos(equation*rad(180/coverflow_textures.length))-1)*8+(i==selection)*1
            let z = Math.sin((equation*rad(180/coverflow_textures.length)))*8
            if(i == 0) {
                console.log(x,z)
            }
            let width = coverflow_images[i][1]
            c.render(canvas,gl,coverflow_textures[i],[
                z,groundHeight+1,
                x],[0,90+(Math.sin((Date.now()-starttime)/1000)*4),0],[0.05,1,width],[0,4,-8],1.0,fov)
            c.render(canvas,gl,coverflow_textures[i],[
                z,
                groundHeight-1,
                x],[0,90+(Math.sin((Date.now()-starttime)/1000)*4),180],[0.05,1,width],[0,4,-8],1.0,fov)
        }
        p.render(canvas,gl,0,0,floor_texture,[0,groundHeight,-16],[-90,0,0],[16,16,1],[0,4,-8],0.8,fov)
        s.render(canvas,gl,32,canvas.height/2-32,button_texture,64*buttonLeftSize,64*buttonLeftSize,0,0,-1,1)
        s.render(canvas,gl,canvas.width-96,canvas.height/2-32,button_texture,64*buttonRightSize,64*buttonRightSize,0,0,1,1)

        gl.disable(gl.DEPTH_TEST)

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}
window.addEventListener('load',coverflow_main,false);
window.addEventListener('resize',function(evt) {
    document.getElementById("coverflow-canvas").width = document.getElementById("coverflow-canvas").getBoundingClientRect().width
    document.getElementById("coverflow-canvas").height = document.getElementById("coverflow-canvas").getBoundingClientRect().height
    },false
)