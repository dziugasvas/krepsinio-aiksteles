/* ==========================================================
   Krepšinis Visur – duomenų saugykla naršyklėje (localStorage)
   Backendo nėra, todėl naudotojo veiksmai (prisijungimas,
   dalyvavimas rungtynėse, nustatymai) saugomi naršyklėje.
   ========================================================== */

const RAKTAS = "krepsinisVisur";

/* Nuskaito visus išsaugotus duomenis (arba tuščią objektą) */
function skaitytiSaugykla() {
  try {
    return JSON.parse(localStorage.getItem(RAKTAS)) || {};
  } catch (klaida) {
    return {};
  }
}

/* Įrašo visus duomenis atgal */
function rasytiSaugykla(duomenys) {
  try {
    localStorage.setItem(RAKTAS, JSON.stringify(duomenys));
  } catch (klaida) {
    console.warn("Nepavyko išsaugoti duomenų", klaida);
  }
}

/* ---------- Naudotojas ---------- */

/* Grąžina prisijungusį naudotoją arba null (svečias) */
function gautiNaudotoja() {
  return skaitytiSaugykla().naudotojas || null;
}

/* Imituoja prisijungimą (tikros paskyros nėra) */
function prisijungti(vardas, budas) {
  const d = skaitytiSaugykla();
  d.naudotojas = { vardas: vardas, budas: budas, lygis: "vidutinis" };
  rasytiSaugykla(d);
}

function atsijungti() {
  const d = skaitytiSaugykla();
  delete d.naudotojas;
  rasytiSaugykla(d);
}

/* Profilio laukų atnaujinimas, pvz. atnaujintiNaudotoja({ lygis: "aukštas" }) */
function atnaujintiNaudotoja(laukai) {
  const d = skaitytiSaugykla();
  if (!d.naudotojas) return;
  d.naudotojas = Object.assign(d.naudotojas, laukai);
  rasytiSaugykla(d);
}

/* ---------- Vieta (rajonas vietoje GPS) ---------- */

function gautiRajona() {
  return skaitytiSaugykla().rajonas || "fabijoniskes";
}

function nustatytiRajona(rajonas) {
  const d = skaitytiSaugykla();
  d.rajonas = rajonas;
  rasytiSaugykla(d);
}

/* ---------- Dalyvavimas rungtynėse ----------
   Saugoma kaip { rungtyniuId: kiekZmoniu }, pvz. { r3: 1, r5: 2 } */

function gautiDalyvavimus() {
  return skaitytiSaugykla().dalyvavimai || {};
}

/* Kiek žmonių naudotojas užregistravo (0 – nedalyvauja) */
function kiekRegistruota(rungtyniuId) {
  return gautiDalyvavimus()[rungtyniuId] || 0;
}

/* kiekis: 1 – „Tik aš“, 2 – „Aš + 1“ ir t. t. */
function registruotisRungtynems(rungtyniuId, kiekis) {
  const d = skaitytiSaugykla();
  d.dalyvavimai = d.dalyvavimai || {};
  d.dalyvavimai[rungtyniuId] = kiekis;
  rasytiSaugykla(d);
}

function atsauktiDalyvavima(rungtyniuId) {
  const d = skaitytiSaugykla();
  if (d.dalyvavimai) delete d.dalyvavimai[rungtyniuId];
  rasytiSaugykla(d);
}

/* ---------- Naudotojo sukurtos rungtynės (FR17) ---------- */

function gautiSukurtasRungtynes() {
  return skaitytiSaugykla().sukurtos || [];
}

function issaugotiSukurtasRungtynes(rungtynes) {
  const d = skaitytiSaugykla();
  d.sukurtos = d.sukurtos || [];
  d.sukurtos.push(rungtynes);
  rasytiSaugykla(d);
}

function istrintiSukurtasRungtynes(id) {
  const d = skaitytiSaugykla();
  d.sukurtos = (d.sukurtos || []).filter((r) => r.id !== id);
  if (d.dalyvavimai) delete d.dalyvavimai[id];
  rasytiSaugykla(d);
}

/* ---------- Filtrai (kad nereikėtų kaskart rinktis iš naujo) ---------- */

function gautiFiltrus() {
  return skaitytiSaugykla().filtrai || { lygis: "visi", laikas: "visi", atstumas: "visi" };
}

function issaugotiFiltrus(filtrai) {
  const d = skaitytiSaugykla();
  d.filtrai = filtrai;
  rasytiSaugykla(d);
}

/* ---------- „Esu aikštelėje“ (FR10) – galioja 2 valandas ---------- */

function pazymetiAiksteleje(aiksteleId) {
  const d = skaitytiSaugykla();
  d.aiksteleje = { aiksteleId: aiksteleId, iki: Date.now() + 2 * 60 * 60000 };
  rasytiSaugykla(d);
}

/* Grąžina aikštelės id, kurioje naudotojas pažymėjo esantis (arba null) */
function gautiBuvimaAiksteleje() {
  const b = skaitytiSaugykla().aiksteleje;
  return b && b.iki > Date.now() ? b.aiksteleId : null;
}

function atsauktiBuvimaAiksteleje() {
  const d = skaitytiSaugykla();
  delete d.aiksteleje;
  rasytiSaugykla(d);
}

/* ---------- Pranešimai apie netoliese ieškomus žaidėjus (FR21) ---------- */

function gautiPranesimuNustatyma() {
  return skaitytiSaugykla().pranesimai !== false; // numatyta – įjungta
}

function nustatytiPranesimus(ijungta) {
  const d = skaitytiSaugykla();
  d.pranesimai = ijungta;
  rasytiSaugykla(d);
}

/* ---------- Visko išvalymas (naudinga testuojant) ---------- */
function isvalytiViska() {
  try {
    localStorage.removeItem(RAKTAS);
  } catch (klaida) {}
}
