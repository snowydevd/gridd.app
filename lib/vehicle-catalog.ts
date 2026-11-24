// Copia de mobile/convex/lib/vehicleCatalog.ts (allá tiene tests): si cambia allá, se copia acá. La web
// no puede importar del repo de la app. Desde las motos el backend sólo hace una validación básica.
/**
 * Catálogo local de marcas y modelos para el garage del usuario (autos y motos).
 *
 * - Es la base curada para el mercado rioplatense; en la app se combina con lo que devuelve la API
 *   de NHTSA (`convex/vehicleApi.ts`) y el usuario también puede escribir una marca/modelo a mano.
 * - `from`/`to`: años de fabricación del modelo (cualquier mercado). `to: null` = se sigue fabricando.
 * - Los rangos son aproximados y no marcan los huecos: un modelo discontinuado y relanzado
 *   (Supra, Bronco, HR-V...) va de la primera generación a hoy.
 * - Si falta algo, se agrega acá; los tests de `vehicleCatalog.test.ts` validan el formato.
 */

export type VehicleType = "car" | "motorcycle";
export type VehicleModel = { name: string; from: number; to: number | null };
export type VehicleMake = { name: string; models: VehicleModel[] };

export const VEHICLE_TYPES: VehicleType[] = ["car", "motorcycle"];

/** Primer año que se puede elegir para un modelo que no está en el catálogo local. */
export const MIN_YEAR = 1900;
export const MAX_MAKE_LENGTH = 40;
export const MAX_MODEL_LENGTH = 60;

const m = (name: string, from: number, to: number | null = null): VehicleModel => ({ name, from, to });

