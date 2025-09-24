    const cardsGrid = document.getElementById('cardsGrid');
    const searchBar = document.getElementById('searchBar');
    
    // ===== Configuración =====
    const cantidadPatitas = 15;
    const tamanoMin = 30;
    const tamanoMax = 70;
    const sidebarWidth = 200; 
    const headerHeight = 90;

    let cardCounter = 0; // 🔹 contador global para IDs

    document.addEventListener('DOMContentLoaded', () => {
        cargarMascotas();
        generarPatitas();
        searchBar.addEventListener('input', filtrarMascotas);
    });

    function cargarMascotas() {
        const pets = JSON.parse(localStorage.getItem("pets")) || [];
        
        if (pets.length === 0) {
            mostrarMensajeVacio();
        } else {
            pets.forEach(pet => crearCard(pet));
        }
    }

    function crearCard(pet) {
        cardCounter++; // 🔹 incrementa ID único
        const cardId = `card-${cardCounter}`;

        const card = document.createElement("div");
        card.className = "card";
        card.id = cardId;

        // Revisar si esta tarjeta ya estaba likeada
        const likedPets = JSON.parse(localStorage.getItem("likedPets")) || {};
        const isLiked = likedPets[cardId] === true;

        card.innerHTML = `
            <div class="card-header">
                <i class='bx bx-message-detail'></i>
                <i class='bx ${isLiked ? "bxs-heart liked" : "bx-heart"} card-like'></i>
            </div>
            <img src="${pet.image}" class="card-img" alt="${pet.name}">
            <div class="card-body">
                <div class="card-info">
                    <i class='bx bxs-cat'></i> 
                    <div class="card-title">${pet.name}</div>
                    <i class='bx bxs-dog'></i> 
                </div>
                <div class="card-desc">${pet.desc}</div>
                <div class="card-details">
                    <p><b>Raza:</b> ${pet.raza}</p>
                    <p><b>Especie:</b> ${pet.especie}</p>
                    <p><b>Tamaño:</b> ${pet.tamano}</p>
                    <p><b>Salud:</b> ${pet.salud}</p>
                </div>
            </div>`;

        // === Evento click en el corazón ===
        const heartIcon = card.querySelector(".card-like");
        heartIcon.addEventListener("click", () => {
            heartIcon.classList.toggle("bx-heart");
            heartIcon.classList.toggle("bxs-heart");
            heartIcon.classList.toggle("liked");

            // Guardar estado en localStorage usando el ID único
            const likedPets = JSON.parse(localStorage.getItem("likedPets")) || {};
            likedPets[cardId] = heartIcon.classList.contains("bxs-heart");
            localStorage.setItem("likedPets", JSON.stringify(likedPets));
        });

        cardsGrid.appendChild(card);
    }

    function mostrarMensajeVacio() {
        const mensaje = document.createElement("div");
        mensaje.className = "no-pets-message";
        mensaje.innerHTML = `
            <i class='bx bx-sad' style='font-size: 3rem; color: #b48a5a; display: block; margin-bottom: 10px;'></i>
            <h3>No hay mascotas disponibles</h3>
            <p>Ve al formulario de adopción para agregar algunas mascotas.</p>
        `;
        cardsGrid.appendChild(mensaje);
    }

    function filtrarMascotas() {
        const filtro = searchBar.value.toLowerCase();
        const pets = JSON.parse(localStorage.getItem("pets")) || [];
        
        cardsGrid.innerHTML = '';
        cardCounter = 0; // 🔹 resetear contador al filtrar

        if (filtro === '') {
            if (pets.length === 0) {
                mostrarMensajeVacio();
            } else {
                pets.forEach(pet => crearCard(pet));
            }
        } else {
            const petsFiltradas = pets.filter(pet => 
                pet.name.toLowerCase().includes(filtro) ||
                pet.raza.toLowerCase().includes(filtro) ||
                pet.especie.toLowerCase().includes(filtro) ||
                pet.desc.toLowerCase().includes(filtro)
            );
            
            if (petsFiltradas.length === 0) {
                const mensaje = document.createElement("div");
                mensaje.className = "no-pets-message";
                mensaje.innerHTML = `
                    <i class='bx bx-search' style='font-size: 3rem; color: #b48a5a; display: block; margin-bottom: 10px;'></i>
                    <h3>No se encontraron mascotas</h3>
                    <p>No hay mascotas que coincidan con "${filtro}"</p>
                `;
                cardsGrid.appendChild(mensaje);
            } else {
                petsFiltradas.forEach(pet => crearCard(pet));
            }
        }
    }

    function generarPatitas() {
        const container = document.getElementById('paw-container');
        const containerWidth = window.innerWidth - sidebarWidth;
        const containerHeight = window.innerHeight;
        const posiciones = [];

        for(let i=0; i<cantidadPatitas; i++) {
            const paw = document.createElement('img');
            paw.src = 'img/pawBackground.png';
            paw.classList.add('paw-bg');

            const tamano = tamanoMin + Math.random() * (tamanoMax - tamanoMin);
            paw.style.width = `${tamano}px`;
            paw.style.height = `${tamano}px`;

            let x, y, intentos = 0;
            do {
                x = sidebarWidth + Math.random() * (containerWidth - tamano);
                y = headerHeight + Math.random() * (containerHeight - headerHeight - tamano);
                intentos++;
            } while(posiciones.some(p => 
                Math.abs(p.x - x) < (p.size + tamano) && Math.abs(p.y - y) < (p.size + tamano)
            ) && intentos < 100);

            posiciones.push({x, y, size: tamano});
            paw.style.left = `${x}px`;
            paw.style.top = `${y}px`;

            paw.style.animationDuration = `${2 + Math.random()*3}s`;

            container.appendChild(paw);
        }
    }

    window.addEventListener('storage', function(e) {
        if (e.key === 'pets') {
            cardsGrid.innerHTML = '';
            cardCounter = 0; // 🔹 resetear contador
            cargarMascotas();
        }
    });

