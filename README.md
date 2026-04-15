# HEIC to JPG MVP

A minimal production-ready MVP for a HEIC to JPG converter website built with Next.js, TypeScript, Tailwind CSS, and server-side file conversion.

## Features

- Upload `.heic` and `.heif` files
- Maximum 10 files per request
- Maximum 20 MB per file
- Server-side conversion to JPG
- Individual download links for converted files
- ZIP download when multiple files are converted
- Temporary file storage only
- Automatic cleanup of stale temporary files
- Privacy page and terms page
- No database

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- `heic-convert` for HEIC to JPG conversion
- Docker

## Project structure

```text
app/
  api/
    convert/route.ts
    download/[token]/route.ts
    download-zip/[token]/route.ts
  privacy/page.tsx
  terms/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  FileList.tsx
  Hero.tsx
  UploadBox.tsx
lib/
  cleanup.ts
  config.ts
  convert.ts
  file-store.ts
  http.ts
  paths.ts
  zip.ts
tmp/
  uploads/
  converted/
  zips/
Dockerfile
README.md
```

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

## Docker setup

### Build the image

```bash
docker build -t heic-to-jpg .
```

### Run the container

```bash
docker run -p 3000:3000 heic-to-jpg
```

## Notes before public launch

This is a strong MVP foundation, but before a real public launch you should still add:

- rate limiting
- abuse protection
- file scanning if needed
- stronger cleanup and persistent token tracking across restarts
- logging and monitoring
- analytics
- legal copy review
- optional object storage if traffic grows

## How temporary files work

- uploaded source files are written to `tmp/uploads`
- converted JPG files are written to `tmp/converted`
- ZIP bundles are written to `tmp/zips`
- a cleanup job removes stale files from disk
- download links expire after 15 minutes

## Extending later

To support more converters later, keep the current pattern:

- create a dedicated converter function in `lib/convert-*.ts`
- add a new route handler for the conversion type
- reuse the file store, ZIP creation, validation rules, and cleanup job
