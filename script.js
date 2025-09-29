// ===== VARIABLES GLOBALES =====
const cardsGrid = document.getElementById('cardsGrid');
const searchBar = document.getElementById('searchBar');
const filtersToggle = document.getElementById('filtersToggle');
const filtersContainer = document.getElementById('filtersContainer');
const especieFilter = document.getElementById('especieFilter');
const razaFilter = document.getElementById('razaFilter');
const tamanoFilter = document.getElementById('tamanoFilter');
const saludFilter = document.getElementById('saludFilter');
const clearFilters = document.getElementById('clearFilters');
const activeFilters = document.getElementById('activeFilters');

// ===== CONFIGURACIÓN =====
const cantidadPatitas = 15;
const tamanoMin = 30;
const tamanoMax = 70;
const sidebarWidth = 200; 
const headerHeight = 90;

let cardCounter = 0;
let allPets = [];
let filteredPets = [];

// Mapeo de razas por especie
const razasPorEspecie = {
    perro: ['Labrador', 'Golden Retriever', 'Bulldog', 'Pastor Alemán', 'Chihuahua', 'Poodle', 'Mestizo'],
    gato: ['Persa', 'Siamés', 'Maine Coon', 'Ragdoll', 'Bengalí', 'Británico', 'Mestizo'],
    conejo: ['Holandés', 'Angora', 'Mini Lop', 'Rex', 'Lionhead'],
    hamster: ['Sirio', 'Roborovski', 'Campbell', 'Winter White'],
    ave: ['Canario', 'Periquito', 'Ninfa', 'Agapornis', 'Jilguero'],
    otro: ['Mestizo', 'Criollo', 'Sin definir']
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    cargarMascotas();
    generarPatitas();
    setupEventListeners();
    crearModalComentarios();
    actualizarTodasLasOpciones();
});

// ===== FUNCIONES DE GUARDADOS =====
function toggleGuardado(cardId) {
    const savedPets = JSON.parse(localStorage.getItem("savedPets")) || {};
    savedPets[cardId] = !savedPets[cardId];
    localStorage.setItem("savedPets", JSON.stringify(savedPets));
    
    window.dispatchEvent(new Event('savedPetsUpdated'));
    
    return savedPets[cardId];
}

function isCardSaved(cardId) {
    const savedPets = JSON.parse(localStorage.getItem("savedPets")) || {};
    return savedPets[cardId] === true;
}

function actualizarIconosGuardados() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const cardId = card.id;
        const bookmarkIcon = card.querySelector('.card-bookmark');
        if (bookmarkIcon) {
            const isSaved = isCardSaved(cardId);
            if (isSaved) {
                bookmarkIcon.classList.remove('bx-bookmark');
                bookmarkIcon.classList.add('bxs-bookmark', 'saved');
            } else {
                bookmarkIcon.classList.remove('bxs-bookmark', 'saved');
                bookmarkIcon.classList.add('bx-bookmark');
            }
        }
    });
}

// ===== FUNCIONES DE ADOPCIÓN =====
function toggleAdopcion(cardId) {
    const adoptedPets = JSON.parse(localStorage.getItem("adoptedPets")) || {};
    adoptedPets[cardId] = !adoptedPets[cardId];
    localStorage.setItem("adoptedPets", JSON.stringify(adoptedPets));
    
    window.dispatchEvent(new Event('adoptedPetsUpdated'));
    
    return adoptedPets[cardId];
}

function isCardAdopted(cardId) {
    const adoptedPets = JSON.parse(localStorage.getItem("adoptedPets")) || {};
    return adoptedPets[cardId] === true;
}

