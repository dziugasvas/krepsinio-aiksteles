/* ==========================================================
   Žaidėjų paieška pagal lygį ir rajoną, profilių peržiūra (FR19)
   ========================================================== */

piestiNavigacija("zaidejai");
piestiVirsu("Žaidėjai");

const zaidejuFiltrai = { lygis: "visi", miestas: dabartinisMiestas() };
let isskleistas = null; // kurio žaidėjo profilis atidarytas

piestiFiltrus();
piestiZaidejus();

function filtroMygtukas(tekstas, pasirinkta, veiksmas) {
  return `<button class="filtro-parinktis ${pasirinkta ? "pasirinkta" : ""}" onclick="${veiksmas}; piestiFiltrus(); piestiZaidejus()">${tekstas}</button>`;
}

function piestiFiltrus() {
  const f = zaidejuFiltrai;
  document.getElementById("zaideju-filtrai").innerHTML = `
    <div class="filtru-eile">
      <span class="etikete">Lygis</span>
      ${filtroMygtukas("Visi", f.lygis === "visi", "zaidejuFiltrai.lygis = 'visi'")}
      ${Object.entries(LYGIAI)
        .map(([k, t]) => filtroMygtukas(t, f.lygis === k, `zaidejuFiltrai.lygis = '${k}'`))
        .join("")}
    </div>
    <div class="filtru-eile">
      <span class="etikete">Miestas</span>
      ${filtroMygtukas("Visi", f.miestas === "visi", "zaidejuFiltrai.miestas = 'visi'")}
      ${Object.entries(MIESTAI)
        .map(([k, m]) => filtroMygtukas(m.pavadinimas, f.miestas === k, `zaidejuFiltrai.miestas = '${k}'`))
        .join("")}
    </div>`;
}

function piestiZaidejus() {
  const tekstas = document.getElementById("paieska").value.trim().toLowerCase();
  const f = zaidejuFiltrai;

  const sarasas = ZAIDEJAI.filter((z) => {
    if (tekstas && !z.vardas.toLowerCase().includes(tekstas)) return false;
    if (f.lygis !== "visi" && z.lygis !== f.lygis) return false;
    if (f.miestas !== "visi" && RAJONAI[z.rajonas].miestas !== f.miestas) return false;
    return true;
  });

  let html = `<p class="blankus" style="margin: 8px 0">Rasta žaidėjų: ${sarasas.length}</p>`;

  if (sarasas.length === 0) {
    html += `<div class="tuscia"><div class="ikona">🔍</div><p>Žaidėjų nerasta. Pabandykite pakeisti filtrus.</p></div>`;
  }

  html += sarasas
    .map((z) => {
      const atidarytas = isskleistas === z.id;
      return `
      <div class="kortele zaidejo-kortele" onclick="skleisti('${z.id}')">
        <div class="zaidejo-virsus">
          <div class="zaidejo-avataras">${z.vardas.charAt(0)}</div>
          <div>
            <div class="zaidejo-vardas">${z.vardas}</div>
            <div class="zaidejo-detales">${z.amzius} m. · ${LYGIAI[z.lygis]} · ${z.pozicija} · ${rajonoPavadinimas(z.rajonas)}</div>
          </div>
          <span class="rodykle">${atidarytas ? "▲" : "▼"}</span>
        </div>
        ${atidarytas ? zaidejoProfilis(z) : ""}
      </div>`;
    })
    .join("");

  document.getElementById("zaideju-sarasas").innerHTML = html;
}

function skleisti(id) {
  isskleistas = isskleistas === id ? null : id;
  piestiZaidejus();
}

/* Žaidėjo profilis: kuriose rungtynėse jis dalyvauja */
function zaidejoProfilis(z) {
  const rungtynes = visosRungtynes().filter((r) => r.dalyviai.includes(z.id));
  return `
    <div class="zaidejo-profilis">
      <div class="blankus">Dalyvauja rungtynėse:</div>
      ${
        rungtynes.length
          ? rungtynes
              .map(
                (r) =>
                  `<a href="rungtynes.html?id=${r.id}" onclick="event.stopPropagation()">${r.aikstele.pavadinimas} – ${rungtyniuLaikas(r)} ›</a>`
              )
              .join("")
          : `<p class="blankus">Šiuo metu niekur neužsiregistravęs.</p>`
      }
    </div>`;
}
