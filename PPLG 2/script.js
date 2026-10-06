/* =====================================================
   ROCKET CURSOR + NOS
===================================================== */

const rocketCursor =
    document.getElementById("rocket-cursor");

let mouseX = 0;
let mouseY = 0;

let rocketX = 0;
let rocketY = 0;

window.addEventListener("mousemove", (e) => {

    mouseX = e.clientX;
    mouseY = e.clientY;

});

function animateRocket() {

    rocketX +=
        (mouseX - rocketX) * 0.22;

    rocketY +=
        (mouseY - rocketY) * 0.22;

    rocketCursor.style.left =
        `${rocketX}px`;

    rocketCursor.style.top =
        `${rocketY}px`;

    requestAnimationFrame(
        animateRocket
    );
}

animateRocket();


/* NOS MOUSE */

document.addEventListener("mousedown", () => {

    rocketCursor.classList.add("nos");

    playSynthSound(
        120,
        "sawtooth",
        .15
    );

});

document.addEventListener("mouseup", () => {

    rocketCursor.classList.remove("nos");

});


/* NOS SPACEBAR */

document.addEventListener("keydown", (e) => {

    if (e.code === "Space") {

        rocketCursor.classList.add("nos");

    }

});

document.addEventListener("keyup", (e) => {

    if (e.code === "Space") {

        rocketCursor.classList.remove("nos");

    }

});


/* =====================================================
   AUDIO SYSTEM
===================================================== */

let audioCtx = null;
let soundEnabled = false;

function playSynthSound(
    frequency = 440,
    type = "sine",
    duration = .1
) {

    if (!soundEnabled)
        return;

    try {

        if (!audioCtx) {

            audioCtx =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }

        const osc =
            audioCtx.createOscillator();

        const gain =
            audioCtx.createGain();

        osc.type = type;

        osc.frequency.setValueAtTime(
            frequency,
            audioCtx.currentTime
        );

        gain.gain.setValueAtTime(
            .05,
            audioCtx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            .00001,
            audioCtx.currentTime + duration
        );

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();

        osc.stop(
            audioCtx.currentTime +
            duration
        );

    } catch (error) {}

}


/* AUDIO BUTTON */

document
    .getElementById("audio-toggle")
    .addEventListener("click", () => {

        soundEnabled =
            !soundEnabled;

        const icon =
            document.getElementById(
                "audio-icon"
            );

        if (soundEnabled) {

            icon.className =
                "fa-solid fa-volume-high";

            showToast(
                "Sound Effects Enabled 🔊"
            );

            playSynthSound(
                880,
                "triangle",
                .2
            );

        } else {

            icon.className =
                "fa-solid fa-volume-xmark";

            showToast(
                "Sound Effects Muted 🔇"
            );

        }

    });


/* =====================================================
   PARTICLE BACKGROUND
===================================================== */

const canvas =
    document.getElementById(
        "bg-canvas"
    );

const ctx =
    canvas.getContext("2d");

let particles = [];

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


class Particle {

    constructor() {
        this.reset();
    }

    reset() {

        this.x =
            Math.random() *
            canvas.width;

        this.y =
            Math.random() *
            canvas.height;

        this.size =
            Math.random() * 2 +
            .5;

        this.speedX =
            (Math.random() - .5) *
            .8;

        this.speedY =
            (Math.random() - .5) *
            .8;

        this.alpha =
            Math.random() * .5 +
            .2;
    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;

        if (
            this.x < 0 ||
            this.x > canvas.width ||
            this.y < 0 ||
            this.y > canvas.height
        ) {

            this.reset();

        }

    }