function actualizarEstadosAdopcion() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const cardId = card.id;
        const adoptBtn = card.querySelector('.adopt-button');
        const statusBadge = card.querySelector('.adoption-status');
        
        if (adoptBtn && statusBadge) {
            const isAdopted = isCardAdopted(cardId);
            
            if (isAdopted) {
                adoptBtn.classList.add('adopted');
                adoptBtn.innerHTML = '<i class="bx bx-check-circle"></i> Adoptado';
                adoptBtn.disabled = true;
                statusBadge.classList.remove('available');
                statusBadge.classList.add('adopted');
                statusBadge.textContent = 'Adoptado';
            } else {
                adoptBtn.classList.remove('adopted');
                adoptBtn.innerHTML = '<i class="bx bxs-heart"></i> Adoptar';
                adoptBtn.disabled = false;
                statusBadge.classList.remove('adopted');
                statusBadge.classList.add('available');
                statusBadge.textContent = 'En Adopción';
            }
        }
    });
}

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====
function setupEventListeners() {
    searchBar.addEventListener('input', aplicarFiltros);
    filtersToggle.addEventListener('click', toggleFilters);
    especieFilter.addEventListener('change', actualizarRazas);
    especieFilter.addEventListener('change', aplicarFiltros);
    razaFilter.addEventListener('change', aplicarFiltros);
    tamanoFilter.addEventListener('change', aplicarFiltros);
    saludFilter.addEventListener('change', aplicarFiltros);
    clearFilters.addEventListener('click', limpiarFiltros);
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'pets') {
            cardsGrid.innerHTML = '';
            cardCounter = 0; 
            cargarMascotas();
            actualizarTodasLasOpciones();
        }
        if (e.key === 'savedPets') {
            actualizarIconosGuardados();
        }
        if (e.key === 'adoptedPets') {
            actualizarEstadosAdopcion();
        }
    });
    
    window.addEventListener('savedPetsUpdated', function() {
        actualizarIconosGuardados();
    });
    
    window.addEventListener('adoptedPetsUpdated', function() {
        actualizarEstadosAdopcion();
    });
}

// ===== FUNCIONES DE FILTROS =====
function toggleFilters() {
    filtersContainer.classList.toggle('active');
    const icon = filtersToggle.querySelector('i');
    if (filtersContainer.classList.contains('active')) {
        icon.className = 'bx bx-x';
        filtersToggle.innerHTML = '<i class="bx bx-x"></i> Cerrar Filtros';
    } else {
        icon.className = 'bx bx-filter-alt';
        filtersToggle.innerHTML = '<i class="bx bx-filter-alt"></i> Filtros Avanzados';
    }
}

// ===== FUNCIONES PARA ACTUALIZAR OPCIONES DINÁMICAMENTE =====
function actualizarTodasLasOpciones() {
    actualizarEspecies();
    actualizarRazas();
    actualizarTamanos();
    actualizarEstadosSalud();
}

function actualizarEspecies() {
    const especieActual = especieFilter.value;
    especieFilter.innerHTML = '<option value="">Todas las especies</option>';
    
    const especiesUnicas = [...new Set(allPets.map(pet => pet.especie.toLowerCase()))];
    
    especiesUnicas.forEach(especie => {
        const option = document.createElement('option');
        option.value = especie;
        option.textContent = especie.charAt(0).toUpperCase() + especie.slice(1);
        especieFilter.appendChild(option);
    });
    
    if (especieActual && especiesUnicas.includes(especieActual)) {
        especieFilter.value = especieActual;
    }
}

function actualizarTamanos() {
    const tamanoActual = tamanoFilter.value;
    tamanoFilter.innerHTML = '<option value="">Todos los tamaños</option>';
    
    const tamanosUnicos = [...new Set(allPets.map(pet => pet.tamano.toLowerCase()))];
    
    tamanosUnicos.forEach(tamano => {
        const option = document.createElement('option');
        option.value = tamano;
        option.textContent = tamano.charAt(0).toUpperCase() + tamano.slice(1);
        tamanoFilter.appendChild(option);
    });
    
    if (tamanoActual && tamanosUnicos.includes(tamanoActual)) {
        tamanoFilter.value = tamanoActual;
    }
}

function actualizarEstadosSalud() {
    const saludActual = saludFilter.value;
    saludFilter.innerHTML = '<option value="">Todos los estados</option>';
    
    const estadosSaludUnicos = [...new Set(allPets.map(pet => pet.salud.toLowerCase()))];
    
    estadosSaludUnicos.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado;
        option.textContent = estado.charAt(0).toUpperCase() + estado.slice(1);
        saludFilter.appendChild(option);
    });
    
    if (saludActual && estadosSaludUnicos.includes(saludActual)) {
        saludFilter.value = saludActual;
    }
}

