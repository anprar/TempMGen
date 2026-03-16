const GUERRILLA_API_URL = "https://api.guerrillamail.com/ajax.php";
const SESSION_COOKIE = "TEMPMGEN_GMSESSID";
const FIXED_DOMAIN = "pokemail.net";
const DEFAULT_HISTORY_LIMIT = 5;
const PREMIUM_HISTORY_LIMIT = 25;
const PREMIUM_HISTORY_PRICE_LABEL = "5k/bulan";
const ADMIN_TELEGRAM_USERNAME = "AndiPradanaAr";
const ADMIN_TELEGRAM_URL = "https://t.me/AndiPradanaAr";
const HISTORY_PREVIEW_LIMIT = 25;
const HISTORY_NOTE_MAX_LENGTH = 300;
const FALLBACK_HISTORY_STORE = new Map();
const FALLBACK_PENDING_STORE = new Map();
const SUPPORTED_EMAIL_DOMAINS = [
  "sharklasers.com",
  "guerrillamail.info",
  "grr.la",
  "guerrillamail.biz",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "pokemail.net",
  "spam4.me",
];
const PASSWORD_ANIMALS = [
  "Gajah",
  "Harimau",
  "Kucing",
  "Anjing",
  "Kuda",
  "Zebra",
  "Panda",
  "Koala",
  "Kelinci",
  "Elang",
  "Naga",
  "Singa",
  "Macan",
  "Rusa",
  "Beruang",
  "Paus",
  "Lumba",
  "Cheetah",
  "Kijang",
  "Burung",
];
const PASSWORD_ACTIONS = [
  "Makan",
  "Minum",
  "Lari",
  "Tidur",
  "Belanja",
  "Main",
  "Belajar",
  "Masak",
  "Kerja",
  "Jalan",
  "Duduk",
  "Nonton",
  "Mandi",
  "Nari",
  "Nyanyi",
  "Mancing",
  "Ngoding",
  "Olahraga",
  "Membaca",
  "Berkebun",
];
const PASSWORD_FOODS = [
  "Pisang",
  "Bakso",
  "Soto",
  "Kopi",
  "Teh",
  "Susu",
  "Roti",
  "Mie",
  "Nasi",
  "Ayam",
  "Burger",
  "Jus",
  "Puding",
  "Donat",
  "EsKrim",
  "Martabak",
  "Seblak",
  "Rendang",
  "Sate",
  "Boba",
];
const PEOPLE = [
  "andi",
  "budi",
  "cahya",
  "dewi",
  "eka",
  "fajar",
  "gani",
  "hani",
  "indra",
  "joko",
  "kiki",
  "lina",
  "mega",
  "nanda",
  "okta",
  "putra",
  "qori",
  "rani",
  "sandi",
  "tari",
  "ulfa",
  "vino",
  "wati",
  "yoga",
  "zaki",
  "agus",
  "bella",
  "citra",
  "dimas",
  "elsa",
  "farah",
  "galih",
  "hanif",
  "irma",
  "jihan",
  "kevin",
  "lutfi",
  "mira",
  "nina",
  "ovi",
  "prima",
  "rahma",
  "salsa",
  "tiara",
  "umar",
  "vidi",
  "wahyu",
  "yuni",
  "zahra",
  "rio",
];
const OBJECTS = [
  "paku",
  "meja",
  "kursi",
  "lampu",
  "buku",
  "pena",
  "gelas",
  "sendok",
  "garpu",
  "payung",
  "tas",
  "sepatu",
  "bantal",
  "guling",
  "lemari",
  "kunci",
  "roda",
  "mesin",
  "kipas",
  "botol",
  "cermin",
  "radio",
  "kabel",
  "piring",
  "pisau",
  "helm",
  "sabun",
  "ember",
  "jarum",
  "kertas",
  "sarung",
  "selimut",
  "karpet",
  "rantai",
  "gembok",
  "sapu",
  "penggaris",
  "kompor",
  "wajan",
  "mangkok",
  "topi",
  "jaket",
  "kaos",
  "celana",
  "koper",
  "baskom",
  "obeng",
  "palu",
  "spidol",
  "terminal",
];
const CITIES = [
  "jakarta",
  "bandung",
  "bogor",
  "depok",
  "bekasi",
  "tangerang",
  "cirebon",
  "serang",
  "semarang",
  "solo",
  "salatiga",
  "yogyakarta",
  "magelang",
  "tegal",
  "purwokerto",
  "surabaya",
  "madiun",
  "kediri",
  "blitar",
  "malang",
  "probolinggo",
  "pasuruan",
  "mojokerto",
  "banyuwangi",
  "denpasar",
  "mataram",
  "kupang",
  "pontianak",
  "singkawang",
  "palangkaraya",
  "banjarmasin",
  "samarinda",
  "balikpapan",
  "tarakan",
  "manado",
  "gorontalo",
  "palu",
  "makassar",
  "parepare",
  "kendari",
  "baubau",
  "ambon",
  "ternate",
  "jayapura",
  "sorong",
  "merauke",
  "padang",
  "pekanbaru",
  "jambi",
  "palembang",
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json(
        {
          ok: true,
          service: "TempMGen",
          provider: "Guerrilla Mail",
          fixedDomain: FIXED_DOMAIN,
          generator: getGeneratorInfo(),
          hasTelegramToken: Boolean(env.TELEGRAM_BOT_TOKEN),
          telegramWebhookPath: "/telegram/webhook",
          hasTelegramWebhookSecret: Boolean(env.TELEGRAM_WEBHOOK_SECRET),
          defaultHistoryLimit: DEFAULT_HISTORY_LIMIT,
          premiumHistoryLimit: PREMIUM_HISTORY_LIMIT,
          hasHistoryStorage: Boolean(env.TEMP_MGEN_STATE),
        },
        200,
      );
    }

    if (url.pathname === "/api/domains" && request.method === "GET") {
      return json(
        {
          ok: true,
          provider: "Guerrilla Mail",
          locked: true,
          fixedDomain: FIXED_DOMAIN,
          domains: [FIXED_DOMAIN],
          generator: getGeneratorInfo(),
          note: "Domain dikunci ke @pokemail.net. Nama email dibuat otomatis di Worker.",
        },
        200,
      );
    }

    if (url.pathname === "/api/create" && request.method === "POST") {
      return handleCreate(request);
    }

    if (url.pathname === "/telegram/webhook" && request.method === "POST") {
      return handleTelegramWebhook(request, env);
    }

    if (url.pathname === "/telegram/webhook" && request.method === "GET") {
      return json(
        {
          ok: true,
          message: "Telegram webhook endpoint is ready.",
          hasTelegramToken: Boolean(env.TELEGRAM_BOT_TOKEN),
          hasTelegramWebhookSecret: Boolean(env.TELEGRAM_WEBHOOK_SECRET),
        },
        200,
      );
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ ok: false, error: "Route not found" }, 404);
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Static assets binding not configured.", { status: 500 });
  },
};

async function handleCreate(request) {
  const result = await generateMailbox(request);

  if (!result.ok) {
    return json({ ok: false, error: result.error }, 502);
  }

  const response = json(result.payload, 200);

  if (result.sessionId) {
    response.headers.append("set-cookie", serializeCookie(SESSION_COOKIE, result.sessionId));
  }

  return response;
}

