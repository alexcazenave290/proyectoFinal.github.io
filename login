<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login - Adopción Responsable</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
<style>
:root {
  --beige: #f5d6a0;
  --beige-oscuro: #d4a373;
  --marron-claro: #a47148;
  --marron: #6b3e2e;
  --negro: #1b1b1b;
}

body {
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
  background: var(--beige);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Patitas flotantes */
.background-paws {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}

.paw-bg {
  position: absolute;
  width: 50px;
  opacity: 0.6;
  transform-origin: center center;
  animation-name: float;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

/* Animación de flotación */
@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -10px) rotate(10deg); }
  50% { transform: translate(0, -20px) rotate(-10deg); }
  75% { transform: translate(-10px, -10px) rotate(10deg); }
  100% { transform: translate(0,0) rotate(0deg); }
}

/* Login Box */
.login-box {
  width: 380px;
  padding: 40px;
  background: var(--beige-oscuro);
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  text-align: center;
  z-index: 1;
  position: relative;
}

.login-box h2 { margin-bottom: 20px; color: var(--marron); font-weight: bold; }
.form-control { background: var(--beige); border: none; border-radius: 10px; padding: 12px; color: var(--negro); }
.form-control:focus { border: 2px solid var(--marron); box-shadow: none; }
.btn-primary { background: var(--marron); border: none; border-radius: 15px; }
.btn-primary:hover { background: var(--marron-claro); }
.btn-success { background: var(--marron-claro); border: none; border-radius: 15px; }
.toggle-text { margin-top: 15px; font-size: 14px; color: var(--negro); }
.toggle-text span { color: var(--marron); font-weight: bold; cursor: pointer; }
.social-login p { color: var(--negro); margin-top: 20px; }
.social-login button { border-radius: 50px; font-weight: bold; }
</style>
</head>
<body>

<div class="background-paws" id="background-paws"></div>

<div class="login-box">
  <h2 id="form-title">🐾 Iniciar Sesión</h2>

  <form id="login-form">
    <div class="form-floating mb-3">
      <input type="text" class="form-control" id="login-username" placeholder="Usuario" required>
      <label for="login-username">Usuario</label>
    </div>
    <div class="form-floating mb-4">
      <input type="password" class="form-control" id="login-password" placeholder="Contraseña" required>
      <label for="login-password">Contraseña</label>
    </div>
    <button type="submit" class="btn btn-primary w-100">Entrar</button>
  </form>

  <form id="register-form" style="display:none;">
    <div class="form-floating mb-3">
      <input type="text" class="form-control" id="new-username" placeholder="Usuario" required>
      <label for="new-username">Usuario</label>
    </div>
    <div class="form-floating mb-3">
      <input type="email" class="form-control" id="email" placeholder="Email" required>
      <label for="email">Email</label>
    </div>
    <div class="form-floating mb-4">
      <input type="password" class="form-control" id="new-password" placeholder="Contraseña" required>
      <label for="new-password">Contraseña</label>
    </div>
    <button type="submit" class="btn btn-success w-100">Registrarse</button>
  </form>

  <p class="toggle-text">
    <span id="toggle-link">¿No tienes cuenta? Regístrate aquí</span>
  </p>

  <div class="social-login">
    <p>O ingresa con</p>
    <div class="d-flex justify-content-center gap-2">
      <button type="button" class="btn btn-danger"><i class="bi bi-google"></i> Google</button>
      <button type="button" class="btn btn-primary"><i class="bi bi-facebook"></i> Facebook</button>
      <button type="button" class="btn btn-dark"><i class="bi bi-github"></i> GitHub</button>
    </div>
  </div>
</div>

<script>
// Toggle login/register
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const toggleLink = document.getElementById("toggle-link");
const formTitle = document.getElementById("form-title");
toggleLink.addEventListener("click", () => {
  if(loginForm.style.display === "none") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    formTitle.textContent = "🐾 Iniciar Sesión";
    toggleLink.textContent = "¿No tienes cuenta? Regístrate aquí";
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    formTitle.textContent = "🐶 Crear Cuenta";
    toggleLink.textContent = "¿Ya tienes cuenta? Inicia sesión aquí";
  }
});

// Simulación localStorage
const users = JSON.parse(localStorage.getItem("users")) || [];
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const user = users.find(u=>u.username===username && u.password===password);
  if(user){ alert("Bienvenido "+username+" 🐾"); }
  else{ alert("Usuario o contraseña incorrectos"); }
});
registerForm.addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("new-username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("new-password").value;
  if(users.find(u=>u.username===username)){ alert("Ese usuario ya existe 🐕"); return; }
  users.push({username,email,password});
  localStorage.setItem("users",JSON.stringify(users));
  alert("Usuario registrado con éxito 🐾 Ahora puedes iniciar sesión.");
  toggleLink.click();
});

// Generar patitas animadas CSS
const background = document.getElementById("background-paws");
const totalPaws = 50;

for(let i=0;i<totalPaws;i++){
  const paw = document.createElement("img");
  paw.src="pawBackground.png";
  paw.classList.add("paw-bg");

  const x = Math.random()*(window.innerWidth-50);
  const y = Math.random()*(window.innerHeight-50);
  const scale = 0.4 + Math.random()*0.6;
  const rotate = Math.random()*360;

  paw.style.left = x + "px";
  paw.style.top = y + "px";
  paw.style.width = 30 + Math.random()*40 + "px"; // tamaño random
  paw.style.opacity = 0.4 + Math.random()*0.5;
  paw.style.transform = `scale(${scale}) rotate(${rotate}deg)`;

  // Velocidad y delay random para animaciones CSS
  const duration = 5 + Math.random()*5; // 5s a 10s
  const delay = Math.random()*5;
  paw.style.animationDuration = duration + "s";
  paw.style.animationDelay = delay + "s";

  background.appendChild(paw);
}
</script>
</body>
</html>
