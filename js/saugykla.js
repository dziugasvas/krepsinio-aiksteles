const RAKTAS = "krepsinisVisur";

function skaitytiSaugykla() {
  try {
    return JSON.parse(localStorage.getItem(RAKTAS)) || {};
  } catch (klaida) {
    return {};
  }
}

function rasytiSaugykla(duomenys) {
  try {
    localStorage.setItem(RAKTAS, JSON.stringify(duomenys));
  } catch (klaida) {
    console.warn("Nepavyko išsaugoti duomenų", klaida);
  }
}

function gautiNaudotoja() {
  return skaitytiSaugykla().naudotojas || null;
}

function prisijungti(vardas, budas) {
  const d = skaitytiSaugykla();
  d.naudotojas = { vardas: vardas, budas: budas, lygis: "vidutinis" };
  rasytiSaugykla(d);
}

function atsijungti() {
  const d = skaitytiSaugykla();
  delete d.naudotojas;
  try {
    sessionStorage.removeItem("pradziaMatyta");
  } catch (klaida) {}
  rasytiSaugykla(d);
}

function atnaujintiNaudotoja(laukai) {
  const d = skaitytiSaugykla();
  if (!d.naudotojas) return;
  d.naudotojas = Object.assign(d.naudotojas, laukai);
  rasytiSaugykla(d);
}

function arPradziaMatyta() {
  try {
    return sessionStorage.getItem("pradziaMatyta") === "taip";
  } catch (klaida) {
    return true;
  }
}

function pazymetiPradziaMatyta() {
  try {
    sessionStorage.setItem("pradziaMatyta", "taip");
  } catch (klaida) {}
}

function gautiRajona() {
  const r = skaitytiSaugykla().rajonas;
  return RAJONAI[r] ? r : "fabijoniskes";
}

function nustatytiMiesta(miestas) {
  if (RAJONAI[gautiRajona()].miestas !== miestas) nustatytiRajona(MIESTAI[miestas].numatytasRajonas);
}

function nustatytiRajona(rajonas) {
  const d = skaitytiSaugykla();
  d.rajonas = rajonas;
  rasytiSaugykla(d);
}

function gautiDalyvavimus() {
  return skaitytiSaugykla().dalyvavimai || {};
}

function kiekRegistruota(rungtyniuId) {
  return gautiDalyvavimus()[rungtyniuId] || 0;
}

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

function gautiFiltrus() {
  return skaitytiSaugykla().filtrai || { lygis: "visi", laikas: "visi", atstumas: "visi" };
}

function issaugotiFiltrus(filtrai) {
  const d = skaitytiSaugykla();
  d.filtrai = filtrai;
  rasytiSaugykla(d);
}

function pazymetiAiksteleje(aiksteleId) {
  const d = skaitytiSaugykla();
  d.aiksteleje = { aiksteleId: aiksteleId, iki: Date.now() + 2 * 60 * 60000 };
  rasytiSaugykla(d);
}

function gautiBuvimaAiksteleje() {
  const b = skaitytiSaugykla().aiksteleje;
  return b && b.iki > Date.now() ? b.aiksteleId : null;
}

function atsauktiBuvimaAiksteleje() {
  const d = skaitytiSaugykla();
  delete d.aiksteleje;
  rasytiSaugykla(d);
}

function gautiSekamus() {
  return skaitytiSaugykla().sekami || [];
}

function perjungtiSekima(zaidejoId) {
  const d = skaitytiSaugykla();
  const sekami = d.sekami || [];
  d.sekami = sekami.includes(zaidejoId) ? sekami.filter((id) => id !== zaidejoId) : sekami.concat(zaidejoId);
  rasytiSaugykla(d);
  return d.sekami.includes(zaidejoId);
}

function gautiPakvietimus() {
  return skaitytiSaugykla().pakvietimai || {};
}

function issaugotiPakvietima(rungtyniuId, zaidejoId) {
  const d = skaitytiSaugykla();
  d.pakvietimai = d.pakvietimai || {};
  d.pakvietimai[rungtyniuId] = (d.pakvietimai[rungtyniuId] || []).concat(zaidejoId);
  rasytiSaugykla(d);
}

function gautiPranesimuNustatyma() {
  return skaitytiSaugykla().pranesimai !== false;
}

function nustatytiPranesimus(ijungta) {
  const d = skaitytiSaugykla();
  d.pranesimai = ijungta;
  rasytiSaugykla(d);
}

function isvalytiViska() {
  try {
    localStorage.removeItem(RAKTAS);
  } catch (klaida) {}
}