export const VEHICLE_CATALOG: VehicleMake[] = [
  {
    name: "Alfa Romeo",
    models: [
      m("145 / 146", 1994, 2001),
      m("147", 2000, 2010),
      m("155", 1992, 1997),
      m("156", 1997, 2007),
      m("Giulia", 2015),
      m("Giulietta", 2010, 2020),
      m("Spider", 1966, 1993),
    ],
  },
  {
    name: "Audi",
    models: [
      m("80", 1966, 1996),
      m("A1", 2010),
      m("A3", 1996),
      m("A4", 1994, 2024),
      m("A5", 2007),
      m("A6", 1994),
      m("Q2", 2016),
      m("Q3", 2011),
      m("Q5", 2008),
      m("Q7", 2005),
      m("Quattro", 1980, 1991),
      m("TT", 1998, 2023),
    ],
  },
  {
    name: "BMW",
    models: [
      m("2002", 1968, 1976),
      m("M3", 1986),
      m("Serie 1", 2004),
      m("Serie 3", 1975),
      m("Serie 5", 1972),
      m("X1", 2009),
      m("X3", 2003),
      m("X5", 1999),
      m("Z4", 2002),
    ],
  },
  {
    name: "BYD",
    models: [
      m("Dolphin", 2021),
      m("Dolphin Mini", 2023),
      m("Han", 2020),
      m("Seal", 2022),
      m("Shark", 2024),
      m("Song Plus", 2020),
      m("Yuan Plus", 2021),
    ],
  },
  {
    name: "Chery",
    models: [
      m("Arrizo 5", 2016),
      m("QQ", 2003, 2020),
      m("Tiggo 2", 2017),
      m("Tiggo 4", 2017),
      m("Tiggo 7", 2016),
      m("Tiggo 8", 2018),
    ],
  },
  {
    name: "Chevrolet",
    models: [
      m("Agile", 2009, 2016),
      m("Astra", 1998, 2011),
      m("Aveo", 2002),
      m("Bel Air", 1950, 1975),
      m("Blazer", 1969),
      m("C-10", 1960, 1987),
      m("Camaro", 1966, 2024),
      m("Celta", 2000, 2015),
      m("Chevelle", 1964, 1977),
      m("Chevette", 1973, 1993),
      m("Chevy", 1969, 1978),
      m("Corsa", 1994, 2016),
      m("Corvette", 1953),
      m("Cruze", 2008),
      m("Equinox", 2004),
      m("Impala", 1958, 2020),
      m("Montana", 2003),
      m("Monza", 1982, 1996),
      m("Onix", 2012),
      m("Opala", 1968, 1992),
      m("Prisma", 2006, 2019),
      m("S10", 1995),
      m("Silverado", 1998),
      m("Spin", 2012),
      m("Tracker", 2013),
      m("Vectra", 1988, 2011),
    ],
  },
  {
    name: "Citroën",
    models: [
      m("2CV", 1948, 1990),
      m("3CV", 1969, 1979),
      m("Berlingo", 1996),
      m("C3", 2002),
      m("C4", 2004),
      m("C4 Cactus", 2014),
      m("DS", 1955, 1975),
      m("Méhari", 1968, 1987),
      m("Saxo", 1996, 2003),
      m("Xsara", 1997, 2006),
      m("Xsara Picasso", 1999, 2012),
    ],
  },
  {
    name: "Dodge",
    models: [
      m("1500", 1971, 1990),
      m("Challenger", 1970, 2023),
      m("Charger", 1966),
      m("Dart", 1960, 1976),
      m("Journey", 2008),
      m("Polara", 1960, 1980),
    ],
  },
  {
    name: "Fiat",
    models: [
      m("128", 1969, 1990),
      m("147", 1976, 1996),
      m("500", 2007),
      m("600", 1955, 1982),
      m("Argo", 2017),
      m("Bravo", 2007, 2016),
      m("Cronos", 2018),
      m("Duna", 1987, 2000),
      m("Fastback", 2022),
      m("Fiorino", 1977),
      m("Grand Siena", 2012, 2021),
      m("Idea", 2005, 2016),
      m("Mobi", 2016),
      m("Palio", 1996, 2017),
      m("Pulse", 2021),
      m("Punto", 1993, 2018),
      m("Siena", 1997, 2016),
      m("Strada", 1998),
      m("Tempra", 1990, 1999),
      m("Toro", 2016),
      m("Uno", 1983, 2021),
    ],
  },
  {
    name: "Ford",
    models: [
      m("Bronco", 1966),
      m("Bronco Sport", 2020),
      m("EcoSport", 2003, 2022),
      m("Escort", 1968, 2004),
      m("F-100", 1953, 1983),
      m("F-150", 1975),
      m("Falcon", 1960, 1991),
      m("Fiesta", 1976, 2023),
      m("Focus", 1998, 2025),
      m("Ka", 1996, 2021),
      m("Kuga", 2008),
      m("Maverick", 1969),
      m("Model A", 1927, 1931),
      m("Model T", 1908, 1927),
      m("Mustang", 1964),
      m("Ranger", 1983),
      m("Sierra", 1982, 1993),
      m("Taunus", 1974, 1984),
      m("Territory", 2018),
      m("Transit", 1965),
    ],
  },
  {
    name: "Geely",
    models: [m("Coolray", 2018), m("Emgrand", 2009)],
  },
  {
    name: "Great Wall",
    models: [m("Poer", 2019), m("Wingle", 2006)],
  },
  {
    name: "Haval",
    models: [m("H6", 2011), m("Jolion", 2020)],
  },
  {
    name: "Honda",
    models: [
      m("Accord", 1976),
      m("City", 1981),
      m("Civic", 1972),
      m("CR-V", 1995),
      m("CR-X", 1983, 1991),
      m("Fit", 2001),
      m("HR-V", 1998),
      m("Integra", 1985),
      m("NSX", 1990, 2022),
      m("Prelude", 1978),
      m("S2000", 1999, 2009),
      m("WR-V", 2017),
    ],
  },
  {
    name: "Hyundai",
    models: [
      m("Accent", 1994),
      m("Creta", 2014),
      m("Elantra", 1990),
      m("Getz", 2002, 2011),
      m("Grand i10", 2007),
      m("H-1", 1997, 2021),
      m("HB20", 2012),
      m("i30", 2007),
      m("Santa Fe", 2000),
      m("Tucson", 2004),
      m("Veloster", 2011, 2022),
    ],
  },
  {
    name: "IKA",
    models: [m("Estanciera", 1957, 1970), m("Torino", 1966, 1982)],
  },
  {
    name: "Isuzu",
    models: [m("D-Max", 2002), m("Trooper", 1981, 2005)],
  },
  {
    name: "Jeep",
    models: [
      m("Cherokee", 1974, 2023),
      m("CJ (Willys)", 1944, 1986),
      m("Commander", 2005),
      m("Compass", 2006),
      m("Grand Cherokee", 1992),
      m("Renegade", 2014),
      m("Wrangler", 1986),
    ],
  },
  {
    name: "Kia",
    models: [
      m("Bongo (K2500 / K2700)", 1980),
      m("Carnival", 1998),
      m("Cerato", 2003),
      m("Picanto", 2004),
      m("Rio", 2000),
      m("Seltos", 2019),
      m("Sorento", 2002),
      m("Soul", 2008),
      m("Sportage", 1993),
    ],
  },
  {
    name: "Lada",
    models: [m("Laika (2104 / 2105 / 2107)", 1980, 2012), m("Niva", 1977), m("Samara", 1984, 2013)],
  },
  {
    name: "Mazda",
    models: [
      m("2", 2002),
      m("3", 2003),
      m("6", 2002, 2024),
      m("323", 1977, 2003),
      m("626", 1979, 2002),
      m("B-Series", 1961, 2006),
      m("BT-50", 2006),
      m("CX-3", 2015),
      m("CX-5", 2012),
      m("CX-30", 2019),
      m("MX-5", 1989),
      m("RX-7", 1978, 2002),
      m("RX-8", 2003, 2012),
    ],
  },
  {
    name: "Mercedes-Benz",
    models: [
      m("190", 1982, 1993),
      m("Clase A", 1997),
      m("Clase C", 1993),
      m("Clase E", 1993),
      m("Clase G", 1979),
      m("GLA", 2013),
      m("GLC", 2015),
      m("SL", 1954),
      m("Sprinter", 1995),
    ],
  },
  {
    name: "Mini",
    models: [m("Cooper", 2001), m("Mini (clásico)", 1959, 2000)],
  },
  {
    name: "Mitsubishi",
    models: [
      m("3000GT / GTO", 1990, 2000),
      m("ASX", 2010),
      m("Eclipse", 1989, 2012),
      m("Galant", 1969, 2012),
      m("L200", 1978),
      m("Lancer", 1973, 2017),
      m("Lancer Evolution", 1992, 2016),
      m("Montero / Pajero", 1982, 2021),
      m("Montero Sport", 1996),
      m("Outlander", 2001),
    ],
  },
  {
    name: "Nissan",
    models: [
      m("180SX", 1989, 1998),
      m("240SX", 1989, 1998),
      m("300ZX", 1983, 2000),
      m("350Z", 2002, 2009),
      m("370Z", 2009, 2020),
      m("Bluebird 510 (Datsun 1600)", 1967, 1973),
      m("Frontier", 1997),
      m("GT-R", 2007, 2025),
      m("Kicks", 2016),
      m("March", 1982),
      m("Pathfinder", 1985),
      m("Patrol", 1951),
      m("Sentra", 1982),
      m("Silvia", 1965, 2002),
      m("Skyline", 1957),
      m("Tiida", 2004, 2018),
      m("Versa", 2006),
      m("X-Trail", 2000),
      m("Z", 2022),
    ],
  },
  {
    name: "Peugeot",
    models: [
      m("106", 1991, 2003),
      m("205", 1983, 1998),
      m("206", 1998, 2013),
      m("207", 2006, 2016),
      m("208", 2012),
      m("306", 1993, 2002),
      m("307", 2001, 2014),
      m("308", 2007),
      m("404", 1960, 1991),
      m("405", 1987, 1997),
      m("406", 1995, 2004),
      m("407", 2004, 2011),
      m("408", 2010),
      m("504", 1968, 2005),
      m("505", 1979, 1999),
      m("2008", 2013),
      m("3008", 2009),
      m("Expert", 1995),
      m("Partner", 1996),
    ],
  },
  {
    name: "Porsche",
    models: [
      m("356", 1948, 1965),
      m("911", 1963),
      m("Boxster", 1996),
      m("Cayenne", 2002),
      m("Cayman", 2005),
      m("Macan", 2014),
    ],
  },
  {
    name: "RAM",
    models: [m("1500", 2010), m("2500", 2010), m("Rampage", 2023)],
  },
  {
    name: "Renault",
    models: [
      m("4", 1961, 1992),
      m("12", 1969, 1994),
      m("18", 1978, 1993),
      m("19", 1988, 2000),
      m("21", 1986, 1995),
      m("Captur", 2013),
      m("Clio", 1990),
      m("Duster", 2010),
      m("Fuego", 1980, 1992),
      m("Kangoo", 1997),
      m("Kwid", 2015),
      m("Laguna", 1994, 2015),
      m("Logan", 2004),
      m("Mégane", 1995),
      m("Oroch", 2015),
      m("Sandero", 2007),
    ],
  },
  {
    name: "Seat",
    models: [m("Ibiza", 1984), m("León", 1999)],
  },
  {
    name: "Subaru",
    models: [
      m("BRZ", 2012),
      m("Forester", 1997),
      m("Impreza", 1992),
      m("Impreza WRX / WRX", 1992),
      m("Legacy", 1989, 2025),
      m("Outback", 1994),
      m("WRX STI", 1994, 2021),
      m("XV / Crosstrek", 2012),
    ],
  },
  {
    name: "Suzuki",
    models: [
      m("Alto", 1979),
      m("Celerio", 2008),
      m("Grand Vitara", 1998),
      m("Jimny", 1970),
      m("S-Presso", 2019),
      m("Samurai", 1981, 2004),
      m("Swift", 1983),
      m("Vitara", 1988),
    ],
  },
  {
    name: "Toyota",
    models: [
      m("86 / GR86", 2012),
      m("Camry", 1982),
      m("Celica", 1970, 2006),
      m("Chaser", 1977, 2001),
      m("Corolla", 1966),
      m("Corolla AE86 (Levin / Trueno)", 1983, 1987),
      m("Corolla Cross", 2020),
      m("Crown", 1955),
      m("Etios", 2010, 2021),
      m("Hilux", 1968),
      m("Land Cruiser", 1951),
      m("Mark II", 1968, 2004),
      m("MR2", 1984, 2007),
      m("Prius", 1997),
      m("RAV4", 1994),
      m("Starlet", 1973, 1999),
      m("Supra", 1978),
      m("SW4", 1984),
      m("Tercel", 1978, 1999),
      m("Yaris", 1999),
    ],
  },
  {
    name: "Volkswagen",
    models: [
      m("Amarok", 2010),
      m("Brasilia", 1973, 1982),
      m("Corrado", 1988, 1995),
      m("Escarabajo (Fusca)", 1938, 2003),
      m("Fox", 2003, 2021),
      m("Gacel", 1983, 1988),
      m("Gol", 1980, 2023),
      m("Golf", 1974),
      m("Jetta", 1979),
      m("Kombi", 1950, 2013),
      m("Nivus", 2020),
      m("Parati", 1982, 2012),
      m("Passat", 1973),
      m("Polo", 1975),
      m("Saveiro", 1982),
      m("Scirocco", 1974, 2017),
      m("Senda", 1987, 1995),
      m("Suran", 2006, 2019),
      m("T-Cross", 2019),
      m("Taos", 2021),
      m("Tiguan", 2007),
      m("Touareg", 2002),
      m("Up!", 2011, 2023),
      m("Virtus", 2017),
      m("Voyage", 1981, 2023),
    ],
  },
  {
    name: "Volvo",
    models: [m("240", 1974, 1993), m("XC40", 2017), m("XC60", 2008)],
  },
];

