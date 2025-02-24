function coverflow_main() {
    let mousex = 0;
    let mousey = 0;
    let buttonLeftSize = 1;
    let buttonRightSize = 1;
    let selection = 0
    let hoveringLeftButton = false;
    let hoveringRightButton = false;
    let subTransition = 0;
    let hoveringCenter = false;
    let hoveringBackground = false;
    let spinnytimer = 0;
    let coverflow_images = [
        ["images/coverflow_images/knfn.png",4/3,{"title":"Knuxfan's Tetriminos","images":["images/coverflow_items/sdltris/knfn.png","images/coverflow_items/sdltris/shot1.png","images/coverflow_items/sdltris/shot2.png","images/coverflow_items/sdltris/shot3.png"],
            "desc":"Knuxfan's Tetriminos is my longest project and the hardest I've worked on anything.<br>Written in it's own entire game engine, I built the game from the ground up using only C++ and OpenGL3.1.<br>The game is compatible with 10 different operating systems and game consoles, with more in the works!<br><br>The game has been in development since 2021, and will be released before I die (Which means... it's coming eventually...)","programming-languages":"C++","link":"https://github.com/knucklesfan/sdltris"}],
        ["images/coverflow_images/reflections.png",1,{"title":"Reflections","images":["images/coverflow_items/reflections/shot2.png","images/coverflow_items/reflections/shot3.png","images/coverflow_items/reflections/shot1.png"],
            "desc":"Self-Reflection is a mental health counseling app, written for use by Middle and High schoolers to easily and quickly reach out to counselors at any time and schedule appointments.<br>Reflections was my first full-stack application and is available for download from the Apple App Store (Google Play is currently down, but will be back up shortly) and can also be accessed from the web.","programming-languages":"Kotlin, Swift, Dart (Flutter), PHP, Javascript (original backend), MySQL, DynamoDB","link":"https://apps.apple.com/us/app/self-reflection/id1636196489"}],
        ["images/coverflow_images/imageshuffle.png",1,{"title":"ImageShuffle","images":["images/coverflow_items/imageshuffle/image1.gif","images/coverflow_items/imageshuffle/output.apng","images/coverflow_items/imageshuffle/horzsat50.png"],"desc":"ImageShuffle is a weird program that lets you sort the pixels in an image, alongside giving you the tools to generate images that can contain two or more images depending on the layering.<br><br> ImageShuffle came from the idea originally of making a program that could sort the pixels in an image by color, but then I got carried away and realized you could hide entire images in other images using this sorting method.<br><br>ImageShuffle allows you to hide images while preserving full color depth, or full height depth, and it just makes a cool animation.<br>","programming-languages":"Python","link":"https://github.com/knucklesfan/ImageShuffle"}],
        ["images/coverflow_images/waiter1.png",1,
        {"title":"KnuxfanWaiter","images":["images/coverflow_items/knuxfanwaiter/waiter1.png","images/coverflow_items/knuxfanwaiter/waiter2.png","images/coverflow_items/knuxfanwaiter/waiter3.png","images/coverflow_items/knuxfanwaiter/waiter4.png"],"desc":"Waiter is an interactive screensaver, designed to be used on Chromebook devices that double as servers. (specific use-case, I know.)<br>Why did I make this, exactly? Well, I have come into ownership of a ton of old, outdated chromebooks, and need some way to tie my several networks together to my one central server, located offsite. I have 3 houses that I manage for my family, and Wireguard links these houses together into one Home Assistant instance, and since a Chromebook is used, why not use that fancy screen and keyboard for something interesting?<br><br>Waiter currently provides a few different scenes/services, including a scrolling, on-screen news ticker, a weather scene, a time scene, and a bouncing DVD Logo.","programming-languages":"Python","link":"https://github.com/knucklesfan/KnuxfanWaiter"}],
        ["images/coverflow_images/flicewater.png",1],
        ["images/coverflow_images/dsonut.png",256/384],
        ["images/coverflow_images/knuxfanspelling.png",32/25],
        ["images/coverflow_images/skyy.png",4/3],


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
        hoveringCenter = mousex<(canvas.width/2)+(canvas.width/6)&&mousex>(canvas.width/2)-(canvas.width/6) //i know the width is hard-coded, but who's gonna notice that
        hoveringBackground = mousex<(canvas.width/4)+192&&mousex>(canvas.width/4)-192 || mousex<(canvas.width-(canvas.width/4))+192&&mousex>(canvas.width-(canvas.width/4))-192
        console.log(hoveringBackground)
        console.log(hoveringCenter)
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
        if(hoveringCenter) { //load the actual thing
            spinnytimer+=360;
            let slideshowholder = document.getElementById("slideshow-location")
            document.getElementById("modaltitle").innerHTML = coverflow_images[selection][2]["title"]
            document.getElementById("modaldesc").innerHTML = coverflow_images[selection][2]["desc"]
            slideshowholder.innerHTML = ""
            for(let i = 0; i < coverflow_images[selection][2]["images"].length; i++) {
                coverflow_images[selection][2]["images"][i]
                slideshowholder.innerHTML += `<div class="mySlides fade" style="text-align: center;">
                <div class="numbertext">${i+1} / ${coverflow_images[selection][2]["images"].length}</div>
                <img src="${coverflow_images[selection][2]["images"][i]}" style="max-height:50vh;width:100%;  object-fit: contain;">
                </div>
                `
            }
            slideshowholder.innerHTML += `<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
            <a class="next" onclick="plusSlides(1)">&#10095;</a>
            `;
            resetSlides(coverflow_images[selection][2]["images"].length)
            document.getElementById("projectModal").style.display = "block";
        }
        if(hoveringBackground) { //little secret easter egg if you click on a background icon
            spinnytimer+=360;
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
        if(spinnytimer > 0.1) {
            spinnytimer = lerp(spinnytimer,0,0.01)
        }
        else {
            spinnytimer = 0;
        }
        if (subTransition != 0) {
            let lerpval = lerp(subTransition,0,0.05);
            if(Math.abs(lerpval) < 0.0001) {
                subTransition = 0;
            }
            else {
                subTransition = lerpval;
            }
        }
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

        if(hoveringLeftButton || hoveringRightButton || hoveringCenter) {
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

            let width = coverflow_images[i][1]
            c.render(canvas,gl,coverflow_textures[i],[
                z,groundHeight+1,
                x],[0,90+(Math.sin((Date.now()-starttime)/1000)*4)+spinnytimer,0],[0.05,1,width],[0,4,-8],1.0,fov)
            c.render(canvas,gl,coverflow_textures[i],[
                z,
                groundHeight-1,
                x],[0,90+(Math.sin((Date.now()-starttime)/1000)*4)+spinnytimer,180],[0.05,1,width],[0,4,-8],1.0,fov)
        }
        p.render(canvas,gl,0,0,floor_texture,[0,groundHeight,-16],[-90,0,0],[16,16,1],[0,4,-8],0.8,fov)
        s.render(canvas,gl,32,canvas.height/2-32,button_texture,64*buttonLeftSize,64*buttonLeftSize,0,0,-1,1)
        s.render(canvas,gl,canvas.width-96,canvas.height/2-32,button_texture,64*buttonRightSize,64*buttonRightSize,0,0,1,1)

        gl.disable(gl.DEPTH_TEST)

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    var modal = document.getElementById("projectModal");

    // Handle modal related stuff too, including clicking on the darkened background
    window.onclick = function(event) {
        console.log(event.target)
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById("modalclose").onclick = function() {
        modal.style.display = "none";
    }

}
window.addEventListener('load',coverflow_main,false);
window.addEventListener('resize',function(evt) {
    document.getElementById("coverflow-canvas").width = document.getElementById("coverflow-canvas").getBoundingClientRect().width
    document.getElementById("coverflow-canvas").height = document.getElementById("coverflow-canvas").getBoundingClientRect().height
    },false
)
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}
function resetSlides(n) {
    slideIndex = 1;
    showSlides(n);
}
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
}
