var canvas=document.querySelector("#canvas");
canvas.width=innerWidth;
canvas.height=innerHeight;
var c=canvas.getContext("2d");
var bubblesArray=[],colorArray=["#ffe700","#05F258","#F25835","#001eff"];
var timeSpan=800,createStatus=1;
var i,j,totalArea=0,windowArea=innerWidth*innerHeight;

var mouse={
  x:undefined,
  y:undefined
};

var universalColorValue=Math.floor(Math.random()*4),universalColor=colorArray[universalColorValue],tempValue;
var score=0,popArray=[],signx=[1,-1,-1,1],signy=[1,1,-1,-1],dateObject=new Date(),gameStatus=1,endStatus=-1,increaseStatus=1;
var startTime,currentTime,displayTime,bubbleCount=0;

var gauntletCount=1,gauntletStart=[0,198,351,506,684],gauntletWidth=[198,153,155,178,144],felixCount=2,tempSpan,felixMode=-1;
var gauntletImage=new Image(),felixImage=new Image(),stoneImage=[new Image(),new Image(),new Image(),new Image(),new Image()],stoneColor=["#f80052","#00b286","#0090db","#ff98a6","#f9b300"];
gauntletImage.src="gauntlet.png";
felixImage.src="felix2.png";
stoneImage[0].src="redStone.png";
stoneImage[1].src="images/peachStone.png";
stoneImage[2].src="images/blueStone.png";
stoneImage[3].src="images/pinkStone.png";
stoneImage[4].src="images/yellowStone.png";

var m,n,p,singleCount=1;

var buttonAudio,burstAudio,themeMusic,deadAudio,felixAudio;
buttonAudio=new Audio("audioFiles/button.wav");
burstAudio=new Audio("audioFiles/burst2.mp3");
deadAudio=new Audio("audioFiles/dead.wav");
themeMusic=new Audio("audioFiles/themeMusic.mp3");
felixAudio=new Audio("audioFiles/colorswitch.wav")

themeMusic.volume=0.3;
themeMusic.loop=true;

function Bubble(x,y,radius,color)
{
  this.x=x;
  this.y=y;
  this.radius=radius;
  this.color=color;
  this.mass=1;
  this.exist=1;
  this.velocity={
    x:(Math.random()-0.5)*7,
    y:(Math.random()-0.5)*7
  };
  this.snapStatus=-1;
  this.stoneStatus=-1;
  this.stoneCount=0;
  if(score>=20)
  {
    if(bubbleCount%26==0&&bubbleCount%40!==0)
    {
      this.stoneStatus=1;
    }
  }
  if(bubbleCount%40==0&&bubblesArray.length>=10)
  {
    this.snapStatus=1;
  }
  this.update=function()
  {
    this.x+=this.velocity.x;
    this.y+=this.velocity.y;
    if(this.x-this.radius>70&&this.x+this.radius<innerWidth-70&&this.y-this.radius>70&&this.y+this.radius<innerHeight-70&&this.radius<=70)
    {
        this.radius+=0.15;
    }

    this.draw();

    for(j=0;j<bubblesArray.length;j++)
    {
      if(this!==bubblesArray[j])
      {
        if(getDistance(this.x,bubblesArray[j].x,this.y,bubblesArray[j].y)<=this.radius+bubblesArray[j].radius)
        {
          resolveCollision(this,bubblesArray[j]);
        }
      }
    }

    if(this.x+this.radius>=innerWidth||this.x-this.radius<=0)
    {
      this.velocity.x=-this.velocity.x;
    }

    if(this.y+this.radius>=innerHeight||this.y-this.radius<=0)
    {
      this.velocity.y=-this.velocity.y;
    }



  };
  this.draw=function()
  {
    if(this.exist==1)
    {
      c.beginPath();
      c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
      c.strokeStyle=this.color;
      c.save();
      c.globalAlpha=1;
      c.fillStyle=this.color;
      c.fill();
      c.restore();
      c.stroke();
      if(this.snapStatus==1)
      {
        let value=this.radius/(Math.pow(2,0.5));
        c.beginPath();
        c.drawImage(gauntletImage,gauntletStart[gauntletCount%5],0,gauntletWidth[gauntletCount%5],284,this.x-value,this.y-value,value*2,value*2);
      }
      else if(this.stoneStatus==1)
      {
        c.fillStyle="black";
        c.fill();
        let value=this.radius/(Math.pow(2,0.5));
        c.beginPath();
        c.drawImage(stoneImage[this.stoneCount],0,0,148,148,this.x-value,this.y-value,value*2,value*2);
      }
    }
    else
    {
      for(let m=0;m<4;m++)
      {
        let value=this.radius/(Math.pow(2,0.5));
        c.beginPath();
        c.moveTo(this.x+signx[m]*value*0.5,this.y+signy[m]*value*0.5);
        c.lineTo(this.x+signx[m]*value*1.5,this.y+signy[m]*value*1.5);
        c.lineWidth=4;
        c.strokeStyle=this.color;
        c.stroke();
      }
    }

  };



}