async function handleTelegramWebhook(request, env) {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return json({ ok: false, error: "TELEGRAM_BOT_TOKEN is missing." }, 500);
  }

  if (env.TELEGRAM_WEBHOOK_SECRET) {
    const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");

    if (headerSecret !== env.TELEGRAM_WEBHOOK_SECRET) {
      return json({ ok: false, error: "Invalid Telegram webhook secret." }, 401);
    }
  }

  let update;

  try {
    update = await request.json();
  } catch {
    return json({ ok: false, error: "Webhook body must be valid JSON." }, 400);
  }

  const callbackQuery = update?.callback_query;

  if (callbackQuery) {
    return handleTelegramCallbackQuery(request, env, callbackQuery);
  }

  const message = update?.message ?? update?.edited_message;
  const chatId = message?.chat?.id;
  const text = String(message?.text ?? "").trim();
  const parsedCommand = parseTelegramCommand(text);
  const command = parsedCommand.command;
  const actorUsername = getTelegramActorUsername(message);
  const plan = getChatPlan(env, chatId, actorUsername);
  const pendingAction = await getPendingAction(env, chatId);

  if (!chatId) {
    return json({ ok: true, ignored: true }, 200);
  }

  if (!command && pendingAction && text) {
    return handlePendingTelegramInput(request, env, message, text, pendingAction, plan);
  }

  if (!command) {
    return json({ ok: true, ignored: true }, 200);
  }

  if (command === "start") {
    const historyState = await getHistoryState(env, chatId, plan);

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildStartMessage(historyState), {
      parse_mode: "HTML",
      reply_markup: buildHomeKeyboard(historyState),
    });

    return json({ ok: true, handled: true, command }, 200);
  }

  if (command === "history") {
    const historyState = await getHistoryState(env, chatId, plan);

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistoryMessage(historyState), {
      parse_mode: "HTML",
      reply_markup: buildHistorySelectorKeyboard(historyState, 0),
    });

    return json({ ok: true, handled: true, command }, 200);
  }

  if (command === "delete") {
    const reference = resolveMailboxReference(message, parsedCommand.argsText);

    if (!reference.ok) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildDeleteUsageMessage(reference.error), {
        parse_mode: "HTML",
      });

      return json({ ok: true, handled: true, command, error: reference.error }, 200);
    }

    const historyState = await deleteHistoryEntry(env, chatId, reference.email, plan);

    if (!historyState.ok) {
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        buildDeleteResultMessage(reference.email, historyState),
        {
          parse_mode: "HTML",
          reply_markup: buildHomeKeyboard(historyState),
        },
      );

      return json({ ok: true, handled: true, command, error: historyState.error || historyState.code }, 200);
    }

    await sendTelegramMessage(
      env.TELEGRAM_BOT_TOKEN,
      chatId,
      buildDeleteResultMessage(reference.email, historyState),
      {
        parse_mode: "HTML",
        reply_markup: buildHomeKeyboard(historyState),
      },
    );

    return json({ ok: true, handled: true, command, email: reference.email }, 200);
  }

  if (command === "note") {
    const noteInput = resolveNoteInput(message, parsedCommand.argsText);

    if (!noteInput.ok) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildNoteUsageMessage(noteInput.error), {
        parse_mode: "HTML",
      });

      return json({ ok: true, handled: true, command, error: noteInput.error }, 200);
    }

    const historyState = await updateHistoryNote(env, chatId, noteInput.email, noteInput.note, plan);

    if (!historyState.ok) {
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        buildNoteResultMessage(noteInput.email, noteInput.note, historyState),
        {
          parse_mode: "HTML",
          reply_markup: buildHomeKeyboard(historyState),
        },
      );

      return json({ ok: true, handled: true, command, error: historyState.error || historyState.code }, 200);
    }

    await sendTelegramMessage(
      env.TELEGRAM_BOT_TOKEN,
      chatId,
      buildNoteResultMessage(noteInput.email, noteInput.note, historyState),
      {
        parse_mode: "HTML",
        reply_markup: buildMailboxKeyboard(noteInput.localPart, historyState),
      },
    );

    return json({ ok: true, handled: true, command, email: noteInput.email }, 200);
  }

  if (command === "new") {
    const historyState = await getHistoryState(env, chatId, plan);

    if (isHistoryLimitReached(historyState)) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistoryLimitMessage(historyState), {
        parse_mode: "HTML",
        reply_markup: buildHomeKeyboard(historyState),
      });

      return json({ ok: true, handled: true, command, error: "History limit reached" }, 200);
    }

    const result = await generateMailbox(request);

    if (!result.ok) {
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        `Gagal membuat email baru.\n\n${escapeHtml(result.error)}`,
        { parse_mode: "HTML" },
      );

      return json({ ok: false, handled: true, command, error: result.error }, 502);
    }

    const historyRecord = await recordHistoryEntry(env, chatId, result.payload, "generated", plan);

    if (!historyRecord.ok) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistoryLimitMessage(historyRecord), {
        parse_mode: "HTML",
        reply_markup: buildHomeKeyboard(historyRecord),
      });

      return json({ ok: true, handled: true, command, error: "History limit reached" }, 200);
    }

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildNewEmailMessage(result.payload, historyRecord), {
      parse_mode: "HTML",
      reply_markup: buildMailboxKeyboard(result.payload.username, historyRecord),
    });

    return json({ ok: true, handled: true, command, email: result.payload.email }, 200);
  }

  if (command === "import") {
    const reference = resolveMailboxReference(message, parsedCommand.argsText);

    if (!reference.ok) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildImportUsageMessage(reference.error), {
        parse_mode: "HTML",
      });

      return json({ ok: true, handled: true, command, error: reference.error }, 200);
    }

    const historyState = await getHistoryState(env, chatId, plan);

    if (isHistoryLimitReached(historyState) && !hasHistoryEmail(historyState, reference.email)) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistoryLimitMessage(historyState), {
        parse_mode: "HTML",
        reply_markup: buildHomeKeyboard(historyState),
      });

      return json({ ok: true, handled: true, command, error: "History limit reached" }, 200);
    }

    const inboxResult = await getMailboxInbox(request, reference.localPart, {
      displayEmail: reference.email,
    });

    if (!inboxResult.ok) {
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        `Gagal import email.\n\n${escapeHtml(inboxResult.error)}`,
        { parse_mode: "HTML" },
      );

      return json({ ok: false, handled: true, command, error: inboxResult.error }, 502);
    }

    const historyRecord = await recordHistoryEntry(env, chatId, inboxResult.payload, "imported", plan);

    if (!historyRecord.ok) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistoryLimitMessage(historyRecord), {
        parse_mode: "HTML",
        reply_markup: buildHomeKeyboard(historyRecord),
      });

      return json({ ok: true, handled: true, command, error: "History limit reached" }, 200);
    }

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildImportSuccessMessage(inboxResult.payload, historyRecord), {
      parse_mode: "HTML",
      reply_markup: buildMailboxKeyboard(reference.localPart, historyRecord),
    });

    return json({ ok: true, handled: true, command, email: inboxResult.payload.email }, 200);
  }

  if (command === "inbox" || command === "refresh") {
    const reference = resolveMailboxReference(message, parsedCommand.argsText);

    if (!reference.ok) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildInboxUsageMessage(reference.error), {
        parse_mode: "HTML",
      });

      return json({ ok: true, handled: true, command, error: reference.error }, 200);
    }

    const historyState = await getHistoryState(env, chatId, plan);
    const historyEntry = findHistoryEntry(historyState, reference.email || reference.localPart);
    const inboxResult = await getMailboxInbox(request, reference.localPart, {
      displayEmail: historyEntry?.email || reference.email,
      historyEntry,
    });

    if (!inboxResult.ok) {
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        `Gagal mengambil inbox.\n\n${escapeHtml(inboxResult.error)}`,
        { parse_mode: "HTML" },
      );

      return json({ ok: false, handled: true, command, error: inboxResult.error }, 502);
    }

    await sendTelegramMessage(
      env.TELEGRAM_BOT_TOKEN,
      chatId,
      buildInboxMessage(inboxResult.payload, { refreshed: command === "refresh" }),
      {
        parse_mode: "HTML",
        reply_markup: buildMailboxKeyboard(reference.localPart, historyState),
      },
    );

    return json({ ok: true, handled: true, command, email: inboxResult.payload.email }, 200);
  }

  const historyState = await getHistoryState(env, chatId, plan);

  await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildUnknownCommandMessage(), {
    parse_mode: "HTML",
    reply_markup: buildHomeKeyboard(historyState),
  });

  return json({ ok: true, handled: true, command }, 200);
}

