const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');

// Configuração do canvas
canvas.width = 800;
canvas.height = 600;

// Classe Player
class Player {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.color = color;
        this.speed = 5;
        this.bullets = [];
        this.score = 0;
        this.controls = controls;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(keys) {
        if (keys[this.controls.left]) this.x -= this.speed;
        if (keys[this.controls.right]) this.x += this.speed;
        if (keys[this.controls.up]) this.y -= this.speed;
        if (keys[this.controls.down]) this.y += this.speed;

        // Limites do canvas
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }

    shoot() {
        const bullet = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            radius: 5,
            speed: 7,
            direction: this.controls.shootDirection
        };
        this.bullets.push(bullet);
    }

    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            switch(bullet.direction) {
                case 'right':
                    bullet.x += bullet.speed;
                    break;
                case 'left':
                    bullet.x -= bullet.speed;
                    break;
            }

            // Remover balas fora da tela
            if (bullet.x < 0 || bullet.x > canvas.width) {
                this.bullets.splice(i, 1);
            }
        }
    }

    drawBullets() {
        ctx.fillStyle = this.color;
        this.bullets.forEach(bullet => {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

// Inicialização dos jogadores
const player1 = new Player(50, canvas.height/2, 'blue', {
    up: 'w',
    down: 's',
    left: 'a',
    right: 'd',
    shoot: ' ',
    shootDirection: 'right'
});

const player2 = new Player(canvas.width - 80, canvas.height/2, 'red', {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    shoot: 'Enter',
    shootDirection: 'left'
});

// Controle de teclas
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    
    // Tiro
    if (e.key === ' ') player1.shoot();
    if (e.key === 'Enter') player2.shoot();
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Verificar colisões
function checkCollisions() {
    // Colisão das balas do player 1 com player 2
    player1.bullets.forEach((bullet, index) => {
        if (bullet.x + bullet.radius > player2.x &&
            bullet.x - bullet.radius < player2.x + player2.width &&
            bullet.y + bullet.radius > player2.y &&
            bullet.y - bullet.radius < player2.y + player2.height) {
            player1.bullets.splice(index, 1);
            player1.score++;
            player1ScoreElement.textContent = player1.score;
        }
    });

    // Colisão das balas do player 2 com player 1
    player2.bullets.forEach((bullet, index) => {
        if (bullet.x + bullet.radius > player1.x &&
            bullet.x - bullet.radius < player1.x + player1.width &&
            bullet.y + bullet.radius > player1.y &&
            bullet.y - bullet.radius < player1.y + player1.height) {
            player2.bullets.splice(index, 1);
            player2.score++;
            player2ScoreElement.textContent = player2.score;
        }
    });
}

// Game loop
function gameLoop() {
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualizar posições
    player1.move(keys);
    player2.move(keys);
    player1.updateBullets();
    player2.updateBullets();

    // Verificar colisões
    checkCollisions();

    // Desenhar
    player1.draw();
    player2.draw();
    player1.drawBullets();
    player2.drawBullets();

    requestAnimationFrame(gameLoop);
}

// Iniciar jogo
gameLoop();
