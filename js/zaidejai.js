piestiNavigacija("zaidejai");
piestiVirsu("Žaidėjai");

const zaidejuFiltrai = { rodyti: "visi", lygis: "visi", miestas: dabartinisMiestas() };
let isskleistas = null;

piestiDazniausius();
piestiFiltrus();
piestiZaidejus();

function dazniausiaiZaistaSu() {
  const kiekiai = {};
  visosRungtynesSuPasibaigusiomis()
    .filter((r) => r.pasibaigusi && r.manoKiekis > 0)
    .forEach((r) => r.dalyviai.forEach((id) => (kiekiai[id] = (kiekiai[id] || 0) + 1)));
  return Object.entries(kiekiai)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, kiek]) => ({ zaidejas: gautiZaideja(id), kiek: kiek }))
    .filter((x) => x.zaidejas);
}

function piestiDazniausius() {
  const vieta = document.getElementById("dazniausi");
  const sarasas = gautiNaudotoja() ? dazniausiaiZaistaSu() : [];
  if (!sarasas.length) {
    vieta.innerHTML = "";
    return;
  }
  vieta.innerHTML = `
    <h2 class="skyriaus-pavadinimas">Dažniausiai žaidžiate su</h2>
    <div class="dazniausi-juosta">
      ${sarasas
        .map(
          (x) => `
        <button class="dazniausias" onclick="rodytiZaideja('${x.zaidejas.id}')">
          <span class="zaidejo-avataras">${x.zaidejas.vardas.charAt(0)}</span>
          <strong>${x.zaidejas.vardas}</strong>
          <span>${daugiskaita(x.kiek, "kartą", "kartus", "kartų")}</span>
        </button>`
        )
        .join("")}
    </div>`;
}

function rodytiZaideja(id) {
  const z = gautiZaideja(id);
  zaidejuFiltrai.rodyti = "visi";
  zaidejuFiltrai.lygis = "visi";
  zaidejuFiltrai.miestas = RAJONAI[z.rajonas].miestas;
  document.getElementById("paieska").value = "";
  isskleistas = id;
  piestiFiltrus();
  piestiZaidejus();
  const kortele = document.querySelector(`[data-zaidejas="${id}"]`);
  if (kortele) kortele.scrollIntoView({ behavior: "smooth", block: "center" });
}

function filtroMygtukas(tekstas, pasirinkta, veiksmas) {
  return `<button class="filtro-parinktis ${pasirinkta ? "pasirinkta" : ""}" onclick="${veiksmas}; piestiFiltrus(); piestiZaidejus()">${tekstas}</button>`;
}

