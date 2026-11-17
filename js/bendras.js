const IKONOS = {
  namai: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  vieta: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  kamuolys: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18"/><path d="M5.6 5.6c2.8 2.8 2.8 10 0 12.8M18.4 5.6c-2.8 2.8-2.8 10 0 12.8"/>',
  zmones: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2c2.9.3 5 2.6 5 5.8"/>',
  varpelis: '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  laikas: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sluoksniai: '<path d="M12 3 2 8l10 5 10-5z"/><path d="m2 13 10 5 10-5"/>',
  asmuo: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  lempute: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  kompasas: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  zemelapis: '<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  nustatymai: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  klaustukas: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7v.5"/><path d="M12 17h.01"/>',
  iseiti: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  piestukas: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  filtras: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  krepsys: '<rect x="3.5" y="2.5" width="17" height="10" rx="1.5"/><rect x="9" y="6" width="6" height="4.5"/><path d="M7.5 13.5h9"/><path d="M8.5 13.5 10 21M15.5 13.5 14 21M12 13.5V21M9.2 17.2h5.6"/>',
};

function svg(ikona, papildoma = "") {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${papildoma}>${IKONOS[ikona]}</svg>`;
}

function ik(ikona) {
  return `<span class="mini-ikona">${svg(ikona)}</span>`;
}

function piestiNavigacija(aktyvus) {
  const punktai = [
    { id: "rungtynes", nuoroda: "index.html", ikona: "namai", tekstas: "Pradžia" },
    { id: "zemelapis", nuoroda: "zemelapis.html", ikona: "vieta", tekstas: "Aikštelės" },
    { id: "mano", nuoroda: "mano-rungtynes.html", ikona: "kamuolys", tekstas: "Mano rungtynės" },
    { id: "zaidejai", nuoroda: "zaidejai.html", ikona: "zmones", tekstas: "Žaidėjai" },
  ];
  const nav = document.getElementById("navigacija");
  if (!nav) return;
  nav.className = "apatine-navigacija";
  nav.setAttribute("aria-label", "Pagrindinė navigacija");
  nav.innerHTML = punktai
    .map(
      (p) => `
      <a href="${p.nuoroda}" class="${p.id === aktyvus ? "aktyvus" : ""}" aria-label="${p.tekstas}" title="${p.tekstas}"
        ${p.id === aktyvus ? 'aria-current="page"' : ""}>${svg(p.ikona)}</a>`
    )
    .join("");
}

function piestiVirsu(pavadinimas, veiksmas = null) {
  const el = document.getElementById("virsus");
  if (!el) return;
  const kiek = gautiPriminimus().length;
  el.className = "virsus-pagrindinis";
  el.innerHTML = `
    ${avatarasHtml("avataras-mygtukas", 'onclick="atidarytiMeniu()" aria-label="Atidaryti meniu"')}
    <h1 class="virsaus-pavadinimas ${pavadinimas.length > 10 ? "ilgas" : ""}">${pavadinimas}</h1>
    <div class="virsaus-veiksmai">
      ${veiksmas ? `<a class="virsaus-nuoroda" href="${veiksmas.nuoroda}">${veiksmas.tekstas}</a>` : ""}
      <button class="varpelis" onclick="perjungtiPranesimuLanga()" aria-label="Priminimai ir pranešimai (${kiek})">
        ${svg("varpelis")}
        ${kiek ? `<span class="zenklelis">${kiek}</span>` : ""}
      </button>
    </div>`;
}

function avatarasHtml(klase, atributai = "") {
  const n = gautiNaudotoja();
  const turinys = n
    ? n.vardas.charAt(0).toUpperCase()
    : '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="M2 24c0-5.5 4.5-10 10-10s10 4.5 10 10z"/></svg>';
  return `<button class="${klase} ${n ? "prisijunges" : ""}" ${atributai}>${turinys}</button>`;
}

function atidarytiMeniu() {
  const n = gautiNaudotoja();
  const rajonas = RAJONAI[gautiRajona()];
  const mano = Object.keys(gautiDalyvavimus()).length;

  const fonas = document.createElement("div");
  fonas.className = "meniu-fonas";
  fonas.onclick = uzdarytiMeniu;

  const meniu = document.createElement("nav");
  meniu.className = "meniu";
  meniu.setAttribute("aria-label", "Meniu");
  meniu.innerHTML = `
    <div class="logotipas-tekstas">Krepšinis visur</div>
    <div class="meniu-profilis">
      ${avatarasHtml("avataras-mygtukas", "tabindex='-1'")}
      <div>
        <div class="vardas">${n ? n.vardas : "Svečias"}</div>
        <div class="blankus">${n ? `Prisijungta per ${n.budas}` : "Naršote neprisijungę"}</div>
      </div>
    </div>
    ${
      n
        ? `<div class="meniu-statistika">
            <div><strong>${LYGIAI[n.lygis]}</strong><span>Lygis</span></div>
            <div><strong>${n.pozicija || "–"}</strong><span>Pozicija</span></div>
            <div><strong>${mano}</strong><span>Rungtynės</span></div>
          </div>`
        : `<a class="mygtukas platus" style="margin-bottom: 18px" href="prisijungimas.html?atgal=${encodeURIComponent(location.pathname.split("/").pop() + location.search)}">Prisijungti</a>`
    }
    ${n ? `<a class="meniu-punktas" href="profilis.html"><span class="ikona">${svg("piestukas")}</span>Redaguoti profilį</a>` : ""}
    <a class="meniu-punktas" href="profilis.html#vieta"><span class="ikona">${svg("vieta")}</span>Mano vieta · ${MIESTAI[rajonas.miestas].pavadinimas}</a>
    ${n ? `<a class="meniu-punktas" href="profilis.html#nustatymai"><span class="ikona">${svg("nustatymai")}</span>Nustatymai</a>` : ""}
    <a class="meniu-punktas" href="pagalba.html"><span class="ikona">${svg("klaustukas")}</span>Pagalba</a>
    ${n ? `<button class="meniu-punktas" onclick="atsijungtiIsMeniu()"><span class="ikona">${svg("iseiti")}</span>Atsijungti</button>` : ""}
    <div class="meniu-apacia">Krepšinis Visur · prototipas v1.0</div>`;

  document.body.append(fonas, meniu);
  document.addEventListener("keydown", meniuKlaviatura);
  requestAnimationFrame(() => {
    fonas.classList.add("atidarytas");
    meniu.classList.add("atidarytas");
  });
}

function uzdarytiMeniu() {
  const fonas = document.querySelector(".meniu-fonas");
  const meniu = document.querySelector(".meniu");
  if (!meniu) return;
  fonas.classList.remove("atidarytas");
  meniu.classList.remove("atidarytas");
  document.removeEventListener("keydown", meniuKlaviatura);
  setTimeout(() => {
    fonas.remove();
    meniu.remove();
  }, 280);
}

function meniuKlaviatura(e) {
  if (e.key === "Escape") uzdarytiMeniu();
}

function atsijungtiIsMeniu() {
  atsijungti();
  window.location.href = "pradzia.html";
}

function gautiPriminimus() {
  if (!gautiNaudotoja()) return [];
  const visos = visosRungtynes();
  const sarasas = [];

  for (const r of visos.filter((r) => r.manoKiekis > 0 && r.pradziaPoMin <= 60 && r.pradziaPoMin > -r.trukmeMin)) {
    const kada = r.vyksta ? "jau vyksta" : `prasideda po ${r.pradziaPoMin} min.`;
    sarasas.push({ raktas: "p-" + r.id, ikona: svg("laikas"), tekstas: `<strong>Priminimas:</strong> rungtynės ${r.aikstele.pavadinimas} ${kada}`, nuoroda: `rungtynes.html?id=${r.id}` });
  }

  if (gautiPranesimuNustatyma()) {
    const ieskoma = visos
      .filter((r) => r.manoKiekis === 0 && r.laisvu > 0 && r.atstumas <= 1.5 && r.pradziaPoMin <= 120)
      .sort((a, b) => a.atstumas - b.atstumas)[0];
    if (ieskoma) {
      sarasas.push({
        raktas: "i-" + ieskoma.id,
        ikona: svg("zmones"),
        tekstas: `Netoliese ieškoma žaidėjų: <strong>${ieskoma.aikstele.pavadinimas}</strong> (${formatuotiAtstuma(ieskoma.atstumas)}) – trūksta ${ieskoma.laisvu}`,
        nuoroda: `rungtynes.html?id=${ieskoma.id}`,
      });
    }
  }
  return sarasas;
}

function perjungtiPranesimuLanga() {
  const esamas = document.querySelector(".pranesimu-langas");
  if (esamas) {
    esamas.remove();
    return;
  }
  const sarasas = gautiPriminimus();
  const langas = document.createElement("div");
  langas.className = "pranesimu-langas";
  langas.setAttribute("role", "dialog");
  langas.innerHTML = `
    <div class="antraste">Priminimai ir pranešimai</div>
    ${
      sarasas.length
        ? sarasas.map((p) => `<a href="${p.nuoroda}"><span>${p.ikona}</span><span>${p.tekstas}</span></a>`).join("")
        : `<p class="blankus" style="padding: 6px 10px 12px">${gautiNaudotoja() ? "Naujų pranešimų nėra." : "Prisijunkite, kad gautumėte priminimus."}</p>`
    }`;
  document.body.appendChild(langas);

  setTimeout(() => document.addEventListener("click", uzdarytiPranesimuLanga), 0);
}

function uzdarytiPranesimuLanga(e) {
  const langas = document.querySelector(".pranesimu-langas");
  if (langas && !langas.contains(e.target)) {
    langas.remove();
    document.removeEventListener("click", uzdarytiPranesimuLanga);
  }
}

function miniatiuraHtml(aikstele, klase = "miniatiura") {
  if (aikstele.foto) {
    return `<div class="${klase}" style="background-image: url('${aikstele.foto}')" role="img" aria-label="${aikstele.pavadinimas}"></div>`;
  }
  return `<div class="${klase} be-nuotraukos" aria-hidden="true">${svg("krepsys")}</div>`;
}

function rungtyniuKorteleHtml(r, mygtukas = "") {
  const org = r.organizatorius === "jus" ? `${r.organizatoriusVardas} (jūs)` : gautiZaideja(r.organizatorius).vardas;
  const laikas = r.vyksta ? "Vyksta dabar" : r.pradziaPoMin < 60 ? `Po ${r.pradziaPoMin} min.` : formatuotiLaika(r.pradzia).replace(" ", " · ");
  return `
    <a class="kortele rungtyniu-kortele" href="rungtynes.html?id=${r.id}">
      <div class="kortele-virsus">
        ${miniatiuraHtml(r.aikstele)}
        <div>
          <div class="laikas ${r.vyksta ? "vyksta" : ""}">${r.vyksta ? "● " : ""}${laikas}</div>
          <div class="pavadinimas">${r.aikstele.pavadinimas}</div>
          <div class="vieta-eilute">${ik("vieta")}${formatuotiAtstuma(r.atstumas)} · Organizuoja ${org}</div>
          <div class="zymos"><span class="zyma oranzine">${LYGIAI[r.lygis]}</span>${r.zymos.map((z) => `<span class="zyma">${z}</span>`).join("")}</div>
        </div>
      </div>
      <div class="kortele-apacia">
        <span class="zaideju-skaicius"><strong>${r.uzimta}/${r.vietu}</strong> žaidėjų ·
          ${r.laisvu > 0 ? `<span class="truksta">trūksta ${r.laisvu}</span>` : "pilna"}</span>
        ${mygtukas}
      </div>
    </a>`;
}

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

function gautiAikstele(id) {
  return AIKSTELES.find((a) => a.id === id);
}

function gautiZaideja(id) {
  return ZAIDEJAI.find((z) => z.id === id);
}

function zaidejuAiksteleje(aikstele) {
  return aikstele.dabar + (gautiBuvimaAiksteleje() === aikstele.id ? 1 : 0);
}

function daugiskaita(n, vienas, keli, daug) {
  const v = n % 10;
  const d = n % 100;
  if (v === 1 && d !== 11) return `${n} ${vienas}`;
  if (v >= 2 && (d < 10 || d > 20)) return `${n} ${keli}`;
  return `${n} ${daug}`;
}

function zaidejuTekstas(n) {
  return daugiskaita(n, "žaidėjas", "žaidėjai", "žaidėjų");
}

function uzimtumoTekstas(aikstele) {
  const n = zaidejuAiksteleje(aikstele);
  if (n === 0) return "Šiuo metu laisva";
  return `Dabar aikštelėje: ${zaidejuTekstas(n)}`;
}

function gautiParametra(vardas) {
  return new URLSearchParams(window.location.search).get(vardas);
}

function rajonoPavadinimas(id) {
  const r = RAJONAI[id];
  return r.pavadinimas === "Centras" ? `${MIESTAI[r.miestas].pavadinimas} (centras)` : r.pavadinimas;
}

function dabartinisMiestas() {
  return RAJONAI[gautiRajona()].miestas;
}

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

function laikasPesciomis(km) {
  return `${Math.max(1, Math.round((km / 5) * 60))} min. pėsčiomis`;
}

function visuRungtyniuSarasas() {
  return RUNGTYNES.concat(gautiSukurtasRungtynes());
}

function gautiRungtynes(id) {
  const r = visuRungtyniuSarasas().find((x) => x.id === id);
  return r ? papildytiRungtynes(r) : null;
}

function visosRungtynes() {
  return visuRungtyniuSarasas().map(papildytiRungtynes).filter((r) => !r.pasibaigusi);
}

function visosRungtynesSuPasibaigusiomis() {
  return visuRungtyniuSarasas().map(papildytiRungtynes);
}

function papildytiRungtynes(r) {
  let pradzia;
  if (r.pradziaMs) {
    pradzia = new Date(r.pradziaMs);
    r = Object.assign({}, r, { pradziaPoMin: Math.round((r.pradziaMs - Date.now()) / 60000) });
  } else {
    pradzia = new Date(Date.now() + r.pradziaPoMin * 60000);
    pradzia.setSeconds(0, 0);

    if (r.pradziaPoMin >= 60) pradzia.setMinutes(Math.round(pradzia.getMinutes() / 15) * 15);
  }
  const aikstele = gautiAikstele(r.aiksteleId);
  const mano = kiekRegistruota(r.id);
  const uzimta = r.dalyviai.length + mano;
  return Object.assign({}, r, {
    pradzia: pradzia,
    vyksta: r.pradziaPoMin <= 0 && r.pradziaPoMin + r.trukmeMin > 0,
    pasibaigusi: r.pradziaPoMin + r.trukmeMin <= 0,
    aikstele: aikstele,
    atstumas: atstumasKm(aikstele),
    manoKiekis: mano,
    uzimta: uzimta,
    laisvu: Math.max(0, r.vietu - uzimta),
  });
}

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

function rungtyniuLaikas(r) {
  if (r.vyksta) return "● Vyksta dabar";
  if (r.pradziaPoMin < 60) return `Po ${r.pradziaPoMin} min.`;
  return formatuotiLaika(r.pradzia);
}

const LYGIAI = {
  pradedantysis: "Pradedantysis",
  vidutinis: "Vidutinis",
  "aukštas": "Aukštas",
};
