/* ==========================================================
   Pagrindinis ekranas – netoliese vykstančių rungtynių sąrašas
   ========================================================== */

piestiNavigacija("rungtynes");
piestiVieta();
piestiRungtynes();

/* Rodo, pagal kokią vietą skaičiuojami atstumai */
function piestiVieta() {
  const rajonas = RAJONAI[gautiRajona()];
  document.getElementById("vieta").innerHTML =
    `📍 Jūsų vieta: <a href="profilis.html">${rajonas.pavadinimas}</a>`;
}

/* Sugrupuoja rungtynes ir nupiešia sąrašą */
function piestiRungtynes() {
  const visos = visosRungtynes();

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
    html = `
      <div class="tuscia">
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
    </a>`;
}
