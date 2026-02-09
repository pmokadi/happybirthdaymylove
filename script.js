// GLOBAL STATE
let currentPage = 1;
let musicPlayingFM = false;
let soundEnabledFM = true;
let gameScore = 0;
let gameTime = 20;
let gameActive = false;
let scratched = false;
let birthdayMusicPlaying = false;

// ========================================
// PAGE NAVIGATION
// ========================================
function goToPage(pageNum) {
    // Hide current page
    const currentPageEl = document.getElementById(`page-${currentPage}`);
    currentPageEl.classList.remove('active');
    
    // Update nav dots
    const navDots = document.querySelectorAll('.nav-dot');
    navDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index + 1 === pageNum) {
            dot.classList.add('active');
        }
    });
    
    // Show new page
    setTimeout(() => {
        currentPage = pageNum;
        const newPageEl = document.getElementById(`page-${pageNum}`);
        newPageEl.classList.add('active');
        
        // Initialize page-specific features
        if (pageNum === 4) {
            initScratchCard();
        }
    }, 300);
}

// ========================================
// PAGE 1 - CONFETTI & BIRTHDAY MUSIC
// ========================================

// Apple-style confetti with realistic physics
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#a29bfe', '#22c55e', '#fd79a8', '#74b9ff'];
    const shapes = ['rect', 'circle', 'triangle'];
    
    const pieces = 60;
    
    for (let i = 0; i < pieces; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const innerDiv = document.createElement('div');
            innerDiv.className = `confetti-${shape}`;
            innerDiv.style.background = colors[Math.floor(Math.random() * colors.length)];
            if (shape === 'triangle') {
                innerDiv.style.borderBottomColor = colors[Math.floor(Math.random() * colors.length)];
            }
            confetti.appendChild(innerDiv);
            
            // Random starting position across the top
            const startX = Math.random() * window.innerWidth;
            confetti.style.left = startX + 'px';
            confetti.style.top = '-20px';
            
            // Physics properties
            const velocity = {
                x: (Math.random() - 0.5) * 3,
                y: Math.random() * 2 + 3,
                rotate: Math.random() * 360,
                rotateSpeed: (Math.random() - 0.5) * 10
            };
            
            const gravity = 0.15;
            const drift = (Math.random() - 0.5) * 0.3;
            
            container.appendChild(confetti);
            
            // Animate with physics
            let currentY = -20;
            let currentX = startX;
            let currentRotate = 0;
            let velocityY = velocity.y;
            let velocityX = velocity.x;
            
            function animate() {
                velocityY += gravity;
                velocityX += drift;
                
                currentY += velocityY;
                currentX += velocityX;
                currentRotate += velocity.rotateSpeed;
                
                confetti.style.transform = `translate(${currentX - startX}px, ${currentY}px) rotate(${currentRotate}deg)`;
                
                // Remove when off screen
                if (currentY > window.innerHeight + 100) {
                    confetti.remove();
                    return;
                }
                
                requestAnimationFrame(animate);
            }
            
            animate();
        }, i * 30);
    }
}

// Apple-style balloons with realistic floating physics
function createBalloons() {
    const container = document.getElementById('balloons-container');
    const numBalloons = 7;
    
    for (let i = 0; i < numBalloons; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.className = `balloon balloon-${i + 1}`;
            
            const balloonBody = document.createElement('div');
            balloonBody.className = 'balloon-body';
            
            const balloonString = document.createElement('div');
            balloonString.className = 'balloon-string';
            
            balloon.appendChild(balloonBody);
            balloon.appendChild(balloonString);
            
            // Random starting position
            const startX = Math.random() * (window.innerWidth - 100) + 50;
            balloon.style.left = startX + 'px';
            balloon.style.bottom = '-100px';
            
            container.appendChild(balloon);
            
            // Physics properties
            const floatSpeed = 0.3 + Math.random() * 0.3;
            const swayAmplitude = 15 + Math.random() * 15;
            const swaySpeed = 0.02 + Math.random() * 0.01;
            
            let currentY = -100;
            let time = Math.random() * 100;
            let stringAngle = 0;
            
            function animate() {
                // Float upward
                currentY += floatSpeed;
                
                // Sway side to side
                time += swaySpeed;
                const swayX = Math.sin(time) * swayAmplitude;
                stringAngle = Math.sin(time) * 5;
                
                balloon.style.transform = `translate(${swayX}px, -${currentY}px)`;
                balloonString.style.transform = `rotate(${stringAngle}deg)`;
                
                // Reset when balloon reaches top
                if (currentY > window.innerHeight + 100) {
                    currentY = -100;
                    time = Math.random() * 100;
                }
                
                requestAnimationFrame(animate);
            }
            
            animate();
        }, i * 300);
    }
}

