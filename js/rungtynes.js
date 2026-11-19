piestiNavigacija("rungtynes");

const rungtyniuId = gautiParametra("id");
let kiekDalyvaus = 1;

piestiPuslapi();

if (gautiParametra("naujos")) {
  rodytiPranesima("✓ Rungtynės sukurtos! Jos jau matomos kitiems žaidėjams.", { trukme: 5000 });
}

function piestiPuslapi() {
  const r = gautiRungtynes(rungtyniuId);
  const turinys = document.getElementById("rungtyniu-turinys");

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
  const organizatorius = r.organizatorius === "jus" ? { vardas: `${r.organizatoriusVardas} (jūs)` } : gautiZaideja(r.organizatorius);

  turinys.innerHTML = `
    ${miniatiuraHtml(a, "virselis")}
    <div class="rungtyniu-antraste ${r.vyksta ? "vyksta" : ""}">${r.vyksta ? "● Vyksta dabar" : formatuotiLaika(r.pradzia).replace(" ", " · ")}</div>
    <a class="aiksteles-nuoroda" href="aikstele.html?id=${a.id}">${a.pavadinimas} <span aria-hidden="true">›</span></a>

    <div class="info-eilutes">
      <div class="info-eilute"><span class="ikona">${svg("vieta")}</span>
        <span>${a.adresas}, ${MIESTAI[a.miestas].pavadinimas}<br><span class="blankus">${formatuotiAtstuma(r.atstumas)} · ${laikasPesciomis(r.atstumas)}</span></span>
      </div>
      <div class="info-eilute"><span class="ikona">${svg("laikas")}</span>
        <span>${formatuotiLaika(r.pradzia)} · ${r.trukmeMin} min.</span>
      </div>
      <div class="info-eilute"><span class="ikona">${svg("sluoksniai")}</span>
        <span>Danga: ${a.danga.toLowerCase()} · būklė: ${a.bukle.toLowerCase()}${a.apsvietimas ? " · apšviesta" : ""}</span>
      </div>
      <div class="info-eilute"><span class="ikona">${svg("asmuo")}</span>
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
    ${r.pasibaigusi && r.manoKiekis > 0 ? `<p class="blankus vertinimo-pastaba">Rungtynės baigėsi – įvertinkite kitus žaidėjus. Vertinimai ir atvykimas lemia žaidėjų reitingą ir patikimumą.</p>` : ""}
    <div class="kortele">${dalyviuSarasas(r)}</div>

    ${pokalbioHtml(r)}

    <div class="veiksmai">${veiksmuSritis(r)}</div>`;
}

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
    const vertinimas = r.pasibaigusi && r.manoKiekis > 0 ? zvaigzduVertinimas(z) : "";
    html += dalyvisHtml(
      z.vardas.charAt(0),
      z.vardas,
      `${z.amzius} m. · ${LYGIAI[z.lygis]} · ${z.pozicija}<div class="dalyvio-zymos">${reitingoZyma(z)}${patikimumoZyma(z)}</div>${vertinimas}`,
      false
    );
  }
  return html;
}

const ZAIDEJU_VERTINIMU_RAKTAS = "krepsinisVisurZaidejuVertinimai";

function gautiZaidejuVertinimus() {
  try {
    return JSON.parse(localStorage.getItem(ZAIDEJU_VERTINIMU_RAKTAS)) || {};
  } catch (klaida) {
    return {};
  }
}

function zvaigzduVertinimas(z) {
  const mano = (gautiZaidejuVertinimus()[rungtyniuId] || {})[z.id] || 0;
  return `
    <div class="zaidejo-vertinimas" role="group" aria-label="Įvertinkite žaidėją ${z.vardas}">
      ${[1, 2, 3, 4, 5]
        .map((n) => `<button class="${n <= mano ? "uzpildyta" : ""}" onclick="ivertintiZaideja('${z.id}', ${n})" aria-label="${n} iš 5">★</button>`)
        .join("")}
    </div>`;
}