    draw() {

        ctx.fillStyle =
            `rgba(
                0,
                240,
                255,
                ${this.alpha}
            )`;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


for (
    let i = 0;
    i < 70;
    i++
) {

    particles.push(
        new Particle()
    );

}


function animateParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(
        particle => {

            particle.update();
            particle.draw();

        }
    );

    requestAnimationFrame(
        animateParticles
    );

}

animateParticles();


/* =====================================================
   TYPING EFFECT
===================================================== */

const typingPhrases = [

    "Senior UI/UX Architect & Visual Systems Lead",

    "Full-Stack Creative Web Developer",

    "Interactive WebGL & 3D Web Graphics Designer"

];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

let typingSpeed = 50;

const typingElement =
    document.getElementById(
        "typing-text"
    );


function setTypingSpeed(speed) {

    typingSpeed = speed;

    showToast(
        `Typing Delay: ${speed}ms`
    );

    playSynthSound(
        600,
        "sine",
        .1
    );

}


function typeLoop() {

    const phrase =
        typingPhrases[
            phraseIndex
        ];

    if (!deleting) {

        typingElement.textContent =
            phrase.substring(
                0,
                charIndex + 1
            );

        charIndex++;

    } else {

        typingElement.textContent =
            phrase.substring(
                0,
                charIndex - 1
            );

        charIndex--;

    }


    if (
        !deleting &&
        charIndex === phrase.length
    ) {

        setTimeout(() => {

            deleting = true;

        }, 1800);

    }


    if (
        deleting &&
        charIndex === 0
    ) {

        deleting = false;

        phraseIndex =
            (phraseIndex + 1) %
            typingPhrases.length;

    }


    const delay =
        deleting
            ? typingSpeed / 2
            : typingSpeed;

    setTimeout(
        typeLoop,
        delay
    );

}

typeLoop();


/* =====================================================
   THEME SYSTEM
===================================================== */

function setTheme(theme) {

    document.body.className =
        `theme-${theme}`;

    showToast(
        `Switched to ${theme.toUpperCase()}`
    );

    playSynthSound(
        523,
        "triangle",
        .15
    );

}


/* =====================================================
   TILT CARD
===================================================== */

const tiltCards =
    document.querySelectorAll(
        ".tilt-card"
    );


tiltCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        (e) => {

            const rect =
                card.getBoundingClientRect();

            const x =
                e.clientX -
                rect.left;

            const y =
                e.clientY -
                rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateX =
                (centerY - y) / 15;

            const rotateY =
                (x - centerX) / 15;

            card.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 scale(1.02)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0) scale(1)";

        }
    );

});


/* =====================================================
   PROJECT FILTER
===================================================== */

function filterProjects(category) {

    const cards =
        document.querySelectorAll(
            ".project-card"
        );

    const buttons =
        document.querySelectorAll(
            ".filters button"
        );


    buttons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter ===
            category
        );

    });


    cards.forEach(card => {

        if (
            category === "all" ||
            card.dataset.category ===
            category
        ) {

            card.style.display =
                "block";

        } else {

            card.style.display =
                "none";

        }

    });


    playSynthSound(
        300,
        "sine",
        .1
    );

}


/* =====================================================
   PROJECT MODAL
===================================================== */

function openModal(
    title,
    description,
    image
) {

    document.getElementById(
        "modal-title"
    ).textContent = title;

    document.getElementById(
        "modal-desc"
    ).textContent = description;

    document.getElementById(
        "modal-img"
    ).src = image;

    document.getElementById(
        "project-modal"
    ).classList.add("show");

    playSynthSound(
        700,
        "square",
        .15
    );

}


function closeModal() {

    document.getElementById(
        "project-modal"
    ).classList.remove("show");

}


/* =====================================================
   CYBER REFLEX GAME
===================================================== */

let gameScore = 0;
let gameTimer = 15;

let timerInterval = null;


function startGame() {

    const arena =
        document.getElementById(
            "game-arena"
        );

    gameScore = 0;
    gameTimer = 15;

    document.getElementById(
        "game-score"
    ).textContent = "0";

    document.getElementById(
        "game-timer"
    ).textContent = "15s";

    arena.innerHTML = "";

    clearInterval(
        timerInterval
    );

    timerInterval =
        setInterval(() => {

            gameTimer--;

            document.getElementById(
                "game-timer"
            ).textContent =
                `${gameTimer}s`;

            if (
                gameTimer <= 0
            ) {

                endGame();

            }

        }, 1000);

    playSynthSound(
        600,
        "triangle",
        .2
    );

    spawnTarget();

}


