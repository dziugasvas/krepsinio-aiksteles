/* ==========================================================
   Žemėlapio ekranas – aikštelės aplink naudotoją (3 užduotis – Vidas)
   ========================================================== */

piestiNavigacija("zemelapis");

const vieta = RAJONAI[gautiRajona()];

/* Sukuriamas žemėlapis, centruotas į naudotojo vietą */
const zemelapis = L.map("zemelapis", { zoomControl: false }).setView([vieta.lat, vieta.lng], 13);

/* Tamsus žemėlapio fonas (CARTO), kad derėtų prie programėlės dizaino */
L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; OpenStreetMap, &copy; CARTO',
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

/* Paspaudus žymeklį – jis paryškinamas (kortelė atsiras 2d žingsnyje) */
function pasirinktiAikstele(id) {
  document.querySelectorAll(".aiksteles-zymeklis").forEach((el) => {
    el.classList.toggle("pasirinktas", el.dataset.id === id);
  });
  const aikstele = gautiAikstele(id);
  zemelapis.panTo([aikstele.lat, aikstele.lng]);
}
