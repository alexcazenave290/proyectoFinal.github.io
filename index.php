<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Casa Patitas</title>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="style.css">
    <style>
        /* ===== Encabezado con Filtros ===== */
        .header {
            width: 90%;
            max-width: 1200px;
            margin: 24px auto 18px auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #b48a5a;
            border-radius: 15px;
            padding: 20px;
            gap: 15px;
            box-shadow: 0 4px 15px rgba(180, 138, 90, 0.3);
        }

        .search-container {
            display: flex;
            align-items: center;
            gap: 15px;
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
        }

        .search-bar {
            width: 300px;
            padding: 12px 18px;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            background: #fffbe6;
            font-weight: bold;
            text-align: center;
            outline: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }

        .search-bar:focus {
            transform: scale(1.02);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .filters-toggle {
            background: #8b4513;
            color: #fffbe6;
            border: none;
            padding: 12px 20px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .filters-toggle:hover {
            background: #654321;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .filters-container {
            width: 100%;
            display: none;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            padding-top: 15px;
            border-top: 2px solid #8b4513;
            animation: slideDown 0.3s ease-out;
        }

        .filters-container.active {
            display: grid;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .filter-label {
            font-weight: bold;
            color: #fffbe6;
            font-size: 0.9rem;
            text-align: center;
        }

        .filter-select {
            padding: 10px 12px;
            border: none;
            border-radius: 8px;
            background: #fffbe6;
            font-size: 0.95rem;
            cursor: pointer;
            outline: none;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .filter-select:hover, .filter-select:focus {
            background: #fff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        .clear-filters {
            background: #e63946;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            align-self: end;
            box-shadow: 0 2px 5px rgba(230, 57, 70, 0.3);
        }

        .clear-filters:hover {
            background: #dc2626;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(230, 57, 70, 0.4);
        }

        .active-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
            justify-content: center;
        }

        .filter-tag {
            background: #8b4513;
            color: #fffbe6;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 5px;
            animation: fadeIn 0.3s ease;
        }

        .filter-tag .remove-tag {
            cursor: pointer;
            font-weight: bold;
            margin-left: 5px;
            transition: color 0.2s ease;
        }

        .filter-tag .remove-tag:hover {
            color: #ff6b6b;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
        
        /* CODIGO PARA EL BOTON DE INICIAR SESIÓN  */
        .Acceder-button {
            position: absolute;
            top: 20px;          
            right: 20px;       
            background-color: #b48a5a; 
            color: #fffbe6;            
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;     
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
            z-index: 100;
        }

        .Acceder-button:hover {
            transform: scale(1.05); 
            background-color: #000000;
        }
    
        /* ===== Cards ===== */
        .cards-grid {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2.5rem 2rem;
            justify-items: center;
            margin: 2.5rem 0;
            padding: 0 20px;
        }

        .card {
            background: #b48a5a;
            border-radius: 18px;
            box-shadow: 0 2px 12px #b48a5a55;
            width: 320px;
            margin: 20px auto;
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: 
                transform 0.35s cubic-bezier(.4,1.5,.6,1),
                box-shadow 0.35s cubic-bezier(.4,1.5,.6,1);
        }

        .card:hover {
            transform: translateY(-16px) scale(1.035) rotate(-2deg);
            box-shadow: 0 8px 32px #b48a5a88;
            z-index: 2;
        }

        .card-header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 8px 14px 0 14px;
            font-size: 1.2rem;
            color: #5a4326;
        }

        .card-bookmark {
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .card-bookmark:hover {
            color: #f4a261;
            transform: scale(1.1);
        }

        .card-bookmark.saved {
            color: #f4a261;
            transform: scale(1.1);
        }

        .card-actions {
            display: flex;
            gap: 10px;
        }

        .card-comment {
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .card-comment:hover {
            color: #8b4513;
            transform: scale(1.1);
        }

        .card-img {
            width: 220px;
            height: 220px;
            object-fit: cover;
            border-radius: 12px;
            margin: 12px auto;
            display: block;
            background: #fff;
            box-shadow: 0 2px 8px #fff8;
        }

        .card-body {
            padding: 10px 18px 18px 18px;
            width: 100%;
            text-align: center;
        }

        .card-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: bold;
            font-size: 1.1rem;
            margin-bottom: 8px;
        }

        .card-title {
            font-size: 1.3rem;
            color: #2d2d2d;
            margin: 8px 0;
            font-weight: bold;
        }

        .card-like {
            cursor: pointer;
            transition: transform 0.3s ease, color 0.3s ease;
            color: #5a4326;
            font-size: 1.3rem;
        }

        .card-like.liked {
            color: #e63946;
            transform: scale(1.2);
        }

        .card-desc {
            font-size: 0.95rem;
            color: #222;
            margin-top: 6px;
        }

        .card-details {
            display: none;
            margin-top: 10px;
            font-size: 0.9rem;
            text-align: left;
            background: #fffbe6;
            border-radius: 8px;
            padding: 8px;
        }

        .card:hover .card-details {
            display: block;
        }

        /* ===== Estado de Adopción ===== */
        .adoption-status {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.85rem;
            margin-top: 5px;
            border: 2px solid;
            transition: all 0.3s ease;
        }

        .adoption-status.available {
            background: #d4edda;
            color: #155724;
            border-color: #28a745;
        }

        .adoption-status.adopted {
            background: #f8d7da;
            color: #721c24;
            border-color: #dc3545;
        }

        /* ===== Botón de Adoptar ===== */
        .adopt-button {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            font-size: 1rem;
            margin-top: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            width: 100%;
        }

        .adopt-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
            background: linear-gradient(135deg, #218838 0%, #1aa179 100%);
        }

        .adopt-button:active {
            transform: translateY(0);
        }

        .adopt-button.adopted {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            cursor: not-allowed;
            box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
        }

        .adopt-button.adopted:hover {
            transform: none;
            box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
        }

        /* ===== Sección de Comentarios ===== */
        .comment-section {
            margin-top: 15px;
            background: #fffbe6;
            border: 2px solid #8b4513;
            border-radius: 12px;
            padding: 15px;
            display: none;
            animation: slideDown 0.3s ease-out;
        }

        .comment-input-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .comment-input {
            flex: 1;
            padding: 10px 12px;
            border: 2px solid #8b4513;
            border-radius: 8px;
            background: #fff;
            font-size: 0.9rem;
            outline: none;
            resize: none;
            min-height: 38px;
            max-height: 80px;
            font-family: inherit;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .comment-input:focus {
            border-color: #654321;
            box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
        }

        .comment-btn {
            background: #d2691e;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(210, 105, 30, 0.3);
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .comment-btn:hover {
            background: #b8651c;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(210, 105, 30, 0.4);
        }

        .comment-list {
            max-height: 150px;
            overflow-y: auto;
            border-top: 1px solid #8b4513;
            padding-top: 10px;
            margin-top: 10px;
        }

        .comment-list:empty {
            border-top: none;
            padding-top: 0;
            margin-top: 0;
        }

        .comment-item {
            background: rgba(139, 69, 19, 0.1);
            border-left: 3px solid #8b4513;
            padding: 8px 12px;
            margin-bottom: 8px;
            border-radius: 6px;
            font-size: 0.85rem;
            color: #333;
            line-height: 1.4;
            transition: background-color 0.2s ease;
        }

        .comment-item:hover {
            background: rgba(139, 69, 19, 0.15);
        }

        .no-comments {
            text-align: center;
            color: #8b4513;
            font-style: italic;
            font-size: 0.9rem;
            padding: 10px;
        }

        /* ===== Mensaje cuando no hay mascotas ===== */
        .no-pets-message {
            text-align: center;
            color: #666;
            font-size: 1.2rem;
            margin: 50px 0;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
            width: 400px;
            margin-left: auto;
            margin-right: auto;
        }

        /* ===== Patitas animadas ===== */
        #paw-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }

        .paw-bg {
            position: absolute;
            user-select: none;
            animation: flotar 3s ease-in-out infinite;
        }

        @keyframes flotar {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
            50% { transform: translateY(-10px) rotate(10deg); opacity: 1; }
            100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
        }

        /* ===== Scrollbar personalizada ===== */
        .comment-list::-webkit-scrollbar {
            width: 6px;
        }

        .comment-list::-webkit-scrollbar-track {
            background: rgba(139, 69, 19, 0.1);
            border-radius: 3px;
        }

        .comment-list::-webkit-scrollbar-thumb {
            background: #8b4513;
            border-radius: 3px;
        }

        /* ===== Modal de comentarios ===== */
        #modal-comentarios {
            position: fixed;
            top:0; left:0;
            width:100%; height:100%;
            background: rgba(0,0,0,0.6);
            display:flex; align-items:center; justify-content:center;
            z-index: 2000;
        }
        #modal-comentarios .modal-content {
            background:#fffbe6;
            border:2px solid #8b4513;
            border-radius:12px;
            padding:20px;
            width:400px;
            max-height:70%;
            overflow-y:auto;
            box-shadow:0 4px 20px rgba(0,0,0,0.3);
            animation: zoomIn 0.3s ease;
        }
        #modal-comentarios .close-btn {
            float:right;
            font-size:1.5rem;
            cursor:pointer;
            color:#8b4513;
        }
        #modal-comentarios .close-btn:hover {
            color:#654321;
        }
        @keyframes zoomIn {
            from {transform:scale(0.7); opacity:0;}
            to {transform:scale(1); opacity:1;}
        }
        #modal-comments .comment-item {
            background: rgba(139, 69, 19, 0.1);
            border-left: 3px solid #8b4513;
            padding: 10px 12px;
            margin-bottom: 8px;
            border-radius: 6px;
            font-size: 0.9rem;
            color: #333;
            line-height: 1.4;
        }

        /* ===== Responsive Design ===== */
        @media (max-width: 768px) {
            .header {
                width: 95%;
                padding: 15px;
            }

            .search-container {
                flex-direction: column;
                gap: 10px;
            }

            .search-bar {
                width: 100%;
                max-width: 300px;
            }

            .filters-container {
                grid-template-columns: 1fr;
                gap: 10px;
            }

            .cards-grid {
                grid-template-columns: 1fr;
                padding: 0 10px;
            }
        }

        #profile-circle:hover {
            background: #f0f0f0;
            transition: background 0.2s;
        }

        .profile-menu {
            display: none;
            position: absolute;
            top: 48px;
            right: 0;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            min-width: 160px;
            overflow: hidden;
            animation: fadeDown 0.25s;
            z-index: 300;
        }

        .profile-menu.open {
            display: block;
            animation: fadeDown 0.25s;
        }

        .profile-menu ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .profile-menu li {
            padding: 14px 22px;
            cursor: pointer;
            color: #8b4513;
            font-weight: 500;
            transition: background 0.2s, color 0.2s;
        }

        .profile-menu li:hover {
            background: #f0f0f0;
            color: #b48a5a;
        }

        @keyframes fadeDown {
            from { opacity: 0; transform: translateY(-10px);}
            to { opacity: 1; transform: translateY(0);}
        }


        #perfil-modal {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .perfil-modal-bg {
            position: absolute;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.35);
            backdrop-filter: blur(4px);
            z-index: 1;
            animation: fadeInBg 0.3s;
        }

        @keyframes fadeInBg {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .perfil-modal-card {
            position: relative;
            z-index: 2;
            background: #fffbe6;
            border-radius: 18px;
            box-shadow: 0 8px 32px #b48a5a88;
            padding: 36px 32px 28px 32px;
            min-width: 340px;
            max-width: 95vw;
            animation: zoomInPerfil 0.3s;
        }

        @keyframes zoomInPerfil {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .close-perfil-modal {
            position: absolute;
            top: 14px;
            right: 18px;
            font-size: 2rem;
            color: #b48a5a;
            cursor: pointer;
            font-weight: bold;
            transition: color 0.2s;
        }
        .close-perfil-modal:hover {
            color: #e63946;
        }

        #perfil-modal-content {
            margin-top: 10px;
        }

        .perfil-info-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 14px;
            font-size: 1.1rem;
        }
        .perfil-info-label {
            font-weight: bold;
            color: #8b4513;
            min-width: 110px;
        }
        .perfil-info-value {
            color: #333;
            word-break: break-all;
        }
    </style>
