const params = new URLSearchParams(window.location.search);

const sourceInput = document.getElementById("clip-source");
const sourceLabel = document.getElementById("clip-source-label");
const titleLabel = document.getElementById("page-title");
const endLabel = document.getElementById("clip-end-label");
const statusLabel = document.getElementById("clip-status");
const noteLabel = document.getElementById("player-note");
const player = document.getElementById("clip-player");
const qrTargetInput = document.getElementById("qr-target");
const qrButton = document.getElementById("build-qr");
const qrResult = document.getElementById("qr-result");
const qrImage = document.getElementById("qr-image");
const qrLink = document.getElementById("qr-link");

const clipSource = params.get("src") || "./clip-web.mp4";
const clipTitle = params.get("title") || "Video Fragment";
const forcedDuration = Number(params.get("duration") || "");
let hardStop = Number.isFinite(forcedDuration) && forcedDuration > 0 ? forcedDuration : null;

sourceInput.src = clipSource;
sourceLabel.textContent = clipSource;
titleLabel.textContent = clipTitle;
player.load();

function toClock(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

player.addEventListener("loadedmetadata", () => {
  if (!hardStop || hardStop > player.duration) {
    hardStop = player.duration;
  }

  endLabel.textContent = toClock(hardStop);
  noteLabel.textContent = hardStop === player.duration
    ? "The clip stops at the end of the uploaded file."
    : `Playback is forced to stop at ${toClock(hardStop)}.`;
});

player.addEventListener("play", () => {
  statusLabel.textContent = "Playing";
});

player.addEventListener("pause", () => {
  if (player.currentTime < (hardStop || player.duration) - 0.08) {
    statusLabel.textContent = "Paused";
  }
});

player.addEventListener("timeupdate", () => {
  if (!hardStop) {
    return;
  }

  if (player.currentTime >= hardStop - 0.04) {
    player.currentTime = hardStop;
    player.pause();
    statusLabel.textContent = "Finished";
  }
});

player.addEventListener("seeking", () => {
  if (hardStop && player.currentTime > hardStop) {
    player.currentTime = hardStop;
  }
});

player.addEventListener("error", () => {
  statusLabel.textContent = "Missing file";
  noteLabel.textContent =
    "No playable file was found. Add clip-web.mp4 to this folder or pass ?src=your-file.mp4 in the page URL.";
});

function buildQrImageUrl(target) {
  const base = "https://api.qrserver.com/v1/create-qr-code/";
  const query = new URLSearchParams({
    size: "640x640",
    data: target,
    format: "png",
    margin: "16",
  });

  return `${base}?${query.toString()}`;
}

qrButton.addEventListener("click", () => {
  const target = qrTargetInput.value.trim();
  if (!target) {
    qrTargetInput.focus();
    return;
  }

  const imageUrl = buildQrImageUrl(target);
  qrImage.src = imageUrl;
  qrLink.href = imageUrl;
  qrLink.textContent = imageUrl;
  qrResult.classList.remove("hidden");
});
