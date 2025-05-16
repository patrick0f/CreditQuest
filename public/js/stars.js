// const starCanvas = document.getElementById('starCanvas');
// const starCtx = starCanvas.getContext('2d');

// function resizeCanvas() {
//   starCanvas.width = window.innerWidth;
//   starCanvas.height = window.innerHeight;
// }
// resizeCanvas();
// window.addEventListener('resize', resizeCanvas);

// class Star {
//   constructor() {
//     this.x = Math.random() * starCanvas.width;
//     this.y = Math.random() * starCanvas.height;
//     this.size = Math.random() * 1.5 + 0.5;
//     this.alpha = Math.random();
//     this.alphaChange = 0.01 * (Math.random() > 0.5 ? 1 : -1);
//     this.speedX = (Math.random() - 0.5) * 0.1; // slow horizontal drift
//     this.speedY = (Math.random() - 0.5) * 0.1; // slow vertical drift
//   }
  
//   update() {
//     this.alpha += this.alphaChange;
//     if (this.alpha <= 0) {
//       this.alpha = 0;
//       this.alphaChange = -this.alphaChange;
//     }
//     if (this.alpha >= 1) {
//       this.alpha = 1;
//       this.alphaChange = -this.alphaChange;
//     }
    
//     this.x += this.speedX;
//     this.y += this.speedY;

//     if (this.x < 0) this.x = starCanvas.width;
//     if (this.x > starCanvas.width) this.x = 0;
//     if (this.y < 0) this.y = starCanvas.height;
//     if (this.y > starCanvas.height) this.y = 0;
//   }
  
//   draw() {
//     starCtx.beginPath();
//     starCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//     starCtx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
//     starCtx.fill();
//   }
// }

// const stars = [];
// const starCount = 100;
// for (let i = 0; i < starCount; i++) {
//   stars.push(new Star());
// }

// function animateStars() {
//   starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
//   stars.forEach(star => {
//     star.update();
//     star.draw();
//   });
//   requestAnimationFrame(animateStars);
// }

// animateStars();
