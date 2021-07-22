class Pinecone {

    x = 1;
    y = 0;
    yspeed = -0.01;
    xup = 1;
    degrees = 0;
    canvas;
    lifetime = 0;
    objects;
    constructor(x,canvas,objects) {
        this.x = x;
        this.y = 0;
        this.canvas = canvas;
        this.xup = Math.random();
    }
    physics(width,height) {
        if(this.lifetime >= 1000) {
            objects.shift();
        }
        this.lifetime++;
        if(this.x >= 0 && this.x <= width) {
            this.x+=this.xup;
        }
        else {
            this.xup *= -1;
            this.x+=this.xup;
        }
        if(this.y >= height) {
            this.yspeed = -2.5;
        }
        this.yspeed += 0.01;
        this.y += this.yspeed;
        this.degrees+=0.1;
    }

    drawSelf(context) {
        var img = new Image();
        img.src = 'images/pinecone.png';
        context.save();
        context.translate(this.x,this.y); // sets scale and origin
        context.rotate(this.degrees*Math.PI/180);
        context.drawImage(img, -64,-64,128,128);
        context.restore();
    }

}