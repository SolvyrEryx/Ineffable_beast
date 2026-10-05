/* ==========================================================================
   ineffablebeast.in

   Projects live here. To add one, append an object to `projects`.
   Nothing else in the codebase needs to change.
   ========================================================================== */

const projects = [
  {
    name: "SayIt",
    description: "Private, local voice transcription and dictation.",
    state: "Live",
    url: "https://sayit.ineffablebeast.in",
  },
  // {
  //   name: "Project name",
  //   description: "One short line.",
  //   state: "In progress",
  //   url: "https://ineffablebeast.in/slug",
  // },
];

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/* ---------------- entrance ---------------- */
function playEntrance() {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => document.body.classList.add("ready"))
  );
}

/* ---------------- projects ---------------- */
function renderProjects() {
  const list = document.getElementById("sheet-list");
  if (!list) return;

  list.innerHTML = projects
    .map((project, index) => {
      const number = String(index + 1).padStart(2, "0");
      return `
        <article class="entry">
          <p class="entry__no">${number}</p>
          <div>
            <h3 class="entry__name">${escapeHtml(project.name)}</h3>
            <p class="entry__desc">${escapeHtml(project.description)}</p>
            <p class="entry__state">${escapeHtml(project.state)}</p>
          </div>
          <a class="entry__open" href="${project.url}"
             aria-label="Open ${escapeHtml(project.name)}">
            Open project <span aria-hidden="true">&#8599;</span>
          </a>
        </article>`;
    })
    .join("");
}

/* ---------------- sheet ---------------- */
function initSheet() {
  const sheet = document.getElementById("sheet");
  const openButton = document.getElementById("projects-open");
  const closeButton = document.getElementById("projects-close");
  if (!sheet || !openButton || !closeButton) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastFocused = null;

  function open() {
    lastFocused = document.activeElement;
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    closeButton.focus({ preventScroll: true });
    document.addEventListener("keydown", onKeydown);
  }

  function close() {
    sheet.classList.remove("is-open");
    document.removeEventListener("keydown", onKeydown);
    const finish = () => {
      sheet.hidden = true;
      if (lastFocused) lastFocused.focus({ preventScroll: true });
    };
    reduced ? finish() : setTimeout(finish, 400);
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = sheet.querySelectorAll("a[href], button:not([disabled])");
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  openButton.addEventListener("click", open);
  closeButton.addEventListener("click", close);
}

/* ---------------- init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  initSheet();
  playEntrance();
});
