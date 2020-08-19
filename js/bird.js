let birdColor = 'hsl(' + Math.floor(Math.random()*360) + ', 100%, 50%)';
class Bird {
  constructor(){
    this.x = 150;
    this.y = 200;
    this.vy = 20;
    this.width = 20;
    this.height = 20;
    this.weight = 1;
  }
  update() {
    let curve = Math.sin(angle)*10;
    if (this.y > canvas.height - (this.height*2) + curve) {
      this.y = canvas.height - (this.height*2) + curve;
      this.vy = 0;
    } else {
      this.vy += this.weight;
      this.vy *= 0.9;
      this.y += this.vy;
    }
    if (this.y < 0 + this.height) {
      this.y = 0 + this.height;
      this.vy = 0;
    }
    if (spacePressed && this.y > this.height * 3) {
      if (holdForFlap) {
        this.flap(2);
      } else if (!holdForFlap && repeating===false) {
        this.flap(18);
        setTimeout(spacePressed = false, 500);
      }
    }
  }
  draw() {
    ctx.fillStyle = birdColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  flap(v) {
    this.vy -= v;
  }
}

const birdPic = new Image();
birdPic.src = 'images/bekfast.jpg';
const bird = new Bird();