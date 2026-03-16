# TempMGen

Web app sederhana untuk:

- generate email otomatis dengan pola `namaorang + benda + kota + angka 0-99`
- pakai domain aktif dari `mail.tm`
- pakai akun email sementara berbasis `mail.tm`
- terima update Telegram lewat webhook Worker
- sediakan command bot `/start`, `/new`, `/history`, `/delete`, `/note`, `/inbox`, `/refresh`, dan `/import`
- simpan history email Telegram dengan batas default 5, premium 25, dan admin unlimited
- tampilkan saran password, VCC dummy, dan OTP yang terdeteksi saat perlu

## Stack

- Cloudflare Workers
- Static frontend (`public/`)
- Worker API proxy (`src/worker.js`)

Provider saat ini: `mail.tm`

Skema generator:

- 50 nama orang
- 50 nama benda
- 50 kota Indonesia
- angka acak `0-99`

Contoh hasil:

- `andipakukediri99@sharebot.net`

## Endpoint internal

- `GET /api/domains`
- `POST /api/create`
- `GET /api/health`
- `POST /telegram/webhook`

## Telegram Bot

Command yang sudah aktif:

- `/start`
- `/new`
- `/history`
- `/delete`
- `/note`
- `/inbox`
- `/refresh`
- `/import`

### Secret yang dipakai Worker

- `TELEGRAM_BOT_TOKEN` wajib
- `TELEGRAM_WEBHOOK_SECRET` opsional tapi direkomendasikan
- `PREMIUM_CHAT_IDS` opsional untuk menandai chat premium agar limit history naik ke 25

### Set webhook Telegram

Setelah Worker ter-deploy dan secret bot sudah terisi, arahkan webhook Telegram ke:

```text
https://<worker-url>/telegram/webhook
```

Tanpa webhook secret:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<worker-url>/telegram/webhook"
```

Dengan webhook secret:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<worker-url>/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>"
```

### Flow command saat ini

- `/start` menampilkan bantuan bot
- `/new` membuat email baru seperti `andipakukediri99@sharebot.net`
- `/history` menampilkan history email user
- `/delete email@domain.tld` menghapus 1 email dari history
- `/note email@domain.tld catatan` menambah catatan untuk email tertentu
- `/inbox email@domain.tld` membuka inbox email itu
- `/refresh email@domain.tld` mengambil inbox terbaru untuk email itu
- `/import email@domain.tld password` memulihkan email lama atau email dari luar bot selama domain masih didukung
- tombol inline `Inbox`, `Refresh`, `History`, `Hapus History Email`, dan `Pembelian 5k/bulan` ikut dikirim di pesan bot

### History email

- limit default: `5` email per chat Telegram
- limit premium: `25` email per chat Telegram
- akun admin `@AndiPradanaAr` otomatis `unlimited history`
- saat history penuh, bot menolak generate/import email baru dan menampilkan pesan error
- tombol `Pembelian 5k/bulan` langsung diarahkan ke `https://t.me/AndiPradanaAr`
- setiap email history bisa punya catatan sendiri
- untuk email luar bot, password akun harus ikut disertakan saat import pertama kali

Cloudflare Durable Object dipakai untuk menyimpan history email per chat.

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

Webhook secret opsional:

```bash
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
```

Chat premium opsional:

```bash
npx wrangler secret put PREMIUM_CHAT_IDS
```

Isi `PREMIUM_CHAT_IDS` dengan daftar chat ID premium dipisah koma atau baris baru.

Catatan admin:

- user Telegram dengan username `@AndiPradanaAr` otomatis dianggap admin
- admin tidak perlu subscribe dan limit history-nya unlimited

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

- Tidak perlu API key untuk `mail.tm`
- Worker membuat akun email sementara dan mengambil JWT token dari `mail.tm`
- Domain email mengikuti daftar aktif dari `mail.tm`
- Webhook Telegram ada di `/telegram/webhook`
- History email Telegram disimpan di Durable Object `TempMGenState`
