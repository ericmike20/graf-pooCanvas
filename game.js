// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota con tamaño, color y velocidad propia)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX;
    }
}

// Clase Paddle (Paleta con soporte de color y altura ajustable)
class Paddle {
    constructor(x, y, width, height, color, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 8;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego, paletas y las 5 pelotas)
class Game {
    constructor() {
        // 5 pelotas con tamaños, colores y velocidades bien diferenciados
        this.balls = [
            new Ball(canvas.width / 2, canvas.height / 2, 6, 3, 3, '#FF5733'),   // Muy pequeña (Radio 6)
            new Ball(canvas.width / 2, canvas.height / 2, 11, 4, -3, '#33FF57'),  // Pequeña (Radio 11)
            new Ball(canvas.width / 2, canvas.height / 2, 17, -3, 4, '#3357FF'), // Mediana (Radio 17)
            new Ball(canvas.width / 2, canvas.height / 2, 28, 5, 2, '#F3FF33'),  // Gigante (Radio 28)
            new Ball(canvas.width / 2, canvas.height / 2, 13, -4, -4, '#FF33F3') // Mediana (Radio 13)
        ];

        // Paleta del jugador: Altura de 200 (el doble de 100), centrada verticalmente
        this.paddle1 = new Paddle(10, canvas.height / 2 - 100, 10, 200, '#00FFFF', true); 
        
        // Paleta de la CPU: Altura normal de 100
        this.paddle2 = new Paddle(canvas.width - 20, canvas.height / 2 - 50, 10, 100, '#FF00FF'); 
        
        this.keys = {};
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        this.balls.forEach(ball => ball.draw());
        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        this.balls.forEach(ball => {
            ball.move();

            // Colisión con la paleta 1 (Jugador)
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
                ball.speedX = -ball.speedX;
            }

            // Colisión con la paleta 2 (CPU)
            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -ball.speedX;
            }

            // Reiniciar si sale de los límites laterales
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });

        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        this.paddle2.autoMove(this.balls[0]);
    }

    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

const game = new Game();
game.run();