/* ==========================================================
   Pagrindinis ekranas – netoliese vykstančių rungtynių sąrašas
   ========================================================== */

/* Puslapio paleidimas – failo pabaigoje (kai visi kintamieji jau aprašyti) */

/* Rodo, pagal kokią vietą skaičiuojami atstumai */
function piestiVieta() {
  const rajonas = RAJONAI[gautiRajona()];
  document.getElementById("vieta").innerHTML =
    `📍 Jūsų vieta: <a href="profilis.html">${rajonas.pavadinimas}</a>`;
}

/* Sugrupuoja rungtynes ir nupiešia sąrašą */
function piestiRungtynes() {
  const visos = visosRungtynes().filter(atitinkaFiltrus);

  const grupes = [
    { pavadinimas: "Vyksta dabar", rungtynes: visos.filter((r) => r.vyksta) },
    { pavadinimas: "Šiandien", rungtynes: visos.filter((r) => !r.vyksta && arSiandien(r.pradzia)) },
    { pavadinimas: "Vėliau", rungtynes: visos.filter((r) => !r.vyksta && !arSiandien(r.pradzia)) },
  ];

  let html = "";
  for (const grupe of grupes) {
    if (grupe.rungtynes.length === 0) continue;
    // Kiekvienoje grupėje – artimiausios viršuje
    grupe.rungtynes.sort((a, b) => a.atstumas - b.atstumas);
    html += `<h2 class="skyriaus-pavadinimas">${grupe.pavadinimas}</h2>`;
    html += grupe.rungtynes.map(rungtyniuKortele).join("");
  }

  if (html === "") {
    html = arYraFiltru()
      ? `<div class="tuscia">
          <div class="ikona">🔍</div>
          <p>Pagal pasirinktus filtrus rungtynių nerasta.</p>
          <p style="margin-top: 12px"><button class="mygtukas antrinis" onclick="isvalytiFiltrus()">Išvalyti filtrus</button></p>
        </div>`
      : `<div class="tuscia">
          <div class="ikona">🏀</div>
          <p>Šiuo metu netoliese rungtynių nėra.</p>
        </div>`;
  }

  document.getElementById("rungtyniu-sarasas").innerHTML = html;
}

function arSiandien(data) {
  return data.toDateString() === new Date().toDateString();
}

/* Vienos rungtynių kortelės HTML */
function rungtyniuKortele(r) {
  const procentai = Math.round((r.uzimta / r.vietu) * 100);
  const zymos = r.zymos.map((z) => `<span class="zyma">${z}</span>`).join("");

  return `
    <a class="kortele rungtyniu-kortele" href="rungtynes.html?id=${r.id}">
      <div class="virsutine-eilute">
        <span class="aiksteles-pavadinimas">${r.aikstele.pavadinimas}</span>
        <span class="atstumas">📍 ${formatuotiAtstuma(r.atstumas)}</span>
      </div>
      <div class="laikas ${r.vyksta ? "vyksta" : ""}">${rungtyniuLaikas(r)}</div>
      <div>
        <span class="zyma oranzine">${LYGIAI[r.lygis]}</span>${zymos}
      </div>
      <div class="uzpildymas">
        <div class="juosta"><span style="width: ${procentai}%"></span></div>
        <div class="tekstas">
          <span>${r.uzimta} / ${r.vietu} žaidėjų</span>
          ${r.laisvu > 0 ? `<span class="truksta">Trūksta ${r.laisvu}</span>` : `<span>Pilna</span>`}
        </div>
      </div>
      ${prisijungimoMygtukas(r)}
    </a>`;
}

/* Mygtukas kortelėje: „Prisijungti“, „Jūs dalyvaujate“ arba „Vietų nėra“ */
function prisijungimoMygtukas(r) {
  if (r.manoKiekis > 0) {
    const kiti = r.manoKiekis > 1 ? ` (+${r.manoKiekis - 1})` : "";
    return `<div class="dalyvaujate">✓ Jūs dalyvaujate${kiti}</div>`;
  }
  if (r.laisvu === 0) {
    return `<button class="mygtukas antrinis platus" disabled>Vietų nebėra</button>`;
  }
  return `<button class="mygtukas platus" onclick="greitasPrisijungimas(event, '${r.id}')">Prisijungti</button>`;
}

