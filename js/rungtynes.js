/* ==========================================================
   Rungtynių puslapis: informacija, dalyviai, prisijungimas,
   „Aš + 1“ ir dalyvavimo atšaukimas (užduotys 2 ir 3)
   ========================================================== */

piestiNavigacija("rungtynes");

const rungtyniuId = gautiParametra("id");
let kiekDalyvaus = 1; // 1 – „Tik aš“, 2 – „Aš + 1“

piestiPuslapi();

function piestiPuslapi() {
  const r = gautiRungtynes(rungtyniuId);
  const turinys = document.getElementById("rungtyniu-turinys");

  // Klaidos atvejis: neteisinga nuoroda
  if (!r) {
    turinys.innerHTML = `
      <div class="tuscia">
        <div class="ikona">🤷</div>
        <p>Tokių rungtynių neradome.</p>
        <p style="margin-top: 12px"><a class="mygtukas" href="index.html">Grįžti į sąrašą</a></p>
      </div>`;
    return;
  }

  const a = r.aikstele;
  const procentai = Math.round((r.uzimta / r.vietu) * 100);
  const organizatorius = gautiZaideja(r.organizatorius);

  turinys.innerHTML = `
    <div class="rungtyniu-antraste">${rungtyniuLaikas(r)}</div>
    <a class="aiksteles-nuoroda" href="aikstele.html?id=${a.id}">🏀 ${a.pavadinimas} ›</a>

    <div class="info-eilutes">
      <div class="info-eilute"><span class="ikona">📍</span>
        <span>${a.adresas}<br><span class="blankus">${formatuotiAtstuma(r.atstumas)} · ${laikasPesciomis(r.atstumas)}</span></span>
      </div>
      <div class="info-eilute"><span class="ikona">🕒</span>
        <span>${formatuotiLaika(r.pradzia)} · ${r.trukmeMin} min.</span>
      </div>
      <div class="info-eilute"><span class="ikona">🧱</span>
        <span>Danga: ${a.danga.toLowerCase()} · būklė: ${a.bukle.toLowerCase()}${a.apsvietimas ? " · apšviesta" : ""}</span>
      </div>
      <div class="info-eilute"><span class="ikona">👤</span>
        <span>Organizatorius: ${organizatorius.vardas}</span>
      </div>
    </div>

    <div>
      <span class="zyma oranzine">Lygis: ${LYGIAI[r.lygis]}</span>
      ${r.zymos.map((z) => `<span class="zyma">${z}</span>`).join("")}
    </div>
    <p class="aprasymas">„${r.aprasymas}“</p>

    <div class="uzpildymas">
      <div class="juosta"><span style="width: ${procentai}%"></span></div>
      <div class="tekstas">
        <span>${r.uzimta} / ${r.vietu} žaidėjų</span>
        ${r.laisvu > 0 ? `<span class="truksta">Trūksta ${r.laisvu}</span>` : `<span>Pilna</span>`}
      </div>
    </div>

    <h2 class="skyriaus-pavadinimas">Dalyviai (${r.uzimta})</h2>
    <div class="kortele">${dalyviuSarasas(r)}</div>

    <div class="veiksmai">${veiksmuSritis(r)}</div>`;
}

/* Dalyvių sąrašas su lygiu ir amžiumi (FR18) */
function dalyviuSarasas(r) {
  let html = "";
  const naudotojas = gautiNaudotoja();

  if (r.manoKiekis > 0 && naudotojas) {
    html += dalyvisHtml(naudotojas.vardas.charAt(0), `${naudotojas.vardas} (jūs)`, `Lygis: ${LYGIAI[naudotojas.lygis]}`, true);
    for (let i = 1; i < r.manoKiekis; i++) {
      html += dalyvisHtml("+", `${naudotojas.vardas} +${i}`, "Registruota per jūsų paskyrą", true);
    }
  }

  for (const id of r.dalyviai) {
    const z = gautiZaideja(id);
    html += dalyvisHtml(z.vardas.charAt(0), z.vardas, `${z.amzius} m. · ${LYGIAI[z.lygis]} · ${z.pozicija}`, false);
  }
  return html;
}

