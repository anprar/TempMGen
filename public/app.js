const STORAGE_KEY = "tempmgen.preferences";
const PREVIEW_DOMAINS = [
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

const state = {
  username: "tempmgen",
  search: "",
  domains: [],
  source: "loading",
  selectedDomain: "",
  generatedEmail: "",
  loadingDomains: false,
  generating: false,
};

const elements = {
  usernameInput: document.querySelector("#usernameInput"),
  domainSearchInput: document.querySelector("#domainSearchInput"),
  domainList: document.querySelector("#domainList"),
  domainSourceLabel: document.querySelector("#domainSourceLabel"),
  domainCountLabel: document.querySelector("#domainCountLabel"),
  generateButton: document.querySelector("#generateButton"),
  generatedEmail: document.querySelector("#generatedEmail"),
  copyButton: document.querySelector("#copyButton"),
  statusMessage: document.querySelector("#statusMessage"),
  reloadDomainsButton: document.querySelector("#reloadDomainsButton"),
};

bootstrap();

function bootstrap() {
  hydratePreferences();
  bindEvents();
  render();
  void fetchDomains();
}

function bindEvents() {
  elements.usernameInput.value = state.username;
  elements.domainSearchInput.value = state.search;

  elements.usernameInput.addEventListener("input", (event) => {
    state.username = event.currentTarget.value;
    persistPreferences();
  });

  elements.domainSearchInput.addEventListener("input", (event) => {
    state.search = event.currentTarget.value;
    renderDomains();
    persistPreferences();
  });

  elements.domainList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-domain]");
    if (!button) {
      return;
    }

    state.selectedDomain = button.dataset.domain || "";
    persistPreferences();
    renderDomains();
    setStatus(`Domain aktif: ${state.selectedDomain}`, "neutral");
  });

  elements.reloadDomainsButton.addEventListener("click", () => {
    void fetchDomains();
  });

  elements.generateButton.addEventListener("click", () => {
    void generateEmail();
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

async function fetchDomains() {
  state.loadingDomains = true;
  render();
  setStatus("Mengambil domain dari Worker...", "neutral");

  try {
    const response = await fetch("/api/domains", {
      headers: {
        Accept: "application/json",
      },
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Gagal mengambil domain.");
    }

    state.domains = Array.isArray(payload.domains) ? payload.domains : [];
    state.source = "live";

    if (!state.domains.length) {
      throw new Error("API hidup, tapi belum mengembalikan domain.");
    }

    if (!state.domains.includes(state.selectedDomain)) {
      state.selectedDomain = state.domains[0];
    }

    setStatus("Domain Guerrilla Mail berhasil dimuat.", "success");
  } catch (error) {
    state.domains = [...PREVIEW_DOMAINS];
    state.source = "preview";

    if (!state.selectedDomain || !state.domains.includes(state.selectedDomain)) {
      state.selectedDomain = state.domains[0] || "";
    }

    setStatus(
      `${error.message} Menampilkan domain referensi Guerrilla Mail agar UI tetap bisa dicoba.`,
      "error",
    );
  } finally {
    state.loadingDomains = false;
    persistPreferences();
    render();
  }
}

async function generateEmail() {
  if (!state.selectedDomain || state.generating) {
    return;
  }

  state.generating = true;
  render();
  setStatus("Membuat email baru...", "neutral");

  try {
    const response = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: state.username,
        domain: state.selectedDomain,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Generate email gagal.");
    }

    state.generatedEmail = payload.email || "";
    elements.generatedEmail.textContent = state.generatedEmail || "Belum ada email";
    elements.copyButton.disabled = !state.generatedEmail;
    setStatus(
      payload.note || "Email berhasil dibuat. Semua domain Guerrilla tetap menuju inbox session yang sama.",
      "success",
    );
  } catch (error) {
    state.generatedEmail = "";
    elements.generatedEmail.textContent = "Gagal membuat email";
    elements.copyButton.disabled = true;
    setStatus(error.message, "error");
  } finally {
    state.generating = false;
    render();
  }
}

function render() {
  elements.generateButton.disabled = state.generating || !state.selectedDomain;
  elements.generateButton.textContent = state.generating
    ? "Generating..."
    : "Generate email";

  elements.reloadDomainsButton.disabled = state.loadingDomains;
  elements.reloadDomainsButton.textContent = state.loadingDomains
    ? "Memuat..."
    : "Reload domain";

  elements.usernameInput.value = state.username;
  elements.domainSearchInput.value = state.search;

  renderDomains();
  renderDomainMeta();
}

function renderDomains() {
  const filteredDomains = getFilteredDomains();

  elements.domainCountLabel.textContent = `${filteredDomains.length} domain`;

  if (!filteredDomains.length) {
    elements.domainList.innerHTML =
      '<p class="empty-state">Tidak ada domain yang cocok dengan filter saat ini.</p>';
    return;
  }

  elements.domainList.innerHTML = filteredDomains
    .map((domain) => {
      const activeClass = domain === state.selectedDomain ? " active" : "";
      return `
        <button class="domain-pill${activeClass}" type="button" data-domain="${escapeHtml(domain)}">
          <span>@${escapeHtml(domain)}</span>
        </button>
      `;
    })
    .join("");
}

function renderDomainMeta() {
  if (state.source === "live") {
    elements.domainSourceLabel.textContent = "Daftar domain Guerrilla";
    return;
  }

  if (state.source === "preview") {
    elements.domainSourceLabel.textContent = "Fallback Guerrilla";
    return;
  }

  elements.domainSourceLabel.textContent = "Memuat...";
}

function getFilteredDomains() {
  const keyword = state.search.trim().toLowerCase();

  if (!keyword) {
    return [...state.domains];
  }

  return state.domains.filter((domain) => domain.toLowerCase().includes(keyword));
}

function hydratePreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    const saved = JSON.parse(raw);
    state.username = typeof saved.username === "string" ? saved.username : state.username;
    state.search = typeof saved.search === "string" ? saved.search : state.search;
    state.selectedDomain =
      typeof saved.selectedDomain === "string" ? saved.selectedDomain : state.selectedDomain;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function persistPreferences() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      username: state.username,
      search: state.search,
      selectedDomain: state.selectedDomain,
    }),
  );
}

function setStatus(message, tone) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status-message ${tone}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
