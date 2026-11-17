/* ==========================================================
   Aikštelės profilis: danga, būklė, įvertinimai, rungtynės (FR8, FR11)
   ========================================================== */

piestiNavigacija("zemelapis");

const aiksteleId = gautiParametra("id");
const VERTINIMU_RAKTAS = "krepsinisVisurVertinimai"; // atskiras raktas, kad nekeistume bendros saugyklos

piestiAikstele();

function piestiAikstele() {
  const a = gautiAikstele(aiksteleId);
  const turinys = document.getElementById("aiksteles-turinys");

  if (!a) {
    turinys.innerHTML = `
      <div class="tuscia">
        <div class="ikona">🤷</div>
        <p>Tokios aikštelės neradome.</p>
        <p style="margin-top: 12px"><a class="mygtukas" href="zemelapis.html">Grįžti į žemėlapį</a></p>
      </div>`;
    return;
  }

  const km = atstumasKm(a);
  const manoIvertinimas = gautiManoIvertinima(a.id);
  const rungtynes = visosRungtynes()
    .filter((r) => r.aiksteleId === a.id)
    .sort((x, y) => x.pradziaPoMin - y.pradziaPoMin);
  const marsrutas = `https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}&travelmode=walking`;

  turinys.innerHTML = `
    ${miniatiuraHtml(a, "virselis")}

    <div class="aiksteles-vardas">${a.pavadinimas}</div>
    <div class="adresas">${ik("vieta")}${a.adresas}, ${MIESTAI[a.miestas].pavadinimas} · ${formatuotiAtstuma(km)} · ${laikasPesciomis(km)}</div>

    <div class="ivertinimo-eilute">
      <span class="zvaigzdes">${zvaigzdes(a.ivertinimas)}</span>
      <strong>${String(a.ivertinimas).replace(".", ",")}</strong>
      <span class="blankus">(${a.atsiliepimai} įvertinimai)</span>
    </div>

    <div class="uzimtumo-kortele ${zaidejuAiksteleje(a) === 0 ? "laisva" : ""}">
      <div>${ik("zmones")}<strong>${uzimtumoTekstas(a)}</strong></div>
      ${buvimoMygtukas(a)}
    </div>

    <div class="info-tinklelis">
      ${langelis("Danga", a.danga)}
      ${langelis("Būklė", a.bukle, a.bukle === "Puiki" || a.bukle === "Gera" ? "gera" : "vidutine")}
      ${langelis("Apšvietimas", a.apsvietimas ? "Yra" : "Nėra")}
      ${langelis("Lankų skaičius", a.lankai)}
    </div>

    <div class="mygtuku-eile">
      <a class="mygtukas antrinis" href="${marsrutas}" target="_blank" rel="noopener">${svg("kompasas", 'width="18" height="18"')} Maršrutas</a>
      <a class="mygtukas antrinis" href="zemelapis.html">${svg("zemelapis", 'width="18" height="18"')} Žemėlapyje</a>
    </div>

    <h2 class="skyriaus-pavadinimas">Rungtynės šioje aikštelėje (${rungtynes.length})</h2>
    ${
      rungtynes.length
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
        : `<p class="blankus">Suplanuotų rungtynių šioje aikštelėje nėra.</p>`
    }

    <h2 class="skyriaus-pavadinimas">Jūsų įvertinimas</h2>
    <div class="kortele">
      <div class="blankus">${manoIvertinimas ? "Ačiū! Įvertinimą galite pakeisti." : "Įvertinkite aikštelės būklę:"}</div>
      <div class="vertinimas">
        ${[1, 2, 3, 4, 5]
          .map(
            (n) =>
              `<button class="${n <= manoIvertinimas ? "uzpildyta" : ""}" onclick="ivertinti(${n})" aria-label="${n} iš 5">★</button>`
          )
          .join("")}
      </div>
    </div>

    <h2 class="skyriaus-pavadinimas">Atsiliepimai</h2>
    <div class="kortele">${atsiliepimai(a)}</div>`;
}

function langelis(etikete, reiksme, klase = "") {
  return `<div class="info-langelis"><div class="etikete">${etikete}</div><div class="reiksme ${klase}">${reiksme}</div></div>`;
}