function actualizarRazas() {
    const razaActual = razaFilter.value;
    const especieSeleccionada = especieFilter.value;
    razaFilter.innerHTML = '<option value="">Todas las razas</option>';
    
    const razasDisponibles = especieSeleccionada 
        ? allPets.filter(pet => pet.especie.toLowerCase() === especieSeleccionada)
                 .map(pet => pet.raza.toLowerCase())
        : allPets.map(pet => pet.raza.toLowerCase());
    
    const razasUnicas = [...new Set(razasDisponibles)];
    
    razasUnicas.forEach(raza => {
        const option = document.createElement('option');
        option.value = raza;
        option.textContent = raza.charAt(0).toUpperCase() + raza.slice(1);
        razaFilter.appendChild(option);
    });
    
    if (razaActual && razasUnicas.includes(razaActual)) {
        razaFilter.value = razaActual;
    }
}

function aplicarFiltros() {
    const textoBusqueda = searchBar.value.toLowerCase().trim();
    const especieFiltro = especieFilter.value.toLowerCase();
    const razaFiltro = razaFilter.value.toLowerCase();
    const tamanoFiltro = tamanoFilter.value.toLowerCase();
    const saludFiltro = saludFilter.value.toLowerCase();
    
    filteredPets = allPets.filter(pet => {
        const cumpleBusqueda = !textoBusqueda || 
            pet.name.toLowerCase().includes(textoBusqueda) ||
            pet.desc.toLowerCase().includes(textoBusqueda);
            
        const cumpleEspecie = !especieFiltro || 
            pet.especie.toLowerCase().includes(especieFiltro);
            
        const cumpleRaza = !razaFiltro || 
            pet.raza.toLowerCase().includes(razaFiltro);
            
        const cumpleTamano = !tamanoFiltro || 
            pet.tamano.toLowerCase().includes(tamanoFiltro);
            
        const cumpleSalud = !saludFiltro || 
            pet.salud.toLowerCase().includes(saludFiltro);
        
        return cumpleBusqueda && cumpleEspecie && cumpleRaza && cumpleTamano && cumpleSalud;
    });
    
    mostrarMascotas();
    actualizarFiltrosActivos();
}

function limpiarFiltros() {
    searchBar.value = '';
    especieFilter.value = '';
    razaFilter.value = '';
    tamanoFilter.value = '';
    saludFilter.value = '';
    actualizarRazas();
    aplicarFiltros();
}

function removerFiltro(tipoFiltro) {
    switch(tipoFiltro) {
        case 'especie':
            especieFilter.value = '';
            actualizarRazas();
            break;
        case 'raza':
            razaFilter.value = '';
            break;
        case 'tamano':
            tamanoFilter.value = '';
            break;
        case 'salud':
            saludFilter.value = '';
            break;
    }
    aplicarFiltros();
}

function actualizarFiltrosActivos() {
    activeFilters.innerHTML = '';
    
    const filtrosActivos = [];
    
    if (especieFilter.value) {
        filtrosActivos.push({
            tipo: 'Especie',
            valor: especieFilter.options[especieFilter.selectedIndex].text,
            filtro: 'especie'
        });
    }
    
    if (razaFilter.value) {
        filtrosActivos.push({
            tipo: 'Raza',
            valor: razaFilter.options[razaFilter.selectedIndex].text,
            filtro: 'raza'
        });
    }
    
    if (tamanoFilter.value) {
        filtrosActivos.push({
            tipo: 'Tamaño',
            valor: tamanoFilter.options[tamanoFilter.selectedIndex].text,
            filtro: 'tamano'
        });
    }
    
    if (saludFilter.value) {
        filtrosActivos.push({
            tipo: 'Salud',
            valor: saludFilter.options[saludFilter.selectedIndex].text,
            filtro: 'salud'
        });
    }
    
    filtrosActivos.forEach(filtro => {
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        tag.innerHTML = `
            ${filtro.tipo}: ${filtro.valor}
            <span class="remove-tag" onclick="removerFiltro('${filtro.filtro}')">×</span>
        `;
        activeFilters.appendChild(tag);
    });
}

// ===== FUNCIONES DE CARGA Y VISUALIZACIÓN =====
function cargarMascotas() {
    const pets = JSON.parse(localStorage.getItem("pets")) || [];
    allPets = pets;
    
    if (pets.length === 0) {
        mostrarMensajeVacio();
    } else {
        actualizarTodasLasOpciones();
        aplicarFiltros();
    }
}

