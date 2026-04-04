#!/usr/bin/env python3
"""Build a direct QR image URL for a public page."""

from __future__ import annotations

import argparse
from urllib.parse import urlencode


def build_qr_url(target: str, size: int) -> str:
    params = urlencode(
        {
            "size": f"{size}x{size}",
            "data": target,
            "format": "png",
            "margin": "16",
        }
    )
    return f"https://api.qrserver.com/v1/create-qr-code/?{params}"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Return a QR image URL for a public fragment page."
    )
    parser.add_argument("target_url", help="Public page URL to encode in the QR code")
    parser.add_argument(
        "--size",
        type=int,
        default=640,
        help="QR image size in pixels for each side (default: 640)",
    )
    args = parser.parse_args()

    print(build_qr_url(args.target_url, args.size))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