/* Prisijungimas prie rungtynių tiesiai iš sąrašo (1 užduotis – Kevinas) */
function greitasPrisijungimas(ivykis, id) {
  // Kad paspaudus mygtuką neatsidarytų rungtynių puslapis
  ivykis.preventDefault();
  ivykis.stopPropagation();

  // Svečias (neprisijungęs) – pasiūlome prisijungti, bet nieko neprarandame
  if (!gautiNaudotoja()) {
    rodytiPranesima("Norėdami dalyvauti, prisijunkite", {
      mygtukas: "Prisijungti",
      veiksmas: () => (window.location.href = "prisijungimas.html?atgal=index.html"),
    });
    return;
  }

  const r = gautiRungtynes(id);
  registruotisRungtynems(id, 1);
  piestiRungtynes();

  // Aiškus patvirtinimas + galimybė atšaukti
  rodytiPranesima(`✓ Prisijungėte: ${r.aikstele.pavadinimas}, ${pirmaMaza(rungtyniuLaikas(r).replace("🔴 ", ""))}`, {
    mygtukas: "Atšaukti",
    veiksmas: () => {
      atsauktiDalyvavima(id);
      piestiRungtynes();
      rodytiPranesima("Dalyvavimas atšauktas");
    },
    trukme: 6000,
  });
}

/* „Vyksta dabar“ → „vyksta dabar“ (sakinio viduryje) */
function pirmaMaza(tekstas) {
  return tekstas.charAt(0).toLowerCase() + tekstas.slice(1);
}

/* ==========================================================
   Filtrai: lygis, laikas, atstumas, „Šeimoms“ (FR13)
   Pasirinkimai išsaugomi – kitą kartą nereikės rinktis iš naujo.
   ========================================================== */

const FILTRU_PARINKTYS = {
  lygis: { pavadinimas: "Lygis", reiksmes: { visi: "Visi", pradedantysis: "Pradedantysis", vidutinis: "Vidutinis", "aukštas": "Aukštas" } },
  laikas: { pavadinimas: "Laikas", reiksmes: { visi: "Bet kada", dabar: "Vyksta dabar", siandien: "Šiandien", rytoj: "Rytoj" } },
  atstumas: { pavadinimas: "Atstumas", reiksmes: { visi: "Bet koks", 1: "Iki 1 km", 3: "Iki 3 km", 5: "Iki 5 km" } },
  zyma: { pavadinimas: "Kita", reiksmes: { visi: "Visos rungtynės", "Šeimoms": "Tik šeimoms" } },
};

let filtrai = Object.assign({ lygis: "visi", laikas: "visi", atstumas: "visi", zyma: "visi" }, gautiFiltrus());
let juodrastis = null; // filtrai, kol langas atidarytas (dar nepritaikyti)

function atitinkaFiltrus(r) {
  if (filtrai.lygis !== "visi" && r.lygis !== filtrai.lygis) return false;
  if (filtrai.atstumas !== "visi" && r.atstumas > Number(filtrai.atstumas)) return false;
  if (filtrai.zyma !== "visi" && !r.zymos.includes(filtrai.zyma)) return false;
  if (filtrai.laikas === "dabar" && !r.vyksta) return false;
  if (filtrai.laikas === "siandien" && !arSiandien(r.pradzia)) return false;
  if (filtrai.laikas === "rytoj") {
    const rytoj = new Date();
    rytoj.setDate(rytoj.getDate() + 1);
    if (r.pradzia.toDateString() !== rytoj.toDateString()) return false;
  }
  return true;
}

function arYraFiltru() {
  return Object.values(filtrai).some((v) => v !== "visi");
}

