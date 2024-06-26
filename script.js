document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const movieTitleInput = document.getElementById('movie-title');
    const resultsContainer = document.getElementById('results');
    const historialContainer = document.getElementById('historial');
    const favoritesContainer = document.getElementById('favorites');

    const API_URL = 'https://www.omdbapi.com/';
    const API_KEY = '19a42194';

    searchBtn?.addEventListener('click', async () => {
        const movieTitle = movieTitleInput.value.trim();
        if (movieTitle) {
            resultsContainer.innerHTML = 'Buscando...';
            try {
                const response = await fetch(`${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(movieTitle)}`);
                const data = await response.json();
                if (data.Response === 'True') {
                    showResults(data);
                    saveToHistory(data);
                } else {
                    resultsContainer.innerHTML = 'No se encontraron resultados.';
                }
            } catch (error) {
                resultsContainer.innerHTML = 'Error al buscar datos.';
            }
        } else {
            resultsContainer.innerHTML = 'Ingresa el título de la película.';
        }
    });

    function showResults(movie) {
        console.log('showresults', movie)
        resultsContainer.innerHTML = `
            <h2>${movie.Title}</h2>
            <p><strong>Año:</strong> ${movie.Year}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <img src="${movie.Poster}" alt="Poster" onerror="this.onerror=null; this.src='no_image.png';">
            <button onclick="addToFavorites(\`${encodeURIComponent(JSON.stringify(movie))}\`)">Agregar a favoritos</button>
        `;
    }

    function saveToHistory(movie) {
        console.log('saveToHistory', movie)
        let history = JSON.parse(localStorage.getItem('movieHistory')) || [];
        history.push(movie);
        localStorage.setItem('movieHistory', JSON.stringify(history));
    }

    function showHistory() {
        // console.log('showHistory', movie)
        const history = JSON.parse(localStorage.getItem('movieHistory')) || [];
        historialContainer.innerHTML = history.length === 0 ? 'No hay historial.' : '';
        history.forEach(movie => {
            historialContainer.innerHTML += `
                <h3>${movie.Title} (${movie.Year})</h3>
                <img src="${movie.Poster}" alt="Poster" onerror="this.onerror=null; this.src='no_image.png';">
            `;
        });
    }

    if (historialContainer) {
        showHistory();
    }

    window.addToFavorites = (movie) => {
        console.log('addToFavorites', movie)
        const movieData = JSON.parse(decodeURIComponent(movie));
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const exists = favorites.find(fav => fav.Title === movieData.Title);
        if (!exists) {
            favorites.push(movieData);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Añadido a favoritos');
        } else {
            alert('Ya está en favoritos');
        }
    };

    window.showFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesContainer.innerHTML = favorites.length === 0 ? 'No hay favoritos.' : '';
        favorites.forEach(movie => {
            favoritesContainer.innerHTML += `
                <div class="favorite-item">
                    <h3>${movie.Title} (${movie.Year})</h3>
                    <p><strong>Director:</strong> ${movie.Director}</p>
                    <img src="${movie.Poster}" alt="Poster" class="favorite-image" onerror="this.onerror=null; this.src='no_image.png';">
                    <button onclick="removeFromFavorites('${movie.Title}')">Eliminar de favoritos</button>
                </div>
            `;
        });
    };

    window.removeFromFavorites = (title) => {
        // console.log('removeFavorites', movie)
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(movie => movie.Title !== title);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showFavorites();
    };

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(error => console.error('Service Worker Registration failed:', error));
    }
});
