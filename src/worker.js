const MAIL_TM_API_URL = "https://api.mail.tm";
const DEFAULT_HISTORY_LIMIT = 5;
const PREMIUM_HISTORY_LIMIT = 25;
const PREMIUM_HISTORY_PRICE_LABEL = "5k/bulan";
const PRO_PLAN_DURATION_DAYS = 30;
const PRO_REMINDER_LEAD_DAYS = 7;
const ADMIN_TELEGRAM_USERNAME = "AndiPradanaAr";
const ADMIN_TELEGRAM_URL = "https://t.me/AndiPradanaAr";
const DEFAULT_INBOX_PASSWORD_SECRET = "tempmgen-mailtm-secret-v1";
const HISTORY_PREVIEW_LIMIT = 25;
const HISTORY_NOTE_MAX_LENGTH = 300;
const FALLBACK_HISTORY_STORE = new Map();
const FALLBACK_PENDING_STORE = new Map();
const FALLBACK_SUBSCRIPTION_STORE = new Map();
const FALLBACK_SUBSCRIPTION_REGISTRY = new Map();
const DOMAIN_EXAMPLE_FALLBACK = "email@domain.tld";
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
          provider: "mail.tm",
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
      return handleDomains();
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

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(runSubscriptionMaintenance(env));
  },
};

async function handleCreate(request) {
  const result = await generateMailbox(env);

  if (!result.ok) {
    return json({ ok: false, error: result.error }, 502);
  }

  return json(result.payload, 200);
}

