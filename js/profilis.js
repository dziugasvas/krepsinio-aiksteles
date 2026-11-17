/* ==========================================================
   Profilis: naudotojo lygis, mano rungtynės, vieta (vietoj GPS)
   ========================================================== */

piestiNavigacija("");
piestiProfili();

function piestiProfili() {
  const naudotojas = gautiNaudotoja();
  const turinys = document.getElementById("profilio-turinys");
  let html = "";

  if (naudotojas) {
    html += `
      <div class="kortele profilio-virsus">
        <div class="didelis-avataras">${naudotojas.vardas.charAt(0)}</div>
        <div>
          <div class="profilio-vardas">${naudotojas.vardas}</div>
          <div class="blankus">Prisijungta per: ${naudotojas.budas}</div>
        </div>
      </div>

      <h2 class="skyriaus-pavadinimas">Vardas</h2>
      <div class="vardo-eilute">
        <input id="vardo-laukas" type="text" value="${naudotojas.vardas}" maxlength="20" aria-label="Vardas">
        <button class="mygtukas antrinis" onclick="issaugotiVarda()">Išsaugoti</button>
      </div>
      <div class="klaidos-tekstas" id="vardo-klaida"></div>

      <h2 class="skyriaus-pavadinimas">Mano žaidimo lygis</h2>
      <div class="parinkciu-eile">
        ${Object.entries(LYGIAI)
          .map(
            ([raktas, tekstas]) =>
              `<button class="parinktis ${naudotojas.lygis === raktas ? "pasirinkta" : ""}" onclick="keistiLygi('${raktas}')">${tekstas}</button>`
          )
          .join("")}
      </div>

      <h2 class="skyriaus-pavadinimas">Pozicija</h2>
      <div class="parinkciu-eile">
        ${["Gynėjas", "Puolėjas", "Centras", "Nesvarbu"]
          .map(
            (p) =>
              `<button class="parinktis ${(naudotojas.pozicija || "Nesvarbu") === p ? "pasirinkta" : ""}" onclick="keistiPozicija('${p}')">${p}</button>`
          )
          .join("")}
      </div>

      ${buvimoInformacija()}

      <h2 class="skyriaus-pavadinimas" id="nustatymai">Pranešimai</h2>
      <label class="jungiklis-eilute">
        <span>📣 Pranešti, kai netoliese ieškoma žaidėjų<br><span class="blankus">Pranešimą galite išjungti bet kada</span></span>
        <input type="checkbox" class="jungiklis" ${gautiPranesimuNustatyma() ? "checked" : ""} onchange="keistiPranesimus(this.checked)">
      </label>

      <h2 class="skyriaus-pavadinimas">Mano rungtynės</h2>
      <div class="kortele">${manoRungtynes()}</div>`;
  } else {
    html += `
      <div class="kortele profilio-virsus">
        <div class="didelis-avataras svecias">?</div>
        <div>
          <div class="profilio-vardas">Svečias</div>
          <div class="blankus">Galite naršyti, bet norint dalyvauti reikia prisijungti.</div>
        </div>
      </div>
      <a class="mygtukas platus" href="prisijungimas.html?atgal=profilis.html">Prisijungti</a>`;
  }

  // Vieta – prieinama ir svečiui
  const rajonas = gautiRajona();
  html += `
    <h2 class="skyriaus-pavadinimas" id="vieta">Mano vieta</h2>
    <p class="blankus">Prototipe vieta pasirenkama ranka (vietoj GPS). Pagal ją skaičiuojami atstumai.</p>
    <div class="parinkciu-eile">
      ${Object.entries(MIESTAI)
        .map(
          ([raktas, m]) =>
            `<button class="parinktis ${dabartinisMiestas() === raktas ? "pasirinkta" : ""}" onclick="keistiMiesta('${raktas}')">${m.pavadinimas}</button>`
        )
        .join("")}
    </div>
    ${
      Object.values(RAJONAI).filter((r) => r.miestas === dabartinisMiestas()).length > 1
        ? `<div class="parinkciu-eile">
            ${Object.entries(RAJONAI)
              .filter(([, r]) => r.miestas === dabartinisMiestas())
              .map(
                ([raktas, r]) =>
                  `<button class="parinktis ${rajonas === raktas ? "pasirinkta" : ""}" onclick="keistiRajona('${raktas}')">📍 ${r.pavadinimas}</button>`
              )
              .join("")}
          </div>`
        : ""
    }

    <div class="apacios-mygtukai">
      ${naudotojas ? `<button class="mygtukas antrinis platus" onclick="atsijungtiIsProfilio()">Atsijungti</button>` : ""}
      <button class="mygtukas pavojingas platus" onclick="isvalytiPrototipa()">Išvalyti prototipo duomenis</button>
    </div>`;

  turinys.innerHTML = html;
}

