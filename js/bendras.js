/* ==========================================================
   Krepšinis Visur – bendros funkcijos visiems ekranams
   (navigacija, pranešimai, atstumai, laiko formatavimas)
   Reikia įtraukti PO duomenys.js ir saugykla.js.
   ========================================================== */

/* ---------- Apatinė navigacija ----------
   Kiekviename HTML faile turi būti <nav id="navigacija"></nav>,
   o puslapio JS iškviečia: piestiNavigacija("rungtynes") */
function piestiNavigacija(aktyvus) {
  const punktai = [
    { id: "rungtynes", nuoroda: "index.html", ikona: "🏀", tekstas: "Rungtynės" },
    { id: "zemelapis", nuoroda: "zemelapis.html", ikona: "🗺️", tekstas: "Žemėlapis" },
    { id: "profilis", nuoroda: "profilis.html", ikona: "👤", tekstas: "Profilis" },
  ];
  const nav = document.getElementById("navigacija");
  if (!nav) return;
  nav.className = "apatine-navigacija";
  nav.innerHTML = punktai
    .map(
      (p) => `
      <a href="${p.nuoroda}" class="${p.id === aktyvus ? "aktyvus" : ""}">
        <span class="ikona">${p.ikona}</span>
        <span>${p.tekstas}</span>
      </a>`
    )
    .join("");
}

/* ---------- Pranešimas ekrano apačioje ----------
   rodytiPranesima("Prisijungėte!")
   rodytiPranesima("Dalyvavimas atšauktas", { mygtukas: "Grąžinti", veiksmas: () => {...} })
   rodytiPranesima("Klaida...", { klaida: true }) */
let pranesimoLaikmatis = null;

function rodytiPranesima(tekstas, nustatymai = {}) {
  let el = document.getElementById("pranesimas");
  if (!el) {
    el = document.createElement("div");
    el.id = "pranesimas";
    el.className = "pranesimas";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.classList.toggle("klaida", !!nustatymai.klaida);
  el.innerHTML = `<span class="tekstas">${tekstas}</span>`;

  if (nustatymai.mygtukas && nustatymai.veiksmas) {
    const btn = document.createElement("button");
    btn.textContent = nustatymai.mygtukas;
    btn.onclick = () => {
      el.classList.remove("matomas");
      nustatymai.veiksmas();
    };
    el.appendChild(btn);
  }

  el.classList.add("matomas");
  clearTimeout(pranesimoLaikmatis);
  pranesimoLaikmatis = setTimeout(() => el.classList.remove("matomas"), nustatymai.trukme || 4000);
}

/* ---------- Paieška duomenyse ---------- */
function gautiAikstele(id) {
  return AIKSTELES.find((a) => a.id === id);
}

function gautiZaideja(id) {
  return ZAIDEJAI.find((z) => z.id === id);
}

/* Paima parametrą iš adreso, pvz. rungtynes.html?id=r3 → "r3" */
function gautiParametra(vardas) {
  return new URLSearchParams(window.location.search).get(vardas);
}

/* ---------- Atstumas (km) nuo naudotojo vietos iki aikštelės ---------- */
function atstumasKm(aikstele) {
  const vieta = RAJONAI[gautiRajona()];
  const R = 6371;
  const dLat = ((aikstele.lat - vieta.lat) * Math.PI) / 180;
  const dLng = ((aikstele.lng - vieta.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((vieta.lat * Math.PI) / 180) * Math.cos((aikstele.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatuotiAtstuma(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace(".", ",")} km`;
}

/* Laikas pėsčiomis (~5 km/h) */
function laikasPesciomis(km) {
  return `${Math.max(1, Math.round((km / 5) * 60))} min. pėsčiomis`;
}

/* ---------- Rungtynės su visa apskaičiuota informacija ---------- */
function gautiRungtynes(id) {
  const r = RUNGTYNES.find((x) => x.id === id);
  return r ? papildytiRungtynes(r) : null;
}

function visosRungtynes() {
  return RUNGTYNES.map(papildytiRungtynes);
}

function papildytiRungtynes(r) {
  const pradzia = new Date(Date.now() + r.pradziaPoMin * 60000);
  pradzia.setSeconds(0, 0);
  /* Vėlesnės rungtynės – „gražiu“ laiku (pvz. 18:00, 18:15), kaip realybėje */
  if (r.pradziaPoMin >= 60) pradzia.setMinutes(Math.round(pradzia.getMinutes() / 15) * 15);
  const aikstele = gautiAikstele(r.aiksteleId);
  const mano = kiekRegistruota(r.id);
  const uzimta = r.dalyviai.length + mano;
  return Object.assign({}, r, {
    pradzia: pradzia,
    vyksta: r.pradziaPoMin <= 0,
    aikstele: aikstele,
    atstumas: atstumasKm(aikstele),
    manoKiekis: mano,
    uzimta: uzimta,
    laisvu: Math.max(0, r.vietu - uzimta),
  });
}

/* ---------- Laiko formatavimas ---------- */
function formatuotiLaika(data) {
  const hh = String(data.getHours()).padStart(2, "0");
  const mm = String(data.getMinutes()).padStart(2, "0");
  const siandien = new Date();
  const rytoj = new Date();
  rytoj.setDate(siandien.getDate() + 1);
  if (data.toDateString() === siandien.toDateString()) return `Šiandien ${hh}:${mm}`;
  if (data.toDateString() === rytoj.toDateString()) return `Rytoj ${hh}:${mm}`;
  return `${data.getMonth() + 1}-${data.getDate()} ${hh}:${mm}`;
}

/* Rungtynių laikas žmonių kalba: „Vyksta dabar“, „Po 40 min.“, „Šiandien 18:00“ */
function rungtyniuLaikas(r) {
  if (r.vyksta) return "🔴 Vyksta dabar";
  if (r.pradziaPoMin < 60) return `Po ${r.pradziaPoMin} min.`;
  return formatuotiLaika(r.pradzia);
}

/* ---------- Lygiai ---------- */
const LYGIAI = {
  pradedantysis: "Pradedantysis",
  vidutinis: "Vidutinis",
  "aukštas": "Aukštas",
};