function piestiFiltrus() {
  const f = zaidejuFiltrai;
  document.getElementById("zaideju-filtrai").innerHTML = `
    <div class="filtru-eile">
      <span class="etikete">Rodyti</span>
      ${filtroMygtukas("Visus", f.rodyti === "visi", "zaidejuFiltrai.rodyti = 'visi'")}
      ${filtroMygtukas(`Sekamus (${gautiSekamus().length})`, f.rodyti === "sekami", "zaidejuFiltrai.rodyti = 'sekami'")}
    </div>
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
    if (f.rodyti === "sekami" && !gautiSekamus().includes(z.id)) return false;
    if (f.lygis !== "visi" && z.lygis !== f.lygis) return false;
    if (f.miestas !== "visi" && RAJONAI[z.rajonas].miestas !== f.miestas) return false;
    return true;
  });

  let html = `<p class="blankus" style="margin: 8px 0">Rasta žaidėjų: ${sarasas.length}</p>`;

  if (sarasas.length === 0) {
    html +=
      f.rodyti === "sekami" && !gautiSekamus().length
        ? `<div class="tuscia"><div class="ikona">⭐</div><p>Dar nieko nesekate. Atidarykite žaidėjo kortelę ir spauskite „Sekti“.</p></div>`
        : `<div class="tuscia"><div class="ikona">🔍</div><p>Žaidėjų nerasta. Pabandykite pakeisti filtrus.</p></div>`;
  }

  html += sarasas
    .map((z) => {
      const atidarytas = isskleistas === z.id;
      return `
      <div class="kortele zaidejo-kortele" data-zaidejas="${z.id}" onclick="skleisti('${z.id}')">
        <div class="zaidejo-virsus">
          <div class="zaidejo-avataras">${z.vardas.charAt(0)}</div>
          <div>
            <div class="zaidejo-vardas">${z.vardas}${gautiSekamus().includes(z.id) ? ` <span class="sekamas-zenklas">Sekate</span>` : ""}</div>
            <div class="zaidejo-detales">${z.amzius} m. · ${LYGIAI[z.lygis]} · ${z.pozicija} · ${rajonoPavadinimas(z.rajonas)}</div>
            <div class="dalyvio-zymos">${reitingoZyma(z)} ${patikimumoZyma(z)}</div>
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

function zaidejoProfilis(z) {
  const rungtynes = visosRungtynes().filter((r) => r.dalyviai.includes(z.id));
  return `
    <div class="zaidejo-profilis">
      <div class="zaidejo-veiksmai">
        <button class="mygtukas ${gautiSekamus().includes(z.id) ? "antrinis" : ""}" onclick="event.stopPropagation(); sekti('${z.id}')">${gautiSekamus().includes(z.id) ? "✓ Sekate" : "+ Sekti"}</button>
        <button class="mygtukas antrinis" onclick="event.stopPropagation(); atidarytiKvietima('${z.id}')">Pakviesti į rungtynes</button>
      </div>
      ${
        z.ugis
          ? `<div class="zaidejo-fiziniai">
              <div><strong>${z.ugis}</strong><span>Ūgis, cm</span></div>
              <div><strong>${z.svoris}</strong><span>Svoris, kg</span></div>
              <div><strong>${z.suolis}</strong><span>Šuolis, cm</span></div>
              <div><strong>${z.patirtis}</strong><span>Patirtis, m.</span></div>
            </div>`
          : ""
      }
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

function sekti(id) {
  if (!gautiNaudotoja()) {
    rodytiPranesima("Prisijunkite, kad galėtumėte sekti žaidėjus.", { mygtukas: "Prisijungti", veiksmas: () => (location.href = "prisijungimas.html") });
    return;
  }
  const z = gautiZaideja(id);
  const sekama = perjungtiSekima(id);
  piestiFiltrus();
  piestiZaidejus();
  rodytiPranesima(sekama ? `✓ Sekate žaidėją: ${z.vardas}.` : `Nebesekate žaidėjo: ${z.vardas}.`);
}

function atidarytiKvietima(id) {
  if (!gautiNaudotoja()) {
    rodytiPranesima("Prisijunkite, kad galėtumėte kviesti žaidėjus.", { mygtukas: "Prisijungti", veiksmas: () => (location.href = "prisijungimas.html") });
    return;
  }
  const z = gautiZaideja(id);
  const pakvietimai = gautiPakvietimus();
  const manoRungtynes = visosRungtynes().filter((r) => r.manoKiekis > 0);

  const turinys = manoRungtynes.length
    ? manoRungtynes
        .map((r) => {
          const jauDalyvauja = r.dalyviai.includes(id);
          const pakviestas = (pakvietimai[r.id] || []).includes(id);
          const pilna = r.laisvu <= 0;
          const busena = jauDalyvauja ? "Jau dalyvauja" : pakviestas ? "✓ Pakviestas" : pilna ? "Vietų nėra" : "Pakviesti";
          return `
          <div class="kvietimo-eilute">
            <div>
              <strong>${r.aikstele.pavadinimas}</strong>
              <span class="blankus">${rungtyniuLaikas(r)} · ${daugiskaita(r.laisvu, "laisva vieta", "laisvos vietos", "laisvų vietų")}</span>
            </div>
            <button class="mygtukas ${jauDalyvauja || pakviestas || pilna ? "antrinis" : ""}" ${jauDalyvauja || pakviestas || pilna ? "disabled" : ""} onclick="pakviesti('${r.id}', '${id}')">${busena}</button>
          </div>`;
        })
        .join("")
    : `<div class="tuscia"><p>Neturite artėjančių rungtynių. Sukurkite rungtynes ir pakvieskite žaidėją.</p></div>
       <a class="mygtukas platus" href="sukurti.html">Sukurti rungtynes</a>`;

  let fonas = document.getElementById("kvietimo-lapas");
  if (!fonas) {
    fonas = document.createElement("div");
    fonas.id = "kvietimo-lapas";
    fonas.className = "lapas-fonas";
    fonas.onclick = (e) => {
      if (e.target === fonas) uzdarytiKvietima();
    };
    document.body.appendChild(fonas);
  }
  fonas.innerHTML = `
    <div class="lapas" role="dialog" aria-modal="true" aria-labelledby="kvietimo-antraste">
      <div class="lapas-rankenele"></div>
      <div class="lapas-antraste">
        <h2 id="kvietimo-antraste">Kvietimas</h2>
        <button class="uzdaryti-lapa" onclick="uzdarytiKvietima()" aria-label="Uždaryti">✕</button>
      </div>
      <p class="blankus" style="margin-bottom: 10px">Žaidėjas: <strong>${z.vardas}</strong>. Pasirinkite rungtynes:</p>
      ${turinys}
    </div>`;
  requestAnimationFrame(() => fonas.classList.add("atidarytas"));
}

function uzdarytiKvietima() {
  const fonas = document.getElementById("kvietimo-lapas");
  if (!fonas) return;
  fonas.classList.remove("atidarytas");
  setTimeout(() => fonas.remove(), 300);
}

function pakviesti(rungtyniuId, zaidejoId) {
  issaugotiPakvietima(rungtyniuId, zaidejoId);
  const r = gautiRungtynes(rungtyniuId);
  uzdarytiKvietima();
  rodytiPranesima(`✓ Pakvietimas išsiųstas (${gautiZaideja(zaidejoId).vardas}, ${r.aikstele.pavadinimas})`);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") uzdarytiKvietima();
});