function zvaigzdes(ivertinimas) {
  const pilnos = Math.round(ivertinimas);
  return "★".repeat(pilnos) + "☆".repeat(5 - pilnos);
}

/* Pavyzdiniai atsiliepimai pagal aikštelės būklę */
function atsiliepimai(a) {
  const geri = [
    { autorius: "Domas", zvaigzdes: 5, tekstas: "Puiki guminė danga, nauji lankai. Vakarais apšviesta." },
    { autorius: "Rasa", zvaigzdes: 4, tekstas: "Saugu žaisti su vaikais, šalia suoliukai." },
  ];
  const vidutiniai = [
    { autorius: "Tadas", zvaigzdes: 3, tekstas: "Asfaltas vietomis įtrūkęs, bet žaisti galima." },
    { autorius: "Matas", zvaigzdes: 4, tekstas: "Vakarais susirenka nemažai žmonių." },
  ];
  const sarasas = a.bukle === "Puiki" || a.bukle === "Gera" ? geri : vidutiniai;
  return sarasas
    .map(
      (s) => `
      <div class="atsiliepimas">
        <span class="autorius">${s.autorius}</span>
        <span class="zvaigzdes">${"★".repeat(s.zvaigzdes)}</span>
        <p>${s.tekstas}</p>
      </div>`
    )
    .join("");
}

/* ---------- Naudotojo įvertinimas (FR11) ---------- */
function gautiManoIvertinima(id) {
  try {
    return (JSON.parse(localStorage.getItem(VERTINIMU_RAKTAS)) || {})[id] || 0;
  } catch (klaida) {
    return 0;
  }
}

function ivertinti(n) {
  if (!gautiNaudotoja()) {
    const atgal = encodeURIComponent(`aikstele.html?id=${aiksteleId}`);
    rodytiPranesima("Norėdami vertinti, prisijunkite", {
      mygtukas: "Prisijungti",
      veiksmas: () => (window.location.href = `prisijungimas.html?atgal=${atgal}`),
    });
    return;
  }
  try {
    const visi = JSON.parse(localStorage.getItem(VERTINIMU_RAKTAS)) || {};
    visi[aiksteleId] = n;
    localStorage.setItem(VERTINIMU_RAKTAS, JSON.stringify(visi));
  } catch (klaida) {}
  piestiAikstele();
  rodytiPranesima(`✓ Ačiū! Įvertinote ${n} iš 5`);
}

/* ---------- „Esu aikštelėje“ (FR10) – kiti mato, kad aikštelėje žaidžiama ---------- */
function buvimoMygtukas(a) {
  if (gautiBuvimaAiksteleje() === a.id) {
    return `<div class="blankus" style="margin-top: 6px">✓ Pažymėjote, kad esate čia (galioja 2 val.)</div>
      <button class="mygtukas antrinis platus" style="margin-top: 8px" onclick="iseiti()">Išeinu iš aikštelės</button>`;
  }
  return `<button class="mygtukas antrinis platus" style="margin-top: 8px" onclick="esuCia()">${svg("vieta", 'width="18" height="18"')} Esu aikštelėje</button>`;
}

function esuCia() {
  if (!gautiNaudotoja()) {
    const atgal = encodeURIComponent(`aikstele.html?id=${aiksteleId}`);
    rodytiPranesima("Norėdami pažymėti, prisijunkite", {
      mygtukas: "Prisijungti",
      veiksmas: () => (window.location.href = `prisijungimas.html?atgal=${atgal}`),
    });
    return;
  }
  const buvusi = gautiBuvimaAiksteleje();
  pazymetiAiksteleje(aiksteleId);
  piestiAikstele();
  rodytiPranesima("✓ Pažymėta: esate šioje aikštelėje", {
    mygtukas: "Atšaukti",
    veiksmas: () => {
      if (buvusi) pazymetiAiksteleje(buvusi);
      else atsauktiBuvimaAiksteleje();
      piestiAikstele();
    },
  });
}

function iseiti() {
  atsauktiBuvimaAiksteleje();
  piestiAikstele();
  rodytiPranesima("Pažymėjimas pašalintas");
}
