let birdColor = 'hsl(' + Math.floor(Math.random()*360) + ', 100%, 50%)';
const birdSprite = new Image();
birdSprite.src = '/images/bird/spritesheet.png';
class Bird {
  constructor(){
    this.x = 150;
    this.y = 200;
    this.vy = 20;
    this.originalWidth = 259;
    this.originalHeight = 146;
    this.width = this.originalWidth/4;
    this.height = this.originalHeight/4;
    this.weight = 1;
    this.frameX = 0;
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
    if (spacePressed && this.y >= this.height * 3) {
      if (!autoplayer) {
        if (holdForFlap) {
          this.flap(2);
        } else if (!holdForFlap && repeating===false) {
          this.flap(18);
          setTimeout(spacePressed = false, 500);
        }
      }
    }
  }
  draw() {
    ctx.fillStyle = birdColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(birdSprite, this.frameX*this.originalWidth, 0, this.originalWidth, this.originalHeight, this.x-13, this.y-10, this.width*1.4, this.height*1.4);
    }
  flap(v) {
    this.vy -= v;
    if (this.frameX >=3) {
      this.frameX = 0;
    } else if(frame%5 === 0) {
      this.frameX++;
    }
  }
}

const bird = new Bird();