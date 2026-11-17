piestiNavigacija("rungtynes");

const kitaValanda = new Date();
kitaValanda.setHours(kitaValanda.getHours() + 1, 0, 0, 0);

const forma = {
  aiksteleId: gautiParametra("aikstele") || artimiausiaAikstele().id,
  diena: kitaValanda.getDate() === new Date().getDate() ? 0 : 1,
  laikas: `${String(kitaValanda.getHours()).padStart(2, "0")}:00`,
  trukme: 90,
  lygis: gautiNaudotoja() ? gautiNaudotoja().lygis : "vidutinis",
  vietu: 10,
  seimoms: false,
  aprasymas: "",
};

const pradineForma = JSON.stringify(forma);

piestiForma();

function arPakeista() {
  return JSON.stringify(forma) !== pradineForma;
}

function arGalimaIseiti() {
  if (!arPakeista()) return true;
  return confirm("Išeiti neišsaugojus? Įvesti rungtynių duomenys bus prarasti.");
}

function atsauktiKurima() {
  if (arGalimaIseiti()) window.location.href = "index.html";
}

function persidengiancios() {
  const pradzia = pradziosData().getTime();
  const pabaiga = pradzia + forma.trukme * 60000;
  return visosRungtynes().filter((r) => {
    if (r.aiksteleId !== forma.aiksteleId) return false;
    const rPradzia = r.pradzia.getTime();
    const rPabaiga = rPradzia + r.trukmeMin * 60000;
    return rPradzia < pabaiga && pradzia < rPabaiga;
  });
}

function artimiausiaAikstele() {
  return AIKSTELES.slice().sort((a, b) => atstumasKm(a) - atstumasKm(b))[0];
}

function piestiForma(klaida = "") {
  const turinys = document.getElementById("kurimo-turinys");

  if (!gautiNaudotoja()) {
    turinys.innerHTML = `
      <div class="tuscia">
        <div class="ikona">🔒</div>
        <p>Norėdami sukurti rungtynes, prisijunkite.</p>
        <p style="margin-top: 12px">
          <a class="mygtukas" href="prisijungimas.html?atgal=${encodeURIComponent("sukurti.html")}">Prisijungti</a>
        </p>
      </div>`;
    return;
  }

  const aiksteles = AIKSTELES.slice().sort((a, b) => atstumasKm(a) - atstumasKm(b));
  const dienos = ["Šiandien", "Rytoj", "Poryt"];

  turinys.innerHTML = `
    <div class="formos-grupe">
      <label for="aikstele">Aikštelė</label>
      <select id="aikstele" onchange="forma.aiksteleId = this.value; piestiForma()">
        ${aiksteles
          .map(
            (a) =>
              `<option value="${a.id}" ${a.id === forma.aiksteleId ? "selected" : ""}>${a.pavadinimas} (${formatuotiAtstuma(atstumasKm(a))})</option>`
          )
          .join("")}
      </select>
      <div class="lauko-pagalba">Artimiausios aikštelės – sąrašo viršuje.</div>
    </div>

    <div class="formos-grupe">
      <span class="formos-etikete">Diena</span>
      <div class="parinktys">
        ${dienos.map((d, i) => parinktis(d, forma.diena === i, `forma.diena = ${i}`)).join("")}
      </div>
    </div>

    <div class="formos-grupe ${klaida ? "su-klaida" : ""}">
      <label for="laikas">Pradžios laikas</label>
      <input id="laikas" type="time" value="${forma.laikas}" step="900" onchange="forma.laikas = this.value; piestiForma()">
      ${klaida ? `<div class="lauko-klaida">${klaida}</div>` : ""}
    </div>

    <div class="formos-grupe">
      <span class="formos-etikete">Trukmė</span>
      <div class="parinktys">
        ${[60, 90, 120].map((t) => parinktis(`${t} min.`, forma.trukme === t, `forma.trukme = ${t}`)).join("")}
      </div>
    </div>

    <div class="formos-grupe">
      <span class="formos-etikete">Žaidėjų lygis</span>
      <div class="parinktys">
        ${Object.entries(LYGIAI).map(([k, t]) => parinktis(t, forma.lygis === k, `forma.lygis = '${k}'`)).join("")}
      </div>
    </div>

    <div class="formos-grupe">
      <span class="formos-etikete">Formatas</span>
      <div class="parinktys">
        ${parinktis("3 prieš 3 (6 žaidėjai)", forma.vietu === 6, "forma.vietu = 6")}
        ${parinktis("5 prieš 5 (10 žaidėjų)", forma.vietu === 10, "forma.vietu = 10")}
      </div>
    </div>

    <div class="formos-grupe">
      <span class="formos-etikete">Kita</span>
      <div class="parinktys">
        ${parinktis("Tinka šeimoms", forma.seimoms, "forma.seimoms = !forma.seimoms")}
      </div>
    </div>

    <div class="formos-grupe">
      <label for="aprasymas">Aprašymas (nebūtina)</label>
      <textarea id="aprasymas" maxlength="120" placeholder="pvz. Žaidžiam iki 21, atsineškite vandens"
        oninput="forma.aprasymas = this.value; document.getElementById('simboliai').textContent = this.value.length">${forma.aprasymas}</textarea>
      <div class="lauko-pagalba"><span id="simboliai">${forma.aprasymas.length}</span> / 120 simbolių</div>
    </div>

    ${persidengimoIspejimas()}

    ${santrauka()}

    <div class="kurimo-mygtukai">
      <button class="mygtukas antrinis" onclick="atsauktiKurima()">Atšaukti</button>
      <button class="mygtukas" onclick="sukurtiRungtynes()">Sukurti rungtynes</button>
    </div>`;
}

