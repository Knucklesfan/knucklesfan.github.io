let objects = []
degrees = 0;

function draw() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(function (ball) {
        ball.drawSelf(context,canvas);
    });
    context.save();
    var grd = context.createLinearGradient(0, 0, 0, canvas.height/2);
    grd.addColorStop(0, "rgba(0,0,0,0.5)");
    grd.addColorStop(1, "rgba(255,255,255,0.5)");
    context.fillStyle = grd;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
    //draws the center pinecone
    var img = new Image();
    img.src = 'images/pinecone.png';
    context.save();
    context.translate(context.canvas.width/2,context.canvas.height/2); // sets scale and origin
    degrees += 0.1;
    context.rotate(degrees*Math.PI/180);
    var a = canvas.height/2;
    context.drawImage(img, a/2*-1,a/2*-1,a,a);
    context.restore();
    context.textAlign = ("center");
    context.font = "100px Times New Roman";
    context.fillStyle = ("lime");
    context.strokeStyle = 'green';
    context.lineWidth = 8;
    context.strokeText("KNUX STUFF", canvas.width/2, canvas.height/2);
    context.fillText("KNUX STUFF",canvas.width/2,canvas.height/2)
    context.font = "32px Arial";
    context.fillStyle = ("red");
    context.strokeStyle = 'darkred';
    context.strokeText("I'm clearly a web designer", canvas.width/2, canvas.height/2+canvas.height/16);
    context.fillText("I'm clearly a web designer",canvas.width/2,canvas.height/2+canvas.height/16)

}
function physics() {
    var canvas = document.getElementById("myCanvas");
    objects.forEach(function (ball) {
        ball.physics(canvas.width, canvas.height);
    });

}
setInterval(draw, 0);

setInterval(physics, 0);
setInterval(spawnPinecone, 100);

function spawnBall() {
        var ball = new BouncingThing(Math.random() * 1280, Math.random() * 720, "#" + ((1 << 24) * Math.random() | 0).toString(16), document.getElementById("myCanvas"))
        objects.push(ball)
}
function spawnPinecone() {
    if(objects.length <= 40) {
        var ball = new Pinecone(Math.random() * window.innerWidth, document.getElementById("myCanvas"), objects);
        objects.push(ball)
    }

}
function openlink(link) {
    window.location.href = link;
}

