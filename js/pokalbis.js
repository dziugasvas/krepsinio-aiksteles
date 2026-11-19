const POKALBIU_RAKTAS = "krepsinisVisurPokalbiai";

function pavyzdinesZinutes(r) {
  const org = r.organizatorius === "jus" ? null : gautiZaideja(r.organizatorius);
  const kiti = r.dalyviai.filter((id) => id !== r.organizatorius).map(gautiZaideja);
  const zinutes = [];
  const prad = r.pradzia.getTime();
  if (org) zinutes.push({ autorius: org.vardas, tekstas: "Sveiki! Renkamės prie aikštelės 10 min. anksčiau, kad spėtume pasiskirstyti komandomis.", laikas: prad - 180 * 60000 });
  if (kiti[0]) zinutes.push({ autorius: kiti[0].vardas, tekstas: "Ar kas nors turi kamuolį?", laikas: prad - 150 * 60000 });
  if (org) zinutes.push({ autorius: org.vardas, tekstas: "Atsinešiu du, nesijaudinkit 👍", laikas: prad - 145 * 60000 });
  if (kiti[1]) zinutes.push({ autorius: kiti[1].vardas, tekstas: r.zymos.includes("Šeimoms") ? "Atvyksiu su dukra, ar tinka?" : "Būsiu, gal 5 min. vėliau.", laikas: prad - 60 * 60000 });
  if (r.pasibaigusi && kiti[2]) zinutes.push({ autorius: kiti[2].vardas, tekstas: "Ačiū visiems, geras žaidimas! Kitą savaitę kartojam?", laikas: prad + (r.trukmeMin + 10) * 60000 });
  return zinutes.filter((z) => z.laikas < Date.now());
}

function manoZinutes(id) {
  try {
    return (JSON.parse(localStorage.getItem(POKALBIU_RAKTAS)) || {})[id] || [];
  } catch (klaida) {
    return [];
  }
}

function visosZinutes(r) {
  const vardas = gautiNaudotoja() ? gautiNaudotoja().vardas : "";
  return pavyzdinesZinutes(r)
    .concat(manoZinutes(r.id).map((z) => Object.assign({ autorius: vardas, mano: true }, z)))
    .sort((a, b) => a.laikas - b.laikas);
}

function zinutesLaikas(ms) {
  const data = new Date(ms);
  const hh = String(data.getHours()).padStart(2, "0");
  const mm = String(data.getMinutes()).padStart(2, "0");
  return data.toDateString() === new Date().toDateString() ? `${hh}:${mm}` : `${data.getMonth() + 1}-${data.getDate()} ${hh}:${mm}`;
}

function apsaugotiTeksta(t) {
  return t.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function pokalbioHtml(r) {
  const zinutes = visosZinutes(r);
  const dalyvauja = r.manoKiekis > 0 && gautiNaudotoja();

  if (!dalyvauja) {
    return `
      <h2 class="skyriaus-pavadinimas">Pokalbis</h2>
      <div class="kortele pokalbis-uzrakintas">
        ${svg("asmuo")}
        <span>Pokalbį (${daugiskaita(zinutes.length, "žinutė", "žinutės", "žinučių")}) mato tik rungtynių dalyviai. Prisijunkite prie rungtynių, kad galėtumėte rašyti.</span>
      </div>`;
  }

  return `
    <h2 class="skyriaus-pavadinimas">Pokalbis (${zinutes.length})</h2>
    <div class="kortele pokalbis">
      <div class="zinutes" id="zinutes">
        ${
          zinutes.length
            ? zinutes
                .map(
                  (z) => `
            <div class="zinute ${z.mano ? "mano" : ""}">
              ${z.mano ? "" : `<span class="zinutes-autorius">${apsaugotiTeksta(z.autorius)}</span>`}
              <span class="burbulas">${apsaugotiTeksta(z.tekstas)}</span>
              <span class="zinutes-laikas">${zinutesLaikas(z.laikas)}</span>
            </div>`
                )
                .join("")
            : `<p class="blankus">Žinučių dar nėra. Parašykite pirmas!</p>`
        }
      </div>
      ${
        r.pasibaigusi
          ? ""
          : `<form class="zinutes-forma" onsubmit="siustiZinute(event)">
              <input id="zinutes-laukas" type="text" maxlength="300" placeholder="Rašykite žinutę…" aria-label="Žinutė" autocomplete="off">
              <button type="submit" aria-label="Siųsti">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
            </form>`
      }
    </div>`;
}

function siustiZinute(ivykis) {
  ivykis.preventDefault();
  const laukas = document.getElementById("zinutes-laukas");
  const tekstas = laukas.value.trim();
  if (!tekstas) {
    laukas.focus();
    return;
  }
  let visos = {};
  try {
    visos = JSON.parse(localStorage.getItem(POKALBIU_RAKTAS)) || {};
  } catch (klaida) {}
  visos[rungtyniuId] = (visos[rungtyniuId] || []).concat({ tekstas: tekstas, laikas: Date.now() });
  try {
    localStorage.setItem(POKALBIU_RAKTAS, JSON.stringify(visos));
  } catch (klaida) {}
  piestiPuslapi();
  const zinutes = document.getElementById("zinutes");
  if (zinutes) zinutes.scrollTop = zinutes.scrollHeight;
  document.getElementById("zinutes-laukas").focus();
}

window.addEventListener("load", () => {
  const zinutes = document.getElementById("zinutes");
  if (zinutes) zinutes.scrollTop = zinutes.scrollHeight;
});