function toggleBirthdayMusic() {
    const audio = document.getElementById('birthday-audio');
    const musicToggle = document.getElementById('music-toggle');
    const musicOn = document.getElementById('music-on');
    const musicOff = document.getElementById('music-off');
    
    if (birthdayMusicPlaying) {
        audio.pause();
        birthdayMusicPlaying = false;
        musicToggle.classList.remove('playing');
        musicOn.style.display = 'block';
        musicOff.style.display = 'none';
    } else {
        audio.play();
        birthdayMusicPlaying = true;
        musicToggle.classList.add('playing');
        musicOn.style.display = 'none';
        musicOff.style.display = 'block';
    }
}

// ========================================
// PAGE 2 - VINYL PLAYER & MUSIC
// ========================================
function toggleMusicFM() {
    musicPlayingFM = !musicPlayingFM;
    
    const playIcon = document.getElementById('play-icon-fm');
    const pauseIcon = document.getElementById('pause-icon-fm');
    const equalizer = document.getElementById('equalizer-fm');
    const vinyl = document.getElementById('vinyl-record');
    const tonearm = document.getElementById('tonearm');
    
    if (musicPlayingFM) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        equalizer.style.display = 'flex';
        vinyl.classList.add('spinning');
        tonearm.classList.add('playing');
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        equalizer.style.display = 'none';
        vinyl.classList.remove('spinning');
        tonearm.classList.remove('playing');
    }
}

function toggleSoundFM() {
    soundEnabledFM = !soundEnabledFM;
    
    const volumeOn = document.getElementById('volume-on-fm');
    const volumeOff = document.getElementById('volume-off-fm');
    
    if (soundEnabledFM) {
        volumeOn.style.display = 'block';
        volumeOff.style.display = 'none';
    } else {
        volumeOn.style.display = 'none';
        volumeOff.style.display = 'block';
    }
}

// ========================================
// PAGE 3 - CATCHING GAME
// ========================================
let canvas, ctx;
let basket = { x: 150, y: 450, width: 100, height: 20 };
let gifts = [];
let gameInterval;
let timerInterval;

function startGame() {
    gameActive = true;
    gameScore = 0;
    gameTime = 20;
    gifts = [];
    
    document.getElementById('game-start').style.display = 'none';
    document.getElementById('game-active').style.display = 'block';
    
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Adjust canvas for retina displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    basket.x = canvas.width / 2 - basket.width / 2;
    basket.y = canvas.height - 50;
    
    // Mouse/Touch controls
    canvas.addEventListener('mousemove', moveBasket);
    canvas.addEventListener('touchmove', moveBasket);
    
    // Start spawning gifts
    gameInterval = setInterval(spawnGift, 800);
    
    // Timer
    timerInterval = setInterval(() => {
        gameTime--;
        document.getElementById('timer').textContent = gameTime;
        
        if (gameTime <= 0) {
            endGame();
        }
    }, 1000);
    
    // Game loop
    gameLoop();
}

function moveBasket(e) {
    if (!gameActive) return;
    
    const rect = canvas.getBoundingClientRect();
    let x;
    
    if (e.type === 'touchmove') {
        x = e.touches[0].clientX - rect.left;
    } else {
        x = e.clientX - rect.left;
    }
    
    basket.x = Math.max(0, Math.min(x - basket.width / 2, canvas.width - basket.width));
}

function spawnGift() {
    if (!gameActive) return;
    
    gifts.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: 2 + Math.random() * 2,
        emoji: ['🎁', '🎀', '🎉', '⭐'][Math.floor(Math.random() * 4)]
    });
}

