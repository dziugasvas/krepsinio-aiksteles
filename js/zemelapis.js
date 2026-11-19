piestiNavigacija("zemelapis");
piestiVirsu("Aikštelės");

const vieta = RAJONAI[gautiRajona()];

const zemelapis = L.map("zemelapis", { zoomControl: false }).setView([vieta.lat, vieta.lng], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(zemelapis);

L.control.zoom({ position: "topright" }).addTo(zemelapis);

L.marker([vieta.lat, vieta.lng], {
  icon: L.divIcon({ className: "", html: '<div class="mano-vieta"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }),
})
  .addTo(zemelapis)
  .bindTooltip("Jūs esate čia");

const zymekliai = {};

for (const aikstele of AIKSTELES) {
  const rungtyniuKiekis = visosRungtynes().filter((r) => r.aiksteleId === aikstele.id).length;
  const klase = rungtyniuKiekis > 0 ? "su-rungtynemis" : "";

  const zymeklis = L.marker([aikstele.lat, aikstele.lng], {
    icon: L.divIcon({
      className: "",
      html: `<div class="aiksteles-zymeklis ${klase}" data-id="${aikstele.id}">${svg("krepsys")}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    }),
    title: aikstele.pavadinimas,
  }).addTo(zemelapis);

  zymeklis.on("click", () => pasirinktiAikstele(aikstele.id));
  zymekliai[aikstele.id] = zymeklis;
}

function pasirinktiAikstele(id) {
  document.querySelectorAll(".aiksteles-zymeklis").forEach((el) => {
    el.classList.toggle("pasirinktas", el.dataset.id === id);
  });
  const aikstele = gautiAikstele(id);

  const taskas = zemelapis.latLngToContainerPoint([aikstele.lat, aikstele.lng]);
  const tikslas = L.point(zemelapis.getSize().x / 2, zemelapis.getSize().y * 0.25);
  zemelapis.panBy(taskas.subtract(tikslas));
  piestiAiksteleskortele(aikstele);
}

zemelapis.on("click", uzdarytiKortele);

function uzdarytiKortele() {
  document.getElementById("aiksteles-kortele").innerHTML = "";
  document.querySelectorAll(".aiksteles-zymeklis").forEach((el) => el.classList.remove("pasirinktas"));
}

function piestiAiksteleskortele(a) {
  const km = atstumasKm(a);
  const rungtynes = visosRungtynes()
    .filter((r) => r.aiksteleId === a.id)
    .sort((x, y) => x.pradziaPoMin - y.pradziaPoMin);

  const rungtyniuHtml = rungtynes.length
    ? rungtynes
        .map(
          (r) => `
        <a class="mini-rungtynes" href="rungtynes.html?id=${r.id}">
          <span>
            <strong>${rungtyniuLaikas(r)}</strong><br>
            <span class="zyma oranzine">${LYGIAI[r.lygis]}</span>${r.zymos.map((z) => `<span class="zyma">${z}</span>`).join("")}
          </span>
          <span class="laisva">${r.laisvu > 0 ? `Trūksta ${r.laisvu}` : "Pilna"} ›</span>
        </a>`
        )
        .join("")
    : `<p class="blankus" style="margin-top: 8px">Suplanuotų rungtynių šioje aikštelėje nėra.</p>`;

  document.getElementById("aiksteles-kortele").innerHTML = `
    <div class="kortele">
      <div class="kortele-virsus">
        <h2>${a.pavadinimas}</h2>
        <button class="uzdaryti" onclick="uzdarytiKortele()" aria-label="Uždaryti">✕ Uždaryti</button>
      </div>
      <div class="atstumo-eilute">${ik("vieta")}${formatuotiAtstuma(km)} · ${laikasPesciomis(km)}</div>
      <div class="uzimtumas ${zaidejuAiksteleje(a) === 0 ? "laisva" : ""}">${ik("zmones")}${uzimtumoTekstas(a)}</div>
      <div>
        <span class="zyma">★ ${vidurkioTekstas(aiksteleVidurkis(a).vidurkis)} · #${aiksteleVieta(a)} mieste</span>
        <span class="zyma">Danga: ${a.danga}</span>
        <span class="zyma ${a.bukle === "Puiki" || a.bukle === "Gera" ? "zalia" : ""}">Būklė: ${a.bukle}</span>
        <span class="zyma">${a.apsvietimas ? "Apšviesta" : "Be apšvietimo"}</span>
      </div>
      <h3 class="skyriaus-pavadinimas">Rungtynės (${rungtynes.length})</h3>
      ${rungtyniuHtml}
      <div class="kortele-mygtukai">
        <a class="mygtukas antrinis platus" href="aikstele.html?id=${a.id}">Visa aikštelės informacija</a>
      </div>
    </div>`;
}

const aiksteliuFiltrai = { danga: "visos", apsviesta: false, atstumas: "visi", uzimtumas: "visi", rikiavimas: "atstumas" };

function rodytiVaizda(vaizdas) {
  const sarasas = vaizdas === "sarasas";
  document.getElementById("aiksteliu-sarasas").hidden = !sarasas;
  document.getElementById("zemelapio-vaizdas").hidden = sarasas;
  document.getElementById("rodyti-sarasa").classList.toggle("pasirinktas", sarasas);
  document.getElementById("rodyti-zemelapi").classList.toggle("pasirinktas", !sarasas);
  uzdarytiKortele();
  if (sarasas) piestiAiksteliuSarasa();
  else zemelapis.invalidateSize();
}

function filtroMygtukas(tekstas, pasirinkta, veiksmas) {
  return `<button class="filtro-parinktis ${pasirinkta ? "pasirinkta" : ""}" onclick="${veiksmas}; piestiAiksteliuSarasa()">${tekstas}</button>`;
}

function piestiAiksteliuSarasa() {
  const f = aiksteliuFiltrai;
  const aiksteles = AIKSTELES.filter((a) => {
    if (a.miestas !== dabartinisMiestas()) return false;
    if (f.danga !== "visos" && a.danga !== f.danga) return false;
    if (f.apsviesta && !a.apsvietimas) return false;
    if (f.atstumas !== "visi" && atstumasKm(a) > Number(f.atstumas)) return false;
    if (f.uzimtumas === "zaidziama" && zaidejuAiksteleje(a) === 0) return false;
    if (f.uzimtumas === "laisva" && zaidejuAiksteleje(a) > 0) return false;
    return true;
  }).sort((a, b) =>
    f.rikiavimas === "reitingas" ? aiksteleVidurkis(b).vidurkis - aiksteleVidurkis(a).vidurkis : atstumasKm(a) - atstumasKm(b)
  );

  const visos = visosRungtynes();

  let html = `
    <div class="saraso-filtrai">
      <span class="etikete">Rikiuoti</span>
      ${filtroMygtukas("Arčiausiai", f.rikiavimas === "atstumas", "aiksteliuFiltrai.rikiavimas = 'atstumas'")}
      ${filtroMygtukas("★ Geriausiai įvertintos", f.rikiavimas === "reitingas", "aiksteliuFiltrai.rikiavimas = 'reitingas'")}
      <span class="etikete">Danga</span>
      ${filtroMygtukas("Visos", f.danga === "visos", "aiksteliuFiltrai.danga = 'visos'")}
      ${filtroMygtukas("Guminė", f.danga === "Guminė", "aiksteliuFiltrai.danga = 'Guminė'")}
      ${filtroMygtukas("Asfaltas", f.danga === "Asfaltas", "aiksteliuFiltrai.danga = 'Asfaltas'")}
      <span class="etikete">Atstumas</span>
      ${filtroMygtukas("Bet koks", f.atstumas === "visi", "aiksteliuFiltrai.atstumas = 'visi'")}
      ${filtroMygtukas("Iki 1 km", f.atstumas === "1", "aiksteliuFiltrai.atstumas = '1'")}
      ${filtroMygtukas("Iki 3 km", f.atstumas === "3", "aiksteliuFiltrai.atstumas = '3'")}
      ${filtroMygtukas("Iki 5 km", f.atstumas === "5", "aiksteliuFiltrai.atstumas = '5'")}
      <span class="etikete">Užimtumas</span>
      ${filtroMygtukas("Bet koks", f.uzimtumas === "visi", "aiksteliuFiltrai.uzimtumas = 'visi'")}
      ${filtroMygtukas("Žaidžiama dabar", f.uzimtumas === "zaidziama", "aiksteliuFiltrai.uzimtumas = 'zaidziama'")}
      ${filtroMygtukas("Laisva", f.uzimtumas === "laisva", "aiksteliuFiltrai.uzimtumas = 'laisva'")}
      <span class="etikete">Kita</span>
      ${filtroMygtukas("Tik apšviestos", f.apsviesta, "aiksteliuFiltrai.apsviesta = !aiksteliuFiltrai.apsviesta")}
    </div>
    <p class="blankus" style="margin-bottom: 8px">${MIESTAI[dabartinisMiestas()].pavadinimas} · rasta aikštelių: ${aiksteles.length}</p>`;

  if (aiksteles.length === 0) {
    html += `<div class="tuscia"><div class="ikona">🔍</div><p>Pagal pasirinktus filtrus aikštelių nerasta.</p></div>`;
  }

  html += aiksteles
    .map((a) => {
      const km = atstumasKm(a);
      const rungtyniu = visos.filter((r) => r.aiksteleId === a.id).length;
      return `
      <a class="kortele aiksteles-eilute" href="aikstele.html?id=${a.id}">
        <div class="virsus-eilute">
          <span class="pavadinimas">${vietosZenklas(a)}${a.pavadinimas}</span>
          <span class="atstumas">${ik("vieta")}${formatuotiAtstuma(km)}</span>
        </div>
        <div class="uzimtumas ${zaidejuAiksteleje(a) === 0 ? "laisva" : ""}">${ik("zmones")}${uzimtumoTekstas(a)}</div>
        <div>
          <span class="zyma">★ ${vidurkioTekstas(aiksteleVidurkis(a).vidurkis)}</span>
          <span class="zyma">${a.danga}</span>
          <span class="zyma ${a.bukle === "Puiki" || a.bukle === "Gera" ? "zalia" : ""}">${a.bukle}</span>
          ${a.apsvietimas ? `<span class="zyma">Apšviesta</span>` : ""}
          ${rungtyniu ? `<span class="zyma oranzine">Rungtynių: ${rungtyniu}</span>` : ""}
        </div>
      </a>`;
    })
    .join("");

  document.getElementById("aiksteliu-sarasas").innerHTML = html;
}

function vietosZenklas(a) {
  const vieta = aiksteleVieta(a);
  return vieta <= 3 ? `<span class="vietos-zenklas vieta-${vieta}" title="${vieta} vieta mieste pagal įvertinimą">#${vieta}</span>` : "";
}

if (gautiParametra("vaizdas") === "reitingas") {
  aiksteliuFiltrai.rikiavimas = "reitingas";
  rodytiVaizda("sarasas");
}