</head> 
<body>
<a href="login.html" class="Acceder-button" id="login-btn">Acceder</a>

<div class="container-main">
    <aside class="sidebar">
        <div class="logo-menu">
            <img src="./img/logoUpon.png" alt="Logo" class="logo">
            <span class="menu-icon">&#9776;</span>
        </div>
        <nav>
            <ul>
                <li><a href="index.html" style="background: #8b4513; border-radius: 8px;">Inicio</a></li>
                <li><a href="PestañaDonaciones.html">Donaciones</a></li>
                <li><a href="SobreNosotros.html">Sobre Nosotros</a></li>
                <li><a href="Asociaciones.html">Asociaciones</a></li>
                <li><a href="RecursosLegales.html">Recursos Legales</a></li>
                <li><a href="guardados.html">Guardados</a></li>
            </ul>
        </nav>
    </aside>

    <main class="main-content">
        <header class="header">
        <div id="profile-icon" style="display:none; position:absolute; top:7vh; right:15vh; z-index:200;">
            <div id="profile-circle" style="width:40px;height:40px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 5px #ccc;cursor:pointer;transition:background 0.2s;">
                <i class='bx bx-user' style="font-size:2rem;color:#b48a5a;"></i>
            </div>
            <div id="profile-menu" class="profile-menu">
                <ul>
                    <li id="ver-perfil">Ver Perfil</li>
                    <li id="editar-perfil">Editar Perfil</li>
                    <li id="logout">Deslogearse</li>
                </ul>
            </div>
        </div>
            <div class="search-container">
                <input type="text" placeholder="Buscar por nombre o descripción..." class="search-bar" id="searchBar">
                <button class="filters-toggle" id="filtersToggle">
                    <i class='bx bx-filter-alt'></i>
                    Filtros Avanzados
                </button>
            </div>
            
            <div class="filters-container" id="filtersContainer">
                <div class="filter-group">
                    <label class="filter-label">Especie</label>
                    <select class="filter-select" id="especieFilter">
                    </select>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">Raza</label>
                    <select class="filter-select" id="razaFilter">
                    </select>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">Tamaño</label>
                    <select class="filter-select" id="tamanoFilter">
                    </select>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">Estado de Salud</label>
                    <select class="filter-select" id="saludFilter">
                    </select>
                </div>
                
                <button class="clear-filters" id="clearFilters">
                    <i class='bx bx-x'></i>
                    Limpiar Filtros
                </button>
            </div>
            
            <div class="active-filters" id="activeFilters"></div>
        </header>

        <div class="background-paws">
            <div class="cards-grid" id="cardsGrid"></div>
        </div>
    </main>
