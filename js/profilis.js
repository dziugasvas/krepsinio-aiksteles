/* ==========================================================
   Profilis: naudotojo lygis, mano rungtynės, vieta (vietoj GPS)
   ========================================================== */

piestiNavigacija("profilis");
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

      <h2 class="skyriaus-pavadinimas">Mano žaidimo lygis</h2>
      <div class="parinkciu-eile">
        ${Object.entries(LYGIAI)
          .map(
            ([raktas, tekstas]) =>
              `<button class="parinktis ${naudotojas.lygis === raktas ? "pasirinkta" : ""}" onclick="keistiLygi('${raktas}')">${tekstas}</button>`
          )
          .join("")}
      </div>

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
    <h2 class="skyriaus-pavadinimas">Mano vieta</h2>
    <p class="blankus">Prototipe vieta pasirenkama ranka (vietoj GPS). Pagal ją skaičiuojami atstumai.</p>
    <div class="parinkciu-eile">
      ${Object.entries(RAJONAI)
        .map(
          ([raktas, r]) =>
            `<button class="parinktis ${rajonas === raktas ? "pasirinkta" : ""}" onclick="keistiRajona('${raktas}')">📍 ${r.pavadinimas}</button>`
        )
        .join("")}
    </div>

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
        <span><strong>${r.aikstele.pavadinimas}</strong><br><span class="blankus">${rungtyniuLaikas(r)}${r.manoKiekis > 1 ? " · Aš + 1" : ""}</span></span>
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
