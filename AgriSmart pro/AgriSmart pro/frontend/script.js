/* ---------- Configuration ---------- */
const API_BASE = "/api";

/* ---------- Helpers ---------- */
function getToken() {
  return localStorage.getItem("token");
}
function showToast(msg, t = 2000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), t);
}
function escapeHtml(s){
  if (s === null || s === undefined) return "";
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
}

/* ---------- Redirect rules ---------- */
let token = getToken();
if (window.location.pathname.includes("index.html") && token) {
  window.location.href = "dashboard.html";
}
if (window.location.pathname.includes("dashboard.html") && !token) {
  alert("Please login.");
  window.location.href = "index.html";
}

/* ---------- DOMContentLoaded: login/signup + dashboard ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  /* ---------------- AUTH PAGE (index.html) ---------------- */
  if (path.endsWith("index.html") || path.endsWith("/")) {
    const form = document.getElementById("authForm");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const submitBtn = document.getElementById("submitBtn");
    const toggleBtn = document.getElementById("toggleBtn");
    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");

    let mode = "login"; // or 'signup'

    toggleBtn.addEventListener("click", () => {
      if (mode === "login") {
        mode = "signup";
        submitBtn.textContent = "Signup";
        toggleBtn.textContent = "Have an account? Login";
        email.style.display = "block";
        confirmPassword.style.display = "block";
        formTitle.textContent = "Create account";
        formSubtitle.textContent = "Sign up to access AgriSmart";
      } else {
        mode = "login";
        submitBtn.textContent = "Login";
        toggleBtn.textContent = "Create account";
        email.style.display = "none";
        confirmPassword.style.display = "none";
        formTitle.textContent = "Welcome Back";
        formSubtitle.textContent = "Log in to your AgriSmart account";
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (mode === "login") {
        const body = { username: username.value.trim(), password: password.value.trim() };
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          const data = await res.json();
          if (!res.ok) {
            alert(data.message || "Login failed");
            return;
          }
          localStorage.setItem("token", data.token);
          window.location.href = "dashboard.html";
        } catch (err) {
          console.error("LOGIN ERR", err);
          alert("Login error (see console)");
        }
      } else {
        // signup
        if (password.value !== confirmPassword.value) return alert("Passwords do not match");
        const body = { username: username.value.trim(), email: email.value.trim(), password: password.value.trim() };
        try {
          const res = await fetch(`${API_BASE}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          const data = await res.json();
          if (!res.ok) {
            alert(data.message || "Signup failed");
            return;
          }
          alert("Signup successful — please login");
          // switch back to login
          toggleBtn.click();
        } catch (err) {
          console.error("SIGNUP ERR", err);
          alert("Signup error (see console)");
        }
      }
    });

    return;
  }

  /* ---------------- DASHBOARD PAGE (dashboard.html) ---------------- */
  if (path.endsWith("dashboard.html")) {
    // UI elements
    const userBadge = document.getElementById("userBadge");
    const logoutBtn = document.getElementById("logoutBtn");
    const sections = document.querySelectorAll(".sidebar nav li");
    const cardsArea = document.getElementById("cardsArea");
    const searchInput = document.getElementById("searchInput");
    const suggestionsEl = document.getElementById("suggestions");
    const searchBtn = document.getElementById("searchBtn");
    const sectionTitle = document.getElementById("sectionTitle");
    const sectionSubtitle = document.getElementById("sectionSubtitle");
    const nameInput = document.getElementById("nameInput");
    const detailsInput = document.getElementById("detailsInput");
    const addBtn = document.getElementById("addBtn");
    const editingId = document.getElementById("editingId");
    const newBtn = document.getElementById("newBtn");
    const totalCount = document.getElementById("totalCount");
    const activeCount = document.getElementById("activeCount");

    let currentSection = "farms";
    let cacheRows = [];

    // fill username badge from token if available
    try {
      const raw = getToken();
      if (raw) {
        const p = JSON.parse(atob(raw.split(".")[1]));
        userBadge.textContent = p.username || "—";
      }
    } catch (e) { userBadge.textContent = "—"; }

    logoutBtn && logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });

    // fetch rows (all)
    async function fetchRows(section) {
      try {
        const res = await fetch(`${API_BASE}/${section}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const json = await res.json();
        if (!res.ok) {
          console.error("FETCH ERROR", json);
          showToast(json.message || "Failed to load");
          return [];
        }
        cacheRows = json;
        updateStats(json);
        return json;
      } catch (err) {
        console.error("FETCH ERR", err);
        showToast("Error loading data");
        return [];
      }
    }

    function updateStats(rows) {
      totalCount.textContent = rows.length;
      activeCount.textContent = Math.min(rows.length, 3);
    }

    // choose an image based on section
    function chooseImage(section) {
      const images = {
        farms: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1000&auto=format&fit=crop",
        fields: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1000&auto=format&fit=crop",
        crops: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1000&auto=format&fit=crop",
        sensors: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1000&auto=format&fit=crop",
        harvests: "https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=1000&auto=format&fit=crop"
      };
      return images[section] || images.farms;
    }

    // render cards
    function renderCards(rows) {
      cardsArea.innerHTML = "";
      if (!rows.length) {
        cardsArea.innerHTML = `<div class="empty" style="padding:26px;color:var(--muted)">No records found. Add new items above.</div>`;
        return;
      }
      rows.forEach(r => {
        const div = document.createElement("div");
        div.className = "card";
        const img = chooseImage(currentSection);
        div.innerHTML = `
          <img class="media" src="${img}" alt="media" />
          <div class="content">
            <h3>${escapeHtml(r.name)}</h3>
            <p>${escapeHtml(r.details||'—')}</p>
          </div>
          <div class="actions">
            <button class="btn small" data-id="${r.id}" data-action="edit">Edit</button>
            <button class="btn small danger" data-id="${r.id}" data-action="delete">Delete</button>
          </div>
        `;
        cardsArea.appendChild(div);
      });

      // attach handlers (delegation would be okay, but keep per-button for clarity)
      cardsArea.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = btn.dataset.id;
          const action = btn.dataset.action;
          if (action === "edit") {
            const row = cacheRows.find(x => String(x.id) === String(id));
            if (!row) return showToast("Record not available");
            nameInput.value = row.name;
            detailsInput.value = row.details || "";
            editingId.value = row.id;
            searchInput.value = row.name;
            showToast("Loaded for edit");
          } else if (action === "delete") {
            if (!confirm("Delete this record?")) return;
            try {
              const res = await fetch(`${API_BASE}/${currentSection}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
              });
              const j = await res.json();
              if (!res.ok) {
                console.error("DELETE ERR", j);
                return showToast(j.message || "Delete failed");
              }
              showToast("Deleted");
              await loadSection(currentSection);
            } catch (err) { console.error("DELETE ERR", err); showToast("Delete failed"); }
          }
        });
      });
    }

    // load section (click on left menu)
    async function loadSection(section) {
      currentSection = section;
      document.querySelectorAll(".sidebar nav li").forEach(li => li.classList.toggle("active", li.dataset.table === section));
      sectionTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1);
      const rows = await fetchRows(section);
      renderCards(rows);
    }

    // suggestions behavior
    function showSuggestions(q) {
      if (!suggestionsEl) return;
      const list = cacheRows.filter(r => r.name && r.name.toLowerCase().includes(q)).slice(0, 10);
      suggestionsEl.innerHTML = "";
      if (!list.length) return;
      list.forEach(r => {
        const d = document.createElement("div");
        d.className = "suggestion";
        d.textContent = r.name;
        d.dataset.id = r.id;
        d.addEventListener("mousedown", () => {
          // mousedown so it executes before blur
          searchInput.value = r.name;
          nameInput.value = r.name;
          detailsInput.value = r.details || "";
          editingId.value = r.id;
          suggestionsEl.innerHTML = "";
          showToast("Suggestion chosen");
        });
        suggestionsEl.appendChild(d);
      });
    }

    (searchInput && searchInput.addEventListener("input", e => showSuggestions(e.target.value.trim().toLowerCase())));
    (searchInput && searchInput.addEventListener("focus", async () => { if (!cacheRows.length) await fetchRows(currentSection); showSuggestions(''); }));
    (searchInput && searchInput.addEventListener("blur", () => setTimeout(()=> suggestionsEl && (suggestionsEl.innerHTML = ''), 170)));

    searchBtn && searchBtn.addEventListener("click", async () => {
      try {
        const q = searchInput.value.trim();
        const res = await fetch(`${API_BASE}/${currentSection}/search?q=${encodeURIComponent(q)}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const j = await res.json();
        if (!res.ok) {
          console.error("SEARCH ERR", j);
          return showToast(j.message || "Search failed");
        }
        renderCards(j);
        showToast(`${j.length} result(s)`);
      } catch (err) { console.error("SEARCH ERR", err); showToast("Search failed"); }
    });

    // add / update
    addBtn && addBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const details = detailsInput.value.trim();
      if (!name) return showToast("Name required");
      const id = editingId.value;
      try {
        if (id) {
          // update
          const res = await fetch(`${API_BASE}/${currentSection}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ name, details })
          });
          const j = await res.json();
          if (!res.ok) {
            console.error("UPDATE ERR", j);
            return showToast(j.message || "Update failed");
          }
          showToast("Updated");
          editingId.value = "";
        } else {
          // create
          const res = await fetch(`${API_BASE}/${currentSection}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ name, details })
          });
          const j = await res.json();
          if (!res.ok) {
            console.error("CREATE ERR", j);
            return showToast(j.message || "Create failed");
          }
          showToast("Added");
        }
        nameInput.value = ""; detailsInput.value = ""; searchInput.value = "";
        await loadSection(currentSection);
      } catch (err) { console.error("SAVE ERR", err); showToast("Save failed"); }
    });

    newBtn && newBtn.addEventListener("click", () => {
      editingId.value = ""; nameInput.value=""; detailsInput.value=""; searchInput.value="";
      showToast("Ready for a new item");
    });

    // left menu clicks
    document.querySelectorAll(".sidebar nav li").forEach(li => li.addEventListener("click", () => loadSection(li.dataset.table)));

    // initial load
    loadSection(currentSection);
  }
});
