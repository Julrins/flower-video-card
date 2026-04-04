#!/usr/bin/env python3
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

BASE_URL = "https://api.countify.xyz/get-total/"
EVENTS = {
    "qr_visit_total": "julrins-flower-video-card-qr-visit-total",
    "qr_visit_unique": "julrins-flower-video-card-qr-visit-unique",
    "video_start_total": "julrins-flower-video-card-video-start-total",
    "video_start_unique": "julrins-flower-video-card-video-start-unique",
    "video_engaged_total": "julrins-flower-video-card-video-engaged-total",
    "video_engaged_unique": "julrins-flower-video-card-video-engaged-unique",
    "video_complete_total": "julrins-flower-video-card-video-complete-total",
    "video_complete_unique": "julrins-flower-video-card-video-complete-unique",
}


def fetch_metric(event_id: str) -> dict[str, object]:
    with urlopen(BASE_URL + event_id, timeout=10) as response:
        payload = json.load(response)
    return {
        "count": int(payload.get("count", 0)),
        "last_updated": payload.get("last_updated"),
    }


def build_payload() -> dict[str, object]:
    metrics: dict[str, dict[str, object]] = {}
    for metric_name, event_id in EVENTS.items():
        metrics[metric_name] = fetch_metric(event_id)

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "metrics": metrics,
    }


def main() -> int:
    output_path = Path(__file__).resolve().parent / "stats.json"
    try:
        payload = build_payload()
    except URLError as error:
        raise SystemExit(f"failed to fetch stats: {error}") from error

    output_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