async function handleDomains() {
  const result = await fetchAvailableDomains();

  if (!result.ok) {
    return json({ ok: false, error: result.error }, 502);
  }

  return json(
    {
      ok: true,
      provider: "mail.tm",
      domains: result.domains,
      generator: getGeneratorInfo(),
    },
    200,
  );
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
  const plan = await resolveChatPlan(env, chatId, actorUsername);
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

  if (command === "admin" && plan.isAdmin) {
    const historyState = await getHistoryState(env, chatId, plan);

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildAdminMessage(chatId), {
      parse_mode: "HTML",
      reply_markup: buildAdminKeyboard(historyState),
    });

    return json({ ok: true, handled: true, command }, 200);
  }

  if (command === "stats" && plan.isAdmin) {
    const historyState = await getHistoryState(env, chatId, plan);
    const stats = await getAdminStats(env, chatId, historyState);

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildStatsMessage(stats), {
      parse_mode: "HTML",
      reply_markup: buildAdminKeyboard(historyState),
    });

    return json({ ok: true, handled: true, command }, 200);
  }

  if (command === "listpro" && plan.isAdmin) {
    const historyState = await getHistoryState(env, chatId, plan);
    const subscriptions = await listChatSubscriptions(env);

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildProListMessage(subscriptions), {
      parse_mode: "HTML",
      reply_markup: buildAdminKeyboard(historyState),
    });

    return json({ ok: true, handled: true, command }, 200);
  }

  if ((command === "setpro" || command === "unpro") && plan.isAdmin) {
    const targetChatId = parseChatIdInput(parsedCommand.argsText);

    if (!targetChatId) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildAdminChatIdPrompt(command === "setpro" ? "admin_setpro" : "admin_removepro", "Chat ID tidak valid."), {
        parse_mode: "HTML",
        reply_markup: buildAdminKeyboard(await getHistoryState(env, chatId, plan)),
      });

      return json({ ok: true, handled: true, command, error: "Chat ID tidak valid." }, 200);
    }

    if (command === "setpro") {
      const subscription = await setChatProSubscription(env, targetChatId, { source: "admin" });
      const targetPlan = await resolveChatPlan(env, targetChatId, "");

      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, Number(targetChatId), buildSubscriptionActivatedMessage(subscription), {
        parse_mode: "HTML",
        reply_markup: buildHomeKeyboard(targetPlan),
      }).catch(() => null);

      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildAdminSubscriptionResultMessage(targetChatId, subscription), {
        parse_mode: "HTML",
        reply_markup: buildAdminKeyboard(await getHistoryState(env, chatId, plan)),
      });

      return json({ ok: true, handled: true, command, chatId: targetChatId }, 200);
    }

    await clearChatSubscription(env, targetChatId);
    await pruneHistoryToLimit(env, targetChatId, DEFAULT_HISTORY_LIMIT);

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, Number(targetChatId), buildSubscriptionRemovedMessage(), {
      parse_mode: "HTML",
    }).catch(() => null);

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildAdminSubscriptionRemovedResult(targetChatId), {
      parse_mode: "HTML",
      reply_markup: buildAdminKeyboard(await getHistoryState(env, chatId, plan)),
    });

    return json({ ok: true, handled: true, command, chatId: targetChatId }, 200);
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
        reply_markup: buildMailboxKeyboard(noteInput.email, historyState),
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

    const result = await generateMailbox(env);

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
      reply_markup: buildMailboxKeyboard(result.payload.email, historyRecord, result.payload),
    });

    return json({ ok: true, handled: true, command, email: result.payload.email }, 200);
  }

  if (command === "import") {
    const historyState = await getHistoryState(env, chatId, plan);
    const rawImportInput = resolveImportInput(parsedCommand.argsText, historyState);
    const importInput = await resolveImportAccess(env, rawImportInput);

    if (!importInput.ok) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildImportUsageMessage(importInput.error), {
        parse_mode: "HTML",
      });

      return json({ ok: true, handled: true, command, error: importInput.error }, 200);
    }

    if (isHistoryLimitReached(historyState) && !hasHistoryEmail(historyState, importInput.email)) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistoryLimitMessage(historyState), {
        parse_mode: "HTML",
        reply_markup: buildHomeKeyboard(historyState),
      });

      return json({ ok: true, handled: true, command, error: "History limit reached" }, 200);
    }

    const inboxResult = await getMailboxInbox(request, importInput.localPart, {
      displayEmail: importInput.email,
      mailboxPassword: importInput.password,
      historyEntry: importInput.historyEntry,
      passwordSource: importInput.passwordSource,
      allowDeterministicPassword: importInput.allowDeterministicPassword,
      env,
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
      reply_markup: buildMailboxKeyboard(inboxResult.payload.email, historyRecord, inboxResult.payload),
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
        reply_markup: buildMailboxKeyboard(inboxResult.payload.email, historyState, inboxResult.payload),
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
  const plan = await resolveChatPlan(env, chatId, actorUsername);

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

      const result = await generateMailbox(env);

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
        reply_markup: buildMailboxKeyboard(result.payload.email, historyRecord, result.payload),
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

    if (data === "admin" && plan.isAdmin) {
      const historyState = await getHistoryState(env, chatId, plan);

      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Admin tools dibuka.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildAdminMessage(chatId), {
        parse_mode: "HTML",
        reply_markup: buildAdminKeyboard(historyState),
      });

      return json({ ok: true, handled: true, callback: data }, 200);
    }

    if (data === "stats" && plan.isAdmin) {
      const historyState = await getHistoryState(env, chatId, plan);
      const stats = await getAdminStats(env, chatId, historyState);

      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Stats dikirim.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildStatsMessage(stats), {
        parse_mode: "HTML",
        reply_markup: buildAdminKeyboard(historyState),
      });

      return json({ ok: true, handled: true, callback: data }, 200);
    }

    if (data === "admin_listpro" && plan.isAdmin) {
      const historyState = await getHistoryState(env, chatId, plan);
      const subscriptions = await listChatSubscriptions(env);

      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Daftar Pro dikirim.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildProListMessage(subscriptions), {
        parse_mode: "HTML",
        reply_markup: buildAdminKeyboard(historyState),
      });

      return json({ ok: true, handled: true, callback: data }, 200);
    }

    if (data === "admin_setpro" && plan.isAdmin) {
      const historyState = await getHistoryState(env, chatId, plan);

      await setPendingAction(env, chatId, { type: "admin_setpro" });
      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Kirim Chat ID user.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildAdminChatIdPrompt("admin_setpro"), {
        parse_mode: "HTML",
        reply_markup: buildAdminKeyboard(historyState),
      });

      return json({ ok: true, handled: true, callback: data }, 200);
    }

    if (data === "admin_removepro" && plan.isAdmin) {
      const historyState = await getHistoryState(env, chatId, plan);

      await setPendingAction(env, chatId, { type: "admin_removepro" });
      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Kirim Chat ID user.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildAdminChatIdPrompt("admin_removepro"), {
        parse_mode: "HTML",
        reply_markup: buildAdminKeyboard(historyState),
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

    if (data.startsWith("copy_")) {
      const historyState = await getHistoryState(env, chatId, plan);
      const botText = String(callbackQuery?.message?.text || "");
      const copyResult = buildCopyPayloadFromBotText(data, botText, historyState);

      if (!copyResult.ok) {
        await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, copyResult.error || "Data tidak tersedia.", true);
        return json({ ok: true, handled: true, callback: data, error: copyResult.error }, 200);
      }

      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, copyResult.notice || "Siap dicopy.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, `<code>${escapeHtml(copyResult.value)}</code>`, {
        parse_mode: "HTML",
        reply_markup: buildMailboxKeyboard(copyResult.email, historyState, copyResult.payload || null),
      });

      return json({ ok: true, handled: true, callback: data }, 200);
    }

    const separator = data.indexOf(":");
    const action = separator >= 0 ? data.slice(0, separator) : data;
    const rawLocalPart = separator >= 0 ? data.slice(separator + 1) : "";
    const historyState = await getHistoryState(env, chatId, plan);

    if (action === "openmsg" || action === "delmsg") {
      const targetEmail = extractEmailFromText(callbackQuery?.message?.text || "");
      const historyEntry = targetEmail ? findHistoryEntry(historyState, targetEmail) : null;

      if (!targetEmail || !historyEntry) {
        await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Email belum ada di history.", true);
        return json({ ok: true, handled: true, callback: data, error: "Email belum ada di history." }, 200);
      }

      if (action === "openmsg") {
        const fullMessageResult = await getMailboxMessageDetail(targetEmail, historyEntry, rawLocalPart);

        if (!fullMessageResult.ok) {
          await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Pesan gagal dibuka.", true);
          await sendTelegramMessage(
            env.TELEGRAM_BOT_TOKEN,
            chatId,
            `Gagal membuka pesan.\n\n${escapeHtml(fullMessageResult.error)}`,
            { parse_mode: "HTML" },
          );

          return json({ ok: false, handled: true, callback: data, error: fullMessageResult.error }, 502);
        }

        await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Pesan dibuka.");
        await sendTelegramMessage(
          env.TELEGRAM_BOT_TOKEN,
          chatId,
          buildFullMessageText(fullMessageResult.payload),
          {
            parse_mode: "HTML",
            reply_markup: buildMessageDetailKeyboard(targetEmail, historyState, fullMessageResult.payload),
          },
        );

        return json({ ok: true, handled: true, callback: data, email: targetEmail }, 200);
      }

      const deleteResult = await deleteMailboxMessage(targetEmail, historyEntry, rawLocalPart);

      if (!deleteResult.ok) {
        await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Pesan gagal dihapus.", true);
        await sendTelegramMessage(
          env.TELEGRAM_BOT_TOKEN,
          chatId,
          `Gagal menghapus pesan.\n\n${escapeHtml(deleteResult.error)}`,
          { parse_mode: "HTML" },
        );

        return json({ ok: false, handled: true, callback: data, error: deleteResult.error }, 502);
      }

      const inboxResult = await getMailboxInbox(request, historyEntry.localPart, {
        displayEmail: targetEmail,
        historyEntry,
      });

      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Pesan dihapus.");
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        inboxResult.ok
          ? buildInboxMessage(inboxResult.payload, { refreshed: true })
          : "Pesan dihapus, tapi inbox belum bisa dimuat ulang.",
        {
          parse_mode: "HTML",
          reply_markup: buildMailboxKeyboard(targetEmail, historyState, inboxResult.ok ? inboxResult.payload : null),
        },
      );

      return json({ ok: true, handled: true, callback: data, email: targetEmail }, 200);
    }

    const mailbox = parseMailboxReference(rawLocalPart);
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
        reply_markup: buildMailboxKeyboard(targetEmail, historyState, historyEntry ? { email: targetEmail } : null),
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
        reply_markup: buildMailboxKeyboard(inboxResult.payload.email, historyState, inboxResult.payload),
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
    const historyState = await getHistoryState(env, chatId, plan);
    const rawImportInput = resolveImportInput(text, historyState);
    const importInput = await resolveImportAccess(env, rawImportInput);

    if (!importInput.ok) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildImportUsageMessage(importInput.error), {
        parse_mode: "HTML",
      });

      return json({ ok: true, handled: true, pending: pendingAction.type, error: importInput.error }, 200);
    }

    if (isHistoryLimitReached(historyState) && !hasHistoryEmail(historyState, importInput.email)) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildHistoryLimitMessage(historyState), {
        parse_mode: "HTML",
        reply_markup: buildHomeKeyboard(historyState),
      });

      return json({ ok: true, handled: true, pending: pendingAction.type, error: "History limit reached" }, 200);
    }

    const inboxResult = await getMailboxInbox(request, importInput.localPart, {
      displayEmail: importInput.email,
      mailboxPassword: importInput.password,
      historyEntry: importInput.historyEntry,
      passwordSource: importInput.passwordSource,
      allowDeterministicPassword: importInput.allowDeterministicPassword,
      env,
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
        reply_markup: buildMailboxKeyboard(inboxResult.payload.email, historyRecord, inboxResult.payload),
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
        reply_markup: buildMailboxKeyboard(pendingAction.email, historyState),
      },
    );

    return json({ ok: true, handled: true, pending: pendingAction.type, email: pendingAction.email }, 200);
  }

  if ((pendingAction.type === "admin_setpro" || pendingAction.type === "admin_removepro") && plan.isAdmin) {
    const targetChatId = parseChatIdInput(text);

    if (!targetChatId) {
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildAdminChatIdPrompt(pendingAction.type, "Chat ID tidak valid."), {
        parse_mode: "HTML",
        reply_markup: buildAdminKeyboard(await getHistoryState(env, chatId, plan)),
      });

      return json({ ok: true, handled: true, pending: pendingAction.type, error: "Chat ID tidak valid." }, 200);
    }

    if (pendingAction.type === "admin_setpro") {
      const subscription = await setChatProSubscription(env, targetChatId, { source: "admin" });
      const targetPlan = await resolveChatPlan(env, targetChatId, "");

      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        Number(targetChatId),
        buildSubscriptionActivatedMessage(subscription),
        { parse_mode: "HTML", reply_markup: buildHomeKeyboard(targetPlan) },
      ).catch(() => null);

      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildAdminSubscriptionResultMessage(targetChatId, subscription), {
        parse_mode: "HTML",
        reply_markup: buildAdminKeyboard(await getHistoryState(env, chatId, plan)),
      });

      return json({ ok: true, handled: true, pending: pendingAction.type, chatId: targetChatId }, 200);
    }

    await clearChatSubscription(env, targetChatId);
    await pruneHistoryToLimit(env, targetChatId, DEFAULT_HISTORY_LIMIT);

    await sendTelegramMessage(
      env.TELEGRAM_BOT_TOKEN,
      Number(targetChatId),
      buildSubscriptionRemovedMessage(),
      { parse_mode: "HTML" },
    ).catch(() => null);

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildAdminSubscriptionRemovedResult(targetChatId), {
      parse_mode: "HTML",
      reply_markup: buildAdminKeyboard(await getHistoryState(env, chatId, plan)),
    });

    return json({ ok: true, handled: true, pending: pendingAction.type, chatId: targetChatId }, 200);
  }

  return json({ ok: true, ignored: true }, 200);
}

