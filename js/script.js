const circle = document.getElementById('myCircle');
const ring = document.getElementById('myRing');
const enemiesContainer = document.getElementById('enemies-container');
const healthDisplay = document.getElementById('health-display');
const gameOverScreen = document.getElementById('game-over-screen');
const retryButton = document.getElementById('retry-button');
const menuButton = document.getElementById('menu-button');
const healthBar = document.getElementById('health-fill');
let isShrunk = false;
let isRingVisible = false;
let health = 3;
let spawnInterval;

function updateHealthBar(health) {
    healthBar.style.width = (health / 3) * 100 + '%';
}



updateHealthBar(health);

circle.addEventListener('mousedown', () => {
    if (!isShrunk) {
        circle.style.transform = 'scale(0.5)';
        isShrunk = true;
    }
});

document.addEventListener('mouseup', () => {
    if (isShrunk) {
        ring.style.left = circle.style.left;
        ring.style.top = circle.style.top;

        circle.style.transform = 'scale(3)';
        setTimeout(() => {
            circle.style.transform = 'scale(1)';
        }, 300);
        isShrunk = false;

        if (!isRingVisible) {
            ring.style.display = 'block';
            ring.style.transform = 'scale(1)';
            isRingVisible = true;

            setTimeout(() => {
                ring.style.transform = 'scale(20)';
            }, 100);

            setTimeout(() => {
                ring.style.display = 'none';
                isRingVisible = false;
            }, 1000);
        } else {
            ring.style.display = 'none';
            isRingVisible = false;
        }
    }
});

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.left = Math.random() * window.innerWidth + 'px';
    enemiesContainer.appendChild(enemy);

    const speed = 5;
    const attraction = 0.1;
    const attractionRange = 300;

    const interval = setInterval(() => {
        const top = parseInt(enemy.style.top) || 0;
        enemy.style.top = top + speed + 'px';

        if (top > window.innerHeight) {
            clearInterval(interval);
            enemy.remove();
            health--;
            updateHealthBar(health);
            if (health <= 0) {
                clearInterval(spawnInterval);
                displayGameOverScreen();
            }
        }

        if (isColliding(enemy, ring)) {
            clearInterval(interval);
            enemy.remove();
        }

        if (isShrunk) {
            const circleRect = circle.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();

            const deltaX = circleRect.left + circleRect.width / 2 - (enemyRect.left + enemyRect.width / 2);
            const deltaY = circleRect.top + circleRect.height / 2 - (enemyRect.top + enemyRect.height / 2);

            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > 1 && distance < attractionRange) {
                enemy.style.left = enemyRect.left + attraction * deltaX + 'px';
                enemy.style.top = enemyRect.top + attraction * deltaY + 'px';
            }
        }
    }, 20);
}

function isColliding(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

function displayGameOverScreen() {
    gameOverScreen.style.display = 'flex';
}

retryButton.addEventListener('click', () => {
    location.reload();
});

menuButton.addEventListener('click', () => {
    window.location.href = 'menu.html';
});

spawnInterval = setInterval(createEnemy, 200);

// Désactive le redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    window.resizeTo(window.innerWidth, window.innerHeight);
});


