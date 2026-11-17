/* ==========================================================
   Krepšinis Visur – prototipo duomenys
   Backendo nėra, todėl visi duomenys surašyti čia.
   Aikštelių vietos apytikslės, žaidėjai išgalvoti.
   ========================================================== */

/* ---------- Rajonai (imituoja GPS vietą) ----------
   Naudotojas profilyje gali pasirinkti, kur „yra“.
   Pagal tai skaičiuojami atstumai iki aikštelių. */
const RAJONAI = {
  fabijoniskes: { pavadinimas: "Fabijoniškės", lat: 54.7275, lng: 25.2440 },
  senamiestis: { pavadinimas: "Senamiestis", lat: 54.6825, lng: 25.2870 },
  zirmunai: { pavadinimas: "Žirmūnai", lat: 54.7055, lng: 25.2965 },
};

/* ---------- Aikštelės ---------- */
const AIKSTELES = [
  {
    id: "a1",
    pavadinimas: "Baltojo tilto aikštelė",
    adresas: "Upės g., Šnipiškės",
    lat: 54.6937, lng: 25.2747,
    danga: "Guminė", bukle: "Puiki", apsvietimas: true, lankai: 4,
    ivertinimas: 4.7, atsiliepimai: 38,
    nuotrauka: "🏟️",
  },
  {
    id: "a2",
    pavadinimas: "Fabijoniškių parko aikštelė",
    adresas: "S. Stanevičiaus g., Fabijoniškės",
    lat: 54.7318, lng: 25.2468,
    danga: "Asfaltas", bukle: "Vidutinė", apsvietimas: false, lankai: 2,
    ivertinimas: 3.4, atsiliepimai: 12,
    nuotrauka: "🏀",
  },
  {
    id: "a3",
    pavadinimas: "Pašilaičių aikštelė",
    adresas: "Gabijos g., Pašilaičiai",
    lat: 54.7290, lng: 25.2310,
    danga: "Guminė", bukle: "Gera", apsvietimas: true, lankai: 2,
    ivertinimas: 4.2, atsiliepimai: 21,
    nuotrauka: "🏀",
  },
  {
    id: "a4",
    pavadinimas: "Vingio parko aikštelė",
    adresas: "M. K. Čiurlionio g., Vingio parkas",
    lat: 54.6835, lng: 25.2395,
    danga: "Guminė", bukle: "Puiki", apsvietimas: true, lankai: 4,
    ivertinimas: 4.8, atsiliepimai: 54,
    nuotrauka: "🏟️",
  },
  {
    id: "a5",
    pavadinimas: "Senamiesčio mokyklos aikštelė",
    adresas: "Pylimo g., Senamiestis",
    lat: 54.6800, lng: 25.2810,
    danga: "Guminė", bukle: "Gera", apsvietimas: true, lankai: 2,
    ivertinimas: 4.1, atsiliepimai: 17,
    nuotrauka: "🏀",
  },
  {
    id: "a6",
    pavadinimas: "Užupio kiemo aikštelė",
    adresas: "Paupio g., Užupis",
    lat: 54.6795, lng: 25.2985,
    danga: "Asfaltas", bukle: "Vidutinė", apsvietimas: false, lankai: 1,
    ivertinimas: 3.6, atsiliepimai: 9,
    nuotrauka: "🏀",
  },
  {
    id: "a7",
    pavadinimas: "Žirmūnų aikštelė",
    adresas: "Kalvarijų g., Žirmūnai",
    lat: 54.7085, lng: 25.2930,
    danga: "Asfaltas", bukle: "Gera", apsvietimas: true, lankai: 2,
    ivertinimas: 4.0, atsiliepimai: 15,
    nuotrauka: "🏀",
  },
  {
    id: "a8",
    pavadinimas: "Antakalnio aikštelė",
    adresas: "Antakalnio g., Antakalnis",
    lat: 54.6990, lng: 25.3150,
    danga: "Guminė", bukle: "Gera", apsvietimas: false, lankai: 2,
    ivertinimas: 3.9, atsiliepimai: 11,
    nuotrauka: "🏀",
  },
];

