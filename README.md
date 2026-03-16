# TempMGen

Web app sederhana untuk:

- generate email otomatis dengan pola `namaorang + benda + kota + angka 0-99`
- kunci domain output ke `@pokemail.net`
- pakai session Guerrilla Mail di balik Worker

## Stack

- Cloudflare Workers
- Static frontend (`public/`)
- Worker API proxy (`src/worker.js`)

Provider saat ini: `Guerrilla Mail`

Domain output tetap: `@pokemail.net`

Skema generator:

- 50 nama orang
- 50 nama benda
- 50 kota Indonesia
- angka acak `0-99`

Contoh hasil:

- `andipakukediri99@pokemail.net`

## Endpoint internal

- `GET /api/domains`
- `POST /api/create`
- `GET /api/health`

## GitHub Actions Auto Deploy

Workflow deploy otomatis sudah disiapkan di `.github/workflows/deploy.yml`.

Trigger:

- push ke branch `main`
- manual dari menu Actions lewat `workflow_dispatch`

## GitHub Secrets yang wajib diisi

Tambahkan di GitHub repo `Settings -> Secrets and variables -> Actions`:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Cara isi `CLOUDFLARE_API_TOKEN`

1. Buka Cloudflare dashboard
2. Masuk ke `My Profile -> API Tokens`
3. Pilih `Create Token`
4. Pakai template `Edit Cloudflare Workers`
5. Batasi ke account Cloudflare yang dipakai deploy Worker ini
6. Simpan token itu ke GitHub secret `CLOUDFLARE_API_TOKEN`

### Cara isi `CLOUDFLARE_ACCOUNT_ID`

1. Buka Cloudflare dashboard
2. Pilih account yang dipakai
3. Salin `Account ID`
4. Simpan ke GitHub secret `CLOUDFLARE_ACCOUNT_ID`

## Secret Telegram Bot

Token bot Telegram jangan dimasukkan ke repository atau file source.

Karena token sempat dipaste di chat, sebaiknya:

1. rotate token dulu lewat `@BotFather`
2. setelah dapat token baru, simpan sebagai secret Worker:

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
```

Kalau nanti kamu mau sinkronkan secret Telegram lewat GitHub Actions juga, saya bisa tambahkan step khusus setelah kamu menyiapkan secret GitHub `TELEGRAM_BOT_TOKEN`.

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
- App ini sengaja mengunci domain ke `@pokemail.net`
- `actualEmail` dari Guerrilla bisa berbeda domain, tetapi inbox session tetap dipakai untuk menerima email
