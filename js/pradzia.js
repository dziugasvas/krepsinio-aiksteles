/* ==========================================================
   Pradžios ekranas: „Prisijungti“ arba „Tęsti be prisijungimo“
   ========================================================== */

/* Prisijungęs naudotojas pradžios ekrano nemato */
if (gautiNaudotoja()) {
  window.location.replace("index.html");
}

/* Svečias gali naršyti aikšteles ir rungtynes (FR4),
   prisijungti reikės tik norint dalyvauti */
function testiKaipSvecias() {
  pazymetiPradziaMatyta();
  window.location.href = "index.html";
}
