const obstaclesArray = [];

class Obstacle {
  constructor(){
    this.pipeY = (Math.random() * 150 + 150);
    this.spacing = (Math.random() * 90 + 100);
    this.top = this.pipeY - this.spacing/2;
    this.bottom = this.pipeY + this.spacing/2;
    this.x = canvas.width;
    this.width = 20;
    this.color = 'hsl(' + hue + ',100%,50%)';
    this.counted = false;
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.top, this.width, -(canvas.height-this.spacing-(canvas.height-this.bottom)));
    ctx.fillRect(this.x, this.bottom, this.width, canvas.height-this.spacing-this.top);
  }
  update(){
    this.x -= gamespeed;
    if (!this.counted && this.x < bird.x) {
      score++;
      this.counted = true;
    }
    this.draw();
  }
}

function handleObstacles(){
  if (frame%150 === 0) {
    // console.log(obstaclesArray);
    obstaclesArray.unshift(new Obstacle());
  }
  for (i = 0; i < obstaclesArray.length; i++) {
    if (obstaclesArray[i].x > bird.x - 50 && autoplayer) {
      bird.y = obstaclesArray[i].pipeY - bird.height/2;
    }
    obstaclesArray[i].update();
  }
  if (obstaclesArray > 20) {
    obstaclesArray.pop(obstaclesArray[0]);
  }
}