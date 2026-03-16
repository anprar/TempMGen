# TempMGen

Web app sederhana untuk:

- tampilkan daftar domain Guerrilla Mail
- filter domain langsung di UI
- generate email dari `namaaccount@domain`

## Stack

- Cloudflare Workers
- Static frontend (`public/`)
- Worker API proxy (`src/worker.js`)

Provider saat ini: `Guerrilla Mail`

## Endpoint internal

- `GET /api/domains`
- `POST /api/create`
- `GET /api/health`

## Jalankan lokal

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run deploy
```

## Catatan

- Tidak perlu API key untuk Guerrilla Mail
- Worker menyimpan session Guerrilla Mail di cookie `TEMPMGEN_GMSESSID` agar nanti bisa dipakai untuk inbox/check email
- Domain Guerrilla yang berbeda tetap menuju inbox session yang sama; pergantian domain terutama memengaruhi alamat yang ditampilkan ke user