function mostrarMascotas() {
    cardsGrid.innerHTML = '';
    cardCounter = 0;
    
    if (filteredPets.length === 0) {
        mostrarMensajeSinResultados();
    } else {
        filteredPets.forEach(pet => crearCard(pet));
    }
}

function mostrarMensajeSinResultados() {
    const mensaje = document.createElement("div");
    mensaje.className = "no-pets-message";
    
    const hayFiltros = searchBar.value || especieFilter.value || razaFilter.value || 
                     tamanoFilter.value || saludFilter.value;
    
    if (hayFiltros) {
        mensaje.innerHTML = `
            <i class='bx bx-search' style='font-size: 3rem; color: #b48a5a; display: block; margin-bottom: 10px;'></i>
            <h3>No se encontraron mascotas</h3>
            <p>No hay mascotas que coincidan con los filtros seleccionados</p>
            <button onclick="limpiarFiltros()" style="margin-top: 10px; padding: 10px 20px; background: #b48a5a; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Limpiar filtros
            </button>
        `;
    } else {
        mensaje.innerHTML = `
            <i class='bx bx-sad' style='font-size: 3rem; color: #b48a5a; display: block; margin-bottom: 10px;'></i>
            <h3>No hay mascotas disponibles</h3>
            <p>Ve al formulario de adopción para agregar algunas mascotas.</p>
        `;
    }
    
    cardsGrid.appendChild(mensaje);
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

// ===== FUNCIÓN PARA CREAR CARDS =====
function crearCard(pet) {
    cardCounter++; 
    const cardId = `card-${cardCounter}`;

    const card = document.createElement("div");
    card.className = "card";
    card.id = cardId;

    const likedPets = JSON.parse(localStorage.getItem("likedPets")) || {};
    const isLiked = likedPets[cardId] === true;
    
    const isSaved = isCardSaved(cardId);
    const isAdopted = isCardAdopted(cardId);

    card.innerHTML = `
        <div class="card-header">
            <i class='bx ${isSaved ? "bxs-bookmark saved" : "bx-bookmark"} card-bookmark'></i>
            <div class="card-actions">
                <i class='bx bx-message-detail card-comment'></i>
                <i class='bx ${isLiked ? "bxs-heart liked" : "bx-heart"} card-like'></i>
            </div>
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
                <p><b>Estado de adopción:</b> <span class="adoption-status ${isAdopted ? 'adopted' : 'available'}">${isAdopted ? 'Adoptado' : 'En Adopción'}</span></p>
            </div>
            <button class="adopt-button ${isAdopted ? 'adopted' : ''}" ${isAdopted ? 'disabled' : ''}>
                <i class='bx ${isAdopted ? 'bx-check-circle' : 'bxs-heart'}'></i>
                ${isAdopted ? 'Adoptado' : 'Adoptar'}
            </button>
            <div class="comment-section">
                <div class="comment-input-container">
                    <textarea placeholder="Escribe un comentario sobre ${pet.name}..." class="comment-input"></textarea>
                    <button class="comment-btn">
                        <i class='bx bx-send'></i>
                        Enviar
                    </button>
                </div>
                <div class="comment-list"></div>
            </div>
        </div>`;

    // === Evento botón de adoptar ===
    const adoptBtn = card.querySelector(".adopt-button");
    const statusBadge = card.querySelector(".adoption-status");
    
    adoptBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        if (!isCardAdopted(cardId)) {
            const nowAdopted = toggleAdopcion(cardId);
            
            if (nowAdopted) {
                adoptBtn.classList.add('adopted');
                adoptBtn.innerHTML = '<i class="bx bx-check-circle"></i> Adoptado';
                adoptBtn.disabled = true;
                statusBadge.classList.remove('available');
                statusBadge.classList.add('adopted');
                statusBadge.textContent = 'Adoptado';
            }
        }
    });

    // === Evento click en bookmark (guardar) ===
    const bookmarkIcon = card.querySelector(".card-bookmark");
    bookmarkIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        const nowSaved = toggleGuardado(cardId);
        
        if (nowSaved) {
            bookmarkIcon.classList.remove("bx-bookmark");
            bookmarkIcon.classList.add("bxs-bookmark", "saved");
        } else {
            bookmarkIcon.classList.remove("bxs-bookmark", "saved");
            bookmarkIcon.classList.add("bx-bookmark");
        }
    });

    // === Evento click corazón ===
    const heartIcon = card.querySelector(".card-like");
    heartIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        heartIcon.classList.toggle("bx-heart");
        heartIcon.classList.toggle("bxs-heart");
        heartIcon.classList.toggle("liked");

        const likedPets = JSON.parse(localStorage.getItem("likedPets")) || {};
        likedPets[cardId] = heartIcon.classList.contains("bxs-heart");
        localStorage.setItem("likedPets", JSON.stringify(likedPets));
    });

    // === Evento click en comentarios ===
    const commentIcon = card.querySelector(".card-comment");
    const commentSection = card.querySelector(".comment-section");
    const commentInput = card.querySelector(".comment-input");
    const commentBtn = card.querySelector(".comment-btn");
    const commentList = card.querySelector(".comment-list");

    mostrarComentarios(cardId, commentList);

    commentIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        const isVisible = commentSection.style.display === "block";
        commentSection.style.display = isVisible ? "none" : "block";
        
        if (!isVisible) {
            setTimeout(() => commentInput.focus(), 100);
        }
    });

    const enviarComentario = () => {
        const texto = commentInput.value.trim();
        if (texto !== "") {
            guardarComentario(cardId, texto);
            commentInput.value = "";
            mostrarComentarios(cardId, commentList);
        }
    };

    commentBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        enviarComentario();
    });

    commentInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            enviarComentario();
        }
    });

    commentSection.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // === Evento click izquierdo en la card para abrir modal ===
    card.addEventListener("click", (e) => {
        if (!e.target.closest(".card-like") && 
            !e.target.closest(".card-comment") &&
            !e.target.closest(".card-bookmark") &&
            !e.target.closest(".comment-section") &&
            !e.target.closest(".adopt-button")) {
            
            abrirModalComentarios(cardId, pet.name);
        }
    });

    cardsGrid.appendChild(card);
}

