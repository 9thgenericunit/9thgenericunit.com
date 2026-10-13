const menu = document.querySelector(".menu"),
  links = document.querySelector(".links");
menu.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".links a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }),
);

// Contatore "membri operativi" dalle statistiche pubbliche della dashboard.
// shortcut: la dashboard deve inviare l'header CORS per questo dominio, altrimenti il blocco viene nascosto.
const STATS_URL =
  location.hostname === "localhost"
    ? "http://localhost:3000/api/publicstats"
    : "https://dashboard.9thgenericunit.com/api/publicstats";
const stat = document.querySelector(".members-stat");

// La risposta attesa è [{ "user_count": 28 }]: ogni altra forma viene scartata.
function parseUserCount(data) {
  const n = Array.isArray(data) ? Number(data[0]?.user_count) : NaN;
  return Number.isInteger(n) && n >= 0 ? n : null;
}

function countUp(el, target) {
  const start = performance.now(),
    duration = 1600;
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))).toLocaleString("it-IT");
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function showStat(count) {
  const num = stat.querySelector(".members-stat-num");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    num.textContent = count.toLocaleString("it-IT");
    stat.classList.add("ready");
    return;
  }
  // L'animazione parte quando il blocco entra nella vista, non a pagina caricata.
  new IntersectionObserver(
    ([entry], observer) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      stat.classList.add("ready");
      countUp(num, count);
    },
    { threshold: 0.6 },
  ).observe(stat);
}

async function loadStat() {
  try {
    const res = await fetch(STATS_URL, { signal: AbortSignal.timeout(5000) });
    const count = res.ok ? parseUserCount(await res.json()) : null;
    if (count === null) throw new Error("risposta non valida");
    showStat(count);
  } catch {
    stat.hidden = true;
  }
}

if (stat) loadStat();
