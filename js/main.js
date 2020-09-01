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
let autoplayer = false;
let usedGodMode = false;


const background = new Image();
background.src = 'images/BG.png';
const BG = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height
}
function handleBackground() {
  if (BG.x1 <= -BG.width + gamespeed) BG.x1 = BG.width;
  else (BG.x1 -= gamespeed);
  if (BG.x2 <= -BG.width + gamespeed) BG.x2 = BG.width;
  else (BG.x2 -= gamespeed);
  ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
  ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}



function animate() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  autoplayerHandler.updateGodScore();
  handleBackground();
  handleObstacles();
  handleParticles();
  bird.update();
  bird.draw();
  handleCollision();
  autoplayerHandler.updateGodScore();
  ctx.fillStyle = 'red';
  ctx.font = '90px Arial';
  if (score >= 1000) {
    ctx.strokeText(score, 370, 100);
    ctx.fillText(score, 370, 100);
  } else if (score >= 100) {
    ctx.strokeText(score, 420, 100);
    ctx.fillText(score, 420, 100);
  } else if (score >= 10) {
    ctx.strokeText(score, 470, 100);
    ctx.fillText(score, 470, 100);
  } else if (score < 10) {
    ctx.strokeText(score, 520, 100);
    ctx.fillText(score, 520, 100);
  }
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
    bird.frameX = 0;
  }
});
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  document.addEventListener("touchstart", function(e) {
    e.preventDefault();
    e.stopPropagation();
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
  let checkButton = document.getElementById("holdForFlapToggle");
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


let autoplayerHandler = {
  displayAutoplayer : function() {
    let currentGodHighScore = localStorage.getItem('godHighScore');
    let checkButton = document.getElementById("toggleAutoplayer");
    if (autoplayer != null) {
      display = document.getElementById("autohighscore");
      display.innerHTML = "God Mode High Score: " + String(currentGodHighScore);
      if (autoplayer == true) {
        checkButton.innerHTML = "God mode: ON";
        usedGodMode = true;
        document.getElementById("usedGodMode").innerHTML = "You tried to cheat with god mode you sneaky bastard! Your high score won't be counted this game.";
      } else {
        checkButton.innerHTML = "God mode: OFF";
      }
    } else {
      autoplayer = false;
      checkButton.innerHTML = "Autoplayer: OFF";
    }
  },
  toggleAutoplayer : function() {
    autoplayer = (localStorage.getItem('autoplayer') == 'true');
    localStorage.setItem('autoplayer', !autoplayer);
    this.displayAutoplayer();
  },
  updateGodScore : function() {
    let currentGodHighScore = localStorage.getItem('godHighScore');
    display = document.getElementById("autohighscore");
    if (score > currentGodHighScore && autoplayer) {
      display.innerHTML = "God Mode High Score: " + String(currentGodHighScore);
      localStorage.setItem('godHighScore', score);
    }
  }
};




let highScoreHandler = {
  isHighScore : function () {
    if (!usedGodMode) {
      let currentHighScore = localStorage.getItem('highScore');
      if (score > currentHighScore) {
        localStorage.setItem('highScore', score);
      }
    } else {
      let currentGodHighScore = localStorage.getItem('godHighScore');
      if (score > currentGodHighScore) {
        localStorage.setItem('godHighScore', score);
      }
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
    display = document.getElementById("autohighscore");
    display.innerHTML = "God Mode High Score: 0";
    localStorage.setItem('godHighScore', 0);
  }
}




function restartGame() {
  location.reload();
  return false;
}



highScoreHandler.displayHighScore();
displayHoldForFlap();
autoplayerHandler.displayAutoplayer();
animate();