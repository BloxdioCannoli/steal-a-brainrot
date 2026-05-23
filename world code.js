//update: aa

/*
=== TODO ===

- players who leave when initializing or in some other cases break the code forever (seems to be fixed FOR THE MOST PART)

=== Important Helper Functions ===


=== BUGS ===

- some brainrot mesh not being removed (seems like a Bloxd bug)
- there seems to be an issue where player coins are not synced
- brainrots sometimes do not start spawning - maybe due to badly-timed interruptions
*/

toload = [
    [1000, 1000, 1000],
    [1000, 1000, 999],
    [1000, 1000, 998],
    [1000, 1000, 997],
];

loadedcallbacks = [""];

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

brainrotSpawnPos = [-999, -999, -1026];
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
defOffset = [0, 0.85, 0];

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
players;

hasspawnedmesh = false;

consec = 0;

wait = 0;

function onPlayerChangeBlock(myId, x, y, z, fromBlock, toBlock, droppedItem, fromBlockInfo, toBlockInfo) {
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
    let item = api.getHeldItem(myId);
    if (!canHit(myId)) {
        api.sendFlyingMiddleMessage(myId, [{ str: "Hit cooldown active!" }], 10, 1000);
        return "preventDamage";
    } else {
        if (item?.name == "Stick") {
            api.setHealth(damagedPlayer, 100);
            applyHitCooldown(myId);
            attemptReturn(damagedPlayer);
        } else {
            return "preventDamage";
        }
    }
}

