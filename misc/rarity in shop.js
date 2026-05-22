api.configureShopCategory("rarities", {
    customTitle: "Rarities",
    description: [{ str: "Brainrot spawn chances and rarities." }],
    sortPriority: 10000,
});

rarityWeight = "800",
raritySize = "20px";

percentWeight = "600",
percentSize = "20px";

api.createShopItem("rarities", "percentages", {
    image: "",
    customTitle: "",
    canBuy: false,

    description: [
        { str: "Common ", style: { color: rarityColors.Common, fontWeight: rarityWeight, fontSize: raritySize } },
        { str: "Default", style: { color: rarityColors.Common, fontWeight: percentWeight, fontSize: percentSize } },
        
        { str: "\nUncommon ", style: { color: rarityColors.Uncommon, fontWeight: rarityWeight, fontSize: raritySize } },
        { str: "50%", style: { color: rarityColors.Uncommon, fontWeight: percentWeight, fontSize: percentSize } },
        
        { str: "\nRare ", style: { color: rarityColors.Rare, fontWeight: rarityWeight, fontSize: raritySize } },
        { str: "25%", style: { color: rarityColors.Rare, fontWeight: percentWeight, fontSize: percentSize } },
        
        { str: "\nLegendary ", style: { color: rarityColors.Legendary, fontWeight: rarityWeight, fontSize: raritySize } },
        { str: "10%", style: { color: rarityColors.Legendary, fontWeight: percentWeight, fontSize: percentSize } },
        
        { str: "\nMythical ", style: { color: rarityColors.Mythical, fontWeight: rarityWeight, fontSize: raritySize } },
        { str: "5%", style: { color: rarityColors.Mythical, fontWeight: percentWeight, fontSize: percentSize } },
    ]
});