function ivertintiZaideja(zaidejoId, n) {
  const visi = gautiZaidejuVertinimus();
  visi[rungtyniuId] = visi[rungtyniuId] || {};
  visi[rungtyniuId][zaidejoId] = n;
  try {
    localStorage.setItem(ZAIDEJU_VERTINIMU_RAKTAS, JSON.stringify(visi));
  } catch (klaida) {}
  piestiPuslapi();
  rodytiPranesima(`✓ ${gautiZaideja(zaidejoId).vardas} įvertintas: ${n} iš 5`);
}

function dalyvisHtml(raide, vardas, detales, jus) {
  return `
    <div class="dalyvis ${jus ? "jus" : ""}">
      <div class="avataras">${raide}</div>
      <div><div class="vardas">${vardas}</div><div class="detales">${detales}</div></div>
    </div>`;
}

function veiksmuSritis(r) {
  if (r.pasibaigusi) {
    return `<button class="mygtukas antrinis platus" disabled>Rungtynės jau pasibaigė</button>`;
  }

  if (r.organizatorius === "jus") {
    return `
      <div class="dalyvaujate-blokas">
        <div class="dalyvaujate">✓ Jūs organizuojate šias rungtynes</div>
        <button class="mygtukas pavojingas platus" onclick="atsauktiRungtynes()">Atšaukti rungtynes</button>
      </div>`;
  }

  if (r.manoKiekis > 0) {
    const kiti = r.manoKiekis > 1 ? ` (Aš + ${r.manoKiekis - 1})` : "";
    return `
      <div class="dalyvaujate-blokas">
        <div class="dalyvaujate">✓ Jūs dalyvaujate${kiti}</div>
        <button class="mygtukas pavojingas platus" onclick="atsaukti()">Atšaukti dalyvavimą</button>
      </div>`;
  }

  if (r.laisvu === 0) {
    return `<button class="mygtukas antrinis platus" disabled>Vietų nebėra</button>`;
  }

  if (kiekDalyvaus > r.laisvu) kiekDalyvaus = r.laisvu;
  const draugu = kiekDalyvaus - 1;
  return `
    <div class="pasirinkimo-etikete">Kas dalyvaus? <span class="blankus">(laisvų vietų: ${r.laisvu})</span></div>
    <div class="skaiciuokle">
      <button onclick="keistiKieki(-1)" ${draugu === 0 ? "disabled" : ""} aria-label="Vienu draugu mažiau">−</button>
      <div class="skaiciuokles-reiksme">
        <strong>${draugu === 0 ? "Tik aš" : `Aš + ${draugu}`}</strong>
        <span class="blankus">${draugu === 0 ? "Su draugais? Spauskite „+“" : `${zaidejuTekstas(kiekDalyvaus)} iš viso`}</span>
      </div>
      <button onclick="keistiKieki(1)" ${kiekDalyvaus >= r.laisvu ? "disabled" : ""} aria-label="Pridėti draugą">+</button>
    </div>
    <button class="mygtukas platus" onclick="prisijungtiPrieRungtyniu()">
      Prisijungti${kiekDalyvaus > 1 ? ` (${zaidejuTekstas(kiekDalyvaus)})` : ""}
    </button>`;
}

function keistiKieki(pokytis) {
  const r = gautiRungtynes(rungtyniuId);
  kiekDalyvaus = Math.min(r.laisvu, Math.max(1, kiekDalyvaus + pokytis));
  piestiPuslapi();
}

function prisijungtiPrieRungtyniu() {
  if (!gautiNaudotoja()) {
    const atgal = encodeURIComponent(`rungtynes.html?id=${rungtyniuId}`);
    rodytiPranesima("Norėdami dalyvauti, prisijunkite", {
      mygtukas: "Prisijungti",
      veiksmas: () => (window.location.href = `prisijungimas.html?atgal=${atgal}`),
    });
    return;
  }

  registruotisRungtynems(rungtyniuId, kiekDalyvaus);
  const zaideju = zaidejuTekstas(kiekDalyvaus);
  kiekDalyvaus = 1;
  piestiPuslapi();
  rodytiPranesima(`✓ Prisijungėte: ${zaideju}. Priminimą gausite 1 val. prieš rungtynes.`, { trukme: 5000 });
}

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

function atsauktiRungtynes() {
  if (!confirm("Atšaukti šias rungtynes? Visi dalyviai bus informuoti.")) return;
  istrintiSukurtasRungtynes(rungtyniuId);
  window.location.href = "index.html";
}
