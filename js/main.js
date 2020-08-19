const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

let spacePressed = false;
let angle = 0;
let hue = Math.floor(Math.random()*360);
let frame = 0;
let score = 0;
let gamespeed = 2;

let gameEnded = false;

let repeating = false;

let gesture = "space";

function animate() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  handleObstacles();
  handleParticles();
  bird.update();
  bird.draw();
  handleCollision();
  ctx.fillStyle = 'red';
  ctx.font = '90px Arial';
  ctx.strokeText(score, 500, 100);
  ctx.fillText(score, 500, 100);
  // handleCollision();
  if (!gameEnded) {
    requestAnimationFrame(animate);
  } else {
    setTimeout(restartGame, 10000);
  }
  angle += 0.2;
  hue++;
  frame ++;
}

window.addEventListener('keydown', function(e) {
  if (e.code === "Space") {
    if (!gameEnded) {
      if (e.repeat){
        repeating = true;
      } else {
        repeating = false;
      }
      spacePressed = true;
    } else {
      restartGame();
    }
  }
});
window.addEventListener('keyup', function(e) {
  if (e.code === "Space" && holdForFlap) {
    repeating = false;
    spacePressed = false;
  }
});

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  document.addEventListener("touchstart", function(e) {
    if (!gameEnded) {
      if (e.repeat){
        repeating = true;
      } else {
        repeating = false;
      }
      spacePressed = true;
    } else {
      restartGame();
    }
  });
  document.addEventListener("touchend", function(e) {
    repeating = false;
    spacePressed = false;
  });
  gesture = "finger";
}

function holdForFlapToggle() {
  holdForFlap = (localStorage.getItem('holdForFlap') == 'true');
  localStorage.setItem('holdForFlap', !holdForFlap);
  displayHoldForFlap();
}

function displayHoldForFlap() {
  holdForFlap = (localStorage.getItem('holdForFlap') == 'true');
  checkButton = document.getElementById("holdForFlapToggle");
  if (holdForFlap !== null) {
    if (holdForFlap === true) {
      allowRepeat = true;
      checkButton.innerHTML = "Hold " + gesture + " to move";
    } else {
      allowRepeat = false;
      checkButton.innerHTML = "Tap " + gesture + " to flap";
    }
  } else {
    holdForFlap = true;
    allowRepeat = true;
    checkButton.innerHTML = "Hold " + gesture + " to move";
  }
}

const bang = new Image();
bang.src = 'images/bang.png';
function handleCollision() {
  for (let i = 0; i < obstaclesArray.length; i++) {
    if (bird.x <= obstaclesArray[i].x + obstaclesArray[i].width &&
        bird.x + bird.width >= obstaclesArray[i].x &&
        ((bird.y <= obstaclesArray[i].top) || (bird.y + bird.height >= obstaclesArray[i].bottom))) {
          //collision detected
          ctx.drawImage(bang, bird.x, bird.y-bird.height/2, 50, 50);
          ctx.font = "25px Georgia";
          ctx.fillStyle = 'black';
          ctx.fillText("Game Over, your score is " + score, 160, canvas.height/2 - 10);
          ctx.fillText("Tap " + gesture + " to restart", 200, canvas.height/2 + 40);
          highScoreHandler.isHighScore();
          gameEnded = true;
          return gameEnded;
        }
  }
}
let highScoreHandler = {
  isHighScore : function () {
    currentHighScore = localStorage.getItem('highScore');
    if (score > currentHighScore) {
      localStorage.setItem('highScore', score);
    }
  },
  displayHighScore : function() {
    currentHighScore = localStorage.getItem('highScore');
    let display = document.getElementById("highscore");
    if (currentHighScore !== null) {
      display.innerHTML = "High Score: " + String(currentHighScore);
    } else {
      display.innerHTML = "High Score: 0";
    }
  },
  resetHighScore : function() {
    let display = document.getElementById("highscore");
    display.innerHTML = "High Score: 0";
    localStorage.setItem('highScore', 0);
  }
}


function restartGame() {
  location.reload();
  return false;
}



highScoreHandler.displayHighScore();
displayHoldForFlap();
animate();