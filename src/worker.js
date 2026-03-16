const GUERRILLA_API_URL = "https://api.guerrillamail.com/ajax.php";
const SESSION_COOKIE = "TEMPMGEN_GMSESSID";
const FIXED_DOMAIN = "pokemail.net";
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

  if (!chatId || !command) {
    return json({ ok: true, ignored: true }, 200);
  }

  if (command === "start") {
    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildStartMessage(), {
      parse_mode: "HTML",
      reply_markup: buildNewEmailKeyboard(),
    });

    return json({ ok: true, handled: true, command }, 200);
  }

  if (command === "new") {
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

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildNewEmailMessage(result.payload), {
      parse_mode: "HTML",
      reply_markup: buildMailboxKeyboard(result.payload.username),
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

    const inboxResult = await getMailboxInbox(request, reference.localPart);

    if (!inboxResult.ok) {
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        `Gagal import email.\n\n${escapeHtml(inboxResult.error)}`,
        { parse_mode: "HTML" },
      );

      return json({ ok: false, handled: true, command, error: inboxResult.error }, 502);
    }

    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildImportSuccessMessage(inboxResult.payload), {
      parse_mode: "HTML",
      reply_markup: buildMailboxKeyboard(reference.localPart),
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

    const inboxResult = await getMailboxInbox(request, reference.localPart);

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
        reply_markup: buildMailboxKeyboard(reference.localPart),
      },
    );

    return json({ ok: true, handled: true, command, email: inboxResult.payload.email }, 200);
  }

  await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildUnknownCommandMessage(), {
    parse_mode: "HTML",
    reply_markup: buildNewEmailKeyboard(),
  });

  return json({ ok: true, handled: true, command }, 200);
}

async function handleTelegramCallbackQuery(request, env, callbackQuery) {
  const callbackId = callbackQuery?.id;
  const chatId = callbackQuery?.message?.chat?.id;
  const data = String(callbackQuery?.data ?? "");

  if (!callbackId || !chatId || !data) {
    return json({ ok: true, ignored: true }, 200);
  }

  try {
    if (data === "new") {
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

      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Email baru dibuat.");
      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, buildNewEmailMessage(result.payload), {
        parse_mode: "HTML",
        reply_markup: buildMailboxKeyboard(result.payload.username),
      });

      return json({ ok: true, handled: true, callback: data, email: result.payload.email }, 200);
    }

    const separator = data.indexOf(":");
    const action = separator >= 0 ? data.slice(0, separator) : data;
    const rawLocalPart = separator >= 0 ? data.slice(separator + 1) : "";
    const mailbox = parseMailboxReference(rawLocalPart);

    if (!mailbox.ok || !rawLocalPart) {
      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Email tidak valid.", true);
      return json({ ok: true, handled: true, callback: data, error: mailbox.error }, 200);
    }

    if (action !== "inbox" && action !== "refresh") {
      await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Aksi tidak dikenal.", true);
      return json({ ok: true, handled: true, callback: data }, 200);
    }

    const inboxResult = await getMailboxInbox(request, mailbox.localPart);

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
        reply_markup: buildMailboxKeyboard(mailbox.localPart),
      },
    );

    return json({ ok: true, handled: true, callback: data, email: inboxResult.payload.email }, 200);
  } catch (error) {
    await answerTelegramCallbackQuery(env.TELEGRAM_BOT_TOKEN, callbackId, "Terjadi error.", true);
    throw error;
  }
}

async function generateMailbox(request) {
  const generated = generateIdentity();

  return withMailboxSession(request, generated.username, async ({ actualEmail, sessionId }) => ({
    ok: true,
    sessionId,
    payload: {
      ok: true,
      provider: "Guerrilla Mail",
      email: `${generated.username}@${FIXED_DOMAIN}`,
      actualEmail,
      username: generated.username,
      domain: FIXED_DOMAIN,
      parts: generated.parts,
      generator: getGeneratorInfo(),
      note: "Email dibuat otomatis dengan pola nama + benda + kota + angka 0-99 di domain @pokemail.net.",
    },
  }));
}

