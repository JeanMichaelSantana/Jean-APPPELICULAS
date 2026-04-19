// main.js - Películas TMDB (API Key directa)
const API_KEY = "f7bacd5b628efa9882c02ad57eebd689";   // ←←← REEMPLAZA CON TU CLAVE REAL

const moviesContainer = document.getElementById('moviesContainer');
const paginationContainer = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');

let currentPage = 1;
let currentQuery = '';
let totalPages = 1;

// URL base de imágenes
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// Cargar películas
async function loadMovies(page = 1, query = '') {
    let url = '';
    if (query) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=${page}`;
    } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.results) {
            totalPages = Math.min(data.total_pages, 10); // máximo 10 páginas
            renderMovies(data.results.slice(0, 12));   // exactamente 12 por página
            renderPagination();
        }
    } catch (error) {
        console.error(error);
        moviesContainer.innerHTML = `<div class="col-12 text-center text-danger">Error al cargar películas</div>`;
    }
}

// Renderizar tarjetas (4 por fila)
function renderMovies(movies) {
    moviesContainer.innerHTML = '';

    movies.forEach(movie => {
        const cardHTML = `
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="card h-100">
                    <img src="${movie.poster_path ? IMG_BASE + movie.poster_path : 'https://picsum.photos/id/1015/500/750'}" 
                         class="card-img-top" alt="${movie.title}">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title">${movie.title}</h5>
                            <span class="vote-badge">${movie.vote_average.toFixed(1)} ★</span>
                        </div>
                        <p class="synopsis flex-grow-1">${movie.overview || 'Sin sinopsis disponible.'}</p>
                        <small class="text-muted">${new Date(movie.release_date).getFullYear()}</small>
                    </div>
                </div>
            </div>
        `;
        moviesContainer.innerHTML += cardHTML;
    });
}

// Paginación
function renderPagination() {
    paginationContainer.innerHTML = `
        <nav>
            <ul class="pagination">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Anterior</a>
                </li>
                ${Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                    const pageNum = i + 1;
                    return `<li class="page-item ${pageNum === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changePage(${pageNum}); return false;">${pageNum}</a></li>`;
                }).join('')}
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Siguiente</a>
                </li>
            </ul>
        </nav>
    `;
}

window.changePage = function(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    loadMovies(currentPage, currentQuery);
};

// Búsqueda dinámica (live search)
let timeout;
searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        currentQuery = searchInput.value.trim();
        currentPage = 1;
        loadMovies(1, currentQuery);
    }, 400);
});

// Iniciar
window.addEventListener('load', () => {
    if (!API_KEY || API_KEY === "PEGA_AQUÍ_TU_API_KEY_REAL") {
        alert("⚠️ Reemplaza 'PEGA_AQUÍ_TU_API_KEY_REAL' con tu clave real de TMDB en main.js");
    }
    loadMovies(1);
});
