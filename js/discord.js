// Unico punto in cui si cambia l'invito Discord: ogni link con l'attributo data-discord lo usa.
// shortcut: i link non hanno href finché il JS non gira; vale solo per chi disattiva JS, da rivedere se serve.
const DISCORD_URL = "https://discord.gg/exF5aSwakn";
document.querySelectorAll("[data-discord]").forEach((a) => (a.href = DISCORD_URL));