async function generateMailbox(env) {
  const domainsResult = await fetchAvailableDomains();

  if (!domainsResult.ok || !domainsResult.domains.length) {
    return { ok: false, error: domainsResult.error || "Domain email tidak tersedia." };
  }

  const generated = generateIdentity();
  const vcc = generateDummyVcc();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const localPart = attempt === 0 ? generated.username : `${generated.username}${attempt}`.slice(0, 40);
    const domain = domainsResult.domains[attempt % domainsResult.domains.length];
    const email = `${localPart}@${domain}`;
    const passwordSuggestion = await generateInboxPassword(email, env);

    const accountResult = await createMailTmAccount(email, passwordSuggestion);

    if (!accountResult.ok) {
      if (accountResult.code === "address_exists") {
        continue;
      }

      return { ok: false, error: accountResult.error };
    }

    const inboxResult = await getMailboxInbox(null, localPart, {
      displayEmail: email,
      mailboxPassword: passwordSuggestion,
      historyEntry: {
        email,
        localPart,
        passwordSuggestion,
        vcc,
      },
    });

    if (!inboxResult.ok) {
      return { ok: false, error: inboxResult.error };
    }

    return {
      ok: true,
      payload: {
        ...inboxResult.payload,
        parts: generated.parts,
        generator: getGeneratorInfo(),
        inboxStatus: inboxResult.payload.messageCount ? `Ada ${inboxResult.payload.messageCount} pesan` : "Kosong",
      },
    };
  }

  return { ok: false, error: "Gagal membuat email baru. Silakan coba lagi." };
}

async function getMailboxInbox(_request, localPart, options = {}) {
  const displayEmail = String(options.displayEmail || "").trim().toLowerCase();
  const historyEntry = options.historyEntry || null;
  let password =
    String(options.mailboxPassword || historyEntry?.mailboxPassword || historyEntry?.passwordSuggestion || "").trim();
  const passwordSource = String(options.passwordSource || "").trim().toLowerCase();

  if (!displayEmail) {
    return { ok: false, error: "Email target belum tersedia." };
  }

  if (!password && options.allowDeterministicPassword) {
    password = await generateInboxPassword(displayEmail, options.env);
  }

  if (!password) {
    return { ok: false, error: "Password email belum tersimpan di history bot." };
  }

  const tokenResult = await createMailTmToken(displayEmail, password);

  if (!tokenResult.ok) {
    if (passwordSource === "deterministic") {
      return {
        ok: false,
        error: "Email ini bukan email bot yang dibuat di sini, atau Password inbox bot-nya berbeda.",
      };
    }

    return { ok: false, error: tokenResult.error };
  }

  const messagesResult = await fetchMailTmMessages(tokenResult.token);

  if (!messagesResult.ok) {
    return { ok: false, error: messagesResult.error };
  }

  return {
    ok: true,
    payload: {
      ok: true,
      email: displayEmail,
      actualEmail: displayEmail,
      username: localPart,
      domain: getEmailDomain(displayEmail),
      messageCount: messagesResult.messages.length,
      messages: messagesResult.messages,
      otpCodes: extractOtpCodes(messagesResult.messages),
      passwordSuggestion: password,
      mailboxPassword: password,
      vcc: historyEntry?.vcc || null,
    },
  };
}

