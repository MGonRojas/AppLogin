const mensajeError = document.querySelector(".error");

document.getElementById("register-form").addEventListener("submit",async(e)=>{
  e.preventDefault();
  console.log(e.target.children.user.value)
  const res = await fetch("/api/register",{
    method:"POST",
    headers:{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      user: e.target.children.user.value,
      email: e.target.children.email.value,
      password: e.target.children.password.value
    })
  });
  if(!res.ok) return mensajeError.classList.toggle("escondido",false);
  const resJson = await res.json();
  if(resJson.redirect){
    window.location.href = resJson.redirect;
  }
})