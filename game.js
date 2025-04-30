//IMPORTANT: Make sure to use Kaboom version 0.5.0 for this game by adding the correct script tag in the HTML file.

kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 1, 1],
})

// Speeds
const MOVE_SPEED = 150
// Define the spawn interval in seconds
var SPAWN_INTERVAL = 2;
var highScore = 0;

// Load sound files
loadSound("background", "background.mp3");
loadSound("yes", "yes.mp3");
loadSound("no", "no.mp3");

let bgMusic;
// Function to play background music
function playBackgroundMusic() {
  const bgMusic = play("background", { loop: true, volume: 0.5 });
}
function stopBackgroundMusic() {
  if (bgMusic) {
    bgMusic.stop();
  }
}

// Function to play win sound effect
function playWinSound() {
  play("yes", { volume: 0.5 });
}

// Function to play lose sound effect
function playLoseSound() {
  play("no", { volume: 0.5 });
}
// Game Logic
loadRoot('zimages/')
loadSprite('rock', 'rock.png')
loadSprite('paper', 'paper.png')
loadSprite('scissors', 'scissors.png')
loadSprite('left-wall', 'leftwall.png')
loadSprite('top-wall', 'topwall.png')
loadSprite('bottom-wall', 'bottomwall.png')
loadSprite('right-wall', 'rightwall.png')
loadSprite('bottom-left-wall', 'bottomleft.png')
loadSprite('bottom-right-wall', 'bottomright.png')
loadSprite('top-left-wall', 'topleft.png')
loadSprite('top-right-wall', 'topright.jpg')
loadSprite('meanRock', 'meanRock.png')
loadSprite('meanPaper', 'meanPaper.png')
loadSprite('meanScissors', 'meanScissors.png')
loadSprite('bg', 'floor.png')

scene('game', ({ level, score, high, lives }) => {
  layers(['bg', 'obj', 'ui'], 'obj')
  playBackgroundMusic();
  function spawnMeanObject() {
    const randX = rand(25, 450); // Random X position within canvas width
    const randY = rand(25, 400); // Random Y position within canvas height
    const meanObjects = ['meanRock', 'meanPaper', 'meanScissors'];
    const randMeanObject = choose(meanObjects); // Choose a random mean object to spawn
    add([
      sprite(randMeanObject),
      pos(randX, randY),
      { dir: -1 }, // Assuming all mean objects move in the same direction initially
      'dangerous',
      randMeanObject,
      'object',
      layer('obj'), // Set the layer explicitly to 'obj'
    ]);
  }

  const maps = [
    [
      'ycccccccccw',
      'a         b',
      'a         b',
      'a         b',
      'a         b',
      'a         b',
      'a         b',
      'a         b',
      'a         b',
      'xdddddddddz',
    ],
  ]

  const levelCfg = {
    width: 48,
    height: 48,
    a: [sprite('left-wall'), solid(), 'wall', 'object'],
    b: [sprite('right-wall'), solid(), 'wall', 'object'],
    c: [sprite('top-wall'), solid(), 'wall', 'object'],
    d: [sprite('bottom-wall'), solid(), 'wall', 'object'],
    w: [sprite('top-right-wall'), solid(), 'wall', 'object'],
    x: [sprite('bottom-left-wall'), solid(), 'wall', 'object'],
    y: [sprite('top-left-wall'), solid(), 'wall', 'object'],
    z: [sprite('bottom-right-wall'), solid(), 'wall', 'object'],
    '*': [sprite('meanRock'), 'meanRock', 'object', 'rock'],
    '}': [sprite('meanPaper'), 'meanPaper', 'object', 'paper'],
    'm': [sprite('meanScissors'), 'meanScissors', 'object', 'scissors'],
  }
  addLevel(maps[level], levelCfg)

  add([sprite('bg'), layer('bg')])

  loop(SPAWN_INTERVAL, () => {
    spawnMeanObject();
  });

  const livesLabel = add([
    text('Lives ' + lives),
    pos(535, 225),
    layer('ui'),
    {
      value: lives,
    },
    scale(2),
    color(0.3, 0.9, 0.5),
  ])
  const levelLabel = add([
    text('Level ' + level),
    pos(535, 250),
    layer('ui'),
    {
      value: level,
    },
    scale(2),
  ])
  const scoreLabel = add([
    text('Score ' + score),
    pos(535, 275),
    layer('ui'),
    {
      value: score,
    },
    scale(2),
  ])
  const highScoreLabel = add([
    text('High Score ' + highScore),
    pos(535, 300),
    layer('ui'),
    {
      value: highScore,
    },
    scale(2),
  ])

  
  add([
    text("Use arrows to move.\n\n\nUse space bar to\nchange character."),
    pos(535, 125),
    layer('ui'),
    scale(2),
    color(0.7, 0.7, 0.7),
  ])
  
  add([
    text("Change your character\nto beat your opponents\nand keep the screen\ncleared!"),
    pos(535, 350),
    scale(2),
    color(1.0, 0.2, 0.2),
  ]);

  add([
    text("Rock, Paper,\nScissors Run!"),
    pos(535, 50),
    scale(2.5),
    color(0.2, 1.0, 0.2),
  ]);
  
  const player = add([
    sprite('paper'),
    pos(20, 190),
    {
      // right by default
      dir: vec2(1, 0),
    },
  ])

  player.action(() => {
    player.resolve()
  })

  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0)
    player.dir = vec2(-1, 0)
  })

  keyDown('right', () => {
    player.move(MOVE_SPEED, 0)
    player.dir = vec2(1, 0)
  })

  keyDown('up', () => {
    player.move(0, -MOVE_SPEED)
    player.dir = vec2(0, -1)
  })

  keyDown('down', () => {
    player.move(0, MOVE_SPEED)
    player.dir = vec2(0, 1)
  })

  let currentChoice = 'paper'; // Initially set to 'paper'

  keyPress('space', () => {
    if (currentChoice === 'paper') {
      player.changeSprite('rock');
      currentChoice = 'rock';
    } else if (currentChoice === 'rock') {
      player.changeSprite('scissors');
      currentChoice = 'scissors';
    } else {
      player.changeSprite('paper');
      currentChoice = 'paper';
    }
  });

  player.overlaps('dangerous', (b) => {
    if (currentChoice === 'paper' && b.is('meanRock')) 
    {
      scoreLabel.value++;
      playWinSound();
      if (scoreLabel.value > highScoreLabel.value)
      {
        highScore = scoreLabel.value;
        highScoreLabel.value = scoreLabel.value;
        highScoreLabel.text = 'High Score ' + highScoreLabel.value;
      }
      scoreLabel.text = 'Score ' + scoreLabel.value;
      destroy(b);
      if (scoreLabel.value%10===0)        
      {
          levelLabel.value++;
          levelLabel.text = 'Level ' + levelLabel.value;
        SPAWN_INTERVAL += 0.5;
      }
    } 
    else if (currentChoice === 'scissors' && b.is('meanPaper')) 
    {
      scoreLabel.value++;
      playWinSound();
      if (scoreLabel.value > highScoreLabel.value)
      {
        highScore = scoreLabel.value;
        highScoreLabel.value = scoreLabel.value;
        highScoreLabel.text = 'High Score ' + highScoreLabel.value;
      }
      scoreLabel.text = 'Score ' + scoreLabel.value;
      destroy(b);
      if (scoreLabel.value%10===0)        
      {
          levelLabel.value++;
          levelLabel.text = 'Level ' + levelLabel.value;
          SPAWN_INTERVAL += 0.5;
      }
    } 
    else if (currentChoice === 'rock' && b.is('meanScissors')) 
    {
      scoreLabel.value++;
      playWinSound();
      if (scoreLabel.value > highScoreLabel.value)
      {
        highScore = scoreLabel.value;
        highScoreLabel.value = scoreLabel.value;
        highScoreLabel.text = 'High Score ' + highScoreLabel.value;
      }
      scoreLabel.text = 'Score ' + scoreLabel.value;
      destroy(b); 
      if (scoreLabel.value%10===0)        
      {
          levelLabel.value++;
          levelLabel.text = 'Level ' + levelLabel.value;
          SPAWN_INTERVAL += 0.5;
      }
    } 
    else if (currentChoice === 'rock' && b.is('meanRock')) 
    {
      
    } 
    else if (currentChoice === 'scissors' && b.is('meanScissors')) 
    {

    } 
    else if (currentChoice === 'paper' && b.is('meanPaper')) 
    {

    }
    else 
    {
      livesLabel.value--;
      playLoseSound();
      livesLabel.text = 'Lives ' + livesLabel.value;
      camShake(4);
      destroy(b);
      if (livesLabel.value < 0)
      {
      stopBackgroundMusic();
      go('lose',{score: scoreLabel.value}, {high: highScore})  
      }
    }
  });
})

