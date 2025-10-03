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

const cantidadPatitas = 15;
const tamanoMin = 30;
const tamanoMax = 70;
const sidebarWidth = 200; 
const headerHeight = 90;

let cardCounter = 0;
let allPets = [];
let filteredPets = [];

// Likes del usuario (IDs de publicaciones)
let userLikes = [];

// ===== CARGAR LIKES DEL USUARIO AL INICIAR =====
document.addEventListener('DOMContentLoaded', () => {
    cargarMascotasDesdeDB(); // Carga desde la base de datos
    generarPatitas();
    setupEventListeners();
    crearModalComentarios();
    cargarLikesUsuario();
});

// ===== FUNCIONES DE LIKES =====
async function cargarLikesUsuario() {
    try {
        const response = await fetch('get_likes.php');
        const likes = await response.json();
        userLikes = likes.map(Number);
        marcarLikesEnCards();
    } catch (e) {
        userLikes = [];
    }
}

function marcarLikesEnCards() {
    document.querySelectorAll('.card-like').forEach(btn => {
        const id = parseInt(btn.dataset.idPubl);
        if (userLikes.includes(id)) {
            btn.classList.remove('bx-heart');
            btn.classList.add('bxs-heart', 'liked');
        } else {
            btn.classList.remove('bxs-heart', 'liked');
            btn.classList.add('bx-heart');
        }
    });
}

// ===== DELEGACIÓN DE EVENTO GLOBAL PARA LIKE =====
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('card-like')) {
        e.stopPropagation();
        const heartIcon = e.target;
        const idPubl = heartIcon.dataset.idPubl;
        toggleLike(idPubl, heartIcon);
    }
});

async function toggleLike(idPubl, heartIcon) {
    try {
        const response = await fetch('like.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'id_publ=' + encodeURIComponent(idPubl)
        });
        const data = await response.json();
        if (data.liked) {
            heartIcon.classList.remove('bx-heart');
            heartIcon.classList.add('bxs-heart', 'liked');
            heartIcon.style.color = "#e63946";
        } else {
            heartIcon.classList.remove('bxs-heart', 'liked');
            heartIcon.classList.add('bx-heart');
            heartIcon.style.color = "";
        }
    } catch (e) {
        alert("Debes iniciar sesión para dar like.");
    }
}

// ===== FUNCIONES DE GUARDADOS =====
async function toggleGuardado(cardId, petId) {
    try {
        const response = await fetch('guardarGuardado.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_masc: petId })
        });
        const result = await response.json();
        return result.success;
    } catch (e) {
        return false;
    }
}

async function isCardSaved(cardId, petId) {
    try {
        const response = await fetch('obtenerGuardado.php?id_masc=' + encodeURIComponent(petId));
        const result = await response.json();
        return result.saved === true;
    } catch (e) {
        return false;
    }
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
        }
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
    marcarLikesEnCards();
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
    marcarLikesEnCards();
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

// FUNCIONALIDAD PARA CARGAR MASCOTAS 

async function cargarMascotasDesdeDB() {
    try {
        const response = await fetch('obtenerMascotas.php');
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            allPets = result.data.map(mascota => ({
                id: mascota.id_masc,
                name: mascota.nom_masc || "Sin nombre",
                raza: mascota.raza_masc || "Desconocida",
                especie: mascota.especie_masc || "Otro",
                image: mascota.foto_masc ? mascota.foto_masc : "img/default.jpg",
                edad: mascota.edad_masc || "Desconocida",
                salud: mascota.salud_masc || "Desconocida",
                tamano: mascota.tamano_masc || "Desconocida",
                desc: mascota.desc_masc || "Sin descripción",
                adoptado: mascota.estadoAdopt_masc || 0
            }));
            aplicarFiltros();
        } else {
            mostrarMensajeVacio();
        }
    } catch (error) {
        console.error("Error al cargar mascotas:", error);
        mostrarMensajeVacio();
    }
}

//FUNCION ADOPTAR MASCOTAS

