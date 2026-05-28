//update: aaaaaaaaaaaaaaaa

/*
=== TODO ===

- players who leave when initializing or in some other cases break the code forever (seems to be fixed FOR THE MOST PART)

=== Important Helper Functions ===


=== BUGS ===

- some brainrot mesh not being removed (seems like a Bloxd bug)
- there seems to be an issue where player coins are not synced
- brainrots sometimes do not start spawning - maybe due to badly-timed interruptions
*/

// offset code: api.setPosition(mesh, [x - (mob.offset ?? [0, 0, 0])[0], y - (mob.offset ?? [0, 0, 0])[1], z - (mob.offset ?? [0, 0, 0])[2]]);

defineVariables();

function defineVariables() {
    if (globalThis.hasDefinedVariables) { return; }
    mobSpawnTime = {};

    globalThis.shouldUpdatePlayerBrainrots = {};
    globalThis.savedPlayerMobNum = {};
    globalThis.savedPlayerMobNum2 = {};

    claimingStart = 1779157161692;

    spawnPos = [-999, -996, -999];

    hasPlayedParticle = {};

    purchaseMob = [];

    stealing = {};
    beingStolenFrom = {};

    serverUiText = "#cef3ff";
    oldPlayers = [];

    disableAdminMode = false;

    playerBrainrotIds = {};

    hasSetMax = false;
    playerJoinLevel = {};

    enableLighting = true;

    admin = ["WanderingCannoli", "WanderingCanoli", "Javisthejavisyt", "SubTo_javisthejavisYT"];

    customText = {
        rebirth: [-1010, -997, -1027],
        luck: [-979, -992, -1045],
        merge: [-993, -996, -992],
        debugReset: [-1005, -997, -972],
    };

    shouldRunPlayerJoin = {};

    hideMobs = true;
    oldCoins = {};

    updateSidebar = {};
    toHide = [];
    stealable = {};

    basesConfig = [
        {
            nametagPos: [-1018, -994, -957], spawnPos: [-1021, -998, -957], borders: [[-1018, -999, -950], [-1029, -982, -963]], laserStartPos: [-1018, -999, -957], otherLasers: [[-1027, -990, -952], [-1028, -990, -952]], lockPos: [-1019, -996, -960],

            brainrotPlatforms: [[-1020, -998, -960], [-1023, -998, -960], [-1026, -998, -960],
            [-1020, -998, -954], [-1023, -998, -954], [-1026, -998, -954],
            [-1020, -989, -960], [-1023, -989, -960], [-1026, -989, -960],
            [-1020, -989, -954], [-1023, -989, -954], [-1026, -989, -954]]
        },
        {
            nametagPos: [-1018, -994, -976], spawnPos: [-1020, -998, -976], borders: [[-1018, -999, -969], [-1029, -982, -982]], laserStartPos: [-1018, -999, -976], otherLasers: [[-1027, -990, -971], [-1028, -990, -971]], lockPos: [-1019, -996, -979],

            brainrotPlatforms: [[-1020, -998, -979], [-1023, -998, -979], [-1026, -998, -979],
            [-1020, -998, -973], [-1023, -998, -973], [-1026, -998, -973],
            [-1020, -989, -979], [-1023, -989, -979], [-1026, -989, -979],
            [-1020, -989, -973], [-1023, -989, -973], [-1026, -989, -973]]
        },
        {
            nametagPos: [-1018, -994, -994], spawnPos: [-1020, -998, -995], borders: [[-1018, -999, -988], [-1029, -982, -1001]], laserStartPos: [-1018, -999, -994], otherLasers: [[-1027, -990, -989], [-1028, -990, -989]], lockPos: [-1019, -996, -997],

            brainrotPlatforms: [[-1020, -998, -997], [-1023, -998, -997], [-1026, -998, -997],
            [-1020, -998, -991], [-1023, -998, -991], [-1026, -998, -991],
            [-1020, -989, -997], [-1023, -989, -997], [-1026, -989, -997],
            [-1020, -989, -991], [-1023, -989, -991], [-1026, -989, -991]]
        },
        {
            nametagPos: [-1018, -994, -1013], spawnPos: [-1020, -998, -1014], borders: [[-1018, -999, -1007], [-1029, -982, -1020]], laserStartPos: [-1018, -999, -1013], otherLasers: [[-1027, -990, -1008], [-1028, -990, -1008]], lockPos: [-1019, -996, -1016],

            brainrotPlatforms: [[-1020, -998, -1016], [-1023, -998, -1016], [-1026, -998, -1016],
            [-1020, -998, -1010], [-1023, -998, -1010], [-1026, -998, -1010],
            [-1020, -989, -1016], [-1023, -989, -1016], [-1026, -989, -1016],
            [-1020, -989, -1010], [-1023, -989, -1010], [-1026, -989, -1010]]
        },

        {
            nametagPos: [-984, -994, -957], spawnPos: [-984, -998, -957], borders: [[-984, -982, -952], [-973, -999, -940]], laserStartPos: [-984, -999, -957], otherLasers: [[-975, -990, -1019], [-974, -990, -1019]], lockPos: [-983, -996, -960],

            brainrotPlatforms: [[-986, -998, -960], [-989, -998, -960], [-992, -998, -960],
            [-986, -998, -954], [-989, -998, -954], [-992, -998, -954],
            [-986, -989, -960], [-989, -989, -960], [-992, -989, -960],
            [-986, -989, -954], [-989, -989, -954], [-992, -989, -954]]
        },
        {
            nametagPos: [-984, -994, -976], spawnPos: [-984, -998, -976], borders: [[-984, -982, -965], [-973, -999, -953]], laserStartPos: [-984, -999, -976], otherLasers: [[-975, -990, -1000], [-974, -990, -1000]], lockPos: [-983, -996, -979],

            brainrotPlatforms: [[-986, -998, -979], [-989, -998, -979], [-992, -998, -979],
            [-986, -998, -973], [-989, -998, -973], [-992, -998, -973],
            [-986, -989, -979], [-989, -989, -979], [-992, -989, -979],
            [-986, -989, -973], [-989, -989, -973], [-992, -989, -973]]
        },
        {
            nametagPos: [-984, -994, -994], spawnPos: [-984, -998, -995], borders: [[-984, -982, -978], [-973, -999, -966]], laserStartPos: [-984, -999, -994], otherLasers: [[-975, -990, -982], [-974, -990, -982]], lockPos: [-983, -996, -997],

            brainrotPlatforms: [[-986, -998, -997], [-989, -998, -997], [-992, -998, -997],
            [-986, -998, -991], [-989, -998, -991], [-992, -998, -991],
            [-986, -989, -997], [-989, -989, -997], [-992, -989, -997],
            [-986, -989, -991], [-989, -989, -991], [-992, -989, -991]]
        },
        {
            nametagPos: [-984, -994, -1013], spawnPos: [-984, -998, -1014], borders: [[-984, -982, -991], [-973, -999, -979]], laserStartPos: [-984, -999, -1013], otherLasers: [[-975, -990, -963], [-974, -990, -963]], lockPos: [-983, -996, -1016],

            brainrotPlatforms: [[-986, -998, -1016], [-989, -998, -1016], [-992, -998, -1016],
            [-986, -998, -1010], [-989, -998, -1010], [-992, -998, -1010],
            [-986, -989, -1016], [-989, -989, -1016], [-992, -989, -1016],
            [-986, -989, -1010], [-989, -989, -1010], [-992, -989, -1010]]
        },
    ];

    dbListSeparator = "|dbListSeparator|";

    lavaPos = [-999, -1002, -941];

    brainrotSpawnPos = [-999, -999, -1025];
    brainrotDeathPos = [-999, -997, -942.5];

    spawnFreq = 20;
    maxConsec = 1;
    waitNum = 5;

    maxBrainrots = 12; // real max: 12

    defOwnedBaseNametag = {
        title: {
            style: { color: "#d6362b", fontSize: "80px" },
            backgroundColor: "#fa5b50",
        },
        subtitle: {
            style: { color: "#d62bc5", fontSize: "50px" },
            backgroundColor: "#e080d7",
        },
    };

    defBaseNametag = {
        title: {
            style: { color: "#d6362b", fontSize: "50px" },
            backgroundColor: "#fa5b50",
        },
        subtitle: {
            style: { color: "#d62bc5", fontSize: "50px" },
            backgroundColor: "#e080d7",
        },
    };

    defLockTime = 30;

    nextSpawnAt = api.now();

    lockedBases = {};
    lockTime = {};

    bases = {};
    baseNum = {};

    tickNum = 0;

    tickNum2 = 0;
    tickNum3 = 0;

    oldPos = {};

    defSize = 2;
    defOffset = [0, -0.85, 0];

    rarityColors = {
        "Common": "#fffaf7",
        "Uncommon": "#41fc03",
        "Rare": "#0390fc",
        "Legendary": "#e8d631",
        "Mythical": "#5531e8",
    };

    brainrots = [
        // cid = config id
        {
            ents: [
                { meshType: "BloxdBlock", blockName: "67 Statue", size: defSize, offset: defOffset, data: { cps: 50, cost: 1000 }, cid: 0 },
                { meshType: "BloxdBlock", blockName: "Bobzilla Statue", size: defSize, offset: defOffset, data: { cps: 50, cost: 1000 }, cid: 1 },
                { meshType: "BloxdBlock", blockName: "Brra Brra Pachim Statue", size: defSize, offset: defOffset, data: { cps: 50, cost: 1000 }, cid: 2 },
                { meshType: "BloxdBlock", blockName: "Monsieur Bedwar Statue", size: defSize, offset: defOffset, data: { cps: 50, cost: 1000 }, cid: 3 },
            ], name: "Common", chance: 1, cid: 0,
        },

        {
            ents: [
                { meshType: "BloxdBlock", blockName: "Duo Blocchino Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 5000 }, cid: 0 },
                { meshType: "BloxdBlock", blockName: "Capitano Explovissimo Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 5000 }, cid: 1 },
                { meshType: "BloxdBlock", blockName: "Il Wizardini Del Porko Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 5000 }, cid: 2 },
            ], name: "Uncommon", chance: 0.5, cid: 1,
        },

        {
            ents: [
                { meshType: "BloxdBlock", blockName: "Bebek Bebek Bebek Statue", size: defSize, offset: defOffset, data: { cps: 5000, cost: 10000 }, cid: 0 },
                { meshType: "BloxdBlock", blockName: "Chimpanzano Bananano Statue", size: defSize, offset: defOffset, data: { cps: 5000, cost: 10000 }, cid: 1 },
                { meshType: "BloxdBlock", blockName: "Twirlina Cappucina Statue", size: defSize, offset: defOffset, data: { cps: 5000, cost: 10000 }, cid: 2 },
                { meshType: "BloxdBlock", blockName: "Block of Diamond", displayName: "Diamond Bloxd", size: defSize, offset: [0, 0, 0], data: { cps: 5000, cost: 10000 }, cid: 3 },
            ], name: "Rare", chance: 0.25, cid: 2,
        },

        {
            ents: [
                { meshType: "BloxdBlock", blockName: "Bobino Musculino Statue", size: defSize, offset: defOffset, data: { cps: 1000, cost: 100000 }, cid: 0 },
                { meshType: "BloxdBlock", blockName: "Cappuccino Ninjino Statue", size: defSize, offset: defOffset, data: { cps: 1000, cost: 100000 }, cid: 1 },
            ], name: "Legendary", chance: 0.1, cid: 3,
        },

        {
            ents: [
                { meshType: "BloxdBlock", blockName: "Lucchia Blocchi Statue", size: defSize, offset: defOffset, data: { cps: 10000, cost: 10000000 }, cid: 0 },
            ], name: "Mythical", chance: 0.05, cid: 4,
        },
    ];

    tickNum = 0;

    pId = 0;
    pNum = 0;

    startWorldTickAt = 0;//20;

    mobs = [];
    players = [];

    hasspawnedmesh = false;

    consec = 0;
    wait = 0;

    toload = [
        [1000, 1000, 1000],
        [1000, 1000, 999],
        [1000, 1000, 998],
        [1000, 1000, 997],
    ];

    loadedcallbacks = ["tick", "onPlayerJoin"];

    loadwait = 12;
    loaddelay = 25;
    showlogs = false;

    starttime = null;
    warmUp = api.getBlock(...toload[0]);

    loaded = false;
    startloading = false;
    shouldLoad = true;

    ticknum = 0;
    ticks = 0;

    globalThis.hasDefinedVariables = true;
}

function onPlayerChangeBlock(myId, x, y, z, fromBlock, toBlock, droppedItem, fromBlockInfo, toBlockInfo) {
    if (blockIfUsingPrestigeItem(myId)) { return "preventChange"; }
    if (!loaded) { "preventChange"; }

    let username = api.getEntityName(myId);
    let isAdmin = admin.includes(username);
    let held = api.getHeldItem(myId)?.name;
    api.setCallbackValueFallback("onPlayerChangeBlock", "preventChange");
    if (fromBlock == "Fireball Block" && !(isAdmin && held?.includes("Pickaxe"))) {
        resetToStarter(myId);
        return "preventChange";
    }
}

function onPlayerDamagingOtherPlayer(myId, damagedPlayer, damageDealt, withItem, bodyPartHit, myDbId) {
    if (blockIfUsingPrestigeItem(myId)) { return "preventDamage"; }

    let actionType = getHeldActionType(myId);

    let item = api.getHeldItem(myId);
    if (!canHit(myId)) {
        api.sendFlyingMiddleMessage(myId, [{ str: "Hit cooldown active!" }], 10, 1000);
        return "preventDamage";
    } else {
        if (actionType == "bat") {
            api.setHealth(damagedPlayer, 100);
            applyHitCooldown(myId);
            attemptReturn(damagedPlayer);
        } else if (actionType == "galaxybat") {
            if (!api.hasEffect(myId, "galaxybatcooldown")) {
                api.setHealth(damagedPlayer, 100);
                applyHitCooldown(myId, "galaxybat");
                attemptReturn(damagedPlayer);
                api.applyEffect(myId, "galaxybatcooldown", 25000, { icon: "Stick", displayName: "Galaxy Bat Cooldown" });
            } else {
                return "preventDamage";
            }
        } else {
            return "preventDamage";
        }
    }
}

function onPlayerDamagingMob(myId, mobId, dmgDealt, withItem, damagerDbId) {
    if ((!loaded) || blockIfUsingPrestigeItem(myId)) { "preventDamage"; }

    let held = (api.getHeldItem(myId)?.name ?? "");
    if (held.includes("Sword")) { return; }
    api.setCallbackValueFallback("onPlayerDamagingMob", "preventDamage");

    if (stealing[myId]) {
        api.sendMessage(myId, [{ str: "Can't interact with other brainrots while stealing." }]);
        return "preventDamage";
    }
    // Make this check not affect upgrades

    let preventPurchase = false;
    let ownedBrainrots = getBrainrots(myId);
    if (beingStolenFrom[myId] && ownedBrainrots.length >= maxBrainrots) {
        api.sendMessage(myId, [{ str: "You still have a chance to get back that stolen brainrot!" }]);
        preventPurchase = true;
    }
    else if (ownedBrainrots.length - 1 >= maxBrainrots) {
        api.sendMessage(myId, [{ str: "You have too many brainrots!" }]);
        preventPurchase = true;
    }

    let mob = "undecided";
    if (!playerBrainrotIds[myId]) { playerBrainrotIds[myId] = {}; }
    if (!playerBrainrotIds[myId][mobId]) {
        for (let m of mobs) {
            if (m.id == mobId) { mob = m; }
        }
        if (mob == "undecided") {
            if (!stealable[myId].includes(mobId)) {
                let stealingFrom = null;
                for (let id in stealable) {
                    for (let brainrot of stealable[id]) {
                        if (brainrot == mobId) {
                            stealingFrom = id;
                        }
                    }
                }

                if (!playerBrainrotIds[stealingFrom]) { playerBrainrotIds[stealingFrom] = {}; }
                let ownedInfo = playerBrainrotIds[stealingFrom][mobId];
                let dbIdx = ownedInfo.idx;
                let ownedBrainrots = getBrainrots(stealingFrom);
                let dbValue = ownedBrainrots[dbIdx];
                let configValue = getBrainrotById(dbValue.id);

                stealing[myId] = { from: stealingFrom, brainrot: dbValue };
                beingStolenFrom[stealingFrom] = true;
                let s = stealing[myId];

                removeBrainrot(stealingFrom, dbIdx);
                showBrainrotStealingEffect(myId, configValue.blockName);

                let stealingBrainrotConfig = getBrainrotById(s.brainrot.id);

                refreshBrainrotRender(stealingFrom);
                api.sendFlyingMiddleMessage(stealingFrom, [{ str: `Someone is stealing your ${stealingBrainrotConfig.name.replace(" Statue", "")}!` }], 100, 1000);

                return "preventDamage";
            } else {
                return "preventDamage";
            }
        }
    } else {
        if (!playerBrainrotIds[myId]) { playerBrainrotIds[myId] = {}; }
        let ownedInfo = playerBrainrotIds[myId][mobId];
        let dbIdx = ownedInfo.idx;
        let dbValue = ownedBrainrots[dbIdx];
        let configValue = getBrainrotById(dbValue.id);

        let actionType = getHeldActionType(myId);

        if (actionType == "upgrade") {
            attemptUpgradeBrainrot(myId, dbIdx);
        } else if (actionType == "claim") {
            claimCoins(myId, dbIdx);
        } else if (actionType == "sell") {
            removeBrainrot(myId, dbIdx);
            refreshBrainrotRender(myId);

            let sellValue = configValue.data.cost;

            api.giveItem(myId, "Gold Coin", sellValue);

            api.sendMessage(myId, [{ str: `Sold for ${sellValue} gold.` }]);
        } else {
            api.sendMessage(myId, [{ str: "Use an item on the right side of your hotbar to interact." }]);
        }

        return "preventDamage";
    }
    let rarityId = null;

    if (!preventPurchase) {
        outer:
        for (let rarity of brainrots) {
            for (let e of rarity.ents) {
                if (e.cid == mob.brainrotData.cid && e.blockName == mob.brainrotData.blockName) {
                    rarityId = rarity.cid;
                    break outer;
                }
            }
        }

        // CHECKPOINT
        let coins = api.getPlayerDbValue(myId, "coins");
        let cost = mob.brainrotData.data.cost;
        if (coins >= cost) {
            purchaseMob.push({ myId: myId, mobId: mobId, mob: mob, rarityId: rarityId });

            return "preventDamage";
        } else {
            api.sendMessage(myId, [{ str: `Not enough coins! You need ${cost - coins} more coins.` }]);
        }
    }

    return "preventDamage";
}

function onPlayerSelectInventorySlot(myId, idx) {
    if (!loaded) { return; }

    let actionType = getHeldActionType(myId);

    if (actionType == "sell") {
        api.setClientOption(myId, "middleTextLower", [
            { icon: "Gold Coin", style: { color: serverUiText } },
            { str: "Click on one of your brainrots to sell.", style: { color: serverUiText } },
            { str: "\nRemove the brainrot from your inventory and collect its value in coins.", style: { color: serverUiText, fontStyle: "italic", fontSize: "17px" } },
        ]);
    } else if (actionType == "upgrade") {
        api.setClientOption(myId, "middleTextLower", [
            { icon: "Lime Directional Arrow", style: { color: serverUiText } },
            { str: "Click on one of your brainrots to upgrade.", style: { color: serverUiText } },
            { str: "\nPay gold and make it produce more!", style: { color: serverUiText, fontStyle: "italic", fontSize: "17px" } },
        ]);
    } else if (actionType == "claim") {
        api.setClientOption(myId, "middleTextLower", [
            { icon: "Block of Gold", style: { color: serverUiText } },
            { str: "Click on one of your brainrots to claim the coins it earned you!", style: { color: serverUiText } },
            { str: "\nUpgrade it to be able to produce more coins per second.", style: { color: serverUiText, fontStyle: "italic", fontSize: "17px" } },
        ]);
    } else if (actionType == "bat") {
        api.setClientOption(myId, "middleTextLower", [
            { icon: "Horizontal Knockback Enchantment", style: { color: serverUiText } },
            { str: "Click on a player to launch them away.", style: { color: serverUiText } },
            //{ str: "\n...", style: { color: serverUiText, fontStyle: "italic", fontSize: "17px" } },
        ]);
    } else if (actionType == "resetbutton") {
        api.setClientOption(myId, "middleTextLower", [
            { icon: "Red Paintball", style: { color: serverUiText } },
            { str: "Click while holding this item to get sent back to spawn.", style: { color: serverUiText } },
            //{ str: "\n...", style: { color: serverUiText, fontStyle: "italic", fontSize: "17px" } },
        ]);
    } else {
        api.setClientOptionToDefault(myId, "middleTextLower");
    }
}

function canUsePrestigeItem(myId, item) {
    return ((!prestigeItemUsed[myId] || prestigeItemUsed[myId] == item) && !api.hasEffect(myId, `${item}cooldown`));
}

function blockIfUsingPrestigeItem(myId) {
    if (prestigeItemUsed[myId]) {
        api.sendMessage(myId, [{ str: `You're using a prestige item! Please unequip it by holding it and clicking.` }]);
        return true;
    }
    return false;
}

function attemptBlockUsingPrestigeItem(myId) {
    if (false) {
        api.sendMessage(myId, [{ str: `You can't activate this prestige item! Please stop performing that action.` }]);
        return true;
    }
    return false;
}

let prestigeItemActivatedThisTick = {};
let prestigeItemUsed = {};
function onPlayerClick(myId, rc, x, y, z, block, targetEId) {
    prestigeItemActivatedThisTick[myId] = null;
    if (!loaded) { return; }

    if (getHeldActionType(myId) == "67saddle") {
        if (api.hasEffect(myId, "riding67")) {
            if (canUsePrestigeItem(myId, "67saddle")) {
                stopRiding67(myId);
                api.applyEffect(myId, "67saddlecooldown", 15000, { icon: "Spirit Saddle", displayName: "67 Saddle Cooldown" });
                delete prestigeItemUsed[myId];
            }
        } else {
            if (canUsePrestigeItem(myId, "67saddle")) {
                ride67(myId, "67");
                prestigeItemUsed[myId] = "67saddle";
                prestigeItemActivatedThisTick[myId] = true;
            }
        }
    } else if (getHeldActionType(myId) == "invisibilityhat") {
        if (api.hasEffect(myId, "invisibilityhat")) {
            if (canUsePrestigeItem(myId, "invisibilityhat")) {
                api.removeEffect(myId, "invisibilityhat");
                api.applyEffect(myId, "invisibilityhatcooldown", 15000, { icon: "Black Concrete Slab", displayName: "Invisibility Hat Cooldown" });
                api.setPlayerOpacity(myId, 1);
                delete prestigeItemUsed[myId];
            }
        } else {
            if (canUsePrestigeItem(myId, "invisibilityhat")) {
                api.applyEffect(myId, "invisibilityhat", null, { displayName: "Using Invisibility Hat", icon: "Invisible" });
                api.setPlayerOpacity(myId, 0);
                prestigeItemUsed[myId] = "invisibilityhat";
                prestigeItemActivatedThisTick[myId] = true;
            }
        }
    } else if (getHeldActionType(myId) == "freezeray") {

    } else if (getHeldActionType(myId) == "swapcrystal") {

    } else if (getHeldActionType(myId) == "flashbang") {

    }

    if (!prestigeItemActivatedThisTick[myId]) { if (blockIfUsingPrestigeItem(myId)) { return; } }

    let [lx, ly, lz] = bases[myId].lockPos;

    let held = api.getHeldItem(myId);

    if (block.includes("Pod")) {
        api.sendMessage(myId, [{ str: "Merging doesn't work right now!" }]);
    }

    if (block == "Bin") { api.setPlayerDbValue(myId, "coins", 0); return; }

    if (x == lx && y == ly && z == lz) {
        if (!lockedBases[myId]) {
            lockedBases[myId] = api.now() + (lockTime[myId] * 1000);
            let base = bases[myId];

            setBaseLockedState(myId, "locked");

            api.sendFlyingMiddleMessage(myId, [
                { str: `Locked base.` },
            ], 10, 1000);
        } else {
            api.sendFlyingMiddleMessage(myId, [
                { str: `Your base is already locked!` },
            ], 10, 1000);
        }
    }

    if (held?.name == "Red Paintball" && held?.attributes?.customDisplayName == "Reset Button") {
        api.setVelocity(myId, 0, 3, 0);
        api.setPosition(myId, spawnPos);
    }
}

function onPlayerLeave(myId) {
    if (!loaded) { return; }

    let idx = baseNum[myId];
    try { clearEntireRenderedBase(myId); } catch { }

    try { setBaseLockedState(myId, "unlocked"); } catch { }

    try { if (bases[myId]) { delete bases[myId]; } } catch { }
    try { if (lockTime[myId]) { delete lockTime[myId]; } } catch { }
    try { if (lockedBases[myId]) { delete lockedBases[myId]; } } catch { }
    try { if (stealable[myId]) { delete stealable[myId]; } } catch { }
}

function onWorldAttemptDespawnMob(mobId) {
    if (!loaded) { return "preventDespawn"; }

    let type = api.getEntityType(mobId);
    for (let m of mobs) {
        if (m.id == mobId) { return "preventDespawn"; }
    }
}

function onPlayerDropItem(myId, x, y, z, itemName, itemAmount, fromIdx) {
    if (!loaded) { return "preventDrop"; }

    let username = api.getEntityName(myId);
    if (!admin.includes(username)) { return "preventDrop"; }
}

function onPlayerJoin(myId) {
    defineVariables();

    let username = api.getEntityName(myId);

    if (!admin.includes(username)) { api.matchmakePlayer(myId, "classic_survival", "banish_player"); }

    playerids = api.getPlayerIds();

    ticks = (toload.length * loadwait) + loaddelay;

    if (!loaded) {
        starttime = api.now();

        let estimatedTime = {
            ticks: ticks,
            seconds: (20 * ticks) / 1000,
            ms: 20 * ticks
        };

        try {
            onDelayStart(estimatedTime);
        } catch { }

        if (showlogs) {
            api.log(
                `Functions not loaded. Loading will finish in ${ticks} ticks! ` +
                `(${20 * ticks}ms or ${(20 * ticks) / 1000}seconds)`
            );
        }
    } else {
        try {
            onPlayerJoinHidden(myId);

            if (showlogs) {
                api.log(`Ran onPlayerJoinHidden for ${myId}`);
            }
        } catch {
            if (showlogs) {
                api.log(`Failed to run onPlayerJoinHidden for ${myId}`);
            }
        }
    }
}

function tick() {
    if (shouldLoad) {
        ticknum++;

        if (ticknum > loaddelay && !startloading) {
            let estimatedTime = {
                ticks: ticks - loaddelay,
                seconds: (20 * (ticks - loaddelay)) / 1000,
                ms: 20 * (ticks - loaddelay)
            };

            try {
                onLoadStart(estimatedTime);
            } catch { }

            startloading = true;
            ticknum = -1;
        }

        if (startloading) {
            let exctick = (ticknum % loadwait) == 0;
            let excnum = Math.floor(ticknum / loadwait);

            if (excnum < toload.length) {
                if (exctick) {
                    if (excnum > 0) { excnum--; }
                    if (api.isNearInterrupt()) { return; }
                    let codepos = toload[excnum];

                    let block = api.getBlock(...codepos);

                    let codedata =
                        api.getBlockData(...codepos)
                            ?.persisted
                            ?.shared
                            ?.text;

                    if (codedata) {
                        globalThis.eval(codedata);
                    }

                    if (block == "Unloaded") {

                    }

                    if (showlogs) {
                        if (
                            codedata != undefined &&
                            block == "Code Block"
                        ) {
                            api.log(`Value from ${block} loaded`);
                            excnum++;
                        } else {
                            api.log(
                                `There is no code block with valid block data at ${codepos}`
                            );
                            excnum++;
                        }
                    }
                }
            } else {
                let finishedms = api.now() - starttime;

                let estimatedTime = {
                    ticks: finishedms / 20,
                    seconds: finishedms / 1000,
                    ms: finishedms
                };

                try {
                    onLoadEnd(estimatedTime);
                } catch { }

                for (let p of api.getPlayerIds()) {
                    try {
                        onPlayerJoinHidden(p);
                    } catch { }
                }

                loaded = true;
                shouldLoad = false;
            }
        }
    } else {
        /*try {*/
        tickHidden();
        /*} catch(err) {
            api.log(err);
        }*/
    }
}