function spawnTarget() {

    const arena =
        document.getElementById(
            "game-arena"
        );

    arena.innerHTML = "";

    if (
        gameTimer <= 0
    )
        return;


    const target =
        document.createElement(
            "div"
        );


    const size =
        Math.floor(
            Math.random() * 25
        ) + 30;


    const maxX =
        arena.clientWidth -
        size -
        20;

    const maxY =
        arena.clientHeight -
        size -
        20;


    target.style.width =
        `${size}px`;

    target.style.height =
        `${size}px`;

    target.style.left =
        `${Math.max(
            10,
            Math.floor(
                Math.random() *
                maxX
            )
        )}px`;

    target.style.top =
        `${Math.max(
            10,
            Math.floor(
                Math.random() *
                maxY
            )
        )}px`;


    target.style.position =
        "absolute";

    target.style.borderRadius =
        "50%";

    target.style.border =
        "2px solid white";

    target.style.background =
        "linear-gradient(135deg,#00f0ff,#ff007f)";

    target.style.boxShadow =
        "0 0 25px #00f0ff";

    target.style.animation =
        "rocketFlame .15s infinite alternate";


    target.onclick = () => {

        gameScore += 100;

        document.getElementById(
            "game-score"
        ).textContent =
            gameScore;

        playSynthSound(
            1000,
            "sine",
            .1
        );

        spawnTarget();

    };


    arena.appendChild(
        target
    );

}


function endGame() {

    clearInterval(
        timerInterval
    );

    const arena =
        document.getElementById(
            "game-arena"
        );

    arena.innerHTML = `

        <div style="
            text-align:center;
            font-family:Orbitron;
        ">

            <div style="
                color:#00f0ff;
                font-size:20px;
                font-weight:bold;
            ">
                TEST COMPLETE
            </div>

            <div style="
                color:#cbd5e1;
                font-size:12px;
                margin-top:8px;
            ">
                REFLEX SCORE:
                <strong style="color:#ff00aa">
                    ${gameScore} PTS
                </strong>
            </div>

        </div>

    `;

    showToast(
        `Reflex Test Finished: ${gameScore} PTS`
    );

}


/* =====================================================
   GUESTBOOK
===================================================== */

function addGuestbookEntry(e) {

    e.preventDefault();

    const user =
        document.getElementById(
            "gb-user"
        ).value;

    const message =
        document.getElementById(
            "gb-msg"
        ).value;


    const feed =
        document.getElementById(
            "guestbook-feed"
        );


    const entry =
        document.createElement(
            "div"
        );

    entry.className =
        "guest-entry";


    const username =
        document.createElement(
            "span"
        );

    username.textContent =
        user;


    const time =
        document.createElement(
            "small"
        );

    time.textContent =
        "Just now";


    const paragraph =
        document.createElement(
            "p"
        );

    paragraph.textContent =
        message;


    entry.appendChild(
        username
    );

    entry.appendChild(
        time
    );

    entry.appendChild(
        paragraph
    );


    feed.prepend(
        entry
    );


    document.getElementById(
        "gb-user"
    ).value = "";

    document.getElementById(
        "gb-msg"
    ).value = "";


    showToast(
        "Guestbook entry transmitted!"
    );

    playSynthSound(
        800,
        "sine",
        .15
    );

}


/* =====================================================
   CONTACT FORM
===================================================== */

function handleContactSubmit(e) {

    e.preventDefault();

    showToast(
        "Transmission received! 🚀"
    );

    e.target.reset();

    playSynthSound(
        900,
        "triangle",
        .2
    );

}


/* =====================================================
   DOWNLOAD CV
===================================================== */

function downloadResume() {

    showToast(
        "Downloading Alexa_Resume_2026.pdf..."
    );

    playSynthSound(
        500,
        "sine",
        .1
    );

}


/* =====================================================
   TOAST
===================================================== */

let toastTimeout;

function showToast(message) {

    const toast =
        document.getElementById(
            "toast-box"
        );

    document.getElementById(
        "toast-message"
    ).textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);

}


/* =====================================================
   MOBILE MENU
===================================================== */

document
    .getElementById(
        "mobile-menu-btn"
    )
    .addEventListener(
        "click",
        () => {

            const menu =
                document.getElementById(
                    "mobile-menu"
                );

            menu.style.display =
                menu.style.display ===
                "flex"
                    ? "none"
                    : "flex";

        }
    );


/* =====================================================
   CLOSE MODAL WITH ESC
===================================================== */

document.addEventListener(
    "keydown",
    (e) => {

        if (e.key === "Escape") {

            closeModal();

        }

    }
);


/* =====================================================
   DEFAULT PROJECT FILTER
===================================================== */

filterProjects("all");