/* Atidaromas filtrų langas */
function atidarytiFiltrus() {
  juodrastis = Object.assign({}, filtrai);
  piestiFiltruLanga();
  document.getElementById("filtru-langas").hidden = false;
}

function uzdarytiFiltrus() {
  document.getElementById("filtru-langas").hidden = true;
}

function piestiFiltruLanga() {
  let html = `<div class="filtru-antraste"><h2>Filtrai</h2>
    <button class="uzdaryti-filtrus" onclick="uzdarytiFiltrus()">✕ Uždaryti</button></div>`;

  for (const [raktas, grupe] of Object.entries(FILTRU_PARINKTYS)) {
    html += `<div class="filtru-grupe"><div class="filtru-grupes-pavadinimas">${grupe.pavadinimas}</div><div class="filtru-parinktys">`;
    for (const [reiksme, tekstas] of Object.entries(grupe.reiksmes)) {
      const pasirinkta = String(juodrastis[raktas]) === String(reiksme);
      html += `<button class="filtro-parinktis ${pasirinkta ? "pasirinkta" : ""}" onclick="pasirinktiFiltra('${raktas}', '${reiksme}')">${tekstas}</button>`;
    }
    html += `</div></div>`;
  }

  const kiek = visosRungtynes().filter((r) => atitinkaFiltrusSu(r, juodrastis)).length;
  html += `
    <div class="filtru-mygtukai">
      <button class="mygtukas antrinis" onclick="pasirinktiNumatytuosius()">Išvalyti</button>
      <button class="mygtukas" onclick="pritaikytiFiltrus()">Rodyti rezultatus (${kiek})</button>
    </div>`;

  document.getElementById("filtru-langas").innerHTML = html;
}

/* Patikrina rungtynes su laikinais (dar nepritaikytais) filtrais */
function atitinkaFiltrusSu(r, laikini) {
  const tikri = filtrai;
  filtrai = laikini;
  const rezultatas = atitinkaFiltrus(r);
  filtrai = tikri;
  return rezultatas;
}

function pasirinktiFiltra(raktas, reiksme) {
  juodrastis[raktas] = reiksme;
  piestiFiltruLanga();
}

function pasirinktiNumatytuosius() {
  juodrastis = { lygis: "visi", laikas: "visi", atstumas: "visi", zyma: "visi" };
  piestiFiltruLanga();
}

function pritaikytiFiltrus() {
  filtrai = juodrastis;
  issaugotiFiltrus(filtrai);
  uzdarytiFiltrus();
  piestiAktyviusFiltrus();
  piestiRungtynes();
}

function isvalytiFiltrus() {
  filtrai = { lygis: "visi", laikas: "visi", atstumas: "visi", zyma: "visi" };
  issaugotiFiltrus(filtrai);
  piestiAktyviusFiltrus();
  piestiRungtynes();
}

/* Aktyvūs filtrai rodomi šalia mygtuko, kad naudotojas matytų, kas pritaikyta */
function piestiAktyviusFiltrus() {
  const aktyvus = Object.entries(filtrai).filter(([, v]) => v !== "visi");
  const mygtukas = document.getElementById("filtru-mygtukas");
  mygtukas.textContent = aktyvus.length ? `⚙️ Filtrai (${aktyvus.length})` : "⚙️ Filtrai";
  mygtukas.classList.toggle("aktyvus", aktyvus.length > 0);

  document.getElementById("aktyvus-filtrai").innerHTML = aktyvus.length
    ? aktyvus.map(([k, v]) => `<span class="zyma oranzine">${FILTRU_PARINKTYS[k].reiksmes[v]}</span>`).join("") +
      `<button class="isvalyti-filtrus" onclick="isvalytiFiltrus()">Išvalyti ✕</button>`
    : "";
}

/* ---------- Puslapio paleidimas ---------- */
piestiNavigacija("rungtynes");
piestiVieta();
piestiAktyviusFiltrus();
piestiRungtynes();
