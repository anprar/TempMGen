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
  const client = getClientDetails(request);
  const storedSessionId = getCookie(request.headers.get("cookie"), SESSION_COOKIE);
  const generated = generateIdentity();

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
    return json({ ok: false, error: initResponse.error }, 502);
  }

  const activeSessionId = initResponse.sessionId || storedSessionId;
  const setResponse = await callGuerrilla(
    {
      f: "set_email_user",
      email_user: generated.username,
      ip: client.ip,
      agent: client.agent,
      lang: "en",
    },
    activeSessionId,
  );

  if (!setResponse.ok) {
    return json({ ok: false, error: setResponse.error }, 502);
  }

  const sessionId = setResponse.sessionId || activeSessionId;
  const actualEmail = String(setResponse.data?.email_addr || "").trim();
  const email = `${generated.username}@${FIXED_DOMAIN}`;
  const response = json(
    {
      ok: true,
      provider: "Guerrilla Mail",
      email,
      actualEmail,
      username: generated.username,
      domain: FIXED_DOMAIN,
      parts: generated.parts,
      generator: getGeneratorInfo(),
      note: "Email dibuat otomatis dengan pola nama + benda + kota + angka 0-99 di domain @pokemail.net.",
    },
    200,
  );

  if (sessionId) {
    response.headers.append("set-cookie", serializeCookie(SESSION_COOKIE, sessionId));
  }

  return response;
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

function normalizeLocalPart(value) {
  const cleaned = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 40);

  return cleaned || "tempmgen0";
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