// ===== FUNCIONES DE COMENTARIOS =====
function guardarComentario(cardId, texto) {
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || {};
    if (!comentarios[cardId]) comentarios[cardId] = [];
    comentarios[cardId].push({
        texto: texto,
        fecha: new Date().toLocaleString()
    });
    localStorage.setItem("comentarios", JSON.stringify(comentarios));
}

function mostrarComentarios(cardId, container) {
    container.innerHTML = "";
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || {};
    const lista = comentarios[cardId] || [];
    
    if (lista.length === 0) {
        container.innerHTML = '<div class="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</div>';
        return;
    }
    
    lista.forEach(comentario => {
        const div = document.createElement("div");
        div.className = "comment-item";
        
        if (typeof comentario === 'string') {
            div.innerHTML = `💬 ${comentario}`;
        } else {
            div.innerHTML = `💬 ${comentario.texto}`;
        }
        
        container.appendChild(div);
    });
    
    container.scrollTop = container.scrollHeight;
}

// ===== FUNCIONES DE MODAL =====
function crearModalComentarios() {
    const modal = document.createElement("div");
    modal.id = "modal-comentarios";
    modal.style.display = "none";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2 id="modal-title"></h2>
            <div id="modal-comments"></div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".close-btn").addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

function abrirModalComentarios(cardId, petName) {
    const modal = document.getElementById("modal-comentarios");
    const title = modal.querySelector("#modal-title");
    const commentsDiv = modal.querySelector("#modal-comments");

    title.textContent = "Comentarios de " + petName;
    commentsDiv.innerHTML = "";

    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || {};
    const lista = comentarios[cardId] || [];

    if (lista.length === 0) {
        commentsDiv.innerHTML = '<div class="no-comments">No hay comentarios aún.</div>';
    } else {
        lista.forEach(comentario => {
            const div = document.createElement("div");
            div.className = "comment-item";
            
            if (typeof comentario === 'string') {
                div.innerHTML = `💬 ${comentario}`;
            } else {
                div.innerHTML = `💬 ${comentario.texto}`;
            }
            
            commentsDiv.appendChild(div);
        });
    }

    modal.style.display = "flex";
}

// ===== FUNCIÓN PARA GENERAR PATITAS ANIMADAS =====
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