/* ---------- Žaidėjai ---------- */
const ZAIDEJAI = [
  { id: "z1", vardas: "Tadas", amzius: 19, lygis: "vidutinis", pozicija: "Gynėjas" },
  { id: "z2", vardas: "Lukas", amzius: 17, lygis: "vidutinis", pozicija: "Puolėjas" },
  { id: "z3", vardas: "Matas", amzius: 22, lygis: "pradedantysis", pozicija: "Gynėjas" },
  { id: "z4", vardas: "Rokas", amzius: 18, lygis: "vidutinis", pozicija: "Centras" },
  { id: "z5", vardas: "Domas", amzius: 31, lygis: "aukštas", pozicija: "Gynėjas" },
  { id: "z6", vardas: "Paulius", amzius: 27, lygis: "aukštas", pozicija: "Puolėjas" },
  { id: "z7", vardas: "Andrius", amzius: 34, lygis: "aukštas", pozicija: "Centras" },
  { id: "z8", vardas: "Ignas", amzius: 25, lygis: "aukštas", pozicija: "Puolėjas" },
  { id: "z9", vardas: "Mantas", amzius: 29, lygis: "aukštas", pozicija: "Gynėjas" },
  { id: "z10", vardas: "Giedrius", amzius: 44, lygis: "vidutinis", pozicija: "Puolėjas" },
  { id: "z11", vardas: "Jonas (12 m.)", amzius: 12, lygis: "pradedantysis", pozicija: "Gynėjas" },
  { id: "z12", vardas: "Rasa", amzius: 41, lygis: "vidutinis", pozicija: "Gynėja" },
  { id: "z13", vardas: "Emilija (11 m.)", amzius: 11, lygis: "pradedantysis", pozicija: "Puolėja" },
  { id: "z14", vardas: "Karolis", amzius: 20, lygis: "pradedantysis", pozicija: "Centras" },
  { id: "z15", vardas: "Simas", amzius: 23, lygis: "vidutinis", pozicija: "Gynėjas" },
  { id: "z16", vardas: "Vytautas", amzius: 38, lygis: "aukštas", pozicija: "Centras" },
];

/* ---------- Rungtynės ----------
   Laikas nurodomas minutėmis nuo „dabar“ (pradziaPoMin),
   kad prototipe rungtynės visada būtų šiandien / artimiausiomis dienomis.
   Neigiamas skaičius = rungtynės jau vyksta. */
const RUNGTYNES = [
  {
    id: "r1", aiksteleId: "a2", pradziaPoMin: -15, trukmeMin: 90,
    lygis: "vidutinis", vietu: 6, dalyviai: ["z1", "z2", "z4", "z15", "z3"],
    zymos: ["3 prieš 3"], organizatorius: "z1",
    aprasymas: "Žaidžiam 3 prieš 3 iki 21. Ateik, trūksta vieno!",
  },
  {
    id: "r2", aiksteleId: "a3", pradziaPoMin: 40, trukmeMin: 90,
    lygis: "pradedantysis", vietu: 10, dalyviai: ["z3", "z14", "z11"],
    zymos: ["5 prieš 5"], organizatorius: "z14",
    aprasymas: "Ramus žaidimas, kviečiami visi.",
  },
  {
    id: "r3", aiksteleId: "a1", pradziaPoMin: 240, trukmeMin: 120,
    lygis: "aukštas", vietu: 10, dalyviai: ["z5", "z6", "z7", "z8", "z9", "z16", "z4", "z15", "z10"],
    zymos: ["5 prieš 5"], organizatorius: "z5",
    aprasymas: "Rimtas žaidimas, buvę klubiniai žaidėjai. Trūksta vieno.",
  },
  {
    id: "r4", aiksteleId: "a4", pradziaPoMin: 300, trukmeMin: 120,
    lygis: "aukštas", vietu: 10, dalyviai: ["z6", "z8", "z16", "z5", "z7", "z9"],
    zymos: ["5 prieš 5"], organizatorius: "z8",
    aprasymas: "Kokybiškas žaidimas Vingio parke.",
  },
  {
    id: "r5", aiksteleId: "a5", pradziaPoMin: 180, trukmeMin: 90,
    lygis: "pradedantysis", vietu: 10, dalyviai: ["z10", "z11", "z12", "z13", "z2", "z3"],
    zymos: ["5 prieš 5", "Šeimoms"], organizatorius: "z12",
    aprasymas: "Tėvai su vaikais, draugiškas žaidimas. Laukiam šeimų!",
  },
  {
    id: "r6", aiksteleId: "a7", pradziaPoMin: 90, trukmeMin: 90,
    lygis: "vidutinis", vietu: 6, dalyviai: ["z15", "z4"],
    zymos: ["3 prieš 3"], organizatorius: "z15",
    aprasymas: "Po darbo 3x3.",
  },
  {
    id: "r7", aiksteleId: "a6", pradziaPoMin: 1500, trukmeMin: 90,
    lygis: "vidutinis", vietu: 10, dalyviai: ["z10", "z12", "z13"],
    zymos: ["5 prieš 5", "Šeimoms"], organizatorius: "z10",
    aprasymas: "Rytoj, Užupyje. Įvairaus amžiaus.",
  },
];
