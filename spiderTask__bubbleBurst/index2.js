/*document.querySelector("#startGame").addEventListener("click",function(){
  window.location.href="index.html";
});
*/
var m,n;

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