function onPlayerDamagingMob(myId, mobId, dmgDealt, withItem, damagerDbId) {
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

                api.log(s.brainrot);
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
        //api.log("---");
        //api.log(mob);
        outer:
        for (let rarity of brainrots) {
            for (let e of rarity.ents) {
                //api.log(e);
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

function tick() {
    //return;
    tickNum2 = (tickNum2 + 1) % 5; if (tickNum2 != 0) { return; }

    if (api.isNearInterrupt()) { return; }
    // if (wait > 0) { wait--; return; } else { if (consec >= maxConsec) { consec = 0; wait = waitNum; } else { consec++; } };

    players = api.getPlayerIds();
    if (!pNum) { pNum = 0; };
    pNum = (pNum + 1) % (players.length + 1);
    tickNum++;

    if (pNum == players.length) {
        // world tick

        if (purchaseMob[0]) {
            let myId = purchaseMob[0].myId;
            let mobId = purchaseMob[0].mobId;
            let mob = purchaseMob[0].mob;
            let rarityId = purchaseMob[0].rarityId;

            let coins = api.getPlayerDbValue(myId, "coins");
            let cost = mob.brainrotData.data.cost;

            let hasAdded = addBrainrot(myId, { id: [rarityId, mob.brainrotData.cid], rarityName: mob.rarityName, level: 1, lastClaimedAt: minifyTime(api.now()) });
            //api.log(`rarityConfigId: ${rarityId}, brainrotConfigId: ${mob.brainrotData.cid}`);
            if (hasAdded) {
                let pos = api.getPosition(mobId);
                let [x, y, z] = pos;

                //api.log(`Let's try to despawn ${mobId}`);
                //api.setPosition(mobId, [x, y+5, z]);
                api.despawnMob(mobId);

                removeCoins(myId, cost);
                api.sendMessage(myId, [{ str: `Purchased brainrot.` }]);

                let base = bases[myId];

                clearRenderedBrainrots(myId);
                updateBrainrots(myId, base.brainrotPlatforms);
            } else {

            }
            purchaseMob.splice(0, 1);
        }

        if (toHide.length > 0) {
            for (let hNum in toHide) {
                let h = toHide[hNum];

                let m = h.id;
                let count = h.count;
                let [x, y, z] = h.pos;

                //api.log(`toHide element at ${[x, y, z]} found`)

                if (count <= 8) {
                    try {
                        if (hideMobs) {
                            api.applyEffect(m, "Invisible", null, {});
                        }
                        api.scalePlayerMeshNodes(m, { TorsoNode: [2, 2, 2], ArmLeftMesh: [1, 1, 1], ArmRightMesh: [1, 1, 1], HeadMesh: [1, 1, 1], LegLeftMesh: [1, 1, 1], LegRightMesh: [1, 1, 1] });
                        api.setPosition(m, [x, y, z]);
                        let effects = api.getEffects(m);
                        //api.log(effects)
                        if (effects.includes("Invisible") && count <= 1) {
                            api.setPosition(mob, x + 0, y + 0, z + 0);
                            toHide.splice(h, 1); continue;
                        }
                        //api.log(`toHide element at ${[x, y, z]} found`)
                    } catch {
                        toHide.splice(hNum, 1);
                    }
                }; h.count--;
            }
        }
        if (!hasspawnedmesh) {
            create3dText();

            let [lx, ly, lz] = lavaPos;

            let mesh = api.attemptCreateMeshEntity("Box", {
                height: 3,
                width: 2,
                depth: 2,

                texture: "lava0",
            });
            api.setPosition(mesh, lavaPos);

            let particles = api.attemptCreateMeshEntity("ParticleEmitter", {
                dir1: [-0.5, 0, -0.5],
                dir2: [0.5, 2.5, 0.5],

                emitRate: 10,
                texture: "square_particle",
                minLifeTime: 0.5,
                maxLifeTime: 0.5,
                minEmitPower: 1,
                maxEmitPower: 2,
                minSize: 0.2,
                maxSize: 0.2,
                manualEmitCount: 50,
                gravity: [0, -10, 0],
                colorGradients: [
                    {
                        timeFraction: 0,
                        minColor: [255, 0, 0, 1],
                        maxColor: [255, 255, 0, 1],
                    },
                ],
                velocityGradients: [
                    {
                        timeFraction: 0,
                        factor: 1,
                        factor2: 1,
                    },
                ],
                blendMode: 1,

                hideDist: 100,
                height: 1,
                width: 1,
                depth: 1,
            });
            api.setPosition(particles, [lx, ly + 2, lz]);

            hasspawnedmesh = true;
        }

        // full world tick
        if (tickNum >= startWorldTickAt) {
            tickNum3 = (tickNum3 + 1) % 2;

            if (tickNum3 == 0) {
                if (nextSpawnAt <= api.now()) {
                    let [x, y, z] = brainrotSpawnPos;

                    let rarity = randomRarity();
                    let [spawnx, spawny, spawnz] = brainrotSpawnPos;
                    let mob = api.attemptSpawnMob("NPC", ...[0, 0, spawnz]); //...brainrotSpawnPos
                    hasPlayedParticle[mob] = false;
                    //api.log(`Spawned mob ${mob}`)

                    let brainrotPool = brainrots[rarity.idx].ents;
                    let brainrotData = brainrotPool[random(0, brainrotPool.length - 1)];

                    if (mob) {
                        spawnBrainrotEntity(mob, brainrotData, rarity.name, x, y, z);
                    }
                    nextSpawnAt = api.now() + 10000;
                }
            }

            for (let mNum = mobs.length - 1; mNum >= 0; mNum--) { // previously: for (let mNum in mobs) {
                let mob = mobs[mNum];
                let m = mobs[mNum].id;

                const remove = (m, mesh, mNum) => {
                    //api.log(`== Removing mob ==`);
                    try {
                        api.deleteMeshEntity(mesh);
                        //api.log(`Removed mesh`); 
                    } catch (err) {
                        // api.log(`Failed to remove mesh (${mesh})\n\nError: ${JSON.stringify(err)}`); 
                    }
                    try {
                        api.despawnMob(m);
                        //api.log(`Despawned mob`); 
                    } catch (err) {
                        //api.log(`Failed to despawn mob (${m})\n\nError: ${JSON.stringify(err)}`); 
                    }
                    mobs.splice(mNum, 1);
                };

                let [x, y, z] = [null, null, null];
                try { [x, y, z] = api.getPosition(m); } catch (err) {
                    //api.log(`Failed to get position of ${m}. Removing.\n\nError: ${JSON.stringify(err)}`);
                    remove(m, mobs[mNum]?.mesh, mNum); continue;
                }

                let mesh = mobs[mNum].mesh;

                let [spawnx, spawny, spawnz] = brainrotSpawnPos;

                api.setPosition(mesh, [x - (mob.offset ?? [0, 0, 0])[0], y - (mob.offset ?? [0, 0, 0])[1], z - (mob.offset ?? [0, 0, 0])[2]]);

                if (mobs[mNum].invisibleCount > 0) {
                    if (hideMobs) {
                        api.applyEffect(m, "Invisible", null, {});

                    }
                    if (mobs[mNum].invisibleCount <= 1) {
                        api.scalePlayerMeshNodes(m, { TorsoNode: [2, 2, 2], ArmLeftMesh: [1, 1, 1], ArmRightMesh: [1, 1, 1], HeadMesh: [1, 1, 1], LegLeftMesh: [1, 1, 1], LegRightMesh: [1, 1, 1] });
                        api.setPosition(m, [spawnx, spawny, spawnz + 1]);
                    }
                    mobs[mNum].invisibleCount--;
                } else {
                    if (!hasPlayedParticle[mob.id]) {
                        rarityParticles(mobs[mNum].rarityName);
                        hasPlayedParticle[mob.id] = true;
                    } else {

                    }
                }

                if (z >= brainrotDeathPos[2]) {
                    //api.log(`Close to death. Removing.`);
                    remove(m, mesh, mNum);
                }
            }
        }
    } else {
        // player tick
        pId = players[pNum];

        if (!playerJoinLevel[pId]) {
            beginRunPlayerJoin(pId);
        }

        let exists = true;
        try {
            if (!api.isAlive(pId)) {
                exists = false;
            }
        } catch { exists = false; }
        if (!exists) { return; }

        if (shouldRunPlayerJoin[pId]) { runPlayerJoin(pId); }

        let coins = api.getPlayerDbValue(pId, "coins");

        if (lockedBases[pId]) {
            if (lockedBases[pId] <= api.now()) {
                setBaseLockedState(pId, "unlocked");
                delete lockedBases[pId];
            }
            updateBaseNametag(pId);
        }

        if (updateSidebar[pId]) {
            api.setClientOption(pId, "RightInfoText", [
                { icon: "Stick", style: { fontSize: "35px" } },
                { str: " Steal a Brainrot", style: { fontSize: "30px", fontWeight: "800", color: "#f5492f" } },
                { str: " ", style: { fontSize: "10px" } },
                { icon: "Rotten Brain", style: { fontSize: "35px" } },
                { str: "\n" },

                { icon: "Gold Trophy", style: { fontSize: "35px" } },
                { str: "Owned by ", style: { fontSize: "18px", fontWeight: "600", color: "#ebd510", fontStyle: "italic" } },
                { str: "JavisthejavisYT\n", style: { fontSize: "18px", fontWeight: "700", color: "#ebd510", fontStyle: "italic" } },

                { icon: "Code Block", style: { fontSize: "35px" } },
                { str: "Coding by ", style: { fontSize: "18px", fontWeight: "600", color: "#eb9310", fontStyle: "italic" } },
                { str: "Bloxdio Cannoli on YT\n", style: { fontSize: "18px", fontWeight: "700", color: "#eb9310", fontStyle: "italic" } },

                //{ icon: "Block of Gold", style: { fontSize: "35px" } },
                //{ str: "Building by ", style: { fontSize: "18px", fontWeight: "600", color: "#10b4eb", fontStyle: "italic" } },
                //{ str: "SKY_SPIRIT", style: { fontSize: "18px", fontWeight: "700", color: "#10b4eb", fontStyle: "italic" } },
            ]);
            updateSidebar[pId] = false;
        }

        let invenCoins = api.getInventoryItemAmount(pId, "Gold Coin");
        if (invenCoins > 0) {
            api.removeItemName(pId, "Gold Coin", invenCoins);
            coins += invenCoins;
        }

        let invenFrags = api.getInventoryItemAmount(pId, "Gold Fragment");
        if (invenFrags > 0) {
            api.removeItemName(pId, "Gold Fragment", invenFrags);
            coins -= invenFrags;
        }

        if (coins != oldCoins[pId]) {
            api.setPlayerDbValue(pId, "coins", coins);
            api.applyEffect(pId, "Coins", null, { displayName: `${coins} Coins`, icon: "Gold Coin" });
            api.setTargetedPlayerSettingForEveryone(pId, "lobbyLeaderboardValues", {
                coins: [
                    { str: `${coins}` }
                ],
            });
        }

        let pos = api.getPosition(pId);
        if (pos != oldPos) {
            let inside = isInOwnBase(pId);
            if (inside) {
                attemptSteal(pId);
            }

        }

        oldCoins[pId] = coins;
        oldPos[pId] = pos;
    }
}

function onPlayerClick(myId, rc, x, y, z, block, targetEId) {
    if (getHeldActionType(myId) == "67saddle") {
        if (api.hasEffect(myId, "riding67")) {
            if (!api.hasEffect(myId, "67saddlecooldown")) {
                stopRiding67(myId);
                api.applyEffect(myId, "67saddlecooldown", 15000, { icon: "Spirit Saddle", displayName: "67 Saddle Cooldown" });
            }
        } else {
            if (!api.hasEffect(myId, "67saddlecooldown")) {
                ride67(myId, "67");
            }
        }
    } else if (getHeldActionType(myId) == "invisibilityhat") {
        if (api.hasEffect(myId, "invisibilityhat")) {
            if (!api.hasEffect(myId, "invisibilityhatcooldown")) {
                api.removeEffect(myId, "invisibilityhat")
                api.applyEffect(myId, "invisibilityhatcooldown", 15000, { icon: "Black Concrete Slab", displayName: "Invisibility Hat Cooldown" });
            }
        } else {
            if (!api.hasEffect(myId, "invisibilityhatcooldown")) {
               api.applyEffect(myId, "invisibilityhat", null, {displayName: "Using Invisibility Hat", icon: "Invisible"})
            }
        }
    }

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
    let idx = baseNum[myId];
    clearEntireRenderedBase(myId);

    setBaseLockedState(myId, "unlocked");

    if (bases[myId]) { delete bases[myId]; }
    if (lockTime[myId]) { delete lockTime[myId]; }
    if (lockedBases[myId]) { delete lockedBases[myId]; }
    if (stealable[myId]) { delete stealable[myId]; }
}

function onPlayerJoin(myId) {
    let username = api.getEntityName(myId);

    if (!admin.includes(username)) { api.matchmakePlayer(myId, "classic_survival", "banish_player"); }

    beginRunPlayerJoin(myId);
}

function onWorldAttemptDespawnMob(mobId) {
    let type = api.getEntityType(mobId);
    //api.log(`Attempted to despawn ${type}`);
    for (let m of mobs) {
        if (m.id == mobId) { return "preventDespawn"; }
    }
}

function onPlayerDropItem(myId, x, y, z, itemName, itemAmount, fromIdx) {
    let username = api.getEntityName(myId);
    if (!admin.includes(username)) { return "preventDrop"; }
}


const loadwait = 5, loaddelay = 25, showlogs = true; let starttime = null, warmUp = api.getBlock(...toload[0]), loaded = false, startloading = false, ticknum = 0; function onPlayerJoin(myId) { playerids = api.getPlayerIds(); ticks = toload.length * loadwait + loaddelay; if (!loaded && startloading) { starttime = api.now(); let estimatedTime = { ticks: ticks, seconds: 20 * ticks / 1e3, ms: 20 * ticks }; try { onDelayStart(estimatedTime); } catch { } if (showlogs) api.log(`Functions not loaded. Loading will finish in ${ticks} ticks! (${20 * ticks}ms or ${20 * ticks / 1e3}seconds)`); } } function tick() { ticknum++; if (ticknum > loaddelay && !startloading) { estimatedTime = { ticks: ticks - loaddelay, seconds: 20 * (ticks - loaddelay) / 1e3, ms: 20 * (ticks - loaddelay) }; try { onLoadStart(estimatedTime); } catch { } startloading = true; ticknum = -1; } if (startloading) { exctick = ticknum % loadwait == 0; excnum = Math.floor(ticknum / loadwait); if (excnum < toload.length) { if (exctick) { codepos = toload[excnum]; let block = api.getBlock(...codepos), codedata = api.getBlockData(...codepos)?.persisted?.shared?.text; globalThis.eval(codedata); if (block == "Unloaded") excnum--; if (showlogs) if (codedata != undefined && block == "Code Block") api.log(`Value from ${block} loaded`); else api.log(`There is no code block with valid block data at ${codepos}`); } } else { loaded = true; let finishedms = api.now() - starttime; estimatedTime = { ticks: finishedms / 20, seconds: finishedms / 1e3, ms: finishedms }; try { onLoadEnd(estimatedTime); } catch { } } } }
