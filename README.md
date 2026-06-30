# Notes App

A minimalist single-page note-taking app built with React and Tailwind CSS.

## Features

- Sidebar with saved notes and active note highlighting
- Create, edit, and delete notes
- Search by title or content
- Dark mode toggle with system preference fallback
- Responsive layout with mobile sidebar
- Notes persist in `localStorage`

## Run locally

Because this app uses React and Tailwind from CDN, you can open it directly in a browser:

```bash
open index.html
```

For the best experience (especially with ES modules and fetch), serve it with a local static server:

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).