async function getMailboxInbox(request, localPart) {
  return withMailboxSession(request, localPart, async ({ client, sessionId, actualEmail }) => {
    const listResponse = await callGuerrilla(
      {
        f: "get_email_list",
        offset: 0,
        ip: client.ip,
        agent: client.agent,
        lang: "en",
      },
      sessionId,
    );

    if (!listResponse.ok) {
      return { ok: false, error: listResponse.error };
    }

    if (listResponse.data?.error) {
      return { ok: false, error: String(listResponse.data.error) };
    }

    const messages = Array.isArray(listResponse.data?.list)
      ? listResponse.data.list.map((item) => normalizeMailboxMessage(item))
      : [];

    return {
      ok: true,
      sessionId,
      payload: {
        ok: true,
        provider: "Guerrilla Mail",
        email: `${localPart}@${FIXED_DOMAIN}`,
        actualEmail,
        username: localPart,
        domain: FIXED_DOMAIN,
        messageCount: messages.length,
        messages,
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

function parseTelegramCommand(text) {
  const match = text.match(/^\/([a-z0-9_]+)(?:@[a-z0-9_]+)?(?:\s+([\s\S]*))?$/i);
  return {
    command: match?.[1]?.toLowerCase() || "",
    argsText: match?.[2]?.trim() || "",
  };
}

function buildStartMessage() {
  return [
    "<b>TempMGen siap dipakai</b>",
    "",
    `Domain tetap: <code>@${FIXED_DOMAIN}</code>`,
    "Pola nama: <code>nama + benda + kota + angka 0-99</code>",
    "",
    "Perintah:",
    "<code>/new</code> - generate email baru",
    "<code>/inbox email@pokemail.net</code> - lihat inbox",
    "<code>/refresh email@pokemail.net</code> - refresh inbox",
    "<code>/import email@pokemail.net</code> - reuse atau recovery email",
    "<code>/start</code> - tampilkan bantuan ini",
  ].join("\n");
}

function buildNewEmailMessage(payload) {
  return [
    "<b>Email baru berhasil dibuat</b>",
    "",
    `<code>${escapeHtml(payload.email)}</code>`,
    "",
    "Komposisi:",
    `- nama: <code>${escapeHtml(payload.parts.person)}</code>`,
    `- benda: <code>${escapeHtml(payload.parts.object)}</code>`,
    `- kota: <code>${escapeHtml(payload.parts.city)}</code>`,
    `- angka: <code>${escapeHtml(payload.parts.number)}</code>`,
    "",
    "Gunakan tombol di bawah atau kirim <code>/inbox</code> sebagai reply ke pesan ini.",
  ].join("\n");
}

function buildImportSuccessMessage(payload) {
  return [
    "<b>Email berhasil di-import</b>",
    "",
    `<code>${escapeHtml(payload.email)}</code>`,
    `Pesan terdeteksi: <code>${escapeHtml(String(payload.messageCount))}</code>`,
    "",
    "Gunakan tombol di bawah untuk buka atau refresh inbox.",
  ].join("\n");
}

function buildInboxMessage(payload, options = {}) {
  const lines = [
    options.refreshed ? "<b>Inbox diperbarui</b>" : "<b>Inbox email</b>",
    "",
    `<code>${escapeHtml(payload.email)}</code>`,
  ];

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
    `<code>/import andipakukediri99</code>`,
  ]
    .filter(Boolean)
    .join("\n");
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
    "<code>/inbox email@pokemail.net</code>",
    "<code>/refresh email@pokemail.net</code>",
    "<code>/import email@pokemail.net</code>",
  ].join("\n");
}

function buildNewEmailKeyboard() {
  return {
    inline_keyboard: [[{ text: "New Email", callback_data: "new" }]],
  };
}

function buildMailboxKeyboard(localPart) {
  return {
    inline_keyboard: [
      [
        { text: "Inbox", callback_data: `inbox:${localPart}` },
        { text: "Refresh", callback_data: `refresh:${localPart}` },
      ],
      [{ text: "New Email", callback_data: "new" }],
    ],
  };
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

function parseMailboxReference(text) {
  const raw = String(text ?? "").trim().toLowerCase();

  if (!raw) {
    return { ok: false, error: "Email target kosong." };
  }

  const emailMatch = raw.match(/([a-z0-9._+-]{1,40})@pokemail\.net/);

  if (emailMatch) {
    return {
      ok: true,
      localPart: emailMatch[1],
      email: `${emailMatch[1]}@${FIXED_DOMAIN}`,
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
    error: `Gunakan email dengan domain @${FIXED_DOMAIN}.`,
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
