// controlmusic.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    const backgroundMusic = document.getElementById('background-music');
    
    // Caminhos das imagens
    const playIcon = '/assets/img/ui/playbtnmusic.png';
    const pauseIcon = '/assets/img/ui/pausebtnmusic.png';
    
    // Configuração inicial
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.15; // Volume padrão (15%)
    
    // Verifica o estado da música ao carregar
    function updateMusicIcon() {
        if (backgroundMusic.paused) {
            musicIcon.src = playIcon;
        } else {
            musicIcon.src = pauseIcon;
        }
    }
    
    // Alternar play/pause
    function toggleMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.play()
                .then(() => {
                    updateMusicIcon();
                    localStorage.setItem('musicState', 'playing');
                })
                .catch(error => {
                    console.error("Erro ao reproduzir música:", error);
                });
        } else {
            backgroundMusic.pause();
            updateMusicIcon();
            localStorage.setItem('musicState', 'paused');
        }
    }
    
    // Controle de volume (opcional)
    function setVolume(volume) {
        backgroundMusic.volume = volume;
        localStorage.setItem('musicVolume', volume);
    }
    
    // Restaurar estado da música do localStorage
    function restoreMusicState() {
        const savedState = localStorage.getItem('musicState');
        const savedVolume = localStorage.getItem('musicVolume');
        
        if (savedVolume) {
            backgroundMusic.volume = parseFloat(savedVolume);
        }
        
        if (savedState === 'playing') {
            backgroundMusic.play()
                .then(updateMusicIcon)
                .catch(error => {
                    console.error("Autoplay bloqueado:", error);
                    updateMusicIcon();
                });
        } else {
            updateMusicIcon();
        }
    }
    
    // Event Listeners
    if (musicBtn && backgroundMusic) {
        musicBtn.addEventListener('click', toggleMusic);
        
        // Atualiza ícone quando a música termina (para garantir sincronia)
        backgroundMusic.addEventListener('ended', function() {
            backgroundMusic.currentTime = 0;
            backgroundMusic.play();
        });
        
        // Restaura o estado ao carregar
        restoreMusicState();
    }
    
    // Controle de volume opcional (pode ser adicionado no HTML)
    window.setMusicVolume = function(volume) {
        setVolume(volume);
    };
});