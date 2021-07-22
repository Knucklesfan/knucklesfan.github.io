class BouncingThing {

    x = 1;
    y = 0;
    yup = -1;
    xup = 1;
    color;
    degrees = 0;
    canvas;
    lifetime = 0;
    constructor(x,y,color,canvas) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.canvas = canvas;
    }
    physics(width, height) {
        if(this.x >= 0 && this.x <= width) {
            this.x+=this.xup;
            this.y+=this.yup;
        }
        else {
            this.xup *= -1;
            this.x+=this.xup;
            this.y+=this.yup;
        }
        if(this.y <= 0) {
            this.yup = 1;
        }
        if(this.y >= height) {
            this.yup = -1;
        }
        this.degrees+=0.1;
    }

    drawSelf(context) {
        var img = new Image();
        img.src = 'images/poggers.jpg';
        context.save();
        context.translate(this.x,this.y); // sets scale and origin
        context.rotate(this.degrees*Math.PI/180);
        context.drawImage(img, -32,-32,64,64);
        context.restore();
    }

}