async function adoptarMascota(id) {
    try {
        const response = await fetch("adoptarMascota.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "id=" + encodeURIComponent(id)
        });

        const result = await response.json();
        if (result.success) {
            alert("🐾 Mascota adoptada con éxito!");
            cargarMascotasDesdeDB(); // recargar lista desde BD
        } else {
            alert("Error: " + result.message);
        }
    } catch (err) {
        console.error("Error al adoptar:", err);
    }
}

// ===== FUNCIÓN PARA CREAR CARDS =====
function crearCard(pet) {
    const cardId = `card-${pet.id}`;
    let isSaved = false;
    let isLiked = false;
    const isAdopted = pet.adoptado == 1;

    const card = document.createElement("div");
    card.className = "card";
    card.id = cardId;
    card.innerHTML = `
        <div class="card-header">
            <i class='bx bx-bookmark card-bookmark'></i>
            <div class="card-actions">
                <i class='bx bx-message-detail card-comment'></i>
                <i class='bx bx-heart card-like' data-id-publ="${pet.id}"></i>
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
                <p><b>Edad:</b> ${pet.edad}</p>
                <p><b>Estado de adopción:</b> 
                    <span class="adoption-status ${isAdopted ? 'adopted' : 'available'}">
                        ${isAdopted ? 'Adoptado' : 'En Adopción'}
                    </span>
                </p>
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
        </div>
    `;

    // Consultar si está guardado
    isCardSaved(cardId, pet.id).then(saved => {
        isSaved = saved;
        const bookmarkIcon = card.querySelector(".card-bookmark");
        if (isSaved) {
            bookmarkIcon.classList.remove("bx-bookmark");
            bookmarkIcon.classList.add("bxs-bookmark", "saved");
        } else {
            bookmarkIcon.classList.remove("bxs-bookmark", "saved");
            bookmarkIcon.classList.add("bx-bookmark");
        }
    });

    // Evento adoptar (opcional, si quieres que funcione el botón Adoptar con backend)
    const adoptBtn = card.querySelector(".adopt-button");
    adoptBtn.addEventListener("click", async () => {
        await adoptarMascota(pet.id);
    });

    // === Evento botón de adoptar (localStorage) ===
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
    bookmarkIcon.addEventListener("click", async (e) => {
        e.stopPropagation();
        const nowSaved = await toggleGuardado(cardId, pet.id);
        if (nowSaved) {
            bookmarkIcon.classList.remove("bx-bookmark");
            bookmarkIcon.classList.add("bxs-bookmark", "saved");
        } else {
            bookmarkIcon.classList.remove("bxs-bookmark", "saved");
            bookmarkIcon.classList.add("bx-bookmark");
        }
    });

    // CORAZON LIKE

    const heartIcon = card.querySelector(".card-like");
    if (userLikes.includes(Number(pet.id))) {
        heartIcon.classList.remove('bx-heart');
        heartIcon.classList.add('bxs-heart', 'liked');
    } else {
        heartIcon.classList.remove('bxs-heart', 'liked');
        heartIcon.classList.add('bx-heart');
    }

    // === Evento click en comentarios ===
    const commentIcon = card.querySelector(".card-comment");
    const commentSection = card.querySelector(".comment-section");
    const commentInput = card.querySelector(".comment-input");
    const commentBtn = card.querySelector(".comment-btn");
    const commentList = card.querySelector(".comment-list");
    mostrarComentariosBD(pet.id, commentList);
    commentIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        const isVisible = commentSection.style.display === "block";
        commentSection.style.display = isVisible ? "none" : "block";
        if (!isVisible) {
            setTimeout(() => commentInput.focus(), 100);
        }
    });
    const enviarComentario = async () => {
        const texto = commentInput.value.trim();
        if (texto !== "") {
            await guardarComentarioBD(pet.id, texto);
            commentInput.value = "";
            mostrarComentariosBD(pet.id, commentList);
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
async function guardarComentarioBD(id_masc, texto) {
    try {
        const response = await fetch('comentarios.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_masc: id_masc, comentario: texto, usuario: 'Anónimo' })
        });
        const result = await response.json();
        return result.success;
    } catch (e) {
        return false;
    }
}

async function mostrarComentariosBD(id_masc, container) {
    container.innerHTML = "";
    try {
        const response = await fetch('comentarios.php?id_masc=' + encodeURIComponent(id_masc));
        const result = await response.json();
        if (result.success && result.comentarios.length > 0) {
            result.comentarios.forEach(comentario => {
                const div = document.createElement("div");
                div.className = "comment-item";
                div.innerHTML = '💬 ' + comentario.texto +
                    (comentario.usuario ? ` <span style=\"color:#888;font-size:0.9em;\">- ${comentario.usuario}</span>` : '') +
                    (comentario.fecha ? ` <span style=\"color:#bbb;font-size:0.8em;\">[${comentario.fecha}]</span>` : '');
                container.appendChild(div);
            });
        } else {
            container.innerHTML = '<div class="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</div>';
        }
        container.scrollTop = container.scrollHeight;
    } catch (e) {
        container.innerHTML = '<div class="no-comments">No se pudieron cargar comentarios.</div>';
    }
}

// ===== FUNCIONES DE MODAL =====
function crearModalComentarios() {
    var modal = document.createElement("div");
    modal.id = "modal-comentarios";
    modal.style.display = "none";
    modal.innerHTML = '<div class="modal-content">' +
        '<span class="close-btn">&times;</span>' +
        '<h2 id="modal-title"></h2>' +
        '<div id="modal-comments"></div>' +
        '</div>';
    document.body.appendChild(modal);
    modal.querySelector(".close-btn").addEventListener("click", function() {
        modal.style.display = "none";
    });
    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

function abrirModalComentarios(cardId, petName) {
    var modal = document.getElementById("modal-comentarios");
    var title = modal.querySelector("#modal-title");
    var commentsDiv = modal.querySelector("#modal-comments");
    title.textContent = "Comentarios de " + petName;
    commentsDiv.innerHTML = "";
    var comentarios = JSON.parse(localStorage.getItem("comentarios")) || {};
    var lista = comentarios[cardId] || [];
    if (lista.length === 0) {
        commentsDiv.innerHTML = '<div class="no-comments">No hay comentarios aún.</div>';
    } else {
        for (var i = 0; i < lista.length; i++) {
            var comentario = lista[i];
            var div = document.createElement("div");
            div.className = "comment-item";
            if (typeof comentario === 'string') {
                div.innerHTML = '💬 ' + comentario;
            } else {
                div.innerHTML = '💬 ' + comentario.texto;
            }
            commentsDiv.appendChild(div);
        }
    }
    modal.style.display = "flex";
}

// ===== FUNCIÓN PARA GENERAR PATITAS ANIMADAS =====
function generarPatitas() {
    var container = document.getElementById('paw-container');
    if (!container) {
        console.warn('No se encontró el contenedor de patitas (#paw-container)');
        return;
    }
    // Limpiar patitas previas si las hay
    container.innerHTML = '';
    var containerWidth = window.innerWidth - sidebarWidth;
    var containerHeight = window.innerHeight;
    var posiciones = [];
    for(var i=0; i<cantidadPatitas; i++) {
        var paw = document.createElement('img');
        paw.src = 'img/pawBackground.png';
        paw.className = 'paw-bg';
        var tamano = tamanoMin + Math.random() * (tamanoMax - tamanoMin);
        paw.style.width = tamano + 'px';
        paw.style.height = tamano + 'px';
        var x, y, intentos = 0;
        do {
            x = sidebarWidth + Math.random() * (containerWidth - tamano);
            y = headerHeight + Math.random() * (containerHeight - headerHeight - tamano);
            intentos++;
        } while(posiciones.some(function(p) {
            return Math.abs(p.x - x) < (p.size + tamano) && Math.abs(p.y - y) < (p.size + tamano);
        }) && intentos < 100);
        posiciones.push({x: x, y: y, size: tamano});
        paw.style.left = x + 'px';
        paw.style.top = y + 'px';
        paw.style.animationDuration = (2 + Math.random()*3) + 's';
        container.appendChild(paw);
    }
}