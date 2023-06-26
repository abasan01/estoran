export default {
    categories: [{
            naziv: "meso",
            sastojci: ["Svinjetina", "Govedina", "Piletina"],
        }, {
            naziv: "riba",
            sastojci: ["Riba"],
        },
        {
            naziv: "ulje",
            sastojci: ["Maslinovo", "Suncokretovo"],
        },
        {
            naziv: "pita",
            sastojci: ["Jabuka", "Jagoda", "Kruška", "Banana", "Kivi", "Naranča", "Mandarina", "Mango", "Marelica", "Limun"]
        },
        {
            naziv: "povrće",
            sastojci: ["Blitva", "Luk", "Češnjak", "Kupus", "Paprika", "Rajčica", "Grah", "Slanutk", "Celer", "Mrkva", "Kukuruz", "Krumpir", "Krastavac", "Mahuna", "Grašak", "Tikivca"],
        },
        {
            naziv: "žito",
            sastojci: ["Pšenica", "Raž", "Ječam", "Riža"],
        },
        {
            naziv: "orašasti",
            sastojci: ["Badem", "Orah", "Kikiriki"],
        },
        {
            naziv: "mliječni",
            sastojci: ["Sir", "Mlijeko", "Jogurt", "Maslac", "Vrhnje"]
        },
        {
            naziv: "jaja",
            sastojci: ["Jaje"]
        },
        {
            naziv: "gljive",
            sastojci: ["Šampinjoni", "Vrganji", "Zelene pupavke"]
        },
        {
            naziv: "morski",
            sastojci: ["Školjke", "Škampi", "Hobotnica"]
        },
        {
            naziv: "alkohol",
            sastojci: ["Bijelo vino", "Crno vino"]
        },
        {
            naziv: "pića",
            sastojci: ["Mineralna voda"]
        }

    ],
    diets: [{
            naziv: "Ništa",
            kategorije: [""],
            opis: "Nikakva ograničenja na odabir hrane"
        },
        {
            naziv: "Vegan",
            kategorije: ["meso", "mliječni", "jaja", "med", "riba", "morski"],
            opis: "Hrana koja u sebi ne sadrži životinjske proizvode"
        },
        {
            naziv: "Košer",
            kategorije: ["svinjetina", "škampi", "školjke", "morski"],
            opis: "Hrana koja je u skladu sa s propisima židovskog zakona"
        },
        {
            naziv: "Pesketerijanac",
            kategorije: ["meso"],
            opis: "Hrana koja u sebi ne sadrži meso sisavaca"
        },
        {
            naziv: "Halal",
            kategorije: ["alkohol", "svinjetina"],
            opis: "Hrana koja je u skladu sa s propisima islamskog zakona"
        },
    ],
    allergies: [{
            naziv: "Ništa",
            kategorije: [""]
        },
        {
            naziv: "Gluten",
            kategorije: ["pšenica"],
            opis: "pšenične proizvode"
        },
        {
            naziv: "Riba",
            kategorije: ["riba"],
            opis: "meso ribe"
        },
        {
            naziv: "Mlijeko",
            kategorije: ["mliječni"],
            opis: "mliječne proizvode"
        },
        {
            naziv: "Jaje",
            kategorije: ["jaje"],
            opis: "jaja"
        },
        {
            naziv: "Školjkaši",
            kategorije: ["Školjke", "Škampi"],
            opis: "školjkaše"
        }
    ]
}