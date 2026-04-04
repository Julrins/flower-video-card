# Video Fragment QR

This folder contains a small static page for a separate legal clip file.

Important:
- A QR code cannot enforce an exact interval on a third-party film page.
- If you need "no more, no less", the reliable solution is a separate clip file such as `clip-web.mp4`.
- This project assumes you already have the right to use that clip.

## Files

- `index.html`: landing page with the player and a QR preview form
- `card.html`: printable card for flowers with a QR code and your message
- `app.js`: stops playback at the configured end point
- `styles.css`: page styling
- `generate_qr_url.py`: builds a direct QR image URL for your public page
- `clip-web.mp4`: compressed file for publication
- `clip.mp4`: original local source, not meant for GitHub

## Quick Start

1. Put your licensed clip file into this folder.
2. For publishing, keep the web-ready file as `clip-web.mp4`.
3. Start a local static server from this directory:

```bash
cd /Users/aotutov/projects/video-fragment-qr
python3 -m http.server 8000
```

4. Open:

```text
http://localhost:8000/
```

If your file has a different name, pass it in the URL:

```text
http://localhost:8000/?src=allowed-fragment.mp4&title=Green%20Room%20Excerpt
```

If you want to force-stop playback before the file ends, add `duration` in seconds:

```text
http://localhost:8000/?src=allowed-fragment.mp4&title=Conference%20Moment&duration=32
```

## QR

When you deploy the page to a public URL, build a QR image link with:

```bash
cd /Users/aotutov/projects/video-fragment-qr
python3 generate_qr_url.py "https://example.com/fragment/"
```

The script prints a ready QR image URL. You can also paste the same public URL into the `QR Builder` section on the page.

For a printed gift card, open:

```text
http://localhost:8000/card.html
```

Paste your public page URL there, customize the text, then print the card.

## Show It To A Friend

If your friend is nearby and on the same Wi-Fi, this is the fastest route:

1. Start the page so it is reachable from other devices on your network:

```bash
cd /Users/aotutov/projects/video-fragment-qr
python3 -m http.server 8000 --bind 0.0.0.0
```

2. Find your laptop local IP address in macOS Wi-Fi settings.
3. Open this address on your own phone first:

```text
http://YOUR_LOCAL_IP:8000/
```

4. Build a QR for exactly that address:

```bash
cd /Users/aotutov/projects/video-fragment-qr
python3 generate_qr_url.py "http://YOUR_LOCAL_IP:8000/"
```

Important:
- This works only while your server is running.
- Both devices should be on the same network.
- If macOS firewall blocks incoming connections, allow Python when prompted.

## Deployment

Any static hosting will work:

- GitHub Pages
- Netlify
- Vercel static site
- Your own web server

After deployment, your QR should point to the public page URL, not to the raw MP4 file, unless you want the clip file to open directly.

## Suggested Flow

1. Upload this folder to any static host.
2. Check that the public page with the video opens on your phone.
3. Open the public `card.html` or local `http://localhost:8000/card.html`.
4. Paste the public page URL into the card generator.
5. Print the card and attach it to the flowers.
