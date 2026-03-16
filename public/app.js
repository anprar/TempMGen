const state = {
  fixedDomain: "pokemail.net",
  generatedEmail: "",
  actualEmail: "",
  parts: null,
  generator: null,
  loadingConfig: false,
  generating: false,
};

const elements = {
  domainValue: document.querySelector("#domainValue"),
  schemeValue: document.querySelector("#schemeValue"),
  poolValue: document.querySelector("#poolValue"),
  generateButton: document.querySelector("#generateButton"),
  generatedEmail: document.querySelector("#generatedEmail"),
  actualEmail: document.querySelector("#actualEmail"),
  generatedRecipe: document.querySelector("#generatedRecipe"),
  copyButton: document.querySelector("#copyButton"),
  statusMessage: document.querySelector("#statusMessage"),
  reloadButton: document.querySelector("#reloadButton"),
};

bootstrap();

function bootstrap() {
  bindEvents();
  render();
  void fetchConfig();
}

function bindEvents() {
  elements.generateButton.addEventListener("click", () => {
    void generateEmail();
  });

  elements.reloadButton.addEventListener("click", () => {
    void fetchConfig();
  });

  elements.copyButton.addEventListener("click", async () => {
    if (!state.generatedEmail) {
      return;
    }

    try {
      await navigator.clipboard.writeText(state.generatedEmail);
      setStatus("Email berhasil disalin.", "success");
    } catch {
      setStatus("Clipboard gagal diakses di browser ini.", "error");
    }
  });
}

async function fetchConfig() {
  state.loadingConfig = true;
  render();
  setStatus("Mengambil konfigurasi generator dari Worker...", "neutral");

  try {
    const response = await fetch("/api/domains", {
      headers: {
        Accept: "application/json",
      },
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Gagal mengambil konfigurasi.");
    }

    state.fixedDomain = payload.fixedDomain || state.fixedDomain;
    state.generator = payload.generator || null;
    setStatus(payload.note || "Konfigurasi generator berhasil dimuat.", "success");
  } catch (error) {
    setStatus(error.message || "Gagal mengambil konfigurasi generator.", "error");
  } finally {
    state.loadingConfig = false;
    render();
  }
}

async function generateEmail() {
  if (state.generating) {
    return;
  }

  state.generating = true;
  render();
  setStatus("Membuat email otomatis di Worker...", "neutral");

  try {
    const response = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({}),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Generate email gagal.");
    }

    state.fixedDomain = payload.domain || state.fixedDomain;
    state.generatedEmail = payload.email || "";
    state.actualEmail = payload.actualEmail || "";
    state.parts = payload.parts || null;
    state.generator = payload.generator || state.generator;
    setStatus(payload.note || "Email berhasil dibuat.", "success");
  } catch (error) {
    state.generatedEmail = "";
    state.actualEmail = "";
    state.parts = null;
    setStatus(error.message || "Generate email gagal.", "error");
  } finally {
    state.generating = false;
    render();
  }
}

function render() {
  elements.domainValue.textContent = `@${state.fixedDomain}`;
  elements.schemeValue.textContent = state.generator?.pattern || "nama + benda + kota + angka 0-99";
  elements.poolValue.textContent = formatPool(state.generator);

  elements.generateButton.disabled = state.generating;
  elements.generateButton.textContent = state.generating ? "Generating..." : "Generate email";

  elements.reloadButton.disabled = state.loadingConfig;
  elements.reloadButton.textContent = state.loadingConfig ? "Memuat..." : "Reload config";

  elements.generatedEmail.textContent = state.generatedEmail || "Belum ada email";
  elements.actualEmail.textContent = state.actualEmail
    ? `Inbox Guerrilla asli: ${state.actualEmail}`
    : "Inbox Guerrilla asli akan muncul setelah generate.";
  elements.generatedRecipe.textContent = state.parts
    ? `${state.parts.person} + ${state.parts.object} + ${state.parts.city} + ${state.parts.number}`
    : "Bagian nama akan tampil di sini setelah generate.";
  elements.copyButton.disabled = !state.generatedEmail;
}

function formatPool(generator) {
  if (!generator) {
    return "50 nama, 50 benda, 50 kota";
  }

  return `${generator.peopleCount} nama, ${generator.objectCount} benda, ${generator.cityCount} kota`;
}

function setStatus(message, tone) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status-message ${tone}`;
}
