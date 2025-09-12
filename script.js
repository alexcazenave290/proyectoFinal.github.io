document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la animación de las patitas al cargar la página
    iniciarAnimacionPatitas();
});

function iniciarAnimacionPatitas() {
    const paws = document.querySelectorAll('.paw-bg');
    paws.forEach(paw => {
        animarPatita(paw);
    });
}

function animarPatita(paw) {
    const randomDeg = Math.floor(Math.random() * 91) - 45;
    paw.style.transform = `rotate(${randomDeg}deg)`;
    const nextTime = 700 + Math.random() * 1000;
    setTimeout(() => animarPatita(paw), nextTime);
}