async function handleTelegramCallbackQuery(request, env, callbackQuery) {
  const callbackId = callbackQuery?.id;
  const chatId = callbackQuery?.message?.chat?.id;
  const data = String(callbackQuery?.data ?? "");
  const actorUsername = getTelegramActorUsername(callbackQuery);
  const plan = getChatPlan(env, chatId, actorUsername);

  if (!callbackId || !chatId || !data) {
    return json({ ok: true, ignored: true }, 200);
  }

  try {
    if (data === "new") {
      const historyState = await getHistoryState(env, chatId, plan);

      if (isHistoryLimitReached(historyState)) {
        await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "History penuh.", true);
        await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistoryLimitMessage(historyState), {
          parse_mode: "HTML",
          reply_markup: buildHomeKeyboard(historyState),
        });

        return json({ ok: true, handled: true, callback: data, error: "History limit reached" }, 200);
      }

      const result = await generateMailbox(request);

      if (!result.ok) {
        await answerTelegramCallbackQuery(
          env.TELEGRAM_BOT_TOKEN,
          callbackId,
          "Generate email gagal.",
          true,
        );
        await sendTelegramMessage(
          env.TELEGRAM_BOT_TOKEN,
          chatId,
          `Gagal membuat email baru.\n\n${escapeHtml(result.error)}`,
          { parse_mode: "HTML" },
        );

        return json({ ok: false, handled: true, callback: data, error: result.error }, 502);
      }

      const historyRecord = await recordHistoryEntry(env, chatId, result.payload, "generated", plan);

      if (!historyRecord.ok) {
        await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "History penuh.", true);
        await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistoryLimitMessage(historyRecord), {
          parse_mode: "HTML",
          reply_markup: buildHomeKeyboard(historyRecord),
        });

        return json({ ok: true, handled: true, callback: data, error: "History limit reached" }, 200);
      }

      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Email baru dibuat.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildNewEmailMessage(result.payload, historyRecord), {
        parse_mode: "HTML",
        reply_markup: buildMailboxKeyboard(result.payload.username, historyRecord),
      });

      return json({ ok: true, handled: true, callback: data, email: result.payload.email }, 200);
    }

    if (data === "history") {
      const historyState = await getHistoryState(env, chatId, plan);

      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "History ditampilkan.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistoryMessage(historyState), {
        parse_mode: "HTML",
        reply_markup: buildHistorySelectorKeyboard(historyState, 0),
      });

      return json({ ok: true, handled: true, callback: data }, 200);
    }

    if (data === "history_select:0" || data.startsWith("history_select:")) {
      const historyState = await getHistoryState(env, chatId, plan);
      const page = Number.parseInt(data.split(":")[1] || "0", 10) || 0;

      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Pilih email dari history.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistorySelectorMessage(historyState, page), {
        parse_mode: "HTML",
        reply_markup: buildHistorySelectorKeyboard(historyState, page),
      });

      return json({ ok: true, handled: true, callback: data }, 200);
    }

    if (data === "import_prompt") {
      const historyState = await getHistoryState(env, chatId, plan);

      await setPendingAction(env, chatId, { type: "import" });
      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Kirim email yang ingin diimport.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildImportPromptMessage(), {
        parse_mode: "HTML",
        reply_markup: buildHomeKeyboard(historyState),
        reply_parameters: callbackQuery?.message?.message_id
          ? { message_id: callbackQuery.message.message_id }
          : undefined,
      });

      return json({ ok: true, handled: true, callback: data }, 200);
    }

    if (data === "buy_history") {
      const historyState = await getHistoryState(env, chatId, plan);

      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Info pembelian dikirim.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildBuyHistoryMessage(chatId, historyState), {
        parse_mode: "HTML",
        reply_markup: buildHomeKeyboard(historyState),
      });

      return json({ ok: true, handled: true, callback: data }, 200);
    }

    const separator = data.indexOf(":");
    const action = separator >= 0 ? data.slice(0, separator) : data;
    const rawLocalPart = separator >= 0 ? data.slice(separator + 1) : "";
    const mailbox = parseMailboxReference(rawLocalPart);
    const historyState = await getHistoryState(env, chatId, plan);
    const historyEntry = mailbox.ok ? findHistoryEntry(historyState, mailbox.email || mailbox.localPart) : null;
    const targetEmail = historyEntry?.email || mailbox.email;

    if (!mailbox.ok || !rawLocalPart) {
      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Email tidak valid.", true);
      return json({ ok: true, handled: true, callback: data, error: mailbox.error }, 200);
    }

    if (action === "delete") {
      const nextHistoryState = await deleteHistoryEntry(env, chatId, targetEmail, plan);

      if (!nextHistoryState.ok) {
        await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Hapus history gagal.", true);
        await sendTelegramMessage(
          env.TELEGRAM_BOT_TOKEN,
          chatId,
          buildDeleteResultMessage(targetEmail, nextHistoryState),
          {
            parse_mode: "HTML",
            reply_markup: buildHomeKeyboard(nextHistoryState),
          },
        );

        return json({ ok: true, handled: true, callback: data, error: nextHistoryState.error || nextHistoryState.code }, 200);
      }

      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "History email dihapus.");
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        buildDeleteResultMessage(targetEmail, nextHistoryState),
        {
          parse_mode: "HTML",
          reply_markup: buildHomeKeyboard(nextHistoryState),
        },
      );

      return json({ ok: true, handled: true, callback: data, email: targetEmail }, 200);
    }

    if (action === "note_prompt") {
      await setPendingAction(env, chatId, {
        type: "note",
        email: targetEmail,
        localPart: mailbox.localPart,
      });
      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Kirim catatan untuk email ini.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildNotePromptMessage(targetEmail), {
        parse_mode: "HTML",
        reply_markup: buildMailboxKeyboard(mailbox.localPart, historyState),
        reply_parameters: callbackQuery?.message?.message_id
          ? { message_id: callbackQuery.message.message_id }
          : undefined,
      });

      return json({ ok: true, handled: true, callback: data, email: targetEmail }, 200);
    }

    if (action !== "inbox" && action !== "refresh") {
      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Aksi tidak dikenal.", true);
      return json({ ok: true, handled: true, callback: data }, 200);
    }

    const inboxResult = await getMailboxInbox(request, mailbox.localPart, {
      displayEmail: targetEmail,
      historyEntry,
    });

    if (!inboxResult.ok) {
      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Inbox gagal diambil.", true);
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        `Gagal mengambil inbox.\n\n${escapeHtml(inboxResult.error)}`,
        { parse_mode: "HTML" },
      );

      return json({ ok: false, handled: true, callback: data, error: inboxResult.error }, 502);
    }

    await answerTelegramCallbackQuery(
      env.TELEGRAM_BOT_TOKEN,
      callbackId,
      action === "refresh" ? "Inbox diperbarui." : "Inbox dibuka.",
    );
    await sendTelegramMessage(
      env.TELEGRAM_BOT_TOKEN,
      chatId,
      buildInboxMessage(inboxResult.payload, { refreshed: action === "refresh" }),
      {
        parse_mode: "HTML",
        reply_markup: buildMailboxKeyboard(mailbox.localPart, historyState),
      },
    );

    return json({ ok: true, handled: true, callback: data, email: inboxResult.payload.email }, 200);
  } catch (error) {
    await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Terjadi error.", true);
    throw error;
  }
}

async function handlePendingTelegramInput(request, env, message, text, pendingAction, plan) {
  const chatId = message?.chat?.id;

  if (!chatId) {
    return json({ ok: true, ignored: true }, 200);
  }

  await clearPendingAction(env, chatId);

  if (pendingAction.type === "import") {
    const reference = parseMailboxReference(text);

    if (!reference.ok) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildImportUsageMessage(reference.error), {
        parse_mode: "HTML",
      });

      return json({ ok: true, handled: true, pending: pendingAction.type, error: reference.error }, 200);
    }

    const historyState = await getHistoryState(env, chatId, plan);

    if (isHistoryLimitReached(historyState) && !hasHistoryEmail(historyState, reference.email)) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistoryLimitMessage(historyState), {
        parse_mode: "HTML",
        reply_markup: buildHomeKeyboard(historyState),
      });

      return json({ ok: true, handled: true, pending: pendingAction.type, error: "History limit reached" }, 200);
    }

    const inboxResult = await getMailboxInbox(request, reference.localPart, {
      displayEmail: reference.email,
    });

    if (!inboxResult.ok) {
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        `Gagal import email.\n\n${escapeHtml(inboxResult.error)}`,
        { parse_mode: "HTML" },
      );

      return json({ ok: false, handled: true, pending: pendingAction.type, error: inboxResult.error }, 502);
    }

    const historyRecord = await recordHistoryEntry(env, chatId, inboxResult.payload, "imported", plan);

    await sendTelegramMessage(
      env.TELEGRAM_BOT_TOKEN,
      chatId,
      buildImportSuccessMessage(inboxResult.payload, historyRecord),
      {
        parse_mode: "HTML",
        reply_markup: buildMailboxKeyboard(reference.localPart, historyRecord),
      },
    );

    return json({ ok: true, handled: true, pending: pendingAction.type, email: inboxResult.payload.email }, 200);
  }

  if (pendingAction.type === "note") {
    const note = normalizeHistoryNote(text);

    if (!note) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildNoteUsageMessage("Catatan belum diisi."), {
        parse_mode: "HTML",
      });

      return json({ ok: true, handled: true, pending: pendingAction.type, error: "Catatan belum diisi." }, 200);
    }

    const historyState = await updateHistoryNote(env, chatId, pendingAction.email, note, plan);

    await sendTelegramMessage(
      env.TELEGRAM_BOT_TOKEN,
      chatId,
      buildNoteResultMessage(pendingAction.email, note, historyState),
      {
        parse_mode: "HTML",
        reply_markup: buildMailboxKeyboard(pendingAction.localPart, historyState),
      },
    );

    return json({ ok: true, handled: true, pending: pendingAction.type, email: pendingAction.email }, 200);
  }

  return json({ ok: true, ignored: true }, 200);
}

async function generateMailbox(request) {
  const generated = generateIdentity();
  const passwordSuggestion = generatePasswordSuggestion();
  const vcc = generateDummyVcc();

  return withMailboxSession(request, generated.username, async ({ client, actualEmail, sessionId }) => {
    const inboxResult = await fetchMailboxMessages(client, sessionId, {
      deleteSystemMessages: true,
    });

    if (!inboxResult.ok) {
      return { ok: false, error: inboxResult.error };
    }

    const displayEmail = `${generated.username}@${FIXED_DOMAIN}`;
    const otpCodes = extractOtpCodes(inboxResult.messages);

    return {
      ok: true,
      sessionId: inboxResult.sessionId || sessionId,
      payload: {
        ok: true,
        email: displayEmail,
        actualEmail,
        username: generated.username,
        domain: FIXED_DOMAIN,
        parts: generated.parts,
        generator: getGeneratorInfo(),
        passwordSuggestion,
        vcc,
        inboxStatus: inboxResult.messages.length ? `Ada ${inboxResult.messages.length} pesan` : "Kosong",
        messageCount: inboxResult.messages.length,
        messages: inboxResult.messages,
        otpCodes,
      },
    };
  });
}

async function getMailboxInbox(request, localPart, options = {}) {
  return withMailboxSession(request, localPart, async ({ client, sessionId, actualEmail }) => {
    const inboxResult = await fetchMailboxMessages(client, sessionId, {
      deleteSystemMessages: true,
    });

    if (!inboxResult.ok) {
      return { ok: false, error: inboxResult.error };
    }

    const displayEmail = options.displayEmail || `${localPart}@${FIXED_DOMAIN}`;
    const historyEntry = options.historyEntry || null;
    const otpCodes = extractOtpCodes(inboxResult.messages);

    return {
      ok: true,
      sessionId: inboxResult.sessionId || sessionId,
      payload: {
        ok: true,
        email: displayEmail,
        actualEmail,
        username: localPart,
        domain: getEmailDomain(displayEmail),
        messageCount: inboxResult.messages.length,
        messages: inboxResult.messages,
        otpCodes,
        passwordSuggestion: historyEntry?.passwordSuggestion || "",
        vcc: historyEntry?.vcc || null,
      },
    };
  });
}

