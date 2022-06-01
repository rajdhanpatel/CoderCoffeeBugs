import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"
// Initialize context
kaboom({
  global : true,
  fullsrene : false,
  font: "apl386",
  background: [ 39, 39, 84, ],
});


// Lets load the Sprites
loadSprite("banana", "sprites/banana.png");
loadSprite("apple", "sprites/apple.png");
loadSprite("bug", "sprites/bug.png");
loadSprite("programmer", "sprites/programmer.png");
loadSprite("coffee", "sprites/coffee.png");

// Lets load the Music

loadSound("background", "sounds/background.mp3");
loadSound("game over", "sounds/game over.mp3");
loadSound("sip", "sounds/sip.mp3");
loadSound("frtA", "sounds/frtA.mp3");
loadSound("frtB", "sounds/frtB.wav");



scene("game", ()=>{
let SPEED = 620
let BSPEED = 2
let SCORE = 0
let scoreText;
let bg = false;
let backgroundMusic;

// Lets define a function to display our score
const displayScore = ()=>{
  destroy(scoreText)
  // a simple score counter
  scoreText = add([
      text("Score:" + SCORE),
      scale(0.51),
      pos(width() - 200, 21),
      color(10, 10, 255)
  ])
}

// Lets define a function to play background music
const playBg = ()=>{
  if(!bg){ 
    backgroundMusic = play("background", {volume: 0.5})
    bg = true;
  }
}

// Lets add the player
const player = add([
    sprite("programmer"),  // renders as a sprite
    pos(120, 80),    // position in world
    area(),          // has a collider
    scale(0.13), 
])

// Lets add events to our player 
onKeyDown("left", () => {
  playBg()
  player.move(-SPEED, 0)
})

onKeyDown("right", () => {
  playBg()
  player.move(SPEED, 0)
})

onKeyDown("up", () => {
  playBg()
  player.move(0, -SPEED)
})

onKeyDown("down", () => {
  playBg()
  player.move(0, SPEED)
})

// Lets add 4 bugs and a coffee on loop
const f = setInterval(()=>{
  for(let i=0; i<4; i++){
    let x = rand(0, width())
    let y = height()

    let c = add([
       sprite("bug"),   
       pos(x, y),   
       area(),
       scale(0.13), 
       "bug",
       
    ])
    c.onUpdate(()=>{
      c.moveTo(c.pos.x, c.pos.y - BSPEED)
    })
  }
  // Lets introduce a coffee for our programmer to drink
  let x = rand(0, width())
  let y = height() 
  let c = add([
     sprite("coffee"),   
     pos(x, y),   
     area(),
     scale(0.13), 
    "coffee"
  ])
  c.onUpdate(()=>{
    c.moveTo(c.pos.x, c.pos.y - BSPEED)
  })
  // Lets introduce a banana for our programmer to eat

  let b = add([
     sprite("banana"),   
     pos(x+800, y),   
     area(),
     scale(0.13), 

    "banana"
  ])
  b.onUpdate(()=>{
    b.moveTo(b.pos.x, b.pos.y-BSPEED)
  })
  // Lets introduce a apple for our programmer to eat

  let a = add([
     sprite("apple"),   
     pos(x+450, y),   
     area(),
     scale(0.13), 
    "apple"
  ])
  a.onUpdate(()=>{
    a.moveTo(a.pos.x, a.pos.y -BSPEED-1)
  })

  
  if(BSPEED<10){ 
    BSPEED +=1
  }
},4000)

//loop over 

player.onCollide("bug", () => {
  backgroundMusic.volume(0.2)
  play("game over")
  destroy(player)
  destroyAll("bug")
  destroyAll("banana")
  destroyAll("apple")
  addKaboom(player.pos)
  clearInterval(f)
  go("gameover")                   
})
//collid with banana
player.onCollide("banana", (banana) => {
  backgroundMusic.volume(0.3)
  play("frtB", {
    volume: 2
  })
  destroy(banana)
  SCORE += 20
  displayScore()
 
})

player.onCollide("apple", (apple) => {
  backgroundMusic.volume(0.3)
  play("frtB", {
    volume: 2
  })
  destroy(apple)
  SCORE += 15
  displayScore()
 
})

player.onCollide("coffee", (coffee) => {
  backgroundMusic.volume(0.2)
  play("sip", {
    volume: 5
  })
  destroy(coffee)
  SCORE += 10
  displayScore()
  // 2 seconds until the volume is back
  wait(2, () => {
      backgroundMusic.volume(0.2)
  })
})
})


scene("gameover", ()=>{
  const displayScore = ()=>{
  destroy(scoreText)
  // a simple score counter
  scoreText = add([
      text("Score:" + SCORE),
      scale(0.51),
      pos(width() - 200, 21),
      color(10, 10, 255)
  ])
}
    scoreText = add([
      text("Game Over! Press space button"),
      
      scale(0.7),
      pos(300,200),
      color(10, 10, 255)
       // displayScore()
    
  ])
 
  onKeyPress("space",()=>{
    go("game")
  })
  
})
go("game")