scene('lose', ({ score, high }) => {
  layers(['bg', 'obj', 'ui'], 'obj')
  add([text('Game Over\nScore: ' + score +'\nHigh Score: ' + highScore, 28), origin('center'), pos(width() / 2, 100)])
  
  keyPress('n', () => {
    window.location.reload();
  })
  add([
    rect(160, 40), origin('center'),
    pos(width() / 2, 180),
    "button",
    {
      clickAction: () => go('game', { level: 0, score: 0, high: highScore, lives: 3 }),
    },
  ]);
  add([
    text("Play Again"), origin('center'),
    pos(width() / 2, 180),
    scale(2),
    color(0, 255, 0)
  ]);
  action("button", b => {

    if (b.isHovered()) {
      b.use(color(0.7, 0.7, 0.7));
    } else {
      b.use(color(255, 0, 0));
    }

    if (b.isClicked()) {
      b.clickAction();
    }
  });

})

scene("menu", () => {
  add([
    text("Rock Paper Scissors\nBy Mr. Groeneveld\nPope HS\nComputer Science"), origin('center'),
    pos(width() / 2, 60),
    scale(3),
  ]);

  add([
    rect(160, 40), origin('center'),
    pos(width() / 2, 180),
    "button",
    {
      clickAction: () => go('game', { level: 0, score: 0, keys: 0, lives: 3 }),
    },
  ]);

  add([
    text("Play game"), origin('center'),
    pos(width() / 2, 180),
    scale(2),
    color(0, 255, 0)
  ]);

  add([
    text("Currently In Development!\nGame will update\from time to time."), origin('center'),
    pos(width() / 2, 400),
    scale(2),
  ]);

  action("button", b => {

    if (b.isHovered()) {
      b.use(color(0.7, 0.7, 0.7));
    } else {
      b.use(color(255, 0, 0));
    }

    if (b.isClicked()) {
      b.clickAction();
    }

  });

});

start("menu")