async function withMailboxSession(request, localPart, run) {
  const client = getClientDetails(request);
  const storedSessionId = getCookie(request.headers.get("cookie"), SESSION_COOKIE);

  const initResponse = await callGuerrilla(
    {
      f: "get_email_address",
      ip: client.ip,
      agent: client.agent,
      lang: "en",
    },
    storedSessionId,
  );

  if (!initResponse.ok) {
    return { ok: false, error: initResponse.error };
  }

  const activeSessionId = initResponse.sessionId || storedSessionId;
  const setResponse = await callGuerrilla(
    {
      f: "set_email_user",
      email_user: localPart,
      ip: client.ip,
      agent: client.agent,
      lang: "en",
    },
    activeSessionId,
  );

  if (!setResponse.ok) {
    return { ok: false, error: setResponse.error };
  }

  if (setResponse.data?.error) {
    return { ok: false, error: String(setResponse.data.error) };
  }

  const sessionId = setResponse.sessionId || activeSessionId;
  const actualEmail = String(setResponse.data?.email_addr || "").trim();
  return run({ client, sessionId, actualEmail, localPart });
}

async function callGuerrilla(params, sessionId) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        query.append(`${key}[]`, String(item));
      }
      continue;
    }

    query.set(key, String(value));
  }

  const headers = {
    Accept: "application/json",
  };

  if (sessionId) {
    headers.Cookie = `PHPSESSID=${sessionId}`;
  }

  try {
    const response = await fetch(`${GUERRILLA_API_URL}?${query.toString()}`, {
      method: "GET",
      headers,
    });
    const raw = await response.text();
    const setCookie = response.headers.get("set-cookie") || "";
    const nextSessionId = extractSetCookie(setCookie, "PHPSESSID") || sessionId;

    if (!response.ok) {
      return {
        ok: false,
        error: raw || `Guerrilla request failed with status ${response.status}`,
        sessionId: nextSessionId,
      };
    }

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      return {
        ok: false,
        error: "Guerrilla returned invalid JSON.",
        sessionId: nextSessionId,
      };
    }

    return {
      ok: true,
      data,
      sessionId: nextSessionId,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown upstream error",
      sessionId,
    };
  }
}

async function fetchMailboxMessages(client, sessionId, options = {}) {
  let activeSessionId = sessionId;

  const loadMessages = async () => {
    const response = await callGuerrilla(
      {
        f: "get_email_list",
        offset: 0,
        ip: client.ip,
        agent: client.agent,
        lang: "en",
      },
      activeSessionId,
    );

    if (!response.ok) {
      return response;
    }

    activeSessionId = response.sessionId || activeSessionId;
    return response;
  };

  let listResponse = await loadMessages();

  if (!listResponse.ok) {
    return { ok: false, error: listResponse.error, sessionId: activeSessionId };
  }

  if (listResponse.data?.error) {
    return { ok: false, error: String(listResponse.data.error), sessionId: activeSessionId };
  }

  let messages = Array.isArray(listResponse.data?.list)
    ? listResponse.data.list.map((item) => normalizeMailboxMessage(item))
    : [];

  if (options.deleteSystemMessages) {
    const systemMessageIds = messages.filter((item) => isSystemMailboxMessage(item)).map((item) => item.id);

    if (systemMessageIds.length) {
      const deleteResponse = await callGuerrilla(
        {
          f: "del_email",
          email_ids: systemMessageIds,
          ip: client.ip,
          agent: client.agent,
          lang: "en",
        },
        activeSessionId,
      );

      if (!deleteResponse.ok) {
        return { ok: false, error: deleteResponse.error, sessionId: activeSessionId };
      }

      activeSessionId = deleteResponse.sessionId || activeSessionId;
      listResponse = await loadMessages();

      if (!listResponse.ok) {
        return { ok: false, error: listResponse.error, sessionId: activeSessionId };
      }

      if (listResponse.data?.error) {
        return { ok: false, error: String(listResponse.data.error), sessionId: activeSessionId };
      }

      messages = Array.isArray(listResponse.data?.list)
        ? listResponse.data.list.map((item) => normalizeMailboxMessage(item))
        : [];
    }
  }

  return {
    ok: true,
    sessionId: activeSessionId,
    messages: messages.filter((item) => !isSystemMailboxMessage(item)),
  };
}

function generateIdentity() {
  const parts = {
    person: pick(PEOPLE),
    object: pick(OBJECTS),
    city: pick(CITIES),
    number: String(randomInt(100)),
  };
  const username = normalizeLocalPart(`${parts.person}${parts.object}${parts.city}${parts.number}`);

  return { username, parts };
}

function getGeneratorInfo() {
  return {
    pattern: "nama + benda + kota + angka 0-99",
    peopleCount: PEOPLE.length,
    objectCount: OBJECTS.length,
    cityCount: CITIES.length,
  };
}

function pick(list) {
  return list[randomInt(list.length)];
}

function randomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function randomBetween(min, max) {
  return min + randomInt(max - min + 1);
}

function padNumber(value, length = 2) {
  return String(value).padStart(length, "0");
}

function generatePasswordSuggestion() {
  return `${pick(PASSWORD_ANIMALS)}${pick(PASSWORD_ACTIONS)}${pick(PASSWORD_FOODS)}${padNumber(randomInt(100))}`;
}

function generateDummyVcc() {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const expYear = randomBetween(currentYear + 3, currentYear + 5);
  const expMonth = randomBetween(1, 12);
  const cvv = String(randomBetween(100, 999));
  const accountDigits = Array.from({ length: 9 }, () => String(randomInt(10))).join("");
  const baseNumber = `625814${accountDigits}`;
  const checkDigit = calculateLuhnCheckDigit(baseNumber);
  const number = `${baseNumber}${checkDigit}`;

  return {
    number,
    expMonth: padNumber(expMonth),
    expYear: String(expYear).slice(-2),
    expText: `${padNumber(expMonth)}/${String(expYear).slice(-2)}`,
    cvv,
  };
}