</div>

<div id="paw-container"></div>

<!-- Enlace al archivo JavaScript externo -->
<script src="script.js"></script>
<script>
document.addEventListener("DOMContentLoaded", async () => {
    const loginBtn = document.getElementById("login-btn");
    const profileIcon = document.getElementById("profile-icon");

    try {
        const res = await fetch("session_status.php");
        const data = await res.json();
        if (data.logged) {
            loginBtn.style.display = "none";
            profileIcon.style.display = "block";
        } else {
            loginBtn.style.display = "block";
            profileIcon.style.display = "none";
        }
    } catch (e) {
        loginBtn.style.display = "block";
        profileIcon.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const loginBtn = document.getElementById("login-btn");
    const profileIcon = document.getElementById("profile-icon");
    const profileCircle = document.getElementById("profile-circle");
    const profileMenu = document.getElementById("profile-menu");

    try {
        const res = await fetch("session_status.php");
        const data = await res.json();
        if (data.logged) {
            loginBtn.style.display = "none";
            profileIcon.style.display = "block";
        } else {
            loginBtn.style.display = "block";
            profileIcon.style.display = "none";
        }
    } catch (e) {
        loginBtn.style.display = "block";
        profileIcon.style.display = "none";
    }

    // Toggle menú de perfil
    profileCircle.addEventListener("click", (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle("open");
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener("click", () => {
        profileMenu.classList.remove("open");
    });

    // Opciones del menú
    document.getElementById("logout").onclick = async () => {
        await fetch("logout.php");
        window.location.reload();
    };
});

document.getElementById("ver-perfil").onclick = async () => {
    // Mostrar modal
    const modal = document.getElementById("perfil-modal");
    const modalContent = document.getElementById("perfil-modal-content");
    modal.style.display = "flex";
    modalContent.innerHTML = "<div style='text-align:center;padding:30px 0;'>Cargando...</div>";

    // Traer datos del perfil
    try {
        const res = await fetch("get_perfil.php");
        const data = await res.json();
        if (data.success) {
            const p = data.perfil;
            modalContent.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:18px;">
                    <div style="width:70px;height:70px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 8px #b48a5a55;">
                        <i class='bx bx-user' style="font-size:3rem;color:#b48a5a;"></i>
                    </div>
                    <div style="font-size:1.3rem;font-weight:bold;color:#8b4513;margin-top:10px;">${p.nom_us ?? ''} ${p.apell_us ?? ''}</div>
                </div>
                <div class="perfil-info-row"><span class="perfil-info-label">Gmail:</span><span class="perfil-info-value">${p.mail_us}</span></div>
                <div class="perfil-info-row"><span class="perfil-info-label">CI:</span><span class="perfil-info-value">${p.ci_us ?? '-'}</span></div>
                <div class="perfil-info-row"><span class="perfil-info-label">Teléfono:</span><span class="perfil-info-value">${p.tel_us ?? '-'}</span></div>
                <div class="perfil-info-row"><span class="perfil-info-label">Dirección:</span><span class="perfil-info-value">${p.direccion_us ?? '-'}</span></div>
            `;
        } else {
            modalContent.innerHTML = `<div style='color:#e63946;text-align:center;padding:30px 0;'>${data.message || "No se pudo cargar el perfil."}</div>`;
        }
    } catch (e) {
        modalContent.innerHTML = `<div style='color:#e63946;text-align:center;padding:30px 0;'>Error al conectar con el servidor.</div>`;
    }
};

// Cerrar modal al clickear la X o el fondo borroso
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("perfil-modal");
    if (!modal) return;
    modal.querySelector(".close-perfil-modal").onclick = () => { modal.style.display = "none"; };
    modal.querySelector(".perfil-modal-bg").onclick = () => { modal.style.display = "none"; };
});

document.getElementById("editar-perfil").onclick = async () => {
    const modal = document.getElementById("perfil-modal");
    const modalContent = document.getElementById("perfil-modal-content");
    modal.style.display = "flex";
    modalContent.innerHTML = "<div style='text-align:center;padding:30px 0;'>Cargando...</div>";

    // Traer datos del perfil
    try {
        const res = await fetch("get_perfil.php");
        const data = await res.json();
        if (data.success) {
            const p = data.perfil;
            modalContent.innerHTML = `
                <form id="editar-perfil-form" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                    <div style="width:70px;height:70px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 8px #b48a5a55;">
                        <i class='bx bx-user' style="font-size:3rem;color:#b48a5a;"></i>
                    </div>
                    <input type="text" name="nom_us" placeholder="Nombre" value="${p.nom_us ?? ''}" required style="padding:8px 12px;border-radius:8px;border:1px solid #ccc;width:100%;">
                    <input type="text" name="apell_us" placeholder="Apellido" value="${p.apell_us ?? ''}" required style="padding:8px 12px;border-radius:8px;border:1px solid #ccc;width:100%;">
                    <input type="text" name="ci_us" placeholder="CI" value="${p.ci_us ?? ''}" style="padding:8px 12px;border-radius:8px;border:1px solid #ccc;width:100%;">
                    <input type="text" name="tel_us" placeholder="Teléfono" value="${p.tel_us ?? ''}" style="padding:8px 12px;border-radius:8px;border:1px solid #ccc;width:100%;">
                    <input type="text" name="direccion_us" placeholder="Dirección" value="${p.direccion_us ?? ''}" style="padding:8px 12px;border-radius:8px;border:1px solid #ccc;width:100%;">
                    <button type="submit" style="margin-top:10px;padding:10px 24px;border-radius:8px;background:#8b4513;color:#fffbe6;font-weight:bold;border:none;cursor:pointer;">Guardar Cambios</button>
                </form>
                <div style="margin-top:10px;font-size:0.95rem;color:#888;">Gmail: <b>${p.mail_us}</b></div>
            `;

            // Manejar submit
            document.getElementById("editar-perfil-form").onsubmit = async (e) => {
                e.preventDefault();
                const form = e.target;
                const payload = {
                    nom_us: form.nom_us.value,
                    apell_us: form.apell_us.value,
                    ci_us: form.ci_us.value,
                    tel_us: form.tel_us.value,
                    direccion_us: form.direccion_us.value
                };
                const res = await fetch("update_perfil.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                const result = await res.json();
                if (result.success) {
                    modalContent.innerHTML = "<div style='color:#28a745;text-align:center;padding:30px 0;'>¡Perfil actualizado!</div>";
                    setTimeout(() => { modal.style.display = "none"; }, 1200);
                } else {
                    alert(result.message || "Error al actualizar");
                }
            };
        } else {
            modalContent.innerHTML = `<div style='color:#e63946;text-align:center;padding:30px 0;'>${data.message || "No se pudo cargar el perfil."}</div>`;
        }
    } catch (e) {
        modalContent.innerHTML = `<div style='color:#e63946;text-align:center;padding:30px 0;'>Error al conectar con el servidor.</div>`;
    }
};

</script>

<div id="perfil-modal" style="display:none;">
    <div class="perfil-modal-bg"></div>
    <div class="perfil-modal-card">
        <span class="close-perfil-modal">&times;</span>
        <div id="perfil-modal-content"></div>
    </div>
</div>

</body>
</html>
