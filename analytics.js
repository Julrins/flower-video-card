(function () {
  const COUNTIFY_BASE = "https://api.countify.xyz";
  const EVENTS = {
    qrVisitTotal: "julrins-flower-video-card-qr-visit-total",
    qrVisitUnique: "julrins-flower-video-card-qr-visit-unique",
    videoStartTotal: "julrins-flower-video-card-video-start-total",
    videoStartUnique: "julrins-flower-video-card-video-start-unique",
    videoEngagedTotal: "julrins-flower-video-card-video-engaged-total",
    videoEngagedUnique: "julrins-flower-video-card-video-engaged-unique",
    videoCompleteTotal: "julrins-flower-video-card-video-complete-total",
    videoCompleteUnique: "julrins-flower-video-card-video-complete-unique",
  };

  const STORAGE_KEYS = {
    qrVisitUnique: "flower-video-card:qr-visit-unique:v1",
    videoStartUnique: "flower-video-card:video-start-unique:v1",
    videoEngagedUnique: "flower-video-card:video-engaged-unique:v1",
    videoCompleteUnique: "flower-video-card:video-complete-unique:v1",
  };

  const page = document.documentElement.dataset.page;
  if (page !== "video") {
    return;
  }

  const player = document.getElementById("clip-player");
  if (!player) {
    return;
  }

  const sessionFlags = {
    started: false,
    engaged: false,
    completed: false,
  };

  function markUnique(key) {
    try {
      if (window.localStorage.getItem(key) === "1") {
        return false;
      }
      window.localStorage.setItem(key, "1");
      return true;
    } catch (_error) {
      return false;
    }
  }

  function increment(eventId) {
    const url = `${COUNTIFY_BASE}/increment/${encodeURIComponent(eventId)}`;
    fetch(url, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
    }).catch(() => {});
  }

  function recordTotalAndMaybeUnique(totalId, uniqueId, storageKey) {
    increment(totalId);
    if (markUnique(storageKey)) {
      increment(uniqueId);
    }
  }

  recordTotalAndMaybeUnique(
    EVENTS.qrVisitTotal,
    EVENTS.qrVisitUnique,
    STORAGE_KEYS.qrVisitUnique
  );

  player.addEventListener("play", () => {
    if (sessionFlags.started) {
      return;
    }
    sessionFlags.started = true;
    recordTotalAndMaybeUnique(
      EVENTS.videoStartTotal,
      EVENTS.videoStartUnique,
      STORAGE_KEYS.videoStartUnique
    );
  });

  player.addEventListener("timeupdate", () => {
    if (!sessionFlags.engaged && player.currentTime >= 5) {
      sessionFlags.engaged = true;
      recordTotalAndMaybeUnique(
        EVENTS.videoEngagedTotal,
        EVENTS.videoEngagedUnique,
        STORAGE_KEYS.videoEngagedUnique
      );
    }
  });

  player.addEventListener("ended", () => {
    if (sessionFlags.completed) {
      return;
    }
    sessionFlags.completed = true;
    recordTotalAndMaybeUnique(
      EVENTS.videoCompleteTotal,
      EVENTS.videoCompleteUnique,
      STORAGE_KEYS.videoCompleteUnique
    );
  });
})();