function persidengimoIspejimas() {
  const kitos = persidengiancios();
  if (kitos.length === 0) return "";
  const r = kitos[0];
  return `
    <div class="ispejimas" role="alert">
      <strong>Šioje aikštelėje tuo metu jau yra rungtynės</strong>
      <span>${rungtyniuLaikas(r).replace("● ", "")} · ${LYGIAI[r.lygis]} · ${r.laisvu > 0 ? `trūksta ${r.laisvu}` : "pilna"}</span>
      <a href="rungtynes.html?id=${r.id}">Peržiūrėti ir prisijungti ›</a>
    </div>`;
}

function parinktis(tekstas, pasirinkta, veiksmas) {
  return `<button type="button" class="parinktis ${pasirinkta ? "pasirinkta" : ""}" onclick="${veiksmas}; piestiForma()">${tekstas}</button>`;
}

function pradziosData() {
  const [h, m] = forma.laikas.split(":").map(Number);
  const data = new Date();
  data.setDate(data.getDate() + forma.diena);
  data.setHours(h, m, 0, 0);
  return data;
}

function santrauka() {
  const a = gautiAikstele(forma.aiksteleId);
  return `
    <div class="kortele santrauka">
      <div class="eilute"><span>Aikštelė</span><span>${a.pavadinimas}</span></div>
      <div class="eilute"><span>Laikas</span><span>${formatuotiLaika(pradziosData())}, ${forma.trukme} min.</span></div>
      <div class="eilute"><span>Lygis</span><span>${LYGIAI[forma.lygis]}</span></div>
      <div class="eilute"><span>Žaidėjų</span><span>${forma.vietu} (jūs + ${forma.vietu - 1} laisvos vietos)</span></div>
    </div>`;
}

function sukurtiRungtynes() {
  const pradzia = pradziosData();

  if (pradzia.getTime() < Date.now() - 5 * 60000) {
    piestiForma("Šis laikas jau praėjo. Pasirinkite vėlesnį laiką arba kitą dieną.");
    document.getElementById("laikas").focus();
    return;
  }

  const naudotojas = gautiNaudotoja();
  const id = "s" + Date.now();
  const zymos = [forma.vietu === 6 ? "3 prieš 3" : "5 prieš 5"];
  if (forma.seimoms) zymos.push("Šeimoms");

  issaugotiSukurtasRungtynes({
    id: id,
    aiksteleId: forma.aiksteleId,
    pradziaMs: pradzia.getTime(),
    trukmeMin: forma.trukme,
    lygis: forma.lygis,
    vietu: forma.vietu,
    dalyviai: [],
    zymos: zymos,
    organizatorius: "jus",
    organizatoriusVardas: naudotojas.vardas,
    aprasymas: forma.aprasymas.trim() || "Kviečiu prisijungti!",
  });

  registruotisRungtynems(id, 1);
  window.location.href = `rungtynes.html?id=${id}&naujos=1`;
}
