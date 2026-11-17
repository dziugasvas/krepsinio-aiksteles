function miestoRungtynes() {
  return visosRungtynes().filter((r) => r.aikstele.miestas === dabartinisMiestas());
}

function piestiMiesta() {
  const miestoId = dabartinisMiestas();
  const m = MIESTAI[miestoId];
  const aiksteles = AIKSTELES.filter((a) => a.miestas === miestoId);
  const siandien = miestoRungtynes().filter((r) => r.vyksta || arSiandien(r.pradzia)).length;
  const zaidzia = aiksteles.reduce((suma, a) => suma + zaidejuAiksteleje(a), 0);
  const rajonai = Object.entries(RAJONAI).filter(([, r]) => r.miestas === miestoId);

  document.getElementById("miestas").innerHTML = `
    <button class="miesto-virselis" style="background-image: url('${m.nuotrauka}')" onclick="atidarytiMiestuSarasa()"
      aria-label="Pakeisti miestą (dabar: ${m.pavadinimas})">
      <span class="miesto-pavadinimas">${m.pavadinimas} <span class="rodykle">⌄</span></span>
      <span class="miesto-sukis">${m.sukis}</span>
    </button>

    <div class="miesto-statistika">
      <div><strong>${siandien}</strong><span>Rungtynės šiandien</span></div>
      <div><strong>${aiksteles.length}</strong><span>Aikštelės</span></div>
      <div><strong>${zaidzia}</strong><span>Žaidžia dabar</span></div>
    </div>

    ${
      rajonai.length > 1
        ? `<div class="rajonai" role="group" aria-label="Jūsų rajonas">
            <span class="blankus">Jūsų vieta:</span>
            ${rajonai
              .map(([id, r]) => `<button class="rajonas ${id === gautiRajona() ? "pasirinktas" : ""}" onclick="keistiRajona('${id}')">${r.pavadinimas}</button>`)
              .join("")}
          </div>`
        : ""
    }`;
}

function keistiRajona(rajonas) {
  nustatytiRajona(rajonas);
  atnaujintiViska();
  rodytiPranesima(`Vieta: ${RAJONAI[rajonas].pavadinimas}`);
}

function atidarytiMiestuSarasa() {
  const dabartinis = dabartinisMiestas();
  const fonas = document.createElement("div");
  fonas.className = "lapas-fonas";
  fonas.onclick = (e) => {
    if (e.target === fonas) uzdarytiMiestuSarasa();
  };
  fonas.innerHTML = `
    <div class="lapas" role="dialog" aria-label="Miesto pasirinkimas">
      <div class="lapas-rankenele"></div>
      <div class="lapas-antraste">
        <h2>Pasirinkite miestą</h2>
        <button class="uzdaryti-lapa" onclick="uzdarytiMiestuSarasa()" aria-label="Uždaryti">✕</button>
      </div>
      <div class="miestu-tinklelis">
        ${Object.entries(MIESTAI)
          .map(([id, m]) => {
            const kiek = AIKSTELES.filter((a) => a.miestas === id).length;
            return `
            <button class="miesto-plytele ${id === dabartinis ? "pasirinkta" : ""}" style="background-image: url('${m.nuotrauka}')" onclick="pasirinktiMiesta('${id}')">
              <span class="plyteles-pavadinimas">${m.pavadinimas}</span>
              <span class="plyteles-info">${daugiskaita(kiek, "aikštelė", "aikštelės", "aikštelių")}${id === dabartinis ? " · ✓ dabar" : ""}</span>
            </button>`;
          })
          .join("")}
      </div>
    </div>`;
  document.body.appendChild(fonas);
  document.addEventListener("keydown", lapoKlaviatura);
  requestAnimationFrame(() => fonas.classList.add("atidarytas"));
}

function uzdarytiMiestuSarasa() {
  const fonas = document.querySelector(".lapas-fonas");
  if (!fonas) return;
  fonas.classList.remove("atidarytas");
  document.removeEventListener("keydown", lapoKlaviatura);
  setTimeout(() => fonas.remove(), 250);
}

function lapoKlaviatura(e) {
  if (e.key === "Escape") uzdarytiMiestuSarasa();
}

function pasirinktiMiesta(miestas) {
  nustatytiMiesta(miestas);
  uzdarytiMiestuSarasa();
  atnaujintiViska();
  window.scrollTo({ top: 0, behavior: "smooth" });
  rodytiPranesima(`Miestas: ${MIESTAI[miestas].pavadinimas}`);
}

