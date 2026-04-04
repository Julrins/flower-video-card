const player = document.getElementById("clip-player");
const source = document.getElementById("clip-source");
const primaryAction = document.getElementById("primary-action");
const soundToggle = document.getElementById("sound-toggle");
const replayButton = document.getElementById("replay-button");
const directLink = document.getElementById("direct-link");
const statusText = document.getElementById("status-text");

const params = new URLSearchParams(window.location.search);
const clipSource = params.get("src") || "./clip-web.mp4";

source.src = clipSource;
directLink.href = clipSource;
player.load();

function setStatus(text) {
  statusText.textContent = text;
}

function syncSoundButton() {
  soundToggle.textContent = player.muted ? "Включить звук" : "Выключить звук";
}

async function tryAutoplay() {
  try {
    await player.play();
    primaryAction.classList.add("hidden");
    setStatus("Видео уже запущено.");
  } catch (_error) {
    primaryAction.classList.remove("hidden");
    setStatus("Если видео не стартовало само, нажми на кнопку поверх видео.");
  }
}

player.addEventListener("loadeddata", () => {
  setStatus("Видео готово к просмотру.");
  syncSoundButton();
  void tryAutoplay();
});

player.addEventListener("play", () => {
  setStatus(player.muted ? "Видео играет. Нажми «Включить звук», если нужно." : "Видео играет со звуком.");
});

player.addEventListener("pause", () => {
  if (!player.ended) {
    setStatus("Видео поставлено на паузу.");
  }
});

player.addEventListener("ended", () => {
  primaryAction.textContent = "Смотреть еще раз";
  primaryAction.classList.remove("hidden");
  setStatus("Видео закончилось. Можно запустить его снова.");
});

player.addEventListener("error", () => {
  primaryAction.classList.add("hidden");
  setStatus("Если видео не открылось во встроенном плеере, нажми «Открыть видео напрямую».");
});

primaryAction.addEventListener("click", async () => {
  try {
    if (player.ended) {
      player.currentTime = 0;
    }
    await player.play();
    primaryAction.classList.add("hidden");
  } catch (_error) {
    setStatus("Браузер не дал запустить видео автоматически. Нажми стандартную кнопку Play на плеере.");
  }
});

soundToggle.addEventListener("click", async () => {
  player.muted = !player.muted;
  syncSoundButton();

  if (player.paused) {
    try {
      await player.play();
    } catch (_error) {
      setStatus("Нажми Play на плеере, если браузер остановил видео после смены звука.");
    }
  }
});

replayButton.addEventListener("click", async () => {
  player.currentTime = 0;
  try {
    await player.play();
    primaryAction.classList.add("hidden");
  } catch (_error) {
    primaryAction.classList.remove("hidden");
    setStatus("Нажми на кнопку поверх видео, чтобы перезапустить ролик.");
  }
});

syncSoundButton();
