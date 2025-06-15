document.addEventListener('DOMContentLoaded', function() {
    const paws = document.querySelectorAll('.paw-bg');
    paws.forEach((paw, idx) => {
        paw.addEventListener('click', function() {
            console.log(`¡Patita ${idx + 1} clickeada!`);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const paws = document.querySelectorAll('.paw-bg');
    paws.forEach((paw, idx) => {
        paw.addEventListener('click', function() {
            console.log(`¡Patita ${idx + 1} clickeada!`);
        });

        function animatePaw() {
            const randomDeg = Math.floor(Math.random() * 91) - 45;
            paw.style.transform = `rotate(${randomDeg}deg)`;
            const nextTime = 700 + Math.random() * 1000; 
            setTimeout(animatePaw, nextTime);
        }
        animatePaw();
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const paws = document.querySelectorAll('.paw-bg');
    const enzoContainer = document.getElementById('enzo-container');
    const enzoImg = document.getElementById('enzo-img');
    const enzoAudio = document.getElementById('enzo-audio');
    let enzoTimeout = null;
    let enzoActive = false;

    // Animación de rotación random para las patitas
    paws.forEach((paw, idx) => {
        function animatePaw() {
            const randomDeg = Math.floor(Math.random() * 91) - 45;
            paw.style.transform = `rotate(${randomDeg}deg)`;
            const nextTime = 700 + Math.random() * 1000; 
            setTimeout(animatePaw, nextTime);
        }
        animatePaw();
    });

    // Evento click para mostrar Enzo y bloquear clicks
    paws.forEach((paw, idx) => {
        paw.addEventListener('click', function() {
            if (enzoActive) return; // Si Enzo está activo, ignora el click
            enzoActive = true;

            // Deshabilitar clicks en todas las patitas
            paws.forEach(p => p.style.pointerEvents = 'none');

            // Mostrar Enzo en el centro
            enzoContainer.classList.add('active');
            // Reproducir audio
            enzoAudio.currentTime = 0;
            enzoAudio.play();

            // Ocultar después de 3 segundos
            clearTimeout(enzoTimeout);
            enzoTimeout = setTimeout(() => {
                enzoContainer.classList.remove('active');
                enzoAudio.pause();
                enzoAudio.currentTime = 0;
                // Habilitar clicks en las patitas
                paws.forEach(p => p.style.pointerEvents = 'auto');
                enzoActive = false;
            }, 3000);
        });
    });
});