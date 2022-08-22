//#region variable declaration
const gameWidth = 60;
const gameHeight = 37;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var xval=0,yval=0,xvel=0,yvel=0;
var txval=-1, tyval=-1;
var length=1;
var gameDone=false;
var dead = false;
var gameDone = false;
var moved = true;
var game = new Array(gameWidth);
var vgame=new Array(gameWidth);
//#endregion

//#region constants
var dim = {
    dim_x: 0,
    dim_y: 1,
    num_dims: 2
};

var map_spots = {
  no_snake: 0,
  snake_head: 1,
  snake_body:2,
  snake_tail:3,
  food:4,
};
//#endregion


function main(){
  beforeGame();
  gamePlay();
}


function goHome(){
  window.location.href = "../index.html";
}

function beforeGame(){
  for (var i = 0; i < gameWidth; i++) {
    game[i] = new Array(gameHeight);
  }

  for(var i=0;i<gameWidth;i++){
    vgame[i]=new Array(gameHeight);
  }

  xval=0,yval=0;
  xvel=0;
  yvel=0;
  txval=-1;
  tyval=-1;
  length=1;
  gameDone=false;
  dead = false;
  gameDone = false;
  moved = true;
  document.getElementById("button").style.visibility ="hidden";
  var i,j;
  for(i=0;i<gameWidth;i++){
    for(j=0;j<gameHeight;j++){
      game[i][j]=map_spots.no_snake;
      vgame[i][j]=-1;
    }
  }
  game[0][0]=map_spots.snake_head;
  document.getElementById("output").innerHTML=length;
  generateFood();
}

async function gamePlay(){
    await sleep(40);
    clear();
    drawMap();
    moveSnake();
    if(gameDone){
      afterGame();
    }
    else{
      gamePlay();
    }
}

function moveSnake(){
  if((xval+xvel)>=gameWidth||(xval+xvel)<0||(yval+yvel)<0||(yval+yvel)>=gameHeight||game[xval+xvel][yval+yvel]==map_spots.snake_body){//if the snake is going through a wall
    dead=true;
    gameDone=true;
    return;
  }
  else if(game[xval+xvel][yval+yvel]==map_spots.food){
    eatFood();
    return;
  }
  if(length==1){//updating the map at length 1
    game[xval][yval]=map_spots.no_snake;
  }
  else if(length==2){//updating the map at length 2
    game[xval][yval]=map_spots.snake_tail;
    game[txval][tyval]=map_spots.no_snake;
    txval=xval;
    tyval=yval;
  }
  else{//updating the map at length greater than 2
    game[xval][yval]=map_spots.snake_body;
  }
    xval+=xvel;//moving the snake
    yval+=yvel;//moving the snake
    game[xval][yval]=map_spots.snake_head;
    var vel=-1;
    if(xvel!=0 || yvel!=0){//if the snake is moving
    if(xvel!=0){
      if(xvel==1){
        vel=2;
      }
      else{
        vel=4;
      }
    }
    else{
      if(yvel==1){
        vel=3;
      }
      else{
        vel=1;
      }
    }
    vgame[xval][yval]=vel;
    if(length>2){//tail logic
      game[txval][tyval]=map_spots.no_snake;
      if(vgame[txval][tyval]==1){//up
        tyval-=1;
      }
      else if(vgame[txval][tyval]==2){//right
        txval+=1;
      }
      else if(vgame[txval][tyval]==3){//down
        tyval+=1;
      }
      else if(vgame[txval][tyval]==4){//left
        txval-=1;
      }
      game[txval][tyval]=map_spots.snake_tail;
    }
  }
  moved=true;
}

function eatFood(){
  if(length==1){
    game[xval][yval]=map_spots.snake_tail;
    txval=xval;
    tyval=yval;
  }
  else{
    game[xval][yval]=map_spots.snake_body;
  }
    xval+=xvel;
    yval+=yvel;
    game[xval][yval]=map_spots.snake_head;
    if(xvel!=0 || yvel!=0){//if the snake is moving
    if(xvel!=0){
      if(xvel==1){
        vel=2;
      }
      else{
        vel=4;
      }
    }
    else{
      if(yvel==1){
        vel=3;
      }
      else{
        vel=1;
      }
    }
  }
  vgame[xval][yval]=vel;
  length+=1;
  generateFood();
  document.getElementById("output").innerHTML=length;
  //console.log(length);
}

function afterGame(){
  console.log("afterGame");
  document.getElementById("button").style.visibility ="visible";
}

function clear(){
  ctx.clearRect(0, 0, 1200, 800);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateFood(){
  var generated=false;
  var newFood=new Array(2);
  while(!generated){
    newFood[0]=getRandomInt(0,gameWidth);
    newFood[1]=getRandomInt(0,gameHeight);
    if(game[newFood[0]][newFood[1]]==map_spots.no_snake){
      game[newFood[0]][newFood[1]]=map_spots.food;
      generated=1;
    }
  }
}

function drawMap(){
  var i,j;
  clear();
  for(i=0;i<gameWidth;i++){
    for(j=0;j<gameHeight;j++){
      if(game[i][j]==map_spots.snake_body){
        drawCircle(i,j, "red");
      }
      else if (game[i][j]==map_spots.snake_head) {
        drawCircle(i,j, "green");
      }
      else if (game[i][j]==map_spots.snake_tail) {
        drawCircle(i,j, "yellow");
      }
      else if (game[i][j]==map_spots.food) {
        drawSquare(i,j, "blue");
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawSquare(x,y,c){
  ctx.fillStyle=c;
  ctx.fillRect((20*x)+1,(20*y+1),18,18);
}

function drawCircle(x,y,c){
  var centerX=(20*(x+.5));
  var centerY=(20*(y+.5));
  var radius=8;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle=c;
  ctx.fill();
}

document.onkeydown = function(e) {
  if(moved){
    switch (e.keyCode) {
        case 37://left
        if(vgame[xval][yval]!=2 || length==1){
            vgame[xval][yval]=4;
            xvel=-1;
            yvel=0;}
            break;
        case 38://up
        if(vgame[xval][yval]!=3||length==1){
            vgame[xval][yval]=1;
            xvel=0;
            yvel=-1;}
            break;
        case 39://right
        if(vgame[xval][yval]!=4||length==1){
            vgame[xval][yval]=2;
            xvel=1;
            yvel=0;
          }
            break;
        case 40://down
        if(vgame[xval][yval]!=1||length==1){
            vgame[xval][yval]=3;
            xvel=0;
            yvel=1;
          }
            break;
        case 80://p (pause)
            xvel=0;
            yvel=0;
            break;
    }
  }
  moved=false;
};

main();