function getDistance(x1,x2,y1,y2)
{
  xDistance=x1-x2;
  yDistance=y1-y2;
  return Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2));

}

function generateRandom(min,max)
{
  return Math.random()*(max-min)+min;
}

function animate()
{
  af=requestAnimationFrame(animate);
  c.clearRect(0,0,innerWidth,innerHeight);
  //checkCondition();
  if(gameStatus==1)
  {
    for(i=0;i<bubblesArray.length;i++)
    {
      bubblesArray[i].update();
    }
    changeArea();
    checkArea();
  }

  console.log(timeSpan);

}

animate();

createInterval=setInterval(createBubble,timeSpan);

gameInterval=setInterval(function(){
  if(felixMode==-1)
  {
    if(timeSpan>=400){
    timeSpan-=100;
    clearInterval(createInterval);
    createInterval=setInterval(createBubble,timeSpan);
    }
  }

},10000);

function createBubble()
{
  if(createStatus==1){
  let x=generateRandom(30,innerWidth-30);
  let y=generateRandom(30,innerHeight-30);
  let radius=generateRandom(20,30);
  let color=getColor();
  for(j=0;j<bubblesArray.length;j++)
  {
    if(getDistance(x,bubblesArray[j].x,y,bubblesArray[j].y)<=radius+bubblesArray[j].radius)
    {
      x=generateRandom(30,innerWidth-30);
      y=generateRandom(30,innerHeight-30);
    }
  }
  bubbleCount++;
  bubblesArray.push(new Bubble(x,y,radius,universalColor));
  totalArea+=Math.PI*radius*radius;
  console.log(totalArea);
  }

}