function gameLoop() {
    if (!gameActive) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw basket
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
    ctx.fillRect(basket.x + 10, basket.y - 10, basket.width - 20, 10);
    
    // Draw gifts
    gifts.forEach((gift, index) => {
        gift.y += gift.speed;
        
        // Draw gift emoji
        ctx.font = '30px Arial';
        ctx.fillText(gift.emoji, gift.x, gift.y);
        
        // Check collision with basket
        if (
            gift.y + gift.height >= basket.y &&
            gift.y <= basket.y + basket.height &&
            gift.x + gift.width >= basket.x &&
            gift.x <= basket.x + basket.width
        ) {
            gameScore++;
            document.getElementById('score').textContent = gameScore;
            gifts.splice(index, 1);
            
            // Flash effect
            ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Remove if off screen
        if (gift.y > canvas.height) {
            gifts.splice(index, 1);
        }
    });
    
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    document.getElementById('game-active').style.display = 'none';
    document.getElementById('game-complete').style.display = 'block';
    document.getElementById('final-score').textContent = gameScore;
}

// ========================================
// PAGE 4 - SCRATCH CARD
// ========================================
function initScratchCard() {
    if (scratched) {
        document.getElementById('scratch-section').style.display = 'none';
        document.getElementById('revealed-section').style.display = 'block';
        return;
    }
    
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const container = canvas.parentElement;
    const maxWidth = Math.min(400, container.clientWidth);
    canvas.width = maxWidth;
    canvas.height = 200;
    
    // Create gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#8b5cf6');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 20px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH TO REVEAL', canvas.width / 2, canvas.height / 2);
    
    // Scratch event listeners
    let isScratching = false;
    
    function scratch(e) {
        if (scratched) return;
        
        const rect = canvas.getBoundingClientRect();
        let x, y;
        
        if (e.type.includes('touch')) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        
        // Scale coordinates for canvas resolution
        x = x * (canvas.width / rect.width);
        y = y * (canvas.height / rect.height);
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
    }
    
    canvas.addEventListener('mousedown', () => isScratching = true);
    canvas.addEventListener('mouseup', () => isScratching = false);
    canvas.addEventListener('mousemove', (e) => {
        if (isScratching) scratch(e);
    });
    
    canvas.addEventListener('touchstart', () => isScratching = true);
    canvas.addEventListener('touchend', () => {
        isScratching = false;
        checkScratchProgress();
    });
    canvas.addEventListener('touchmove', scratch);
    
    // Check scratch progress
    let scratchCheckTimeout;
    canvas.addEventListener('mousemove', () => {
        clearTimeout(scratchCheckTimeout);
        scratchCheckTimeout = setTimeout(checkScratchProgress, 500);
    });
}

function checkScratchProgress() {
    if (scratched) return;
    
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Count transparent pixels
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) transparent++;
    }
    
    const totalPixels = canvas.width * canvas.height;
    const percentScratched = (transparent / totalPixels) * 100;
    
    // Reveal if >50% scratched
    if (percentScratched > 50) {
        revealGift();
    }
}

function revealGift() {
    scratched = true;
    
    // Fade out scratch section
    const scratchSection = document.getElementById('scratch-section');
    scratchSection.style.opacity = '0';
    scratchSection.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        scratchSection.style.display = 'none';
        const revealedSection = document.getElementById('revealed-section');
        revealedSection.style.display = 'block';
        revealedSection.style.opacity = '0';
        
        setTimeout(() => {
            revealedSection.style.transition = 'opacity 0.5s ease';
            revealedSection.style.opacity = '1';
        }, 50);
    }, 500);
}

// ========================================
// INITIALIZE
// ========================================
window.addEventListener('load', () => {
    // Set initial page
    document.getElementById('page-1').classList.add('active');
    
    // Set active nav dot
    document.querySelectorAll('.nav-dot')[0].classList.add('active');
    
    // Start confetti and balloons on page 1
    createBalloons();
    createConfetti();
    
    // Create confetti burst every 4 seconds
    setInterval(createConfetti, 4000);
});

// Handle window resize for scratch card
window.addEventListener('resize', () => {
    if (currentPage === 4 && !scratched) {
        initScratchCard();
    }
});