async function fetchMailTmJson(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
  };

  try {
    const response = await fetch(`${MAIL_TM_API_URL}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const raw = await response.text();
    let data = null;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data?.message || data?.detail || raw || `mail.tm request failed with status ${response.status}`,
        data,
      };
    }

    return {
      ok: true,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : "Unknown upstream error",
      data: null,
    };
  }
}

async function fetchAvailableDomains() {
  const result = await fetchMailTmJson("/domains");

  if (!result.ok) {
    return { ok: false, error: result.error, domains: [] };
  }

  const domains = extractHydraMembers(result.data)
    .filter((item) => item && item.isActive !== false && typeof item.domain === "string")
    .map((item) => String(item.domain).trim().toLowerCase())
    .filter(Boolean);

  if (!domains.length) {
    return { ok: false, error: "mail.tm tidak mengembalikan domain aktif.", domains: [] };
  }

  return { ok: true, domains };
}

async function createMailTmAccount(address, password) {
  const result = await fetchMailTmJson("/accounts", {
    method: "POST",
    body: { address, password },
  });

  if (result.ok) {
    return { ok: true, account: result.data };
  }

  const message = String(result.error || "").toLowerCase();

  if (result.status === 422 || message.includes("already") || message.includes("used")) {
    return { ok: false, code: "address_exists", error: "Alamat email sudah terpakai." };
  }

  return { ok: false, code: "create_failed", error: result.error || "Gagal membuat akun email." };
}

async function createMailTmToken(address, password) {
  const result = await fetchMailTmJson("/token", {
    method: "POST",
    body: { address, password },
  });

  if (!result.ok || !result.data?.token) {
    if (result.status === 401) {
      return {
        ok: false,
        error: "Email atau Password inbox salah.",
      };
    }

    return { ok: false, error: result.error || "Gagal login ke inbox email." };
  }

  return { ok: true, token: String(result.data.token) };
}

async function fetchMailTmMessages(token) {
  const result = await fetchMailTmJson("/messages", { token });

  if (!result.ok) {
    return { ok: false, error: result.error, messages: [] };
  }

  return {
    ok: true,
    messages: extractHydraMembers(result.data).map((item) => normalizeMailboxMessage(item)),
  };
}

async function fetchMailTmMessageById(token, messageId) {
  const result = await fetchMailTmJson(`/messages/${encodeURIComponent(messageId)}`, { token });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return {
    ok: true,
    message: normalizeFullMailboxMessage(result.data),
  };
}

async function deleteMailTmMessage(token, messageId) {
  const result = await fetchMailTmJson(`/messages/${encodeURIComponent(messageId)}`, {
    method: "DELETE",
    token,
  });

  if (!result.ok && result.status !== 204) {
    return { ok: false, error: result.error };
  }

  return { ok: true };
}

async function getMailboxMessageDetail(email, historyEntry, messageId) {
  const password = String(historyEntry?.passwordSuggestion || historyEntry?.mailboxPassword || "").trim();

  if (!email || !password) {
    return { ok: false, error: "Data inbox tidak lengkap. Refresh inbox dulu." };
  }

  const tokenResult = await createMailTmToken(email, password);

  if (!tokenResult.ok) {
    return { ok: false, error: tokenResult.error };
  }

  const messageResult = await fetchMailTmMessageById(tokenResult.token, messageId);

  if (!messageResult.ok) {
    return { ok: false, error: messageResult.error };
  }

  return {
    ok: true,
    payload: {
      ...messageResult.message,
      email,
    },
  };
}

async function deleteMailboxMessage(email, historyEntry, messageId) {
  const password = String(historyEntry?.passwordSuggestion || historyEntry?.mailboxPassword || "").trim();

  if (!email || !password) {
    return { ok: false, error: "Data inbox tidak lengkap. Refresh inbox dulu." };
  }

  const tokenResult = await createMailTmToken(email, password);

  if (!tokenResult.ok) {
    return { ok: false, error: tokenResult.error };
  }

  return deleteMailTmMessage(tokenResult.token, messageId);
}

async function getAdminStats(env, chatId, historyState) {
  const domainsResult = await fetchAvailableDomains();
  const subscriptions = await listChatSubscriptions(env);

  return {
    provider: "mail.tm",
    domainCount: domainsResult.ok ? domainsResult.domains.length : 0,
    historyCount: historyState.count,
    planName: formatPlanName(historyState),
    premiumConfiguredCount: parsePremiumChatIds(env?.PREMIUM_CHAT_IDS).size,
    activeProCount: subscriptions.length,
    chatId,
  };
}

function extractHydraMembers(data) {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data["hydra:member"])) {
    return data["hydra:member"];
  }

  if (Array.isArray(data.member)) {
    return data.member;
  }

  return [];
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

async function generateInboxPassword(email, env) {
  const seed = `${String(env?.INBOX_PASSWORD_SECRET || DEFAULT_INBOX_PASSWORD_SECRET)}:${String(email).trim().toLowerCase()}`;
  const bytes = await digestSeed(seed);

  return `${PASSWORD_ANIMALS[bytes[0] % PASSWORD_ANIMALS.length]}${PASSWORD_ACTIONS[bytes[1] % PASSWORD_ACTIONS.length]}${PASSWORD_FOODS[bytes[2] % PASSWORD_FOODS.length]}${padNumber(bytes[3] % 100)}`;
}

async function digestSeed(value) {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return new Uint8Array(buffer);
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
  return atIndex >= 0 ? normalized.slice(atIndex + 1) : "";
}

function isSupportedEmailDomain(domain) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(String(domain ?? "").trim());
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
    planCode: isAdmin ? "admin" : isPremium ? "pro" : "basic",
    isUnlimited: isAdmin,
    limit: isAdmin ? null : isPremium ? PREMIUM_HISTORY_LIMIT : DEFAULT_HISTORY_LIMIT,
    upgradePriceLabel: PREMIUM_HISTORY_PRICE_LABEL,
    expiresAt: 0,
    isSubscriptionManaged: false,
  };
}

async function resolveChatPlan(env, chatId, username = "") {
  const basePlan = getChatPlan(env, chatId, username);

  if (basePlan.isAdmin || basePlan.isPremium) {
    return basePlan;
  }

  const subscription = await getChatSubscription(env, chatId);

  if (!subscription) {
    return basePlan;
  }

  const now = Date.now();

  if (subscription.expiresAt <= now) {
    await clearChatSubscription(env, chatId);
    await pruneHistoryToLimit(env, chatId, DEFAULT_HISTORY_LIMIT);
    return basePlan;
  }

  return {
    ...basePlan,
    isPremium: true,
    planCode: "pro",
    limit: PREMIUM_HISTORY_LIMIT,
    expiresAt: subscription.expiresAt,
    isSubscriptionManaged: true,
  };
}

async function getChatSubscription(env, chatId) {
  const result = await invokeHistoryStore(env, chatId, "/subscription_get", {});
  return normalizeSubscriptionRecord(result?.subscription, chatId);
}

async function setChatProSubscription(env, chatId, options = {}) {
  const now = Date.now();
  const current = await getChatSubscription(env, chatId);
  const startFrom = current && current.expiresAt > now ? current.expiresAt : now;
  const expiresAt = startFrom + PRO_PLAN_DURATION_DAYS * 24 * 60 * 60 * 1000;
  const subscription = normalizeSubscriptionRecord(
    {
      chatId,
      planCode: "pro",
      expiresAt,
      remindedAt: 0,
      createdAt: current?.createdAt || now,
      updatedAt: now,
      source: options.source || "admin",
    },
    chatId,
  );

  await invokeHistoryStore(env, chatId, "/subscription_set", { subscription });
  await invokeSubscriptionRegistry(env, "/subscription_upsert", { subscription });

  return subscription;
}

async function clearChatSubscription(env, chatId) {
  await invokeHistoryStore(env, chatId, "/subscription_clear", {});
  await invokeSubscriptionRegistry(env, "/subscription_remove", { chatId: String(chatId) });
}

async function listChatSubscriptions(env) {
  const result = await invokeSubscriptionRegistry(env, "/subscription_list", {});
  return Array.isArray(result?.items)
    ? result.items.map((item) => normalizeSubscriptionRecord(item, item?.chatId)).filter(Boolean)
    : [];
}

async function updateChatSubscriptionReminder(env, subscription) {
  if (!subscription) {
    return;
  }

  await invokeHistoryStore(env, subscription.chatId, "/subscription_set", { subscription });
  await invokeSubscriptionRegistry(env, "/subscription_upsert", { subscription });
}

async function pruneHistoryToLimit(env, chatId, limit) {
  const result = await invokeHistoryStore(env, chatId, "/prune", { limit });
  return Array.isArray(result?.items) ? result.items.length : 0;
}

async function runSubscriptionMaintenance(env) {
  if (!env?.TELEGRAM_BOT_TOKEN) {
    return;
  }

  const subscriptions = await listChatSubscriptions(env);
  const now = Date.now();
  const reminderWindowMs = PRO_REMINDER_LEAD_DAYS * 24 * 60 * 60 * 1000;

  for (const subscription of subscriptions) {
    if (!subscription) {
      continue;
    }

    if (subscription.expiresAt <= now) {
      await clearChatSubscription(env, subscription.chatId);
      await pruneHistoryToLimit(env, subscription.chatId, DEFAULT_HISTORY_LIMIT);
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        Number(subscription.chatId),
        buildSubscriptionExpiredMessage(),
        { parse_mode: "HTML" },
      ).catch(() => null);
      continue;
    }

    if (subscription.expiresAt - now <= reminderWindowMs && !subscription.remindedAt) {
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        Number(subscription.chatId),
        buildSubscriptionReminderMessage(subscription),
        { parse_mode: "HTML" },
      ).catch(() => null);

      subscription.remindedAt = now;
      subscription.updatedAt = now;
      await updateChatSubscriptionReminder(env, subscription);
    }
  }
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

  let state = normalizeHistoryState(result, plan);

  if (plan.limit !== null && state.count > plan.limit) {
    const pruned = await invokeHistoryStore(env, chatId, "/prune", { limit: plan.limit });
    state = normalizeHistoryState(pruned, plan);
  }

  return state;
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

async function invokeSubscriptionRegistry(env, path, payload) {
  if (env?.TEMP_MGEN_STATE) {
    const id = env.TEMP_MGEN_STATE.idFromName("registry:subscriptions");
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

  return fallbackSubscriptionRegistryFetch(path, payload);
}

function fallbackHistoryStoreFetch(chatId, path, payload) {
  const key = String(chatId ?? "unknown");
  const existing = normalizeStoredHistory(FALLBACK_HISTORY_STORE.get(key));
  const pending = normalizePendingAction(FALLBACK_PENDING_STORE.get(key));
  const subscription = normalizeSubscriptionRecord(FALLBACK_SUBSCRIPTION_STORE.get(key), key);

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

  if (path === "/subscription_get") {
    return {
      ok: true,
      subscription,
    };
  }

  if (path === "/subscription_set") {
    const nextSubscription = normalizeSubscriptionRecord(payload?.subscription, key);

    if (nextSubscription) {
      FALLBACK_SUBSCRIPTION_STORE.set(key, nextSubscription);
    } else {
      FALLBACK_SUBSCRIPTION_STORE.delete(key);
    }

    return {
      ok: true,
      subscription: nextSubscription,
    };
  }

  if (path === "/subscription_clear") {
    FALLBACK_SUBSCRIPTION_STORE.delete(key);
    return {
      ok: true,
      subscription: null,
    };
  }

  if (path === "/prune") {
    const limit = normalizeHistoryLimit(payload?.limit, {});
    const nextItems = existing.slice(0, limit || existing.length);
    FALLBACK_HISTORY_STORE.set(key, nextItems);

    return {
      ok: true,
      items: nextItems,
      count: nextItems.length,
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

function fallbackSubscriptionRegistryFetch(path, payload) {
  if (path === "/subscription_list") {
    return {
      ok: true,
      items: Array.from(FALLBACK_SUBSCRIPTION_REGISTRY.values()),
    };
  }

  if (path === "/subscription_upsert") {
    const subscription = normalizeSubscriptionRecord(payload?.subscription, payload?.subscription?.chatId);

    if (subscription) {
      FALLBACK_SUBSCRIPTION_REGISTRY.set(subscription.chatId, subscription);
    }

    return {
      ok: true,
      subscription,
      items: Array.from(FALLBACK_SUBSCRIPTION_REGISTRY.values()),
    };
  }

  if (path === "/subscription_remove") {
    FALLBACK_SUBSCRIPTION_REGISTRY.delete(String(payload?.chatId ?? ""));
    return {
      ok: true,
      items: Array.from(FALLBACK_SUBSCRIPTION_REGISTRY.values()),
    };
  }

  return {
    ok: false,
    error: "Unknown registry operation.",
    items: Array.from(FALLBACK_SUBSCRIPTION_REGISTRY.values()),
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

  if (type === "admin_setpro" || type === "admin_removepro") {
    return { type };
  }

  return null;
}

function normalizeSubscriptionRecord(value, fallbackChatId = "") {
  if (!value || typeof value !== "object") {
    return null;
  }

  const chatId = String(value.chatId ?? fallbackChatId ?? "").trim();
  const expiresAt = Number(value.expiresAt || 0);

  if (!chatId || !Number.isFinite(expiresAt) || expiresAt <= 0) {
    return null;
  }

  return {
    chatId,
    planCode: String(value.planCode || "pro").trim().toLowerCase(),
    expiresAt,
    remindedAt: Number(value.remindedAt || 0),
    createdAt: Number(value.createdAt || Date.now()),
    updatedAt: Number(value.updatedAt || Date.now()),
    source: String(value.source || "admin").trim().toLowerCase(),
  };
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

  return normalizedLocalPart;
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
  const lines = [
    "<b>TempMGen siap dipakai</b>",
    "",
    "Domain: <code>otomatis dari sistem</code>",
    "Pola nama: <code>nama + benda + kota + angka 0-99</code>",
    `History: <code>${escapeHtml(formatHistoryUsage(historyState))}</code>`,
    `Paket: <code>${escapeHtml(formatPlanName(historyState))}</code>`,
    "",
    "Perintah:",
    "<code>/new</code> - buat email baru",
    "<code>/history</code> - lihat history email",
    "<code>/import email</code> - recovery email buatan bot",
    "<code>/import email password-bot</code> - recovery pakai Password inbox",
    "<code>/delete email</code> - hapus 1 email dari history",
    "<code>/note email catatan</code> - simpan catatan email",
    "<code>/inbox email</code> - lihat inbox",
    "<code>/refresh email</code> - refresh inbox",
    "<code>/start</code> - tampilkan bantuan ini",
  ];

  if (historyState.isAdmin) {
    lines.push("<code>/admin</code> - buka admin tools", "<code>/stats</code> - lihat ringkasan bot");
  }

  return lines.join("\n");
}

function buildNewEmailMessage(payload, historyState) {
  const lines = [
    "<b>Email baru</b>",
    "",
    `<code>${escapeHtml(payload.email)}</code>`,
    `Inbox: <code>${escapeHtml(payload.inboxStatus || "Kosong")}</code>`,
    `History: <code>${escapeHtml(formatHistoryUsage(historyState))}</code>`,
    "",
    "Password inbox:",
    `<code>${escapeHtml(payload.passwordSuggestion)}</code>`,
    "",
    "VCC dummy:",
    `<code>${escapeHtml(payload.vcc?.number || "-")}</code>`,
    `Exp: <code>${escapeHtml(payload.vcc?.expText || "-")}</code>`,
    `CVV: <code>${escapeHtml(payload.vcc?.cvv || "-")}</code>`,
  ];

  if (payload.otpCodes?.length) {
    lines.push("");
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

  if (payload.passwordSuggestion) {
    lines.push("", "Password inbox:", `<code>${escapeHtml(payload.passwordSuggestion)}</code>`);
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
    lines.push("");
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
    if (item.note) {
      lines.push(`   catatan: ${escapeHtml(item.note)}`);
    }
  }

  if (historyState.items.length > previewItems.length) {
    lines.push("", `Dan ${escapeHtml(String(historyState.items.length - previewItems.length))} email lainnya.`);
  }

  lines.push(
    "",
    "Gunakan <code>/import email</code> untuk recovery email bot.",
    "Gunakan <code>/import email password-bot</code> kalau mau pakai Password inbox bot.",
    "Gunakan <code>/delete email</code> untuk hapus history 1 email.",
    "Gunakan <code>/note email catatan</code> untuk menambah catatan.",
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
    `<code>/delete ${DOMAIN_EXAMPLE_FALLBACK}</code>`,
    "<code>/delete email-di-history</code>",
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
    `<code>/note ${DOMAIN_EXAMPLE_FALLBACK} akun marketplace</code>`,
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
    lines.push("", "Password inbox:", `<code>${escapeHtml(payload.passwordSuggestion)}</code>`);
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

  if (!payload.messages.length) {
    lines.push("", "Belum ada pesan masuk.");
    return lines.join("\n");
  }

  lines.push("", `Pesan terbaru: <code>${escapeHtml(String(payload.messageCount))}</code>`);

  for (const [index, item] of payload.messages.slice(0, 5).entries()) {
    const messageOtpCodes = extractOtpCodesFromText(`${item.subject || ""} ${item.excerpt || ""}`);

    lines.push(
      "",
      `${index + 1}. <b>${escapeHtml(item.subject || "Tanpa subjek")}</b>`,
      `Dari: <code>${escapeHtml(item.from || "unknown")}</code>`,
      `Waktu: <code>${escapeHtml(item.date || "-")}</code>`,
      escapeHtml(item.excerpt || "(tidak ada preview)"),
    );

    for (const code of messageOtpCodes) {
      lines.push(`<code>${escapeHtml(code)}</code>`);
    }
  }

  if (payload.messages.length > 5) {
    lines.push("", `Dan ${escapeHtml(String(payload.messages.length - 5))} pesan lainnya.`);
  }

  return lines.join("\n");
}

function buildFullMessageText(payload) {
  const lines = [
    "<b>Isi pesan lengkap</b>",
    "",
    `<code>${escapeHtml(payload.email)}</code>`,
    `Dari: <code>${escapeHtml(payload.from || "unknown")}</code>`,
    `Subjek: <code>${escapeHtml(payload.subject || "Tanpa subjek")}</code>`,
    `Waktu: <code>${escapeHtml(payload.date || "-")}</code>`,
  ];

  if (payload.otpCodes?.length) {
    lines.push("");
    for (const code of payload.otpCodes) {
      lines.push(`<code>${escapeHtml(code)}</code>`);
    }
  }

  lines.push("", escapeHtml(payload.body || payload.excerpt || "(isi pesan kosong)"));

  return lines.join("\n");
}

function buildAdminMessage(chatId) {
  return [
    "<b>Admin tools</b>",
    "",
    `Admin: <code>@${escapeHtml(ADMIN_TELEGRAM_USERNAME)}</code>`,
    `Chat ID: <code>${escapeHtml(String(chatId))}</code>`,
    "",
    `Paket Pro: <code>${PREMIUM_HISTORY_PRICE_LABEL}</code> / ${PRO_PLAN_DURATION_DAYS} hari`,
    `Reminder: <code>H-${PRO_REMINDER_LEAD_DAYS}</code> sebelum habis`,
    `Limit setelah Pro habis: <code>${DEFAULT_HISTORY_LIMIT}</code> history`,
    "",
    "Gunakan tombol di bawah untuk atur paket user.",
  ].join("\n");
}

function buildStatsMessage(stats) {
  return [
    "<b>Ringkasan bot</b>",
    "",
    `Provider: <code>${escapeHtml(stats.provider)}</code>`,
    `Domain aktif: <code>${escapeHtml(String(stats.domainCount))}</code>`,
    `History chat ini: <code>${escapeHtml(String(stats.historyCount))}</code>`,
    `Paket chat ini: <code>${escapeHtml(stats.planName)}</code>`,
    `Premium via secret: <code>${escapeHtml(String(stats.premiumConfiguredCount))}</code>`,
    `Pro aktif: <code>${escapeHtml(String(stats.activeProCount))}</code>`,
    `Chat ID: <code>${escapeHtml(String(stats.chatId))}</code>`,
  ].join("\n");
}

function buildProListMessage(subscriptions) {
  if (!subscriptions.length) {
    return [
      "<b>Daftar Paket Pro</b>",
      "",
      "Belum ada user Pro aktif.",
    ].join("\n");
  }

  const lines = [
    "<b>Daftar Paket Pro</b>",
    "",
  ];

  for (const item of subscriptions.slice(0, 20)) {
    lines.push(
      `Chat: <code>${escapeHtml(item.chatId)}</code>`,
      `Akhir: <code>${escapeHtml(formatDateTime(item.expiresAt))}</code>`,
      "",
    );
  }

  if (subscriptions.length > 20) {
    lines.push(`Dan ${escapeHtml(String(subscriptions.length - 20))} user lainnya.`);
  }

  return lines.join("\n").trim();
}

function buildAdminChatIdPrompt(actionType, error = "") {
  const mode = actionType === "admin_removepro" ? "Cabut Pro" : "Set Pro 30 Hari";

  return [
    `<b>${mode}</b>`,
    "",
    error ? escapeHtml(error) : "",
    "Kirim Chat ID user target.",
    "Contoh:",
    "<code>123456789</code>",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildAdminSubscriptionResultMessage(chatId, subscription) {
  return [
    "<b>Paket Pro diaktifkan</b>",
    "",
    `Chat ID: <code>${escapeHtml(String(chatId))}</code>`,
    `Berakhir: <code>${escapeHtml(formatDateTime(subscription.expiresAt))}</code>`,
    `Limit history: <code>${PREMIUM_HISTORY_LIMIT}</code>`,
  ].join("\n");
}

function buildAdminSubscriptionRemovedResult(chatId) {
  return [
    "<b>Paket Pro dicabut</b>",
    "",
    `Chat ID: <code>${escapeHtml(String(chatId))}</code>`,
    `History dibatasi lagi ke <code>${DEFAULT_HISTORY_LIMIT}</code>.`,
  ].join("\n");
}

function buildSubscriptionActivatedMessage(subscription) {
  return [
    "<b>Paket Pro aktif</b>",
    "",
    `History kamu naik jadi <code>${PREMIUM_HISTORY_LIMIT}</code> selama ${PRO_PLAN_DURATION_DAYS} hari.`,
    `Berakhir: <code>${escapeHtml(formatDateTime(subscription.expiresAt))}</code>`,
  ].join("\n");
}

function buildSubscriptionReminderMessage(subscription) {
  return [
    "<b>Paket Pro akan segera habis</b>",
    "",
    `Masa aktif berakhir: <code>${escapeHtml(formatDateTime(subscription.expiresAt))}</code>`,
    `Kalau tidak diperpanjang, history akan disisakan <code>${DEFAULT_HISTORY_LIMIT}</code>.`,
    `Hubungi <a href="${ADMIN_TELEGRAM_URL}">@${escapeHtml(ADMIN_TELEGRAM_USERNAME)}</a> untuk perpanjang.`,
  ].join("\n");
}

function buildSubscriptionExpiredMessage() {
  return [
    "<b>Paket Pro sudah habis</b>",
    "",
    `History kamu kembali ke batas <code>${DEFAULT_HISTORY_LIMIT}</code>.`,
    `Hubungi <a href="${ADMIN_TELEGRAM_URL}">@${escapeHtml(ADMIN_TELEGRAM_USERNAME)}</a> jika ingin aktif lagi.`,
  ].join("\n");
}

function buildSubscriptionRemovedMessage() {
  return [
    "<b>Paket Pro dinonaktifkan</b>",
    "",
    `History kamu kembali ke batas <code>${DEFAULT_HISTORY_LIMIT}</code>.`,
  ].join("\n");
}

function buildImportUsageMessage(error) {
  return [
    "<b>Format import email</b>",
    "",
    error ? escapeHtml(error) : "",
    "",
    "Contoh:",
    `<code>/import ${DOMAIN_EXAMPLE_FALLBACK}</code>`,
    `<code>/import ${DOMAIN_EXAMPLE_FALLBACK} PasswordInboxBot</code>`,
    "<code>/import email-di-history</code>",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildImportPromptMessage() {
  return [
    "<b>Import email</b>",
    "",
    "Kirim email bot yang ingin direcovery.",
    "Contoh:",
    `<code>${DOMAIN_EXAMPLE_FALLBACK}</code>`,
    `<code>${DOMAIN_EXAMPLE_FALLBACK} PasswordInboxBot</code>`,
    "<code>email-di-history</code>",
  ].join("\n");
}

function buildInboxUsageMessage(error) {
  return [
    "<b>Cara buka inbox</b>",
    "",
    error ? escapeHtml(error) : "",
    "",
    "Contoh:",
    `<code>/inbox ${DOMAIN_EXAMPLE_FALLBACK}</code>`,
    `<code>/refresh ${DOMAIN_EXAMPLE_FALLBACK}</code>`,
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
    "<code>/import email password-bot</code>",
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

  if (historyState.isAdmin) {
    rows.push([{ text: "Admin Tools", callback_data: "admin" }]);
  }

  return { inline_keyboard: rows };
}

function buildMailboxKeyboard(targetEmail, historyState, payload = null) {
  const reference = parseMailboxReference(targetEmail);
  const key = reference.ok ? reference.email : String(targetEmail ?? "");
  const rows = [
    [
      { text: "Inbox", callback_data: `inbox:${key}` },
      { text: "Refresh", callback_data: `refresh:${key}` },
    ],
    [
      { text: "History", callback_data: "history" },
      { text: "Pindah Email", callback_data: "history_select:0" },
    ],
    [
      { text: "Catatan", callback_data: `note_prompt:${key}` },
      { text: "Hapus Email", callback_data: `delete:${key}` },
    ],
    [
      { text: "Email Baru", callback_data: "new" },
      { text: "Import Email", callback_data: "import_prompt" },
    ],
  ];

  if (payload?.messages?.length) {
    for (const [index, message] of payload.messages.slice(0, 3).entries()) {
      rows.push([
        { text: `Open ${index + 1}`, callback_data: `openmsg:${message.id}` },
        { text: `Delete ${index + 1}`, callback_data: `delmsg:${message.id}` },
      ]);
    }
  }

  if (!historyState.isPremium && !historyState.isAdmin) {
    rows.push([{ text: "Pembelian 5k/bulan", url: ADMIN_TELEGRAM_URL }]);
  }

  if (historyState.isAdmin) {
    rows.push([{ text: "Admin Tools", callback_data: "admin" }]);
  }

  return { inline_keyboard: rows };
}

function buildMessageDetailKeyboard(targetEmail, historyState, payload) {
  const reference = parseMailboxReference(targetEmail);
  const key = reference.ok ? reference.email : String(targetEmail ?? "");
  const rows = [
    [
      { text: "Refresh Inbox", callback_data: `refresh:${key}` },
      { text: "Delete Message", callback_data: `delmsg:${payload.id}` },
    ],
  ];

  return { inline_keyboard: rows };
}

function buildAdminKeyboard(historyState) {
  return {
    inline_keyboard: [
      [
        { text: "Stats", callback_data: "stats" },
        { text: "List Pro", callback_data: "admin_listpro" },
      ],
      [
        { text: "Set Pro 30 Hari", callback_data: "admin_setpro" },
        { text: "Cabut Pro", callback_data: "admin_removepro" },
      ],
      [{ text: "Email Baru", callback_data: "new" }],
      ...(historyState.isAdmin ? [[{ text: "Admin Tools", callback_data: "admin" }]] : []),
    ],
  };
}

function buildHistorySelectorKeyboard(historyState, page = 0) {
  const rows = [];
  const { pageItems, pageCount, safePage } = paginateHistoryItems(historyState, page, 5);

  for (const item of pageItems) {
    rows.push([{ text: shortenEmailForButton(item.email), callback_data: `inbox:${item.email}` }]);
    rows.push([
      { text: "Catatan", callback_data: `note_prompt:${item.email}` },
      { text: "Hapus", callback_data: `delete:${item.email}` },
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
  const startsWithExplicitEmail = /@[a-z0-9.-]+\.[a-z]{2,}\b/i.test(raw);

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

function resolveImportInput(rawText, historyState) {
  const raw = String(rawText ?? "").trim();

  if (!raw) {
    return { ok: false, error: "Email belum diisi." };
  }

  const [firstToken, ...restTokens] = raw.split(/\s+/);
  const reference = parseMailboxReference(firstToken);

  if (!reference.ok) {
    return { ok: false, error: reference.error };
  }

  const historyEntry = findHistoryEntry(historyState, reference.email || reference.localPart);
  const email = historyEntry?.email || reference.email;
  const providedPassword = restTokens.join(" ").trim();

  return {
    ok: true,
    email,
    localPart: reference.localPart,
    providedPassword,
    historyEntry,
  };
}

async function resolveImportAccess(env, importInput) {
  if (!importInput?.ok) {
    return importInput;
  }

  if (!String(importInput.email || "").includes("@")) {
    return {
      ok: false,
      error: "Gunakan alamat email lengkap yang dibuat bot.",
    };
  }

  const deterministicPassword = await generateInboxPassword(importInput.email, env);

  if (importInput.providedPassword) {
    if (importInput.providedPassword !== deterministicPassword) {
      return {
        ok: false,
        error: "Import hanya untuk email yang dibuat bot. Gunakan Password inbox bot yang benar.",
      };
    }

    return {
      ok: true,
      email: importInput.email,
      localPart: importInput.localPart,
      password: deterministicPassword,
      historyEntry: importInput.historyEntry,
      passwordSource: "provided",
      allowDeterministicPassword: false,
    };
  }

  return {
    ok: true,
    email: importInput.email,
    localPart: importInput.localPart,
    password: deterministicPassword,
    historyEntry: importInput.historyEntry,
    passwordSource: "deterministic",
    allowDeterministicPassword: true,
  };
}

function parseChatIdInput(text) {
  const match = String(text ?? "").trim().match(/-?\d{4,20}/);
  return match?.[0] || "";
}

function parseMailboxReference(text) {
  const raw = String(text ?? "").trim().toLowerCase();

  if (!raw) {
    return { ok: false, error: "Email target kosong." };
  }

  const emailMatch = raw.match(/([a-z0-9._+-]{1,64})@([a-z0-9.-]+\.[a-z]{2,})/);

  if (emailMatch && isSupportedEmailDomain(emailMatch[2])) {
    return {
      ok: true,
      localPart: emailMatch[1],
      email: `${emailMatch[1]}@${emailMatch[2]}`,
    };
  }

  const token = raw.split(/\s+/)[0];

  if (/^[a-z0-9._+-]{1,64}$/.test(token)) {
    return {
      ok: true,
      localPart: token,
      email: token,
    };
  }

  return {
    ok: false,
    error: "Gunakan email yang valid.",
  };
}

function normalizeMailboxMessage(item) {
  const fromAddress =
    String(item?.from?.address || item?.from?.name || item?.mail_from || "")
      .trim();
  const subject = String(item?.subject || item?.mail_subject || "").trim();
  const excerpt = String(item?.intro || item?.mail_excerpt || "").replace(/\s+/g, " ").trim();
  const createdAt = String(item?.createdAt || item?.mail_date || "").trim();

  return {
    id: String(item?.id || item?.mail_id || ""),
    from: decodeHtmlEntities(fromAddress),
    subject: decodeHtmlEntities(subject),
    excerpt: trimText(decodeHtmlEntities(excerpt), 180),
    date: formatMessageDate(createdAt),
  };
}

function normalizeFullMailboxMessage(item) {
  const base = normalizeMailboxMessage(item);
  const body = extractMessageBody(item);

  return {
    ...base,
    body: trimText(body, 3500),
    otpCodes: extractOtpCodes([{ subject: base.subject, excerpt: `${base.excerpt} ${body}` }]),
  };
}

function isSystemMailboxMessage(item) {
  return false;
}

function extractMessageBody(item) {
  if (typeof item?.text === "string" && item.text.trim()) {
    return item.text.trim();
  }

  if (Array.isArray(item?.text) && item.text.length) {
    return item.text.join("\n").trim();
  }

  if (typeof item?.html === "string" && item.html.trim()) {
    return stripHtml(item.html).trim();
  }

  if (Array.isArray(item?.html) && item.html.length) {
    return stripHtml(item.html.join("\n")).trim();
  }

  return String(item?.intro || "").trim();
}

function stripHtml(value) {
  return String(value ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
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

function formatMessageDate(value) {
  const input = String(value ?? "").trim();

  if (!input) {
    return "-";
  }

  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return input;
  }

  return `${date.getUTCFullYear()}-${padNumber(date.getUTCMonth() + 1)}-${padNumber(date.getUTCDate())} ${padNumber(date.getUTCHours())}:${padNumber(date.getUTCMinutes())} UTC`;
}

function formatDateTime(value) {
  return formatMessageDate(new Date(Number(value || 0)).toISOString());
}

function buildCopyPayloadFromBotText(action, botText, historyState) {
  const email = extractEmailFromText(botText);
  const historyEntry = email ? findHistoryEntry(historyState, email) : null;
  const payload = historyEntry
    ? {
        email: historyEntry.email,
        passwordSuggestion: historyEntry.passwordSuggestion || "",
        vcc: historyEntry.vcc || null,
        otpCodes: extractOtpCodesFromText(botText),
      }
    : {
        email,
        passwordSuggestion:
          extractLabeledValue(botText, "Password inbox") ||
          extractLabeledValue(botText, "Password saran") ||
          extractLabeledValue(botText, "Password"),
        vcc: {
          number: extractNextLineValue(botText, "VCC dummy") || "",
          expText: extractInlineValue(botText, "Exp") || "",
          cvv: extractInlineValue(botText, "CVV") || "",
        },
        otpCodes: extractOtpCodesFromText(botText),
      };

  if (action === "copy_email") {
    return email ? { ok: true, value: email, email, payload, notice: "Email siap dicopy." } : { ok: false, error: "Email belum ada." };
  }

  if (action === "copy_password") {
    const value = payload.passwordSuggestion;
    return value
      ? { ok: true, value, email, payload, notice: "Password siap dicopy." }
      : { ok: false, error: "Password belum tersedia." };
  }

  if (action === "copy_otp") {
    const value = payload.otpCodes?.[0] || "";
    return value
      ? { ok: true, value, email, payload, notice: "OTP siap dicopy." }
      : { ok: false, error: "OTP belum ditemukan." };
  }

  if (action === "copy_vcc") {
    const value = payload.vcc?.number || "";
    return value
      ? { ok: true, value, email, payload, notice: "Nomor VCC siap dicopy." }
      : { ok: false, error: "Nomor VCC belum tersedia." };
  }

  if (action === "copy_cvv") {
    const value = payload.vcc?.cvv || "";
    return value
      ? { ok: true, value, email, payload, notice: "CVV siap dicopy." }
      : { ok: false, error: "CVV belum tersedia." };
  }

  return { ok: false, error: "Aksi copy tidak dikenal." };
}

function extractEmailFromText(text) {
  const match = String(text ?? "").match(/[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  return match?.[0]?.toLowerCase() || "";
}

function extractOtpCodesFromText(text) {
  return Array.from(new Set(String(text ?? "").match(/\b\d{4,8}\b/g) || [])).slice(0, 5);
}

function extractLabeledValue(text, label) {
  const lines = String(text ?? "").split(/\r?\n/);
  const index = lines.findIndex((line) => line.trim().toLowerCase() === `${label.toLowerCase()}:`);
  return index >= 0 ? String(lines[index + 1] || "").trim() : "";
}

function extractNextLineValue(text, label) {
  return extractLabeledValue(text, label);
}

function extractInlineValue(text, label) {
  const match = String(text ?? "").match(new RegExp(`${label}:\\s*([^\\n]+)`, "i"));
  return match?.[1]?.trim() || "";
}

function normalizeLocalPart(value) {
  const cleaned = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._+-]/g, "")
    .replace(/[._+-]{2,}/g, ".")
    .replace(/^[._+-]+|[._+-]+$/g, "")
    .slice(0, 64);

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

    if (url.pathname === "/subscription_get") {
      return json(
        {
          ok: true,
          subscription: await this.readSubscription(),
        },
        200,
      );
    }

    if (url.pathname === "/subscription_set") {
      const subscription = normalizeSubscriptionRecord(body?.subscription, body?.subscription?.chatId);
      await this.writeSubscription(subscription);

      return json(
        {
          ok: true,
          subscription,
        },
        200,
      );
    }

    if (url.pathname === "/subscription_clear") {
      await this.writeSubscription(null);

      return json(
        {
          ok: true,
          subscription: null,
        },
        200,
      );
    }

    if (url.pathname === "/prune") {
      const items = await this.readHistory();
      const limit = normalizeHistoryLimit(body?.limit, {});
      const nextItems = limit === null ? items : items.slice(0, limit);
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

    if (url.pathname === "/subscription_list") {
      return json(
        {
          ok: true,
          items: await this.readRegistrySubscriptions(),
        },
        200,
      );
    }

    if (url.pathname === "/subscription_upsert") {
      const subscription = normalizeSubscriptionRecord(body?.subscription, body?.subscription?.chatId);
      const items = await this.readRegistrySubscriptions();
      const nextItems = items.filter((item) => item.chatId !== subscription?.chatId);

      if (subscription) {
        nextItems.unshift(subscription);
      }

      await this.writeRegistrySubscriptions(nextItems);

      return json(
        {
          ok: true,
          subscription,
          items: nextItems,
        },
        200,
      );
    }

    if (url.pathname === "/subscription_remove") {
      const items = await this.readRegistrySubscriptions();
      const chatId = String(body?.chatId ?? "").trim();
      const nextItems = items.filter((item) => item.chatId !== chatId);
      await this.writeRegistrySubscriptions(nextItems);

      return json(
        {
          ok: true,
          items: nextItems,
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

  async readSubscription() {
    const stored = await this.state.storage.get("subscription");
    return normalizeSubscriptionRecord(stored, stored?.chatId);
  }

  async writeSubscription(subscription) {
    if (subscription) {
      await this.state.storage.put("subscription", normalizeSubscriptionRecord(subscription, subscription.chatId));
      return;
    }

    await this.state.storage.delete("subscription");
  }

  async readRegistrySubscriptions() {
    const stored = await this.state.storage.get("subscription_registry");
    return Array.isArray(stored)
      ? stored.map((item) => normalizeSubscriptionRecord(item, item?.chatId)).filter(Boolean)
      : [];
  }

  async writeRegistrySubscriptions(items) {
    await this.state.storage.put(
      "subscription_registry",
      Array.isArray(items)
        ? items.map((item) => normalizeSubscriptionRecord(item, item?.chatId)).filter(Boolean)
        : [],
    );
  }
}
