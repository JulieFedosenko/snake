class GameBoard {
    constructor() {
      this.boardElement = document.querySelector('.game-board');
      this.boardSize = 10;
      this.cells = [];
    }

    createBoard() {
      for (let row = 0; row < this.boardSize; row++) {
        for (let col = 0; col < this.boardSize; col++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          this.boardElement.appendChild(cell);
          this.cells.push(cell);
        }
      }
    }
 


    clearBoard() {
      this.cells.forEach((cell) => {
        cell.classList.remove('snake-body');
        cell.classList.remove('apple');
      });
    }

    drawSnake(snake) {
      snake.body.forEach(({ x, y }) => {
        const index = y * this.boardSize + x;
        this.cells[index].classList.add('snake-body');
      });
    }


    drawApple(apple) {
      const index = apple.y * this.boardSize + apple.x;
      this.cells[index].classList.add('apple');
      
      if(!cell.classList.contains('snake-body')) {
        cell.classList.add('apple');
      }
      
    }
    
  }

  class Snake {
    constructor() {
      this.body = [
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 }
      ];
      this.direction = 'right';
      this.newDirection = 'right';
    }
    
    move() {
      const head = { ...this.body[0] };
      this.direction = this.newDirection;

      switch (this.direction) {
        case 'up':
          head.y--;
          break;
        case 'down':
          head.y++;
          break;
        case 'left':
          head.x--;
          break;
        case 'right':
          head.x++;
          break;
      }

      this.body.unshift(head);
      this.body.pop();
    }

    changeDirection(direction) {
      const validDirections = ['up', 'down', 'left', 'right'];

      if (validDirections.includes(direction)) {
        const isOppositeDirection =
          (this.direction === 'up' && direction === 'down') ||
          (this.direction === 'down' && direction === 'up') ||
          (this.direction === 'left' && direction === 'right') ||
          (this.direction === 'right' && direction === 'left');

        if (!isOppositeDirection) {
          this.newDirection = direction;
        }
      }
    }

    eatApple() {
      const tail = { ...this.body[this.body.length - 1] };
      this.body.push(tail);
    }
  }

  class Apple {
    constructor(boardSize) {
      this.x = Math.floor(Math.random() * boardSize);
      this.y = Math.floor(Math.random() * boardSize);
    
    }
  }

  class Game {
    constructor() {
      this.gameBoard = new GameBoard();
      this.snake = new Snake();
      this.apple = null;
      this.scoreElement = document.getElementById('score');
      this.bestScoreElement = document.getElementById('best-score');
      this.restartButton = document.getElementById('restart-button');

      this.score = 0;
      this.bestScore = localStorage.getItem('bestScore') || 0;
      this.isGameOver = false;
      this.timerId = null;

      this.restartButton.addEventListener('click', () => this.restartGame());
      document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    initialize() {
      this.gameBoard.createBoard();
      this.updateScore();

      this.startGame();
    }

    startGame() {
      this.snake = new Snake();
      this.makeApple();
      this.isGameOver = false;

      this.timerId = setInterval(() => {
        this.update();
      }, 300);
    }

    update() {
      this.snake.move();

      if (this.checkCollision()) {
        this.endGame();
        return;
      }

      if (this.checkAppleCollision()) {
        this.snake.eatApple();
        this.score++;
        this.updateScore();
        this.makeApple();
      }

      this.gameBoard.clearBoard();
      this.gameBoard.drawSnake(this.snake);
      this.gameBoard.drawApple(this.apple);
    }

    updateScore() {
      this.scoreElement.textContent = this.score;
      this.bestScoreElement.textContent = this.bestScore;
    }

    makeApple() {
      this.apple = new Apple(this.gameBoard.boardSize);
      
    }

    checkCollision() {
      const head = this.snake.body[0];

      if (
        head.x < 0 ||
        head.x >= this.gameBoard.boardSize ||
        head.y < 0 ||
        head.y >= this.gameBoard.boardSize
      ) {
        return true;
      }

      for (let i = 1; i < this.snake.body.length; i++) {
        if (head.x === this.snake.body[i].x && head.y === this.snake.body[i].y) {
          return true;
        }
      }

      return false;
    }

    checkAppleCollision() {
      const head = this.snake.body[0];

      return head.x === this.apple.x && head.y === this.apple.y;
    }

    handleKeyDown(event) {
      const directions = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
      };

      const direction = directions[event.key];

      if (direction) {
        this.snake.changeDirection(direction);
      }
    }

    endGame() {
      clearInterval(this.timerId);

      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem('bestScore', this.bestScore);
      }

      this.isGameOver = true;
      this.restartButton.style.display = 'block';
    }

    restartGame() {
      this.score = 0;
      this.updateScore();

      this.restartButton.style.display = 'none';

      this.startGame();
    }
  }

  const game = new Game();
  game.initialize();