export const MOTORCYCLE_CATALOG: VehicleMake[] = [
  {
    name: "Aprilia",
    models: [m("RS 125", 1992), m("RS 457", 2024), m("RS 660", 2020), m("RSV4", 2009), m("Tuono", 2002)],
  },
  {
    name: "Bajaj",
    models: [
      m("Avenger", 2005),
      m("Dominar 250", 2020),
      m("Dominar 400", 2016),
      m("Pulsar 135", 2009),
      m("Pulsar 200 NS", 2012),
      m("Pulsar N250", 2021),
      m("Pulsar RS 200", 2015),
      m("Rouser 220", 2007),
    ],
  },
  {
    name: "Benelli",
    models: [m("Leoncino 500", 2017), m("TNT 15", 2014), m("TNT 135", 2014), m("TNT 600", 2006), m("TRK 251", 2019), m("TRK 502", 2017)],
  },
  {
    name: "Beta",
    models: [m("Motard 2.0", 2018), m("RR 125", 2017), m("RR 300", 2013), m("Tempo 150", 2016)],
  },
  {
    name: "BMW",
    models: [
      m("F 750 GS", 2018),
      m("F 800 GS", 2008, 2018),
      m("F 900 R", 2020),
      m("G 310 GS", 2017),
      m("G 310 R", 2016),
      m("K 1600", 2011),
      m("R 1200 GS", 2004, 2018),
      m("R 1250 GS", 2018, 2024),
      m("R 1300 GS", 2023),
      m("R nineT", 2014),
      m("S 1000 RR", 2009),
    ],
  },
  {
    name: "CFMoto",
    models: [m("300 NK", 2019), m("450 MT", 2024), m("650 MT", 2012), m("650 NK", 2012), m("800 MT", 2021)],
  },
  {
    name: "Corven",
    models: [m("Energy 110", 2008), m("Hunter 150", 2009), m("Triax 150", 2014), m("Triax 250", 2015), m("TXR 250", 2014)],
  },
  {
    name: "Ducati",
    models: [
      m("DesertX", 2022),
      m("Diavel", 2011),
      m("Hypermotard", 2007),
      m("Monster", 1993),
      m("Multistrada", 2003),
      m("Panigale V2", 2020),
      m("Panigale V4", 2018),
      m("Scrambler", 2015),
      m("Streetfighter", 2009),
    ],
  },
  {
    name: "Gilera",
    models: [m("Ac4 250", 2016), m("Sahel 150", 2013), m("Smash 110", 2007), m("VC 150", 2009)],
  },
  {
    name: "Harley-Davidson",
    models: [
      m("Fat Boy", 1990),
      m("Iron 883", 2009, 2022),
      m("Nightster", 2022),
      m("Pan America", 2021),
      m("Road Glide", 1998),
      m("Road King", 1994),
      m("Sportster", 1957),
      m("Street Bob", 2006),
      m("Street Glide", 2006),
    ],
  },
  {
    name: "Honda",
    models: [
      m("Africa Twin", 1988),
      m("Biz 125", 2005),
      m("CB 190R", 2015),
      m("CB 250 Twister", 2016),
      m("CB 500F", 2013),
      m("CB 650R", 2019),
      m("CB 1000R", 2008),
      m("CBR 600RR", 2003),
      m("CBR 1000RR", 2004),
      m("CG 150 Titan", 2004),
      m("Gold Wing", 1975),
      m("NC 750X", 2014),
      m("PCX 160", 2021),
      m("Wave 110", 1997),
      m("XR 150L", 2014),
      m("XR 190L", 2016),
      m("XR 250 Tornado", 2001),
      m("XRE 300", 2009),
    ],
  },
  {
    name: "Husqvarna",
    models: [m("701 Enduro", 2016), m("Svartpilen 401", 2018), m("TE 300", 2014), m("Vitpilen 401", 2018)],
  },
  {
    name: "Kawasaki",
    models: [
      m("KLR 650", 1987),
      m("KX 250", 1974),
      m("Ninja 400", 2018),
      m("Ninja 650", 2006),
      m("Ninja ZX-6R", 1995),
      m("Ninja ZX-10R", 2004),
      m("Versys 650", 2007),
      m("Vulcan S", 2015),
      m("Z400", 2019),
      m("Z650", 2017),
      m("Z900", 2017),
      m("Z900RS", 2018),
    ],
  },
  {
    name: "Keller",
    models: [m("Miracle 150", 2014), m("Quasar 250", 2013), m("Stratus 150", 2010)],
  },
  {
    name: "KTM",
    models: [
      m("200 Duke", 2012),
      m("250 Duke", 2015),
      m("390 Adventure", 2020),
      m("390 Duke", 2013),
      m("690 Enduro", 2008),
      m("790 Duke", 2018),
      m("890 Adventure", 2021),
      m("1290 Super Adventure", 2015),
      m("EXC 300", 2004),
      m("RC 390", 2014),
    ],
  },
  {
    name: "Kymco",
    models: [m("Agility 125", 2006), m("AK 550", 2017), m("Like 150", 2009), m("Xciting 400", 2013)],
  },
  {
    name: "Motomel",
    models: [m("Blitz 110", 2009), m("Dakar 200", 2016), m("Sirius 250", 2018), m("Skua 150", 2011), m("Skua 250", 2014)],
  },
  {
    name: "MV Agusta",
    models: [m("Brutale", 2001), m("Dragster", 2014), m("F3", 2012), m("F4", 1999, 2019)],
  },
  {
    name: "Royal Enfield",
    models: [
      m("Bullet 350", 1932),
      m("Classic 350", 2008),
      m("Continental GT 650", 2018),
      m("Himalayan", 2016),
      m("Hunter 350", 2022),
      m("Interceptor 650", 2018),
      m("Meteor 350", 2020),
    ],
  },
  {
    name: "Suzuki",
    models: [
      m("AX 100", 1997, 2020),
      m("DR 650", 1990),
      m("Gixxer 150", 2014),
      m("GN 125", 1982),
      m("GSX-R 600", 1992),
      m("GSX-R 750", 1985),
      m("GSX-R 1000", 2001),
      m("GSX-S 750", 2015),
      m("Hayabusa", 1999),
      m("SV 650", 1999),
      m("V-Strom 650", 2004),
    ],
  },
  {
    name: "Triumph",
    models: [
      m("Bonneville", 1959),
      m("Scrambler 400 X", 2023),
      m("Speed 400", 2023),
      m("Speed Triple", 1994),
      m("Street Triple", 2007),
      m("Tiger 900", 2020),
      m("Trident 660", 2021),
    ],
  },
  {
    name: "TVS",
    models: [m("Apache RTR 160", 2007), m("Apache RTR 200", 2016), m("NTorq 125", 2018), m("Raider 125", 2021)],
  },
  {
    name: "Vespa",
    models: [m("GTS 300", 2008), m("Primavera", 1968), m("PX", 1977, 2017), m("Sprint", 2014)],
  },
  {
    name: "Voge",
    models: [m("300 Rally", 2021), m("500 DS", 2020), m("525 DSX", 2023)],
  },
  {
    name: "Yamaha",
    models: [
      m("Crypton 110", 1993),
      m("FZ 25", 2017),
      m("FZ-S", 2008),
      m("MT-03", 2006),
      m("MT-07", 2014),
      m("MT-09", 2013),
      m("R1", 1998),
      m("R3", 2015),
      m("R6", 1999, 2020),
      m("Ténéré 700", 2019),
      m("XT 660", 2004, 2016),
      m("XTZ 125", 2003),
      m("XTZ 250", 2007),
      m("YBR 125", 2005),
    ],
  },
  {
    name: "Zanella",
    models: [m("Due 110", 2008), m("Patagonian Eagle 250", 2010), m("RX 150", 2011), m("Styler 150", 2011), m("ZR 150", 2015)],
  },
];