function getColor()
{
  return colorArray[Math.floor(Math.random()*6)];
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

/*function checkCondition()
{
  if(totalArea>=windowArea*0.5)
  {
    createStatus=-1;
    console.log("checked");
  }
  else
  {
    createStatus=1;
  }


}*/

window.addEventListener("click",function(event){
  for(let k=0;k<bubblesArray.length;k++)
  {
    if(getDistance(event.x,bubblesArray[k].x,event.y,bubblesArray[k].y)<=bubblesArray[k].radius)
    {
      burstAudio.play();
      if(bubblesArray[k].snapStatus==-1&&bubblesArray[k].stoneStatus==-1)
      {
        totalArea-=Math.PI*bubblesArray[k].radius*bubblesArray[k].radius;
        bubblesArray[k].exist=-1;
        score++;
        break;
      }
      else if(bubblesArray[k].snapStatus==1&&bubblesArray[k].stoneStatus==-1)
      {
        for(let q=0;q<10;q++)
        {
          totalArea-=Math.PI*bubblesArray[q].radius*bubblesArray[q].radius;
          bubblesArray[q].exist=-1;
        }
        if(k>=10)
        totalArea-=Math.PI*bubblesArray[k].radius*bubblesArray[k].radius;
        bubblesArray[k].exist=-1;
        score++;
        break;
      }
      else if(bubblesArray[k].stoneStatus==1&&bubblesArray[k].snapStatus==-1)
      {
        bubblesArray[k].stoneCount++;
        score++;
        if(bubblesArray[k].stoneCount>=5)
        {
          totalArea-=Math.PI*bubblesArray[k].radius*bubblesArray[k].radius;
          bubblesArray[k].exist=-1;
          break;
        }
        break;
      }
    }
  }

  setTimeout(function(){
    for(let k=0;k<bubblesArray.length;k++)
    {
      if(bubblesArray[k].exist==-1)
      {
        bubblesArray.splice(k,1);
        k=-1;
      }
    }
  },100);

  document.querySelector("#value1").textContent=score;

});

function changeArea()
{
  totalArea=0;
  for(let k=0;k<bubblesArray.length;k++)
  {
    totalArea+=Math.pow(bubblesArray[k].radius,2)*Math.PI;
  }
}

setInterval(function(){
  tempValue=Math.floor(Math.random()*4);
  while(tempValue==universalColorValue)
  {
    tempValue=Math.floor(Math.random()*4);
  }
  universalColorValue=tempValue;
  universalColor=colorArray[universalColorValue];

  for(let k=0;k<bubblesArray.length;k++)
  {
    bubblesArray[k].color=universalColor;
  }
},5000);

document.querySelector("#homeButton").addEventListener("click",function(){
  buttonAudio.play();
  window.location.href="home.html";restart();
});

document.querySelector("#pauseButton").addEventListener("click",function(){
  buttonAudio.play();
  themeMusic.pause();
  document.querySelector(".pausePage").classList.remove("hidden");
  gameStatus=-1;
  createStatus=-1;
  document.querySelector("#playButton").classList.remove("hidden");
});

document.querySelector("#playButton").addEventListener("click",function(){
  if(bubblesArray.length==0)
  {
    themeMusic.play();
    gameStatus=1;
    createStatus=1;
    document.querySelector("#pauseButton").classList.remove("hidden");
    document.querySelector("#felixUsage").classList.remove("hidden");
    document.querySelector("#felixButton").classList.remove("hidden");
  }
  themeMusic.play();
  buttonAudio.play();
  gameStatus=1;
  createStatus=1;
  document.querySelector(".pausePage").classList.add("hidden")
  document.querySelector("#playButton").classList.add("hidden");
});

document.querySelector("#value1").textContent=0;
//document.querySelector("#playButton").classList.add("hidden");
//document.querySelector(".pausePage").classList.add("hidden");
createStatus=-1;gameStatus=-1;
document.querySelector("#pauseButton").classList.add("hidden");
document.querySelector("#felixUsage").classList.add("hidden");
document.querySelector("#felixButton").classList.add("hidden");


function checkArea()
{
  if(totalArea>=0.4*windowArea)
  {
    document.querySelector(".countDown").classList.remove("hidden");
    if(endStatus==-1)
    {
      startTime=Date.now();
    }
    endStatus=1;
    currentTime=Date.now();
    displayTime=Math.floor((currentTime-startTime)/1000);
    document.querySelector(".countDown").textContent=10-displayTime;
    if(displayTime>=10)
    {
      window.location.href="gameOver.html";
      if(singleCount==1)
      {
        changeBestScores();
        singleCount=-1;
      }
    }
  }
  else
  {
    endStatus=-1;
    document.querySelector(".countDown").classList.add("hidden");
  }
}

setInterval(function(){
      gauntletCount++;
  if(gauntletCount>=70)
  gauntletCount=1;
},150);

document.querySelector("#felixButton").addEventListener("click",function(){
  if(felixCount>0)
  {
    felixAudio.play();
    felixCount--;
    felixMode=1;
    tempSpan=timeSpan;
    clearInterval(createInterval);
    createInterval=setInterval(createBubble,3500);
    setTimeout(function(){
      clearInterval(createInterval);
      createInterval=setInterval(createBubble,tempSpan);
      felixMode=-1;
    },5000);
    document.querySelector("#felixUsage").textContent=felixCount;
    if(felixCount==0)
    {
      document.querySelector("#felixUsage").textContent="";
    }
  }
});

document.querySelector("#felixUsage").textContent=felixCount;

function changeBestScores()
{
  for(m=1;m<=11;m++)
  {
    if(localStorage.getItem(`best${m}`)==null||localStorage.getItem(`best${m}`)==="?")
    {
      if(score!=0)
      localStorage.setItem(`best${m}`,score);
      break;
    }
  }
  for(m=11;m>=1;m--)
  {
    if(localStorage.getItem(`best${m}`)!==null||localStorage.getItem(`best${m}`)==="?")
    {
      for(n=1;n<=m;n++)
      {
        for(p=n+1;p<=m;p++)
        {
          if(Number(localStorage.getItem(`best${p}`))>Number(localStorage.getItem(`best${n}`)))
          {
            temporary=localStorage.getItem(`best${p}`);
            localStorage.setItem(`best${p}`,localStorage.getItem(`best${n}`));
            localStorage.setItem(`best${n}`,temporary);

          }
        }

      }
      if(localStorage.getItem(`best11`)!=null)
      localStorage.setItem(`best11`,"?");
      break;
    }
  }

  for(m=10;m>=1;m--)
  {
    if(localStorage.getItem(`best${m}`)!==null)
    {
      for(n=1;n<=m;n++)
      {
        document.querySelector("#v"+n).textContent=localStorage.getItem(`best${n}`);

      }
      break;
    }
  }
}