/* Rungtynės, prie kurių naudotojas prisijungęs */
function manoRungtynes() {
  const dalyvavimai = gautiDalyvavimus();
  const sarasas = Object.keys(dalyvavimai)
    .map((id) => gautiRungtynes(id))
    .filter((r) => r)
    .sort((a, b) => a.pradziaPoMin - b.pradziaPoMin);

  if (sarasas.length === 0) {
    return `<p class="blankus">Dar neprisijungėte prie jokių rungtynių. <a href="index.html">Rasti rungtynes ›</a></p>`;
  }

  return sarasas
    .map(
      (r) => `
      <a class="mano-rungtynes" href="rungtynes.html?id=${r.id}">
        <span><strong>${r.aikstele.pavadinimas}</strong><br><span class="blankus">${rungtyniuLaikas(r)}${r.manoKiekis > 1 ? ` · Aš + ${r.manoKiekis - 1}` : ""}</span></span>
        <span>›</span>
      </a>`
    )
    .join("");
}

function keistiLygi(lygis) {
  atnaujintiNaudotoja({ lygis: lygis });
  piestiProfili();
  rodytiPranesima(`✓ Lygis pakeistas: ${LYGIAI[lygis]}`);
}

function keistiMiesta(miestas) {
  nustatytiMiesta(miestas);
  piestiProfili();
  rodytiPranesima(`📍 Miestas: ${MIESTAI[miestas].pavadinimas}`);
}

function keistiRajona(rajonas) {
  nustatytiRajona(rajonas);
  piestiProfili();
  rodytiPranesima(`📍 Vieta pakeista: ${RAJONAI[rajonas].pavadinimas}`);
}

function atsijungtiIsProfilio() {
  atsijungti();
  piestiProfili();
  rodytiPranesima("Atsijungėte");
}

/* Testavimui: viskas grąžinama į pradinę būseną (su patvirtinimu – klaidų prevencija) */
function isvalytiPrototipa() {
  if (!confirm("Ištrinti visus prototipo duomenis (prisijungimą, dalyvavimus, filtrus)?")) return;
  isvalytiViska();
  try {
    localStorage.removeItem("krepsinisVisurVertinimai");
  } catch (klaida) {}
  piestiProfili();
  rodytiPranesima("Prototipo duomenys išvalyti");
}

/* ---------- Vardas ir pozicija (FR5) ---------- */
function issaugotiVarda() {
  const vardas = document.getElementById("vardo-laukas").value.trim();
  if (vardas.length < 2) {
    document.getElementById("vardo-klaida").textContent = "Vardas turi būti bent 2 raidžių.";
    return;
  }
  atnaujintiNaudotoja({ vardas: vardas });
  piestiProfili();
  rodytiPranesima("✓ Vardas išsaugotas");
}

function keistiPozicija(pozicija) {
  atnaujintiNaudotoja({ pozicija: pozicija });
  piestiProfili();
  rodytiPranesima(`✓ Pozicija: ${pozicija}`);
}

/* ---------- Pranešimai (FR21) ---------- */
function keistiPranesimus(ijungta) {
  nustatytiPranesimus(ijungta);
  rodytiPranesima(ijungta ? "🔔 Pranešimai įjungti" : "🔕 Pranešimai išjungti");
}

/* ---------- Kur naudotojas pažymėjo esantis (FR10) ---------- */
function buvimoInformacija() {
  const id = gautiBuvimaAiksteleje();
  if (!id) return "";
  const a = gautiAikstele(id);
  return `
    <h2 class="skyriaus-pavadinimas">Šiuo metu</h2>
    <a class="kortele" href="aikstele.html?id=${a.id}">📍 Esate: <strong>${a.pavadinimas}</strong> ›</a>`;
}

/* Atėjus iš meniu (#vieta, #nustatymai) – nuslenkama prie reikiamos vietos */
if (location.hash) {
  const tikslas = document.querySelector(location.hash);
  if (tikslas) setTimeout(() => tikslas.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
}
