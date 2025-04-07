  <script src="../../gameassets/boss.js" defer></script>// bosscontent.js
  document.addEventListener('DOMContentLoaded', () => {
    // Verifica se Phaser está carregado
    if (typeof Phaser === 'undefined') {
      console.error('Phaser não está carregado!');
      return;
    }
  
    class BossScene extends Phaser.Scene {
      constructor() {
        super('BossScene');
      }
  
      preload() {
        console.log('Carregando assets...'); // Debug
        this.load.image('boss', '../assets/img/game/vampirelord.mp4');
        this.load.image('background', '../assets/img/game/castle-bg.jpg');
      }
  
      create() {
        console.log('Criando cena...'); // Debug
        
        // Background
        this.add.image(400, 300, 'background')
          .setScale(1.5)
          .setAlpha(0.8);
        
        // Boss
        this.boss = this.add.sprite(400, 250, 'boss')
          .setScale(0.7)
          .setInteractive();
        
        // Efeito de hover
        this.boss.on('pointerover', () => {
          this.boss.setScale(0.75);
        });
        
        this.boss.on('pointerout', () => {
          this.boss.setScale(0.7);
        });
      }
    }
  
    // Configuração do jogo
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      scene: BossScene,
      backgroundColor: '#1a1a2e',
      physics: {
        default: 'arcade',
        arcade: { debug: false }
      }
    };
  
    // Inicia o jogo
    const game = new Phaser.Game(config);
  });