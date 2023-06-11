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
            kategorije: [""]
        },
        {
            naziv: "Vegan",
            kategorije: ["meso", "mliječni", "jaja", "med", "riba", "morski"]
        },
        {
            naziv: "Košer",
            kategorije: ["svinjetina", "škampi", "školjke", "morski"]
        },
        {
            naziv: "Pesketerijanac",
            kategorije: ["meso"]
        },
        {
            naziv: "Halal",
            kategorije: ["alkohol", "svinjetina", "alkohol"]
        },
    ],
    allergies: [{
            naziv: "Ništa",
            kategorije: [""]
        },
        {
            naziv: "Gluten",
            kategorije: ["pšenica"]
        },
        {
            naziv: "Riba",
            kategorije: ["riba"]
        },
        {
            naziv: "Mlijeko",
            kategorije: ["mliječni"]
        },
        {
            naziv: "Jaje",
            kategorije: ["jaje"]
        },
        {
            naziv: "Školjkaši",
            kategorije: ["Školjke", "Škampi"]
        }
    ]
}