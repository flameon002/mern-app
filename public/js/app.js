console.log("hola mundooiuioi");

document.addEventListener('click', (e) => {
  if (e.target.dataset.short) {
    const url= `http://localhost:3001/${e.target.dataset.short}`;
    navigator.clipboard
    .writeText(url)
    .then(()=>{
      console.log("Text copied to clipboard...");
    })
    .catch((err)=>{
      console.log("Algo salio mal",err);
    })
  }
});