function dalyvisHtml(raide, vardas, detales, jus) {
  return `
    <div class="dalyvis ${jus ? "jus" : ""}">
      <div class="avataras">${raide}</div>
      <div><div class="vardas">${vardas}</div><div class="detales">${detales}</div></div>
    </div>`;
}

/* Apatinė sritis: prisijungimas / dalyvavimas / pilna */
function veiksmuSritis(r) {
  // Jau dalyvauja
  if (r.manoKiekis > 0) {
    const kiti = r.manoKiekis > 1 ? " (Aš + 1)" : "";
    return `
      <div class="dalyvaujate-blokas">
        <div class="dalyvaujate">✓ Jūs dalyvaujate${kiti}</div>
        <button class="mygtukas pavojingas platus" onclick="atsaukti()">Atšaukti dalyvavimą</button>
      </div>`;
  }

  // Vietų nebėra
  if (r.laisvu === 0) {
    return `<button class="mygtukas antrinis platus" disabled>Vietų nebėra</button>`;
  }

  // Galima prisijungti: pasirinkimas „Tik aš“ / „Aš + 1“ (FR15)
  if (kiekDalyvaus > r.laisvu) kiekDalyvaus = 1;
  return `
    <div class="pasirinkimo-etikete">Kas dalyvaus?</div>
    <div class="pasirinkimas">
      <button class="${kiekDalyvaus === 1 ? "pasirinktas" : ""}" onclick="pasirinktiKieki(1)">Tik aš</button>
      <button class="${kiekDalyvaus === 2 ? "pasirinktas" : ""}" onclick="pasirinktiKieki(2)" ${r.laisvu < 2 ? "disabled" : ""}>Aš + 1</button>
    </div>
    <button class="mygtukas platus" onclick="prisijungtiPrieRungtyniu()">
      Prisijungti${kiekDalyvaus > 1 ? ` (${kiekDalyvaus} žaidėjai)` : ""}
    </button>`;
}

function pasirinktiKieki(kiekis) {
  kiekDalyvaus = kiekis;
  piestiPuslapi();
}

function prisijungtiPrieRungtyniu() {
  // Svečias – nukreipiame prisijungti ir grąžiname atgal į šias rungtynes
  if (!gautiNaudotoja()) {
    const atgal = encodeURIComponent(`rungtynes.html?id=${rungtyniuId}`);
    rodytiPranesima("Norėdami dalyvauti, prisijunkite", {
      mygtukas: "Prisijungti",
      veiksmas: () => (window.location.href = `prisijungimas.html?atgal=${atgal}`),
    });
    return;
  }

  registruotisRungtynems(rungtyniuId, kiekDalyvaus);
  const zaideju = kiekDalyvaus === 1 ? "1 žaidėjas" : `${kiekDalyvaus} žaidėjai`;
  kiekDalyvaus = 1;
  piestiPuslapi();
  rodytiPranesima(`✓ Prisijungėte: ${zaideju}. Priminimą gausite 1 val. prieš rungtynes.`, { trukme: 5000 });
}

/* Atšaukimas su galimybe grąžinti (klaidos atitaisymas) */
function atsaukti() {
  const buvo = kiekRegistruota(rungtyniuId);
  atsauktiDalyvavima(rungtyniuId);
  piestiPuslapi();
  rodytiPranesima("Dalyvavimas atšauktas", {
    mygtukas: "Grąžinti",
    veiksmas: () => {
      registruotisRungtynems(rungtyniuId, buvo);
      piestiPuslapi();
      rodytiPranesima("✓ Dalyvavimas grąžintas");
    },
    trukme: 6000,
  });
}
