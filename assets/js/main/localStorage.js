document.addEventListener("DOMContentLoaded", () => {
    const musicBtn = document.getElementById("music-btn");
    const musicIcon = document.getElementById("music-icon");
    const backgroundMusic = document.getElementById("background-music");

    let isPlaying = false; // Variável para rastrear o estado da música

    // Função para tocar a música
    function playMusic() {
        backgroundMusic.play().then(() => {
            isPlaying = true; // Atualizar o estado para "tocando"
            musicIcon.src = "img/pausebtnmusic.png"; // Alterar o ícone para "pause"
            localStorage.setItem("musicPlaying", "true"); // Salvar estado no localStorage
            console.log("Música tocando automaticamente.");
        }).catch((error) => {
            console.log("A reprodução automática foi bloqueada pelo navegador:", error);
        });
    }

    // Função para pausar a música
    function pauseMusic() {
        backgroundMusic.pause();
        isPlaying = false; // Atualizar o estado para "pausado"
        musicIcon.src = "img/playbtnmusic.png"; // Alterar o ícone para "play"
        localStorage.setItem("musicPlaying", "false"); // Salvar estado no localStorage
    }

    // Adicionar evento de clique ao botão
    musicBtn.addEventListener("click", () => {
        if (isPlaying) {
            pauseMusic(); // Pausar a música
        } else {
            playMusic(); // Tocar a música
        }
    });

    // Restaurar o estado da música ao carregar a página
    const musicState = localStorage.getItem("musicPlaying");
    if (musicState === "true") {
        playMusic(); // Tocar a música automaticamente se estava tocando antes
    }
});