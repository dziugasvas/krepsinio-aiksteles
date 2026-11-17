/* ==========================================================
   Žemėlapio ekranas – aikštelės aplink naudotoją (3 užduotis – Vidas)
   ========================================================== */

piestiNavigacija("zemelapis");

const vieta = RAJONAI[gautiRajona()];

/* Sukuriamas žemėlapis, centruotas į naudotojo vietą */
const zemelapis = L.map("zemelapis", { zoomControl: false }).setView([vieta.lat, vieta.lng], 13);

/* Žemėlapio fonas – OpenStreetMap (nemokamas, be API rakto).
   Tamsią išvaizdą suteikia CSS filtras (css/zemelapis.css). */
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(zemelapis);

L.control.zoom({ position: "topright" }).addTo(zemelapis);

/* Naudotojo vieta */
L.marker([vieta.lat, vieta.lng], {
  icon: L.divIcon({ className: "", html: '<div class="mano-vieta">📍</div>', iconSize: [28, 28], iconAnchor: [14, 28] }),
})
  .addTo(zemelapis)
  .bindTooltip("Jūs esate čia");

/* Aikštelių žymekliai: oranžinis – yra rungtynių, pilkas – nėra */
const zymekliai = {};

for (const aikstele of AIKSTELES) {
  const rungtyniuKiekis = RUNGTYNES.filter((r) => r.aiksteleId === aikstele.id).length;
  const klase = rungtyniuKiekis > 0 ? "su-rungtynemis" : "";

  const zymeklis = L.marker([aikstele.lat, aikstele.lng], {
    icon: L.divIcon({
      className: "",
      html: `<div class="aiksteles-zymeklis ${klase}" data-id="${aikstele.id}">🏀</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    }),
    title: aikstele.pavadinimas,
  }).addTo(zemelapis);

  zymeklis.on("click", () => pasirinktiAikstele(aikstele.id));
  zymekliai[aikstele.id] = zymeklis;
}

/* Paspaudus žymeklį – jis paryškinamas ir apačioje parodoma aikštelės kortelė */
function pasirinktiAikstele(id) {
  document.querySelectorAll(".aiksteles-zymeklis").forEach((el) => {
    el.classList.toggle("pasirinktas", el.dataset.id === id);
  });
  const aikstele = gautiAikstele(id);
  // Aikštelė perkeliama į viršutinę ekrano dalį, kad jos neuždengtų kortelė
  const taskas = zemelapis.latLngToContainerPoint([aikstele.lat, aikstele.lng]);
  const tikslas = L.point(zemelapis.getSize().x / 2, zemelapis.getSize().y * 0.25);
  zemelapis.panBy(taskas.subtract(tikslas));
  piestiAiksteleskortele(aikstele);
}

/* Paspaudus tuščią žemėlapio vietą – kortelė uždaroma */
zemelapis.on("click", uzdarytiKortele);

function uzdarytiKortele() {
  document.getElementById("aiksteles-kortele").innerHTML = "";
  document.querySelectorAll(".aiksteles-zymeklis").forEach((el) => el.classList.remove("pasirinktas"));
}

/* Aikštelės kortelė: atstumas, būklė ir rungtynės šioje aikštelėje */
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
      <div class="atstumo-eilute">📍 ${formatuotiAtstuma(km)} · 🚶 ${laikasPesciomis(km)}</div>
      <div>
        <span class="zyma">⭐ ${String(a.ivertinimas).replace(".", ",")}</span>
        <span class="zyma">Danga: ${a.danga}</span>
        <span class="zyma ${a.bukle === "Puiki" || a.bukle === "Gera" ? "zalia" : ""}">Būklė: ${a.bukle}</span>
        <span class="zyma">${a.apsvietimas ? "💡 Apšviesta" : "Be apšvietimo"}</span>
      </div>
      <h3 class="skyriaus-pavadinimas">Rungtynės (${rungtynes.length})</h3>
      ${rungtyniuHtml}
      <div class="kortele-mygtukai">
        <a class="mygtukas antrinis platus" href="aikstele.html?id=${a.id}">Visa aikštelės informacija</a>
      </div>
    </div>`;
}
