# Krepšinis Visur

Mobilios programėlės prototipas, padedantis rasti krepšinio aikšteles ir žaidėjus didžiausiuose Lietuvos miestuose.

**Išbandyti:** https://dziugasvas.github.io/krepsinio-aiksteles/

Prototipas sukurtas kaip grupinis darbas modulyje „Naudotojo sąsajos kūrimas“ (VU MIF).

## Galimybės

- Netoliese vykstančios ir suplanuotos rungtynės, filtrai pagal lygį, laiką, atstumą ir žymas
- Prisijungimas prie rungtynių vienu paspaudimu, draugų pridėjimas („Aš + 1“, „Aš + 2“…)
- Rungtynių kūrimas ir atšaukimas
- Aikštelių žemėlapis ir sąrašas: danga, būklė, apšvietimas, užimtumas, įvertinimai
- Aikštelių reitingas mieste, rikiavimas pagal įvertinimą
- Mygtukas „Rasti mane“ žemėlapyje (GPS)
- Žymėjimas „Esu aikštelėje“ su GPS patikrinimu
- Rungtynių pokalbis (tik dalyviams)
- Žaidėjų paieška pagal lygį ir miestą
- Žaidėjų reitingai ir patikimumas: vertinimas po rungtynių, žyma „Neatvyko“, vėlyvo atšaukimo taisyklė
- „Dažniausiai žaidžiate su“, žaidėjų sekimas ir kvietimas į rungtynes
- Profilis: lygis, pozicija, ūgis, svoris, šuolis, patirtis
- Priminimai ir pranešimai apie netoliese ieškomus žaidėjus
- 5 miestai: Vilnius, Kaunas, Klaipėda, Šiauliai, Panevėžys

## Apie prototipą

Tai tik naudotojo sąsajos prototipas, be serverio dalies. Aikštelės, žaidėjai ir rungtynės yra pavyzdiniai duomenys (`js/duomenys.js`), o naudotojo veiksmai išsaugomi naršyklėje (`localStorage`). Prisijungimas imituojamas. Atstumai skaičiuojami nuo profilyje arba pradžios ekrane pasirinkto rajono, o tikra GPS vieta naudojama mygtukui „Rasti mane“ ir žymėjimui „Esu aikštelėje“ (tam reikia HTTPS arba vietinio serverio).

## Paleidimas

Užtenka atidaryti `index.html` per bet kokį vietinį serverį, pvz., VS Code plėtinį **Live Server**. Žemėlapis veikia tik per serverį, ne atidarius failą tiesiogiai.

## Technologijos

- HTML, CSS, JavaScript (be karkasų)
- [Leaflet](https://leafletjs.com/) ir [OpenStreetMap](https://www.openstreetmap.org/) žemėlapiui
- Šriftas [Oswald](https://fonts.google.com/specimen/Oswald)

## Struktūra

```
index.html            Pradžia: miestas ir rungtynės šalia
zemelapis.html        Aikštelės: žemėlapis ir sąrašas
mano-rungtynes.html   Mano rungtynės
zaidejai.html         Žaidėjų paieška
rungtynes.html        Rungtynių informacija
aikstele.html         Aikštelės informacija
sukurti.html          Rungtynių kūrimas
profilis.html         Profilis ir nustatymai
prisijungimas.html    Prisijungimas ir registracija
pradzia.html          Pradžios ekranas
pagalba.html          Pagalba (DUK)
css/                  Stiliai
js/                   Logika ir duomenys
img/                  Nuotraukos
```

## Autoriai

Džiugas Vasiljevas, Dovydas Žukas
