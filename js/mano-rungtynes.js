piestiNavigacija("mano");
piestiVirsu("Mano rungtynės", { nuoroda: "sukurti.html", tekstas: "Sukurti" });

let skirtukas = "busimos";
rodytiSkirtuka("busimos");

function rodytiSkirtuka(kuris) {
  skirtukas = kuris;
  document.getElementById("skirtukas-busimos").classList.toggle("aktyvus", kuris === "busimos");
  document.getElementById("skirtukas-praejusios").classList.toggle("aktyvus", kuris === "praejusios");
  document.getElementById("skirtukas-busimos").setAttribute("aria-selected", kuris === "busimos");
  document.getElementById("skirtukas-praejusios").setAttribute("aria-selected", kuris === "praejusios");
  piestiSarasa();
}

function piestiSarasa() {
  const el = document.getElementById("mano-sarasas");

  if (!gautiNaudotoja()) {
    el.innerHTML = `
      <div class="tuscia">
        <div class="ikona">🏀</div>
        <p>Prisijunkite, kad matytumėte savo rungtynes.</p>
        <p style="margin-top: 14px"><a class="mygtukas" href="prisijungimas.html?atgal=mano-rungtynes.html">Prisijungti</a></p>
      </div>`;
    return;
  }

  const mano = visosRungtynesSuPasibaigusiomis().filter((r) => r.manoKiekis > 0);

  const praejusi = (r) => r.pradziaPoMin + r.trukmeMin < 0;
  const sarasas = mano
    .filter((r) => (skirtukas === "busimos" ? !praejusi(r) : praejusi(r)))
    .sort((a, b) => a.pradziaPoMin - b.pradziaPoMin);

  if (sarasas.length === 0) {
    el.innerHTML =
      skirtukas === "busimos"
        ? `<div class="tuscia">
            <div class="ikona">🏀</div>
            <p>Dar neprisijungėte prie jokių rungtynių.</p>
            <p style="margin-top: 14px"><a class="mygtukas" href="index.html">Rasti rungtynes</a></p>
          </div>`
        : `<div class="tuscia"><div class="ikona">🕓</div><p>Praėjusių rungtynių dar nėra.</p></div>`;
    return;
  }

  el.innerHTML = sarasas
    .map((r) => {
      const busena =
        r.organizatorius === "jus"
          ? `<span class="pill dalyvauja">✓ Organizuojate</span>`
          : `<span class="pill dalyvauja">✓ Dalyvaujate${r.manoKiekis > 1 ? ` +${r.manoKiekis - 1}` : ""}</span>`;
      return rungtyniuKorteleHtml(r, busena);
    })
    .join("");
}