export function catalogFor(type: VehicleType): VehicleMake[] {
  return type === "motorcycle" ? MOTORCYCLE_CATALOG : VEHICLE_CATALOG;
}

export function findModel(make: string, model: string, type: VehicleType = "car"): VehicleModel | undefined {
  return catalogFor(type)
    .find((x) => x.name === make)
    ?.models.find((x) => x.name === model);
}

/** Años que se pueden elegir para un modelo, del más nuevo al más viejo. */
export function modelYears(model: VehicleModel, currentYear: number): number[] {
  const last = Math.min(model.to ?? currentYear, currentYear);
  const years: number[] = [];
  for (let y = last; y >= model.from; y--) years.push(y);
  return years;
}

/** Recorta y colapsa espacios: "  Gol   Trend " → "Gol Trend". */
export function cleanName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

/** Clave para comparar nombres sin importar mayúsculas, tildes ni guiones: "HARLEY DAVIDSON" = "Harley-Davidson". */
export function nameKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * NHTSA devuelve todo en mayúsculas ("ALFA ROMEO", "KOMBI"). Las palabras sólo de letras con más de
 * 3 caracteres pasan a "Title Case"; las siglas y las que tienen números quedan como vienen (BMW, GTI, CBR954RR).
 */
export function prettifyApiName(name: string): string {
  return cleanName(name)
    .split(" ")
    .map((word) =>
      word.length > 3 && /^[A-Z]+(-[A-Z]+)*$/.test(word)
        ? word.toLowerCase().replace(/(^|-)([a-z])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase())
        : word,
    )
    .join(" ");
}

/** Suma a `base` los nombres de `extra` que no estén ya (comparando con `nameKey`), en orden alfabético. */
export function mergeNames(base: string[], extra: string[]): string[] {
  const seen = new Set(base.map(nameKey));
  const out = [...base];
  for (const name of extra) {
    const key = nameKey(name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out.sort((a, b) => a.localeCompare(b, "es", { numeric: true, sensitivity: "base" }));
}

/**
 * Validación básica: la marca y el modelo pueden venir del catálogo local, de NHTSA o escritos a mano,
 * así que sólo se controla que sean texto razonable y que el año esté entre `MIN_YEAR` y el año que viene.
 */
export function isValidVehicle(
  { make, model, year }: { make: string; model: string; year: number },
  currentYear: number,
): boolean {
  const cleanMake = cleanName(make);
  const cleanModel = cleanName(model);
  if (!cleanMake || cleanMake.length > MAX_MAKE_LENGTH) return false;
  if (!cleanModel || cleanModel.length > MAX_MODEL_LENGTH) return false;
  return Number.isInteger(year) && year >= MIN_YEAR && year <= currentYear + 1;
}
