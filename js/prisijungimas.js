const atgal = gautiParametra("atgal") || "index.html";
let registracija = false;

document.getElementById("atgal").href = atgal;
document.getElementById("be-prisijungimo").href = atgal;

if (gautiNaudotoja()) {
  window.location.replace(atgal);
}

function prisijungtiPer(budas) {
  prisijungti(budas === "Google" ? "Kevinas" : "Skirmantas", budas);
  grizti();
}

function pateiktiForma(ivykis) {
  ivykis.preventDefault();
  isvalytiKlaidas();

  const vardas = document.getElementById("vardas").value.trim();
  const pastas = document.getElementById("pastas").value.trim();
  const slaptazodis = document.getElementById("slaptazodis").value;
  let geras = true;

  if (registracija && vardas.length < 2) {
    rodytiKlaida("vardas", "Įveskite vardą (bent 2 raidės).");
    geras = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pastas)) {
    rodytiKlaida("pastas", "Neteisingas el. pašto adresas, pvz. vardas@pastas.lt");
    geras = false;
  }
  if (slaptazodis.length < 6) {
    rodytiKlaida("slaptazodis", "Slaptažodis turi būti bent 6 simbolių.");
    geras = false;
  }
  if (!geras) return;

  const rodomasVardas = registracija ? vardas : pastas.split("@")[0];
  prisijungti(rodomasVardas.charAt(0).toUpperCase() + rodomasVardas.slice(1), "El. paštas");
  grizti();
}

function grizti() {
  window.location.href = atgal;
}

function perjungtiRezima() {
  registracija = !registracija;
  isvalytiKlaidas();
  document.getElementById("vardo-laukas").hidden = !registracija;
  document.getElementById("pamirsau").hidden = registracija;
  document.getElementById("pateikti").textContent = registracija ? "Sukurti paskyrą" : "Prisijungti";
  document.getElementById("pavadinimas").textContent = registracija ? "Registracija" : "Prisijunkite";
  document.getElementById("perjungimo-tekstas").textContent = registracija ? "Jau turite paskyrą?" : "Neturite paskyros?";
  document.getElementById("perjungimo-mygtukas").textContent = registracija ? "Prisijungti" : "Registruotis";
  document.getElementById("slaptazodis").autocomplete = registracija ? "new-password" : "current-password";
}

function atkurtiSlaptazodi() {
  isvalytiKlaidas();
  const pastas = document.getElementById("pastas").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pastas)) {
    rodytiKlaida("pastas", "Įveskite el. paštą, kuriuo registravotės – atsiųsime atkūrimo nuorodą.");
    document.getElementById("pastas").focus();
    return;
  }
  rodytiPranesima(`Atkūrimo nuoroda išsiųsta į ${pastas}`);
}

function rodytiSlaptazodi() {
  const laukas = document.getElementById("slaptazodis");
  const rodo = laukas.type === "text";
  laukas.type = rodo ? "password" : "text";
  document.getElementById("rodyti-mygtukas").textContent = rodo ? "Rodyti" : "Slėpti";
}

function rodytiKlaida(lauko, tekstas) {
  document.getElementById(`${lauko}-klaida`).textContent = tekstas;
  document.getElementById(lauko).closest(".laukas").classList.add("su-klaida");
}

function isvalytiKlaidas() {
  document.querySelectorAll(".klaidos-tekstas").forEach((el) => (el.textContent = ""));
  document.querySelectorAll(".laukas").forEach((el) => el.classList.remove("su-klaida"));
}