function piestiRungtynes() {
  const visos = miestoRungtynes().filter(atitinkaFiltrus);

  const grupes = [
    { pavadinimas: "Vyksta dabar", rungtynes: visos.filter((r) => r.vyksta) },
    { pavadinimas: "Šiandien", rungtynes: visos.filter((r) => !r.vyksta && arSiandien(r.pradzia)) },
    { pavadinimas: "Vėliau", rungtynes: visos.filter((r) => !r.vyksta && !arSiandien(r.pradzia)) },
  ];

  let html = "";
  for (const grupe of grupes) {
    if (grupe.rungtynes.length === 0) continue;

    grupe.rungtynes.sort((a, b) => a.atstumas - b.atstumas);
    html += `<h2 class="skyriaus-pavadinimas">${grupe.pavadinimas}</h2>`;
    html += grupe.rungtynes.map((r) => rungtyniuKorteleHtml(r, prisijungimoMygtukas(r))).join("");
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
          <p>Šiuo metu šiame mieste rungtynių nėra.</p>
          <p style="margin-top: 12px"><a class="mygtukas" href="sukurti.html">Sukurti rungtynes</a></p>
        </div>`;
  }

  document.getElementById("rungtyniu-sarasas").innerHTML = html;
}

function arSiandien(data) {
  return data.toDateString() === new Date().toDateString();
}

function prisijungimoMygtukas(r) {
  if (r.organizatorius === "jus") return `<span class="pill dalyvauja">✓ Organizuojate</span>`;
  if (r.manoKiekis > 0) {
    const kiti = r.manoKiekis > 1 ? ` +${r.manoKiekis - 1}` : "";
    return `<span class="pill dalyvauja">✓ Dalyvaujate${kiti}</span>`;
  }
  if (r.laisvu === 0) return `<button class="pill" disabled>Pilna</button>`;
  return `<button class="pill oranzinis" onclick="greitasPrisijungimas(event, '${r.id}')">Prisijungti</button>`;
}

function greitasPrisijungimas(ivykis, id) {
  ivykis.preventDefault();
  ivykis.stopPropagation();

  if (!gautiNaudotoja()) {
    rodytiPranesima("Norėdami dalyvauti, prisijunkite", {
      mygtukas: "Prisijungti",
      veiksmas: () => (window.location.href = "prisijungimas.html?atgal=index.html"),
    });
    return;
  }

  const r = gautiRungtynes(id);
  registruotisRungtynems(id, 1);
  atnaujintiViska();

  rodytiPranesima(`✓ Prisijungėte: ${r.aikstele.pavadinimas} (${r.aikstele.adresas}), ${pirmaMaza(rungtyniuLaikas(r).replace("● ", ""))}`, {
    mygtukas: "Atšaukti",
    veiksmas: () => {
      atsauktiDalyvavima(id);
      atnaujintiViska();
      rodytiPranesima("Dalyvavimas atšauktas");
    },
    trukme: 6000,
  });
}

function pirmaMaza(tekstas) {
  return tekstas.charAt(0).toLowerCase() + tekstas.slice(1);
}

const FILTRU_PARINKTYS = {
  lygis: { pavadinimas: "Lygis", reiksmes: { visi: "Visi", pradedantysis: "Pradedantysis", vidutinis: "Vidutinis", "aukštas": "Aukštas" } },
  laikas: { pavadinimas: "Laikas", reiksmes: { visi: "Bet kada", dabar: "Vyksta dabar", siandien: "Šiandien", rytoj: "Rytoj" } },
  atstumas: { pavadinimas: "Atstumas", reiksmes: { visi: "Bet koks", 1: "Iki 1 km", 3: "Iki 3 km", 5: "Iki 5 km" } },
  zyma: { pavadinimas: "Kita", reiksmes: { visi: "Visos rungtynės", "Šeimoms": "Tik šeimoms" } },
};

let filtrai = Object.assign({ lygis: "visi", laikas: "visi", atstumas: "visi", zyma: "visi" }, gautiFiltrus());
let juodrastis = null;

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

  const kiek = miestoRungtynes().filter((r) => atitinkaFiltrusSu(r, juodrastis)).length;
  html += `
    <div class="filtru-mygtukai">
      <button class="mygtukas antrinis" onclick="pasirinktiNumatytuosius()">Išvalyti</button>
      <button class="mygtukas" onclick="pritaikytiFiltrus()">Rodyti rezultatus (${kiek})</button>
    </div>`;

  document.getElementById("filtru-langas").innerHTML = html;
}

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

function piestiAktyviusFiltrus() {
  const aktyvus = Object.entries(filtrai).filter(([, v]) => v !== "visi");
  const mygtukas = document.getElementById("filtru-mygtukas");
  mygtukas.textContent = aktyvus.length ? `Filtrai (${aktyvus.length})` : "Filtrai";
  mygtukas.classList.toggle("aktyvus", aktyvus.length > 0);

  document.getElementById("aktyvus-filtrai").innerHTML = aktyvus.length
    ? aktyvus.map(([k, v]) => `<span class="zyma oranzine">${FILTRU_PARINKTYS[k].reiksmes[v]}</span>`).join("") +
      `<button class="isvalyti-filtrus" onclick="isvalytiFiltrus()">Išvalyti ✕</button>`
    : "";
}

function atnaujintiViska() {
  piestiVirsu("Pradžia", { nuoroda: "sukurti.html", tekstas: "Sukurti" });
  piestiMiesta();
  piestiAktyviusFiltrus();
  piestiRungtynes();
}

piestiNavigacija("rungtynes");
atnaujintiViska();
