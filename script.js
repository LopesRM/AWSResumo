.gif-intro {
    max-width: 80px; /* Reduz o tamanho do vídeo */
    height: auto; /* Mantém a proporção */
    border-radius: 10px; /* Opcional: bordas arredondadas */
}

// Seleciona o título animado
const tituloAnimado = document.getElementById('titulo-animado');

// Inicializa o contador de cliques
let clickCount = 0;

// Adiciona um evento de clique ao título
tituloAnimado.addEventListener('click', () => {
    clickCount++; // Incrementa o contador

    // Verifica se o contador atingiu 7 cliques
    if (clickCount === 7) {
        // Redireciona para o link do YouTube
        window.location.href = 'https://www.youtube.com/watch?v=6RiIww6jVXw';
    }
});