function calculateLuhnCheckDigit(baseNumber) {
  let sum = 0;
  let shouldDouble = true;

  for (let index = baseNumber.length - 1; index >= 0; index -= 1) {
    let digit = Number(baseNumber[index]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return String((10 - (sum % 10)) % 10);
}

function getEmailDomain(email) {
  const normalized = String(email ?? "").trim().toLowerCase();
  const atIndex = normalized.lastIndexOf("@");
  return atIndex >= 0 ? normalized.slice(atIndex + 1) : FIXED_DOMAIN;
}

function isSupportedEmailDomain(domain) {
  return SUPPORTED_EMAIL_DOMAINS.includes(String(domain ?? "").trim().toLowerCase());
}

function extractOtpCodes(messages) {
  const codes = [];
  const seen = new Set();

  for (const message of messages) {
    const haystack = `${message.subject} ${message.excerpt}`;
    const matches = haystack.match(/\b\d{4,8}\b/g) || [];

    for (const code of matches) {
      if (!seen.has(code)) {
        seen.add(code);
        codes.push(code);
      }
    }
  }

  return codes.slice(0, 5);
}

function getChatPlan(env, chatId, username = "") {
  const premiumChatIds = parsePremiumChatIds(env?.PREMIUM_CHAT_IDS);
  const isAdmin = normalizeTelegramUsername(username) === normalizeTelegramUsername(ADMIN_TELEGRAM_USERNAME);
  const isPremium = isAdmin || premiumChatIds.has(String(chatId ?? ""));

  return {
    isAdmin,
    isPremium,
    isUnlimited: isAdmin,
    limit: isAdmin ? null : isPremium ? PREMIUM_HISTORY_LIMIT : DEFAULT_HISTORY_LIMIT,
    upgradePriceLabel: PREMIUM_HISTORY_PRICE_LABEL,
  };
}

function parsePremiumChatIds(value) {
  const set = new Set();

  for (const item of String(value ?? "").split(/[\s,]+/)) {
    const trimmed = item.trim();
    if (trimmed) {
      set.add(trimmed);
    }
  }

  return set;
}

async function getHistoryState(env, chatId, plan = getChatPlan(env, chatId)) {
  const result = await invokeHistoryStore(env, chatId, "/state", {
    limit: plan.limit,
    isPremium: plan.isPremium,
    isUnlimited: plan.isUnlimited,
  });

  return normalizeHistoryState(result, plan);
}

async function recordHistoryEntry(env, chatId, payload, source, plan = getChatPlan(env, chatId)) {
  const result = await invokeHistoryStore(env, chatId, "/record", {
    email: payload.email,
    localPart: payload.username,
    note: payload.note || "",
    passwordSuggestion: payload.passwordSuggestion || "",
    vcc: payload.vcc || null,
    source,
    limit: plan.limit,
    isPremium: plan.isPremium,
    isUnlimited: plan.isUnlimited,
  });

  return normalizeHistoryState(result, plan);
}

async function deleteHistoryEntry(env, chatId, email, plan = getChatPlan(env, chatId)) {
  const reference = parseMailboxReference(email);

  if (!reference.ok) {
    return normalizeHistoryState(
      { ok: false, error: reference.error, items: [] },
      plan,
    );
  }

  const result = await invokeHistoryStore(env, chatId, "/delete", {
    email: reference.email,
    localPart: reference.localPart,
  });

  return normalizeHistoryState(result, plan);
}

async function updateHistoryNote(env, chatId, email, note, plan = getChatPlan(env, chatId)) {
  const reference = parseMailboxReference(email);

  if (!reference.ok) {
    return normalizeHistoryState(
      { ok: false, error: reference.error, items: [] },
      plan,
    );
  }

  const result = await invokeHistoryStore(env, chatId, "/note", {
    email: reference.email,
    localPart: reference.localPart,
    note,
  });

  return normalizeHistoryState(result, plan);
}

async function getPendingAction(env, chatId) {
  const result = await invokeHistoryStore(env, chatId, "/pending_get", {});
  return normalizePendingAction(result?.pending);
}

async function setPendingAction(env, chatId, pending) {
  const result = await invokeHistoryStore(env, chatId, "/pending_set", {
    pending: normalizePendingAction(pending),
  });
  return normalizePendingAction(result?.pending);
}

async function clearPendingAction(env, chatId) {
  const result = await invokeHistoryStore(env, chatId, "/pending_clear", {});
  return normalizePendingAction(result?.pending);
}

async function invokeHistoryStore(env, chatId, path, payload) {
  if (env?.TEMP_MGEN_STATE) {
    const id = env.TEMP_MGEN_STATE.idFromName(`chat:${chatId}`);
    const stub = env.TEMP_MGEN_STATE.get(id);
    const response = await stub.fetch(`https://history${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return response.json();
  }

  return fallbackHistoryStoreFetch(chatId, path, payload);
}

function fallbackHistoryStoreFetch(chatId, path, payload) {
  const key = String(chatId ?? "unknown");
  const existing = normalizeStoredHistory(FALLBACK_HISTORY_STORE.get(key));
  const pending = normalizePendingAction(FALLBACK_PENDING_STORE.get(key));

  if (path === "/state") {
    return {
      ok: true,
      items: existing,
      count: existing.length,
    };
  }

  if (path === "/pending_get") {
    return {
      ok: true,
      pending,
    };
  }

  if (path === "/pending_set") {
    const nextPending = normalizePendingAction(payload?.pending);

    if (nextPending) {
      FALLBACK_PENDING_STORE.set(key, nextPending);
    } else {
      FALLBACK_PENDING_STORE.delete(key);
    }

    return {
      ok: true,
      pending: nextPending,
    };
  }

  if (path === "/pending_clear") {
    FALLBACK_PENDING_STORE.delete(key);
    return {
      ok: true,
      pending: null,
    };
  }

  if (path === "/delete") {
    const reference = parseMailboxReference(payload?.email || payload?.localPart);

    if (!reference.ok) {
      return {
        ok: false,
        error: reference.error,
        items: existing,
        count: existing.length,
      };
    }

    const nextItems = existing.filter(
      (item) => item.localPart !== reference.localPart && item.email !== reference.email,
    );

    if (nextItems.length === existing.length) {
      return {
        ok: false,
        code: "not_found",
        items: existing,
        count: existing.length,
      };
    }

    FALLBACK_HISTORY_STORE.set(key, nextItems);

    return {
      ok: true,
      items: nextItems,
      count: nextItems.length,
    };
  }

  if (path === "/note") {
    const reference = parseMailboxReference(payload?.email || payload?.localPart);
    const note = normalizeHistoryNote(payload?.note);

    if (!reference.ok) {
      return {
        ok: false,
        error: reference.error,
        items: existing,
        count: existing.length,
      };
    }

    const nextItems = [...existing];
    const index = nextItems.findIndex(
      (item) => item.localPart === reference.localPart || item.email === reference.email,
    );

    if (index < 0) {
      return {
        ok: false,
        code: "not_found",
        items: existing,
        count: existing.length,
      };
    }

    nextItems[index] = {
      ...nextItems[index],
      note,
      updatedAt: Date.now(),
    };
    FALLBACK_HISTORY_STORE.set(key, nextItems);

    return {
      ok: true,
      items: nextItems,
      count: nextItems.length,
    };
  }

  if (path !== "/record") {
    return {
      ok: false,
      error: "Unknown history operation.",
      items: existing,
      count: existing.length,
    };
  }

  const localPart = normalizeLocalPart(payload?.localPart);
  const email = formatHistoryEmail(payload?.email, localPart);
  const limit = normalizeHistoryLimit(payload?.limit, {
    isPremium: Boolean(payload?.isPremium),
    isUnlimited: Boolean(payload?.isUnlimited),
  });
  const note = normalizeHistoryNote(payload?.note);
  const passwordSuggestion = normalizePasswordSuggestion(payload?.passwordSuggestion);
  const vcc = normalizeStoredVcc(payload?.vcc);

  if (!localPart || !email) {
    return {
      ok: false,
      error: "History email is invalid.",
      items: existing,
      count: existing.length,
    };
  }

  const updated = [...existing];
  const existingIndex = updated.findIndex((item) => item.localPart === localPart || item.email === email);

  if (existingIndex >= 0) {
    const [current] = updated.splice(existingIndex, 1);
    updated.unshift({
      ...current,
      email,
      localPart,
      note: note || normalizeHistoryNote(current.note),
      passwordSuggestion: passwordSuggestion || normalizePasswordSuggestion(current.passwordSuggestion),
      vcc: vcc || normalizeStoredVcc(current.vcc),
      source: normalizeHistorySource(payload?.source, current.source),
      updatedAt: Date.now(),
    });
    FALLBACK_HISTORY_STORE.set(key, updated);

    return {
      ok: true,
      items: updated,
      count: updated.length,
    };
  }

  if (limit !== null && updated.length >= limit) {
    return {
      ok: false,
      code: "limit_reached",
      items: updated,
      count: updated.length,
    };
  }

  updated.unshift({
    email,
    localPart,
    note,
    passwordSuggestion,
    vcc,
    source: normalizeHistorySource(payload?.source),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  FALLBACK_HISTORY_STORE.set(key, updated);

  return {
    ok: true,
    items: updated,
    count: updated.length,
  };
}

function normalizeHistoryState(result, plan) {
  const items = normalizeStoredHistory(result?.items);

  return {
    ok: Boolean(result?.ok),
    code: result?.code || "",
    error: result?.error || "",
    items,
    count: items.length,
    limit: plan.limit,
    isPremium: plan.isPremium,
    isAdmin: plan.isAdmin,
    isUnlimited: plan.isUnlimited,
    upgradePriceLabel: plan.upgradePriceLabel,
  };
}

function normalizeStoredHistory(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const localPart = normalizeLocalPart(item?.localPart);
      const email = formatHistoryEmail(item?.email, localPart);

      if (!localPart || !email) {
        return null;
      }

      return {
        email,
        localPart,
        note: normalizeHistoryNote(item?.note),
        passwordSuggestion: normalizePasswordSuggestion(item?.passwordSuggestion),
        vcc: normalizeStoredVcc(item?.vcc),
        source: normalizeHistorySource(item?.source),
        createdAt: Number(item?.createdAt || 0),
        updatedAt: Number(item?.updatedAt || 0),
      };
    })
    .filter(Boolean);
}

function normalizePendingAction(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const type = String(value.type ?? "").trim().toLowerCase();

  if (type === "import") {
    return { type: "import" };
  }

  if (type === "note") {
    const reference = parseMailboxReference(value.email || value.localPart);

    if (!reference.ok) {
      return null;
    }

    return {
      type: "note",
      email: reference.email,
      localPart: reference.localPart,
    };
  }

  return null;
}

function normalizeHistorySource(value, fallback = "generated") {
  const normalized = String(value ?? fallback).trim().toLowerCase();
  return normalized === "imported" ? "imported" : "generated";
}

function normalizeHistoryLimit(value, options = {}) {
  if (options.isUnlimited) {
    return null;
  }

  const fallback = options.isPremium ? PREMIUM_HISTORY_LIMIT : DEFAULT_HISTORY_LIMIT;
  const parsed = Number.parseInt(String(value ?? fallback), 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(PREMIUM_HISTORY_LIMIT, Math.max(DEFAULT_HISTORY_LIMIT, parsed));
}

function normalizeHistoryNote(value) {
  return trimText(String(value ?? "").trim().replace(/\s+/g, " "), HISTORY_NOTE_MAX_LENGTH);
}

function normalizePasswordSuggestion(value) {
  return trimText(String(value ?? "").trim(), 80);
}

function normalizeStoredVcc(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const number = String(value.number ?? "").replace(/\D/g, "");
  const expMonth = String(value.expMonth ?? value.month ?? "").replace(/\D/g, "").slice(0, 2);
  const expYear = String(value.expYear ?? value.year ?? "").replace(/\D/g, "").slice(0, 2);
  const cvv = String(value.cvv ?? "").replace(/\D/g, "").slice(0, 3);

  if (number.length < 13 || expMonth.length !== 2 || expYear.length !== 2 || cvv.length !== 3) {
    return null;
  }

  return {
    number,
    expMonth,
    expYear,
    expText: `${expMonth}/${expYear}`,
    cvv,
  };
}

function formatHistoryEmail(email, localPart) {
  const normalizedLocalPart = normalizeLocalPart(localPart || email);
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const normalizedDomain = getEmailDomain(normalizedEmail);

  if (normalizedLocalPart && isSupportedEmailDomain(normalizedDomain) && normalizedEmail.includes("@")) {
    return normalizedEmail;
  }

  if (!normalizedLocalPart) {
    return "";
  }

  return `${normalizedLocalPart}@${FIXED_DOMAIN}`;
}

function hasHistoryEmail(historyState, email) {
  const reference = parseMailboxReference(email);

  if (!reference.ok) {
    return false;
  }

  return historyState.items.some(
    (item) => item.email === reference.email || item.localPart === reference.localPart,
  );
}

function findHistoryEntry(historyState, emailOrLocalPart) {
  const reference = parseMailboxReference(emailOrLocalPart);

  if (!reference.ok) {
    return null;
  }

  return (
    historyState.items.find(
      (item) => item.email === reference.email || item.localPart === reference.localPart,
    ) || null
  );
}

function paginateHistoryItems(historyState, page = 0, pageSize = 5) {
  const items = Array.isArray(historyState?.items) ? historyState.items : [];
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(0, page), pageCount - 1);
  const start = safePage * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return {
    items,
    pageItems,
    pageCount,
    safePage,
  };
}

function shortenEmailForButton(email) {
  const value = String(email ?? "");
  return value.length > 28 ? `${value.slice(0, 25)}...` : value;
}

function parseTelegramCommand(text) {
  const match = text.match(/^\/([a-z0-9_]+)(?:@[a-z0-9_]+)?(?:\s+([\s\S]*))?$/i);
  return {
    command: match?.[1]?.toLowerCase() || "",
    argsText: match?.[2]?.trim() || "",
  };
}

function getTelegramActorUsername(entity) {
  return normalizeTelegramUsername(entity?.from?.username || entity?.chat?.username);
}

function normalizeTelegramUsername(value) {
  return String(value ?? "")
    .trim()
    .replace(/^@+/, "")
    .toLowerCase();
}

function formatPlanName(historyState) {
  if (historyState.isAdmin) {
    return "Admin";
  }

  return historyState.isPremium ? "Premium" : "Basic";
}

function formatHistoryUsage(historyState) {
  const limit = historyState.isUnlimited ? "Unlimited" : String(historyState.limit ?? DEFAULT_HISTORY_LIMIT);
  return `${historyState.count}/${limit}`;
}

function isHistoryLimitReached(historyState) {
  return historyState.limit !== null && historyState.limit !== undefined && historyState.count >= historyState.limit;
}

function buildStartMessage(historyState) {
  return [
    "<b>TempMGen siap dipakai</b>",
    "",
    `Domain tetap: <code>@${FIXED_DOMAIN}</code>`,
    "Pola nama: <code>nama + benda + kota + angka 0-99</code>",
    `History: <code>${escapeHtml(formatHistoryUsage(historyState))}</code>`,
    `Paket: <code>${escapeHtml(formatPlanName(historyState))}</code>`,
    "",
    "Perintah:",
    "<code>/new</code> - buat email baru",
    "<code>/history</code> - lihat history email",
    "<code>/import email</code> - import email lama atau email luar",
    "<code>/delete email</code> - hapus 1 email dari history",
    "<code>/note email catatan</code> - simpan catatan email",
    "<code>/inbox email</code> - lihat inbox",
    "<code>/refresh email</code> - refresh inbox",
    "<code>/start</code> - tampilkan bantuan ini",
  ].join("\n");
}

function buildNewEmailMessage(payload, historyState) {
  const lines = [
    "<b>Email baru</b>",
    "",
    `<code>${escapeHtml(payload.email)}</code>`,
    `Inbox: <code>${escapeHtml(payload.inboxStatus || "Kosong")}</code>`,
    `History: <code>${escapeHtml(formatHistoryUsage(historyState))}</code>`,
    "",
    "Password saran:",
    `<code>${escapeHtml(payload.passwordSuggestion)}</code>`,
    "",
    "VCC dummy:",
    `<code>${escapeHtml(payload.vcc?.number || "-")}</code>`,
    `Exp: <code>${escapeHtml(payload.vcc?.expText || "-")}</code>`,
    `CVV: <code>${escapeHtml(payload.vcc?.cvv || "-")}</code>`,
  ];

  if (payload.otpCodes?.length) {
    lines.push("", "OTP terdeteksi:");
    for (const code of payload.otpCodes) {
      lines.push(`<code>${escapeHtml(code)}</code>`);
    }
  }

  return lines.join("\n");
}

function buildImportSuccessMessage(payload, historyState) {
  const lines = [
    "<b>Email berhasil di-import</b>",
    "",
    `<code>${escapeHtml(payload.email)}</code>`,
    `Inbox: <code>${escapeHtml(payload.messageCount ? `Ada ${payload.messageCount} pesan` : "Kosong")}</code>`,
    `History: <code>${escapeHtml(formatHistoryUsage(historyState))}</code>`,
  ];

  if (payload.otpCodes?.length) {
    lines.push("", "OTP terdeteksi:");
    for (const code of payload.otpCodes) {
      lines.push(`<code>${escapeHtml(code)}</code>`);
    }
  }

  return lines.join("\n");
}

function buildHistoryMessage(historyState) {
  const previewItems = historyState.items.slice(0, HISTORY_PREVIEW_LIMIT);
  const lines = [
    "<b>History email</b>",
    "",
    `Paket: <code>${escapeHtml(formatPlanName(historyState))}</code>`,
    `Terpakai: <code>${escapeHtml(formatHistoryUsage(historyState))}</code>`,
  ];

  if (!historyState.items.length) {
    lines.push("", "Belum ada email di history.", "Kirim <code>/new</code> untuk membuat email pertama.");
    return lines.join("\n");
  }

  lines.push("", "Daftar email:");

  for (const [index, item] of previewItems.entries()) {
    lines.push(`${index + 1}. <code>${escapeHtml(item.email)}</code>`);
    lines.push(`   sumber: <code>${escapeHtml(item.source)}</code>`);

    if (item.note) {
      lines.push(`   catatan: ${escapeHtml(item.note)}`);
    }
  }

  if (historyState.items.length > previewItems.length) {
    lines.push("", `Dan ${escapeHtml(String(historyState.items.length - previewItems.length))} email lainnya.`);
  }

  lines.push(
    "",
    "Gunakan <code>/import email@pokemail.net</code> untuk recovery email tertentu.",
    "Gunakan <code>/delete email@pokemail.net</code> untuk hapus history 1 email.",
    "Gunakan <code>/note email@pokemail.net catatan</code> untuk menambah catatan.",
  );

  return lines.join("\n");
}

function buildHistorySelectorMessage(historyState, page = 0) {
  const { items, pageItems, pageCount, safePage } = paginateHistoryItems(historyState, page, 5);

  if (!items.length) {
    return [
      "<b>History email</b>",
      "",
      "Belum ada email di history.",
      "Tekan tombol <code>Email Baru</code> atau <code>Import Email</code>.",
    ].join("\n");
  }

  const lines = [
    "<b>Pilih email</b>",
    "",
    `Halaman: <code>${safePage + 1}/${pageCount}</code>`,
    `Total: <code>${escapeHtml(String(items.length))}</code> email`,
    "",
  ];

  for (const [index, item] of pageItems.entries()) {
    const absoluteIndex = safePage * 5 + index + 1;
    lines.push(`${absoluteIndex}. <code>${escapeHtml(item.email)}</code>`);
    if (item.note) {
      lines.push(`   catatan: ${escapeHtml(item.note)}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}

function buildHistoryLimitMessage(historyState) {
  const lines = [
    "<b>History email sudah penuh</b>",
    "",
    `Terpakai: <code>${escapeHtml(formatHistoryUsage(historyState))}</code>`,
  ];

  if (historyState.isUnlimited) {
    lines.push("", "Akun admin tidak punya batas history.");
    return lines.join("\n");
  }

  if (historyState.isPremium) {
    lines.push("", "Limit premium kamu sudah penuh. Gunakan email yang ada di history atau lakukan import email lama.");
    return lines.join("\n");
  }

  lines.push(
    "",
    `Upgrade <code>${escapeHtml(historyState.upgradePriceLabel)}</code> untuk menaikkan limit history menjadi <code>${PREMIUM_HISTORY_LIMIT}</code> email.`,
    "Tekan tombol pembelian di bawah untuk info upgrade.",
  );

  return lines.join("\n");
}

function buildBuyHistoryMessage(chatId, historyState) {
  return [
    "<b>Upgrade history email</b>",
    "",
    `Harga: <code>${escapeHtml(historyState.upgradePriceLabel)}</code>`,
    `Limit: <code>${DEFAULT_HISTORY_LIMIT}</code> -> <code>${PREMIUM_HISTORY_LIMIT}</code> history email`,
    "",
    `Hubungi <a href="${ADMIN_TELEGRAM_URL}">@${escapeHtml(ADMIN_TELEGRAM_USERNAME)}</a> untuk pembelian premium.`,
    "Kirim Chat ID ini ke admin untuk aktivasi premium:",
    `<code>${escapeHtml(String(chatId))}</code>`,
    "",
    "Setelah pembayaran aktif, history kamu akan naik jadi 25 email.",
  ].join("\n");
}

function buildDeleteResultMessage(email, historyState) {
  if (historyState.ok) {
    return [
      "<b>History email dihapus</b>",
      "",
      `<code>${escapeHtml(email)}</code>`,
      `Sisa history: <code>${escapeHtml(formatHistoryUsage(historyState))}</code>`,
    ].join("\n");
  }

  if (historyState.code === "not_found") {
    return [
      "<b>Email tidak ada di history</b>",
      "",
      `<code>${escapeHtml(email)}</code>`,
      "Gunakan <code>/history</code> untuk lihat email yang tersimpan.",
    ].join("\n");
  }

  return [
    "<b>Gagal menghapus history</b>",
    "",
    escapeHtml(historyState.error || "Terjadi kesalahan."),
  ].join("\n");
}

function buildDeleteUsageMessage(error) {
  return [
    "<b>Cara hapus history email</b>",
    "",
    error ? escapeHtml(error) : "",
    "",
    "Contoh:",
    `<code>/delete andipakukediri99@${FIXED_DOMAIN}</code>`,
    `<code>/delete andipakukediri99</code>`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildNoteResultMessage(email, note, historyState) {
  if (historyState.ok) {
    return [
      "<b>Catatan email disimpan</b>",
      "",
      `<code>${escapeHtml(email)}</code>`,
      `Catatan: ${escapeHtml(note)}`,
      `History: <code>${escapeHtml(formatHistoryUsage(historyState))}</code>`,
    ].join("\n");
  }

  if (historyState.code === "not_found") {
    return [
      "<b>Email tidak ada di history</b>",
      "",
      `<code>${escapeHtml(email)}</code>`,
      "Generate atau import email itu dulu sebelum menambah catatan.",
    ].join("\n");
  }

  return [
    "<b>Gagal menyimpan catatan</b>",
    "",
    escapeHtml(historyState.error || "Terjadi kesalahan."),
  ].join("\n");
}

function buildNoteUsageMessage(error) {
  return [
    "<b>Cara menambah catatan email</b>",
    "",
    error ? escapeHtml(error) : "",
    "",
    "Contoh:",
    `<code>/note andipakukediri99@${FIXED_DOMAIN} akun marketplace</code>`,
    "Atau reply ke pesan email bot dengan:",
    "<code>/note akun marketplace</code>",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildNotePromptMessage(email) {
  return [
    "<b>Tambah catatan</b>",
    "",
    `<code>${escapeHtml(email)}</code>`,
    "Kirim catatan untuk email ini.",
  ].join("\n");
}

function buildInboxMessage(payload, options = {}) {
  const lines = [
    options.refreshed ? "<b>Inbox diperbarui</b>" : "<b>Inbox email</b>",
    "",
    `<code>${escapeHtml(payload.email)}</code>`,
  ];

  if (payload.passwordSuggestion) {
    lines.push("", "Password saran:", `<code>${escapeHtml(payload.passwordSuggestion)}</code>`);
  }

  if (payload.vcc?.number) {
    lines.push(
      "",
      "VCC dummy:",
      `<code>${escapeHtml(payload.vcc.number)}</code>`,
      `Exp: <code>${escapeHtml(payload.vcc.expText || "-")}</code>`,
      `CVV: <code>${escapeHtml(payload.vcc.cvv || "-")}</code>`,
    );
  }

  if (payload.otpCodes?.length) {
    lines.push("", "OTP terdeteksi:");

    for (const code of payload.otpCodes) {
      lines.push(`<code>${escapeHtml(code)}</code>`);
    }
  }

  if (!payload.messages.length) {
    lines.push("", "Belum ada pesan masuk.");
    return lines.join("\n");
  }

  lines.push("", `Pesan terbaru: <code>${escapeHtml(String(payload.messageCount))}</code>`);

  for (const [index, item] of payload.messages.slice(0, 5).entries()) {
    lines.push(
      "",
      `${index + 1}. <b>${escapeHtml(item.subject || "Tanpa subjek")}</b>`,
      `Dari: <code>${escapeHtml(item.from || "unknown")}</code>`,
      `Waktu: <code>${escapeHtml(item.date || "-")}</code>`,
      escapeHtml(item.excerpt || "(tidak ada preview)"),
    );
  }

  if (payload.messages.length > 5) {
    lines.push("", `Dan ${escapeHtml(String(payload.messages.length - 5))} pesan lainnya.`);
  }

  return lines.join("\n");
}

function buildImportUsageMessage(error) {
  return [
    "<b>Format import email</b>",
    "",
    error ? escapeHtml(error) : "",
    "",
    "Contoh:",
    `<code>/import andipakukediri99@${FIXED_DOMAIN}</code>`,
    "<code>/import nama@sharklasers.com</code>",
    `<code>/import andipakukediri99</code>`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildImportPromptMessage() {
  return [
    "<b>Import email</b>",
    "",
    "Kirim email yang ingin diimport.",
    "Contoh:",
    `<code>andipakukediri99@${FIXED_DOMAIN}</code>`,
    "<code>nama@sharklasers.com</code>",
  ].join("\n");
}

function buildInboxUsageMessage(error) {
  return [
    "<b>Cara buka inbox</b>",
    "",
    error ? escapeHtml(error) : "",
    "",
    "Contoh:",
    `<code>/inbox andipakukediri99@${FIXED_DOMAIN}</code>`,
    `<code>/refresh andipakukediri99@${FIXED_DOMAIN}</code>`,
    "Atau reply ke pesan email bot lalu kirim <code>/inbox</code>.",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildUnknownCommandMessage() {
  return [
    "Perintah belum tersedia.",
    "",
    "Gunakan:",
    "<code>/start</code>",
    "<code>/new</code>",
    "<code>/history</code>",
    "<code>/delete email</code>",
    "<code>/note email catatan</code>",
    "<code>/inbox email</code>",
    "<code>/refresh email</code>",
    "<code>/import email</code>",
  ].join("\n");
}

function buildHomeKeyboard(historyState) {
  const rows = [
    [
      { text: "Email Baru", callback_data: "new" },
      { text: "Pindah Email", callback_data: "history_select:0" },
    ],
    [
      { text: "History", callback_data: "history" },
      { text: "Import Email", callback_data: "import_prompt" },
    ],
  ];

  if (!historyState.isPremium && !historyState.isAdmin) {
    rows.push([{ text: "Pembelian 5k/bulan", url: ADMIN_TELEGRAM_URL }]);
  }

  return { inline_keyboard: rows };
}

function buildMailboxKeyboard(localPart, historyState) {
  const rows = [
    [
      { text: "Inbox", callback_data: `inbox:${localPart}` },
      { text: "Refresh", callback_data: `refresh:${localPart}` },
    ],
    [
      { text: "History", callback_data: "history" },
      { text: "Pindah Email", callback_data: "history_select:0" },
    ],
    [
      { text: "Catatan", callback_data: `note_prompt:${localPart}` },
      { text: "Hapus Email", callback_data: `delete:${localPart}` },
    ],
    [
      { text: "Email Baru", callback_data: "new" },
      { text: "Import Email", callback_data: "import_prompt" },
    ],
  ];

  if (!historyState.isPremium && !historyState.isAdmin) {
    rows.push([{ text: "Pembelian 5k/bulan", url: ADMIN_TELEGRAM_URL }]);
  }

  return { inline_keyboard: rows };
}

function buildHistorySelectorKeyboard(historyState, page = 0) {
  const rows = [];
  const { pageItems, pageCount, safePage } = paginateHistoryItems(historyState, page, 5);

  for (const item of pageItems) {
    rows.push([{ text: shortenEmailForButton(item.email), callback_data: `inbox:${item.localPart}` }]);
    rows.push([
      { text: "Catatan", callback_data: `note_prompt:${item.localPart}` },
      { text: "Hapus", callback_data: `delete:${item.localPart}` },
    ]);
  }

  if (pageCount > 1) {
    const nav = [];
    if (safePage > 0) {
      nav.push({ text: "Prev", callback_data: `history_select:${safePage - 1}` });
    }
    if (safePage < pageCount - 1) {
      nav.push({ text: "Next", callback_data: `history_select:${safePage + 1}` });
    }
    if (nav.length) {
      rows.push(nav);
    }
  }

  rows.push([
    { text: "Email Baru", callback_data: "new" },
    { text: "Import Email", callback_data: "import_prompt" },
  ]);

  if (!historyState.isPremium && !historyState.isAdmin) {
    rows.push([{ text: "Pembelian 5k/bulan", url: ADMIN_TELEGRAM_URL }]);
  }

  return { inline_keyboard: rows };
}

async function sendTelegramMessage(token, chatId, text, extra = {}) {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
      ...extra,
    }),
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(raw || `Telegram API failed with status ${response.status}`);
  }

  return response.json();
}

async function answerTelegramCallbackQuery(token, callbackQueryId, text, showAlert = false) {
  const response = await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert,
    }),
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(raw || `Telegram callback API failed with status ${response.status}`);
  }

  return response.json();
}

function getClientDetails(request) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
  const ip = String(forwarded || "127.0.0.1").split(",")[0].trim() || "127.0.0.1";
  const agent = (request.headers.get("user-agent") || "TempMGen").slice(0, 160);

  return { ip, agent };
}

function getCookie(cookieHeader, name) {
  if (!cookieHeader) {
    return "";
  }

  const target = `${name}=`;

  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(target)) {
      return trimmed.slice(target.length);
    }
  }

  return "";
}

function extractSetCookie(headerValue, name) {
  const match = headerValue.match(new RegExp(`(?:^|,\\s*)${name}=([^;,\\s]+)`));
  return match?.[1] || "";
}

function serializeCookie(name, value) {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`;
}

function resolveMailboxReference(message, argsText) {
  if (argsText) {
    return parseMailboxReference(argsText);
  }

  const repliedText = String(message?.reply_to_message?.text ?? message?.reply_to_message?.caption ?? "");

  if (repliedText) {
    return parseMailboxReference(repliedText);
  }

  return {
    ok: false,
    error: "Email target belum diberikan.",
  };
}

function resolveNoteInput(message, argsText) {
  const raw = String(argsText ?? "").trim();

  if (!raw) {
    return {
      ok: false,
      error: "Catatan belum diisi.",
    };
  }

  const hasReplyReference = resolveMailboxReference(message, "").ok;
  const startsWithExplicitEmail = /@pokemail\.net\b/i.test(raw);

  if (hasReplyReference && !startsWithExplicitEmail) {
    const replyReference = resolveMailboxReference(message, "");
    const note = normalizeHistoryNote(raw);

    if (!note) {
      return {
        ok: false,
        error: "Catatan belum diisi.",
      };
    }

    return {
      ok: true,
      email: replyReference.email,
      localPart: replyReference.localPart,
      note,
    };
  }

  const firstToken = raw.split(/\s+/)[0] || "";
  const directReference = parseMailboxReference(firstToken);

  if (directReference.ok) {
    const note = normalizeHistoryNote(raw.slice(firstToken.length).trim());

    if (!note) {
      return {
        ok: false,
        error: "Catatan belum diisi.",
      };
    }

    return {
      ok: true,
      email: directReference.email,
      localPart: directReference.localPart,
      note,
    };
  }

  const replyReference = resolveMailboxReference(message, "");

  if (!replyReference.ok) {
    return {
      ok: false,
      error: "Balas pesan email bot atau sertakan email target di command.",
    };
  }

  const note = normalizeHistoryNote(raw);

  if (!note) {
    return {
      ok: false,
      error: "Catatan belum diisi.",
    };
  }

  return {
    ok: true,
    email: replyReference.email,
    localPart: replyReference.localPart,
    note,
  };
}

function parseMailboxReference(text) {
  const raw = String(text ?? "").trim().toLowerCase();

  if (!raw) {
    return { ok: false, error: "Email target kosong." };
  }

  const emailMatch = raw.match(/([a-z0-9._+-]{1,40})@([a-z0-9.-]+)/);

  if (emailMatch && isSupportedEmailDomain(emailMatch[2])) {
    return {
      ok: true,
      localPart: emailMatch[1],
      email: `${emailMatch[1]}@${emailMatch[2]}`,
    };
  }

  const token = raw.split(/\s+/)[0];

  if (/^[a-z0-9._+-]{1,40}$/.test(token)) {
    return {
      ok: true,
      localPart: token,
      email: `${token}@${FIXED_DOMAIN}`,
    };
  }

  return {
    ok: false,
    error: `Gunakan email dengan domain yang didukung.`,
  };
}

function normalizeMailboxMessage(item) {
  return {
    id: String(item?.mail_id ?? ""),
    from: decodeHtmlEntities(String(item?.mail_from ?? "")).trim(),
    subject: decodeHtmlEntities(String(item?.mail_subject ?? "")).trim(),
    excerpt: trimText(decodeHtmlEntities(String(item?.mail_excerpt ?? "")).replace(/\s+/g, " "), 180),
    date: String(item?.mail_date ?? "").trim(),
  };
}

function isSystemMailboxMessage(item) {
  const from = String(item?.from ?? "").trim().toLowerCase();
  const subject = String(item?.subject ?? "").trim().toLowerCase();

  return from === "no-reply@guerrillamail.com" && subject === "welcome to guerrilla mail";
}

function decodeHtmlEntities(value) {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#039;", "'");
}

function trimText(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}...`;
}

function normalizeLocalPart(value) {
  const cleaned = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 40);

  return cleaned || "tempmgen0";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function json(payload, status) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export class TempMGenState {
  constructor(state) {
    this.state = state;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed." }, 405);
    }

    let body = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    if (url.pathname === "/state") {
      const items = await this.readHistory();

      return json(
        {
          ok: true,
          items,
          count: items.length,
        },
        200,
      );
    }

    if (url.pathname === "/pending_get") {
      return json(
        {
          ok: true,
          pending: await this.readPending(),
        },
        200,
      );
    }

    if (url.pathname === "/pending_set") {
      const pending = normalizePendingAction(body?.pending);
      await this.writePending(pending);

      return json(
        {
          ok: true,
          pending,
        },
        200,
      );
    }

    if (url.pathname === "/pending_clear") {
      await this.writePending(null);

      return json(
        {
          ok: true,
          pending: null,
        },
        200,
      );
    }

    if (url.pathname === "/delete") {
      const items = await this.readHistory();
      const reference = parseMailboxReference(body?.email || body?.localPart);

      if (!reference.ok) {
        return json(
          {
            ok: false,
            error: reference.error,
            items,
            count: items.length,
          },
          200,
        );
      }

      const nextItems = items.filter(
        (item) => item.localPart !== reference.localPart && item.email !== reference.email,
      );

      if (nextItems.length === items.length) {
        return json(
          {
            ok: false,
            code: "not_found",
            items,
            count: items.length,
          },
          200,
        );
      }

      await this.writeHistory(nextItems);

      return json(
        {
          ok: true,
          items: nextItems,
          count: nextItems.length,
        },
        200,
      );
    }

    if (url.pathname === "/note") {
      const items = await this.readHistory();
      const reference = parseMailboxReference(body?.email || body?.localPart);
      const note = normalizeHistoryNote(body?.note);

      if (!reference.ok) {
        return json(
          {
            ok: false,
            error: reference.error,
            items,
            count: items.length,
          },
          200,
        );
      }

      const nextItems = [...items];
      const existingIndex = nextItems.findIndex(
        (item) => item.localPart === reference.localPart || item.email === reference.email,
      );

      if (existingIndex < 0) {
        return json(
          {
            ok: false,
            code: "not_found",
            items,
            count: items.length,
          },
          200,
        );
      }

      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        note,
        updatedAt: Date.now(),
      };
      await this.writeHistory(nextItems);

      return json(
        {
          ok: true,
          items: nextItems,
          count: nextItems.length,
        },
        200,
      );
    }

    if (url.pathname === "/record") {
      const items = await this.readHistory();
      const localPart = normalizeLocalPart(body?.localPart);
      const email = formatHistoryEmail(body?.email, localPart);
      const limit = normalizeHistoryLimit(body?.limit, {
        isPremium: Boolean(body?.isPremium),
        isUnlimited: Boolean(body?.isUnlimited),
      });
      const note = normalizeHistoryNote(body?.note);
      const passwordSuggestion = normalizePasswordSuggestion(body?.passwordSuggestion);
      const vcc = normalizeStoredVcc(body?.vcc);

      if (!localPart || !email) {
        return json(
          {
            ok: false,
            error: "History email is invalid.",
            items,
            count: items.length,
          },
          200,
        );
      }

      const nextItems = [...items];
      const existingIndex = nextItems.findIndex(
        (item) => item.localPart === localPart || item.email === email,
      );

      if (existingIndex >= 0) {
        const [current] = nextItems.splice(existingIndex, 1);
        nextItems.unshift({
          ...current,
          email,
          localPart,
          note: note || normalizeHistoryNote(current.note),
          passwordSuggestion: passwordSuggestion || normalizePasswordSuggestion(current.passwordSuggestion),
          vcc: vcc || normalizeStoredVcc(current.vcc),
          source: normalizeHistorySource(body?.source, current.source),
          updatedAt: Date.now(),
        });
        await this.writeHistory(nextItems);

        return json(
          {
            ok: true,
            items: nextItems,
            count: nextItems.length,
          },
          200,
        );
      }

      if (limit !== null && nextItems.length >= limit) {
        return json(
          {
            ok: false,
            code: "limit_reached",
            items: nextItems,
            count: nextItems.length,
          },
          200,
        );
      }

      nextItems.unshift({
        email,
        localPart,
        note,
        passwordSuggestion,
        vcc,
        source: normalizeHistorySource(body?.source),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await this.writeHistory(nextItems);

      return json(
        {
          ok: true,
          items: nextItems,
          count: nextItems.length,
        },
        200,
      );
    }

    return json({ ok: false, error: "Route not found." }, 404);
  }

  async readHistory() {
    const stored = await this.state.storage.get("history");
    return normalizeStoredHistory(stored);
  }

  async writeHistory(items) {
    await this.state.storage.put("history", normalizeStoredHistory(items));
  }

  async readPending() {
    const stored = await this.state.storage.get("pending");
    return normalizePendingAction(stored);
  }

  async writePending(pending) {
    if (pending) {
      await this.state.storage.put("pending", normalizePendingAction(pending));
      return;
    }

    await this.state.storage.delete("pending");
  }
}
