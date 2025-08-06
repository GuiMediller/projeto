const audioElements = {};
const active = {};
const gifElements = {
  balerina: document.getElementById("gif-balerina"),
  miau: document.getElementById("gif-miau"),
  milkshake: document.getElementById("gif-milkshake"),
  pew: document.getElementById("gif-pew"),
  sahur: document.getElementById("gif-sahur"),
  vaca: document.getElementById("gif-vaca"),
  tralalero: document.getElementById("gif-tralalero"),
};

const actions = ["balerina", "miau", "milkshake", "pew", "sahur", "vaca", "tralalero"];

function toggleAction(name) {
  if (active[name]) {
    if (audioElements[name]) {
      audioElements[name].pause();
      audioElements[name].currentTime = 0;
    }
    if (gifElements[name]) {
      gifElements[name].style.display = "none";
    }
    active[name] = false;
  } else {
    // Parar todos os outros
    actions.forEach(action => {
      if (audioElements[action]) {
        audioElements[action].pause();
        audioElements[action].currentTime = 0;
      }
      if (gifElements[action]) {
        gifElements[action].style.display = "none";
      }
      active[action] = false;
    });

    // Ativar novo
    if (!audioElements[name]) {
      audioElements[name] = new Audio(`audio/${name}.mp3`);
    }
    audioElements[name].play();
    if (gifElements[name]) {
      gifElements[name].style.display = "block";
    }
    active[name] = true;
  }
}

// Teclado 1–7
window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key >= "1" && key <= "7") {
    const index = parseInt(key) - 1;
    const name = actions[index];
    toggleAction(name);
  }
});

// Gamepad
let gamepadIndex = null;

window.addEventListener("gamepadconnected", (e) => {
  gamepadIndex = e.gamepad.index;
  document.getElementById("mensagem").textContent = "Controle conectado";
  const connectedSound = new Audio("audio/conectado.mp3");
  connectedSound.play();
});

function gameLoop() {
  if (gamepadIndex !== null) {
    const gp = navigator.getGamepads()[gamepadIndex];
    if (gp) {
      const mapping = {
        0: "miau",        // A
        1: "balerina",    // B
        2: "milkshake",   // X
        3: "pew",         // Y
        4: "sahur",       // LB
        5: "vaca",        // RB
        6: "tralalero"    // Back
      };

      gp.buttons.forEach((button, index) => {
        if (button.pressed && mapping[index]) {
          if (!gp.lastButton || gp.lastButton !== index) {
            toggleAction(mapping[index]);
            gp.lastButton = index;
          }
        } else if (!button.pressed && gp.lastButton === index) {
          gp.lastButton = null;
        }
      });
    }
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
