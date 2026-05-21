//update: aaa

/*
=== TODO ===

== stealing brainrots from other players ==
General:
- Store the claimable coins somewhere else during steal process?
On attempt steal:
1. Give the player the effect and display of holding a brainrot
2. Remove the brainrot from the player's database (re-add if the thief leaves)
Succesful steal:
1. Add the brainrot to the thief's database and re-render
2. Remove the effect and display
Failed steal:
1. Re-add the brainrot to the owner's DB
2. Remove the effect and display

- invis solid not removed when a player leaves with an active base lock

- players who leave when initializing or in some other cases break the code forever

=== Important Helper Functions ===


=== BUGS ===

- onPlayerJoin not fully registering on interrupt
- some brainrot mesh not being removed (seems like a Bloxd bug)
- ensure proper sizing and offset for blocks like "Diamond Bloxd"
- there seems to be an issue where player coins are synced
- attacked brainrot sometimes (possibly) gets removed from the list of brainrots to move
*/

claimingStart = 1779157161692;

spawnPos = [-999, -996, -999];

purchaseMob = [];

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

function refreshBrainrotRender(myId) {
    let base = bases[myId];
    clearRenderedBrainrots(myId);
    updateBrainrots(myId, base.brainrotPlatforms);
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

stealing = {};
beingStolenFrom = {};
function onPlayerDamagingMob(myId, mobId, dmgDealt, withItem, damagerDbId) {
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

function getHeldActionType(myId) {
    let item = api.getHeldItem(myId);
    let customName = item?.attributes.customDisplayName;

    if (customName == "Upgrade") { return "upgrade"; }
    if (customName == "Claim") { return "claim"; }
    if (customName == "Sell") { return "sell"; }

    if (customName == "Bat") { return "bat"; }

    if (customName == "Reset Button") { return "resetbutton"; }

    return null;
}

let serverUiText = "#cef3ff";
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

oldPlayers = [];

function canHit(myId) {
    return !api.hasEffect(myId, "Hit cooldown");
}
function applyHitCooldown(myId) {
    api.applyEffect(myId, "Hit cooldown", 1000, { displayName: "Hit cooldown", icon: "Fist" });
}

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
let oldCoins = {};

let updateSidebar = {};
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

let dbListSeparator = "|dbListSeparator|";

function addBrainrot(myId, content) {
    let brainrots = getBrainrots(myId);
    let hasUpdated = false;

    for (let i = 0; i < brainrots.length; i++) {
        let b = brainrots[i];

        if (b === null) {
            brainrots[i] = content;
            hasUpdated = true;
            break;
        }
    }

    if (!hasUpdated) { return false; }

    setBrainrots(myId, brainrots);
    return api.getPlayerDbValue(myId, "brainrots");
}

function attemptInitBrainrotDb(myId) {
    let brainrots = api.getPlayerDbValue(myId, "brainrots");
    if (!brainrots) {
        let newBrainrots = [];
        for (let i = 0; i < maxBrainrots; i++) {
            let contents = null;
            newBrainrots.push(contents);
        }
        setBrainrots(myId, newBrainrots);
    }
}

function getBrainrots(myId) {
    let raw = api.getPlayerDbValue(myId, "brainrots");
    if (!raw) {
        return Array(maxBrainrots + 1).fill(null);
    }

    let brainrots = raw.split(dbListSeparator);

    for (let i = 0; i < brainrots.length; i++) {
        let b = brainrots[i];
        try {
            if (b === "null") {
                brainrots[i] = null;
            } else {
                brainrots[i] = JSON.parse(b);
            }
        } catch {
            brainrots[i] = null;
        }
    }

    return brainrots;
}

function setBrainrots(myId, brainrots) {
    let serialized = [];

    for (let i = 0; i < brainrots.length; i++) {
        let b = brainrots[i];
        if (b === null) {
            serialized.push("null");
        } else {
            serialized.push(JSON.stringify(b));
        }
    }

    let value = serialized.join(dbListSeparator);
    api.setPlayerDbValue(myId, "brainrots", value);
}

function removeBrainrot(myId, idx) {
    let brainrots = getBrainrots(myId);
    brainrots[idx] = null;
    setBrainrots(myId, brainrots);
}

function setBrainrot(myId, idx, brainrot) {
    let brainrots = getBrainrots(myId);
    brainrots[idx] = brainrot;
    setBrainrots(myId, brainrots);
}

function setBrainrotValue(myId, idx, key, value) {
    let brainrot = getBrainrots(myId)[idx];
    brainrot[key] = value;
    setBrainrot(myId, idx, brainrot);
}

function getBrainrotValue(myId, idx, key) {
    let brainrot = getBrainrots(myId)[idx];
    return brainrot[key];
}

let lavaPos = [-999, -1002, -941];

brainrotSpawnPos = [-999, -999, -1025];
brainrotDeathPos = [-999, -997, -942.5];

let spawnFreq = 20;
const maxConsec = 1;
const waitNum = 5;

maxBrainrots = 12; // real max: 12

let defOwnedBaseNametag = {
    title: {
        style: { color: "#d6362b", fontSize: "80px" },
        backgroundColor: "#fa5b50",
    },
    subtitle: {
        style: { color: "#d62bc5", fontSize: "50px" },
        backgroundColor: "#e080d7",
    },
};

let defBaseNametag = {
    title: {
        style: { color: "#d6362b", fontSize: "50px" },
        backgroundColor: "#fa5b50",
    },
    subtitle: {
        style: { color: "#d62bc5", fontSize: "50px" },
        backgroundColor: "#e080d7",
    },
};

let defLockTime = 30;

let lockedBases = {};
let lockTime = {};

bases = {};
let baseNum = {};

let tickNum = 0;

let tickNum2 = 0;

let consec = 0; let wait = 0; function tick() {
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
                api.log(`Let's try to despawn ${mobId}`);
                //api.setPosition(mobId, ...brainrotDeathPos);
                //api.despawnMob(mobId);

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
            if (tickNum % (spawnFreq) == 1) {
                let [x, y, z] = brainrotSpawnPos;

                let rarity = randomRarity();
                /*let mob = api.attemptSpawnMob("NPC", ...[-999, -1005, -1033]); //previously*/ let mob = api.attemptSpawnMob("NPC", ...brainrotSpawnPos);
                //api.log(`Spawned mob ${mob}`)

                let brainrotPool = brainrots[rarity.idx].ents;
                let brainrotData = brainrotPool[random(0, brainrotPool.length - 1)];

                if (mob) {
                    spawnBrainrotEntity(mob, brainrotData, rarity.name, x, y, z);
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
                    mobs.splice(m, 1);
                };

                let [x, y, z] = [null, null, null];
                try { [x, y, z] = api.getPosition(m); } catch (err) {
                    //api.log(`Failed to get position of ${m}. Removing.\n\nError: ${JSON.stringify(err)}`);
                    remove(m, mobs[mNum]?.mesh, mNum); continue;
                }

                let mesh = mobs[mNum].mesh;

                //api.setPosition(m, brainrotSpawnPos);
                api.setPosition(mesh, [x - (mob.offset ?? [0, 0, 0])[0], y - (mob.offset ?? [0, 0, 0])[1], z - (mob.offset ?? [0, 0, 0])[2]]);

                if (mobs[mNum].invisibleCount > 0) {
                    if (hideMobs) {
                        api.applyEffect(m, "Invisible", null, {});

                    }
                    if (mobs[mNum].invisibleCount <= 1) {
                        api.scalePlayerMeshNodes(m, { TorsoNode: [2, 2, 2], ArmLeftMesh: [1, 1, 1], ArmRightMesh: [1, 1, 1], HeadMesh: [1, 1, 1], LegLeftMesh: [1, 1, 1], LegRightMesh: [1, 1, 1] });
                    }
                    mobs[mNum].invisibleCount--;
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
oldPos = {};

function onPlayerClickUp(myId, rc, x, y, z, block, targetEId) {
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
function runPlayerJoin(myId) {
    if (!playerJoinLevel[myId]) { playerJoinLevel[myId] = 0; }

    api.setCanChangeBlockType(myId, "Fireball Block");

    api.setItemStat(myId, "Fireball Block", "ttb", 1000);

    resetLaserWalkthroughs(myId);

    resetBrainrotsLastClaimedAt(myId);

    let username = api.getEntityName(myId);

    if (!hasSetMax) { api.setMaxPlayers(8, 8); hasSetMax = true; }

    if (playerJoinLevel[myId] <= 0) {// client-side setup
        //api.setPosition(myId, bases[myId].spawnPos); // <= uncomment on publish

        setLightingMode(myId, enableLighting);

        lbNameStyle = { color: "lightgray", fontWeight: "800" };
        api.setClientOptions(myId, {
            "lightingOverride": enableLighting,
            "lobbyLeaderboardInfo": {
                name: {
                    displayName: [{ icon: "Name Tag" }, { str: "Name", style: lbNameStyle, }],
                    sortPriority: 1,
                },
                coins: {
                    displayName: [{ icon: "Gold Coin" }, { str: "Coins", style: lbNameStyle, }],
                    sortPriority: 0,
                },
            },
            cantChangeError: [],

        });

        if (enableLighting) {
            api.setClientOptions(myId, {
                "skyBox": "starry"
            });
        } else {
            api.setClientOptions(myId, {
                "skyBox": {
                    type: "earth",
                    //vertexTint: [0, 0, 0]
                }
            });
        }

        let isAdmin = admin.includes(username);
        if (isAdmin) {
            applyCustomItems(myId);
            api.setCanChangeBlockType(myId, "Invisible Solid");
            api.setWalkThroughType(myId, "Invisible Solid", false);
            api.setWalkThroughRect(myId, [-1000, 0, -942], [-999, -10000, -941], 2);

            api.setClientOptions(myId, {
                canChange: true,
                useFullInventory: true,
                inventoryItemsMoveable: true,
                maxHealth: null,
            });
            api.setHealth(myId, null);
        } else {
            applyCustomItems(myId);
            api.setCantChangeBlockType(myId, "Invisible Solid");
            api.setWalkThroughType(myId, "Invisible Solid", true);
            api.setWalkThroughRect(myId, [-1000, 0, -942], [-999, -10000, -941], 0);

            api.setClientOptions(myId, {
                canChange: false,
                useFullInventory: false,
                inventoryItemsMoveable: false,
                creative: false,
                maxHealth: 100,
            });
            api.setHealth(myId, 100);
        }

        api.setWalkThroughType(myId, "Pink Portal");

        api.setItemStat(myId, "Gold Coin", "displayName", "+ Coins");
        api.setItemStat(myId, "Gold Coin", "description", "Get coins for each of this item you pick up.");

        api.setItemStat(myId, "Gold Fragment", "displayName", "- Coins");
        api.setItemStat(myId, "Gold Fragment", "description", "Lose coins for each of this item you pick up.");

        playerJoinLevel[myId]++;
    }

    if (playerJoinLevel[myId] <= 1) { // database and object setup
        let coins = api.getPlayerDbValue(myId, "coins");
        if (!coins) {
            api.setPlayerDbValue(myId, "coins", 0);
        }
        playerBrainrotIds[myId] = {};
        updateSidebar[myId] = true;
        lockTime[myId] = defLockTime;

        playerJoinLevel[myId]++;
    }

    if (playerJoinLevel[myId] <= 2) { // brainrot init
        attemptInitBrainrotDb(myId);

        playerJoinLevel[myId]++;
    }


    if (playerJoinLevel[myId] <= 3) { // base init 1
        let freeBaseIdx = getFreeBase();
        baseNum[myId] = freeBaseIdx;
        bases[myId] = { ...basesConfig[freeBaseIdx] }; bases[myId].idx = freeBaseIdx;

        playerJoinLevel[myId]++;
    }
    let base = bases[myId];

    if (playerJoinLevel[myId] <= 4) { // client-side base setup
        let lsp = base.laserStartPos;
        api.setWalkThroughRect(myId, [lsp[0], lsp[1] + 3, lsp[2]], [lsp[0], lsp[1] + 1, lsp[2] - 1], 1);

        let otherLasers = base.otherLasers;
        for (let laser of otherLasers) {
            let [olx, oy, oz] = laser;
            api.setWalkThroughRect(myId, [olx, oy + 1, oz], [olx, oy + 3, oz], 1);
        }

        playerJoinLevel[myId]++;
    }

    if (playerJoinLevel[myId] <= 5) { // base init 2
        updateBrainrots(myId, base.brainrotPlatforms);
        nametag = api.attemptCreateMeshEntity("BloxdBlock", {
            blockName: "Invisible Solid",
            size: 1,
        }, `${username}'s Base`);

        api.setPosition(nametag, bases[myId].nametagPos);
        base.nametag = nametag;
        updateBaseNametag(myId, true);

        createLockNotif(myId, base.lockPos);

        playerJoinLevel[myId]++;
    }

    delete shouldRunPlayerJoin[myId];
}

function onWorldAttemptDespawnMob(mobId) {
    let type = api.getEntityType(mobId);
    //api.log(`Attempted to despawn ${type}`);
    for (let m of mobs) {
        if (m.id == mobId) { return "preventDespawn"; }
    }
}

let defSize = 2;
let defOffset = [0, 0.85, 0];

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
            { meshType: "BloxdBlock", blockName: "67 Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 0 },
            { meshType: "BloxdBlock", blockName: "Bobzilla Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 1 },
            { meshType: "BloxdBlock", blockName: "Brra Brra Pachim Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 2 },
            { meshType: "BloxdBlock", blockName: "Monsieur Bedwar Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 3 },
        ], name: "Common", chance: 1, cid: 0,
    },

    {
        ents: [
            { meshType: "BloxdBlock", blockName: "Duo Blocchino Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 0 },
            { meshType: "BloxdBlock", blockName: "Capitano Explovissimo Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 1 },
            { meshType: "BloxdBlock", blockName: "Il Wizardini Del Porko Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 2 },
        ], name: "Uncommon", chance: 0.5, cid: 1,
    },

    {
        ents: [
            { meshType: "BloxdBlock", blockName: "Bebek Bebek Bebek Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 0 },
            { meshType: "BloxdBlock", blockName: "Chimpanzano Bananano Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 1 },
            { meshType: "BloxdBlock", blockName: "Twirlina Cappucina Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 2 },
            { meshType: "BloxdBlock", blockName: "Block of Diamond", displayName: "Diamond Bloxd", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 3 },
        ], name: "Rare", chance: 0.25, cid: 2,
    },

    {
        ents: [
            { meshType: "BloxdBlock", blockName: "Bobino Musculino Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 0 },
            { meshType: "BloxdBlock", blockName: "Cappuccino Ninjino", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 1 },
        ], name: "Legendary", chance: 0.1, cid: 3,
    },

    {
        ents: [
            { meshType: "BloxdBlock", blockName: "Lucchia Blocchi Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 }, cid: 0 },
        ], name: "Mythical", chance: 0.05, cid: 4,
    },
];

tickNum = 0;

let pId = 0;
let pNum = 0;

let startWorldTickAt = 0;//20;

mobs = [];
let players;

let hasspawnedmesh = false;

function clearAll() {
    mobs = [];

    for (let e of api.getMobIds()) {
        api.despawnMob(e);
    }
    for (let e of api.getEntitiesInRect([-10000, -10000, -10000], [10000, 10000, 10000])) {
        let type = api.getEntityType(e);
        if (type == "Mesh") { api.deleteMeshEntity(e); }
    }
}; clearAll();

function randomRarity() {
    const _random = () => (Math.random());
    const r = _random();

    let lowest = brainrots[0];
    for (let bNum in brainrots) {
        let b = brainrots[bNum];

        let chance = b.chance;
        if (r <= chance) {
            lowest = b;
        }
    }

    return { idx: brainrots.indexOf(lowest), name: lowest.name, chance: lowest.chance };;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createLaser(x, y, z, height = 5) {
    laser1 = api.attemptCreateMeshEntity("BloxdBlock", {
        size: [0.5, height, 0.5],
        blockName: "Red Concrete",
        hideDist: 100,
    }, "laser");
    api.setTargetedPlayerSettingForEveryone(laser1, "nameTagInfo", { content: [] });
    api.setPosition(laser1, [x + 0.5, y + 1, z + 0.5]);
}

function removeLaser(x, y, z) {
    for (let e of api.getEntitiesInRect([x - 1, y - 1, z - 1], [z + 1, y + 10, z + 1])) {
        let type = api.getEntityType(e);

        if (type == "Mesh") { if (api.getEntityName(e) == "laser") { api.deleteMeshEntity(e); } }
    }
}

function createLockNotif(myId, pos) {
    let [x, y, z] = pos;

    lockNotif = api.attemptCreateMeshEntity("BloxdBlock", {
        size: [1, 1, 1],
        blockName: "Invisible Solid",
        hideDist: 10,
    }, "lockbase");

    api.setTargetedPlayerSettingForEveryone(lockNotif, "canSee", false, true);
    api.setOtherEntitySetting(myId, lockNotif, "canSee", true);

    api.setOtherEntitySetting(myId, lockNotif, "nameTagInfo", {
        content: [
            { str: "Lock Base", style: { fontSize: "150px" } }
        ],
        subtitle: [
            { str: "Click on the Block of Iron to lock." }
        ]
    });
    api.setPosition(lockNotif, [x + 0.5, y + 0, z + 0.5]);
}

function setBaseLockedState(myId, type = "locked") {
    let base = bases[myId];

    let [lx, ly, lz] = base.laserStartPos;
    let otherLasers = base.otherLasers;

    if (type == "locked") {
        api.setBlockRect([lx, ly + 1, lz - 1], [lx, ly + 3, lz], "Invisible Solid");
        createLaser(lx, ly - 2, lz);
        createLaser(lx, ly - 2, lz - 1);

        for (let laser of otherLasers) {
            let [olx, oy, oz] = laser;

            createLaser(olx, oy, oz, 3);
            api.setBlockRect([olx, oy + 1, oz], [olx, oy + 3, oz], "Invisible Solid");
        }
    } else if (type == "unlocked") {
        api.setBlockRect([lx, ly + 1, lz - 1], [lx, ly + 3, lz], "Air");
        removeLaser(lx, ly - 2, lz);
        removeLaser(lx, ly - 2, lz - 1);

        for (let laser of otherLasers) {
            let [olx, oy, oz] = laser;

            removeLaser(olx, oy, oz);
            api.setBlockRect([olx, oy + 1, oz], [olx, oy + 3, oz], "Air");
        }
    }
};

function log(msg) { api.sendMessage(api.getPlayerId("WanderingCannoli"), JSON.stringify(msg)); }

function isCannoli(myId) { return api.getEntityName(myId) == "WanderingCannoli"; };

function getFreeBase() {
    let indexes = [];

    for (let id in bases) {
        indexes.push(bases[id].idx);
    }

    let numbers = [0, 1, 2, 3, 4, 5, 6, 7];
    for (let num of numbers) {
        if (!indexes.includes(num)) {
            return num;
        }
    }
    return false;
}

function updateBaseNametag(ownerId, onJoin = false) {
    //api.log(`called updateBaseNametag`)
    let username = api.getEntityName(ownerId);
    let base = bases[ownerId];

    let timeleft = Math.ceil((lockedBases[ownerId] - api.now()) / 1000);

    let nametag = base.nametag;

    if (!lockedBases[ownerId]) {
        api.setTargetedPlayerSettingForEveryone(nametag, "nameTagInfo", { content: [{ str: `${username}'s Base`, style: defBaseNametag.title.style }], backgroundColor: defBaseNametag.title.backgroundColor });
    } else {
        api.setTargetedPlayerSettingForEveryone(nametag, "nameTagInfo", { content: [{ str: `${username}'s Base`, style: defBaseNametag.title.style }], backgroundColor: defBaseNametag.title.backgroundColor, subtitle: [{ str: `Time left: ${timeleft}`, style: defBaseNametag.subtitle.style }], subtitleBackgroundColor: defBaseNametag.subtitle.backgroundColor });
    }
    if (!lockedBases[ownerId]) {
        api.setOtherEntitySetting(ownerId, nametag, "nameTagInfo", { content: [{ str: `Your base`, style: defOwnedBaseNametag.title.style }], backgroundColor: defBaseNametag.title.backgroundColor });
    } else {
        api.setOtherEntitySetting(ownerId, nametag, "nameTagInfo", { content: [{ str: `Your base`, style: defOwnedBaseNametag.title.style }], backgroundColor: defOwnedBaseNametag.title.backgroundColor, subtitle: [{ str: `Time left: ${timeleft}`, style: defOwnedBaseNametag.subtitle.style }], subtitleBackgroundColor: defOwnedBaseNametag.subtitle.backgroundColor });
    }
    if (onJoin) { api.setOtherEntitySetting(ownerId, nametag, "hasPriorityNametag", true); }
}

function updateBrainrots(myId, spawnAt) {
    stealable[myId] = [];

    let brainrots = getBrainrots(myId);
    for (let bNum in brainrots) {
        let b = brainrots[bNum];
        if (!b) { continue; }


        let [x, y, z] = (spawnAt[bNum] ?? [0, 0, 0]);
        y -= 0.5;

        //api.log(`Spawning at ${[x, y, z]}`)

        //api.log(b.id);
        let brainrotConfig = getBrainrotById(b.id);
        //api.log(brainrotConfig);

        let mesh = api.attemptCreateMeshEntity("BloxdBlock", {
            size: brainrotConfig.size,
            autoRotate: true,

            blockName: (brainrotConfig.blockName),
            hideDist: 15,
        });
        api.setPosition(mesh, x + 0, y + 0, z + 0);

        let mob = api.attemptSpawnMob("Draugr Zombie", 0, 0, 0);
        let rarityName = b.rarityName;
        let level = b.level;
        //api.log(`Called updateBrainrots`)
        api.setTargetedPlayerSettingForEveryone(mesh, "nameTagInfo", {
            content: [
                { str: `${brainrotConfig.displayName ?? (brainrotConfig.blockName.replace(" Statue", ""))}`, style: { fontSize: "65px", color: rarityColors[rarityName] } },
            ], backgroundColor: "rgba(0,0,0,0)",

            subtitle: [
                { str: `${rarityName}   Cost: ${brainrotConfig.data.cost}   CpS: ${brainrotConfig.data.cps * level}    Level: ${level}`, style: { fontSize: "20px" } }
            ]
        });

        playerBrainrotIds[myId][mob] = { idx: bNum };
        stealable[myId].push(mob);
        toHide.push({ id: mob, count: 10, pos: [x, y, z] });
        //api.log(`Pushed to toHide`);
        api.setMobAiState(mob, "disabled", null);
    }
}

function spawnBrainrotEntity(mob, brainrotData, rarityName, x, y, z, hideDist = 250) {
    api.setMobAiState(mob, "walkingToPosition", { pos: brainrotDeathPos });

    let mesh = api.attemptCreateMeshEntity(brainrotData.meshType, {
        size: brainrotData.size,
        autoRotate: true,

        blockName: (brainrotData.displayName ?? brainrotData.blockName),
        hideDist: hideDist,
    });
    api.setPosition(mesh, x, y, z);

    api.applyEffect(mob, "Slowness", null, { inbuiltLevel: 1 });

    if (mesh) {
        api.setTargetedPlayerSettingForEveryone(mesh, "nameTagInfo", {
            content: [
                { str: `${brainrotData.blockName.replace(" Statue", "")}`, style: { fontSize: "85px", color: rarityColors[rarityName] } }
            ], backgroundColor: "rgba(0,0,0,0)",

            subtitle: [
                { str: `${rarityName}   Cost: ${brainrotData.data.cost}   Coins per Second: ${brainrotData.data.cps}` }
            ]
        });
        brainrotData.rarityName = rarityName;
        mobs.push({ rarityName: rarityName, id: mob, mesh: mesh, type: "mesh", invisibleCount: 5, offset: brainrotData.offset, brainrotData: brainrotData });
        //api.log(mobs[mobs.length - 1]);
    }
}

// admin commands
function onPlayerChat(myId, message) {
    let name = api.getEntityName(myId);
    let admins = ["WanderingCannoli", "JavisthejavisYT"];

    if (admins.includes(name) && message.startsWith("!spawn ")) {
        let targetName = message.replace("!spawn ", "").trim().toLowerCase();
        let found = false;

        for (let category of brainrots) {
            for (let ent of category.ents) {
                let checkName = ent.blockName.toLowerCase();
                let dispName = ent.displayName ? ent.displayName.toLowerCase() : "";

                if (checkName === targetName || dispName === targetName || checkName.replace(" statue", "") === targetName) {
                    let [x, y, z] = brainrotSpawnPos;
                    let mob = api.attemptSpawnMob("NPC", ...brainrotSpawnPos);
                    if (mob) {
                        spawnBrainrotEntity(mob, ent, category.name, x, y, z);
                        api.sendMessage(myId, `Spawned ${ent.blockName}!`);
                    }
                    found = true;
                    break;
                }
            }
            if (found) break;
        }

        if (!found) {
            api.sendMessage(myId, "Brainrot not found.");
        }
        return "preventChat";
    }
}
function getBrainrotById(id = []) {
    let brainrotConfig = null;
    for (let b of brainrots) {
        //api.log(id[0])
        if (b.cid == id[0]) {
            //api.log(`Rarity match: ${b.cid}`)
            for (let e of b.ents) {
                if (e.cid == id[1]) {
                    brainrotConfig = e;
                }
            }
        }
    }
    if (brainrotConfig) {
        return brainrotConfig;
    }
    return false;
}

function clearRenderedBrainrots(myId) {
    let base = bases[myId];
    if (!base) { return; }
    let [x1, y1, z1] = base.borders[0];
    let [x2, y2, z2] = base.borders[1];
    for (let ent of api.getEntitiesInRect([x1, y1, z1], [x2, y2, z2])) {
        let name = api.getEntityName(ent);
        //log(`${name}`);
        let protectedMesh = ["lockbase", "laser"];
        if (api.getEntityType(ent) == "Mesh" && !name.includes("'") && !protectedMesh.includes(name)) {
            api.deleteMeshEntity(ent);
        }
        else {
            try { api.despawnMob(ent); } catch { }
        }
    }
}

function clearEntireRenderedBase(myId) {
    let base = bases[myId];
    if (!base) { return; }
    let [x1, y1, z1] = base.borders[0];
    let [x2, y2, z2] = base.borders[1];
    for (let ent of api.getEntitiesInRect([x1, y1, z1], [x2, y2, z2])) {
        let name = api.getEntityName(ent);
        //log(`${name}`);
        if (api.getEntityType(ent) == "Mesh") {
            api.deleteMeshEntity(ent);
        }
        else {
            try { api.despawnMob(ent); } catch { }
        }
    }
}

function create3dText() {
    // Rebirth
    let text = api.attemptCreateMeshEntity("BloxdBlock", {
        size: 1,
        blockName: "Invisible Solid",
        hideDist: 1000,
    });

    api.setTargetedPlayerSettingForEveryone(text, "nameTagInfo", {
        content: [
            { str: "Rebirth", style: { fontSize: "100px", color: "#1052eb" } }
        ], backgroundColor: "rgba(0,0,0,0)",
        subtitle: [
            { str: "(Not yet added)" }
        ]
    });
    //api.setTargetedPlayerSettingForEveryone(text, "hasPriorityNametag", true);

    let [x, y, z] = customText.rebirth;
    api.setPosition(text, [x + 0.5, y, z + 0.5]);

    // Server Luck
    let text1 = api.attemptCreateMeshEntity("BloxdBlock", {
        size: 1,
        blockName: "Invisible Solid",
        hideDist: 1000,
    });

    api.setTargetedPlayerSettingForEveryone(text1, "nameTagInfo", {
        content: [
            { str: "Server Luck", style: { fontSize: "100px", color: "#ebc310" } }
        ], backgroundColor: "rgba(0,0,0,0)",
        subtitle: [
            { str: "(Not yet added)" }
        ]
    });
    //api.setTargetedPlayerSettingForEveryone(text1, "hasPriorityNametag", true);

    let [x1, y1, z1] = customText.luck;
    api.setPosition(text1, [x1 + 0.5, y1, z1 + 0.5]);

    // Merge Machine
    let text2 = api.attemptCreateMeshEntity("BloxdBlock", {
        size: 1,
        blockName: "Invisible Solid",
        hideDist: 1000,
    });

    api.setTargetedPlayerSettingForEveryone(text2, "nameTagInfo", {
        content: [
            { str: "Merge", style: { fontSize: "100px", color: "#eb1097" } }
        ], backgroundColor: "rgba(0,0,0,0)",
        subtitle: [
            { str: "(Not yet added)" }
        ]
    });
    //api.setTargetedPlayerSettingForEveryone(text2, "hasPriorityNametag", true);

    let [x2, y2, z2] = customText.merge;
    api.setPosition(text2, [x2 + 0.5, y2, z2 + 0.5]);

    // Debug Reset All
    let text3 = api.attemptCreateMeshEntity("BloxdBlock", {
        size: 1,
        blockName: "Invisible Solid",
        hideDist: 1000,
    });

    api.setTargetedPlayerSettingForEveryone(text3, "nameTagInfo", {
        content: [
            { str: "Reset All", style: { fontSize: "100px", color: "#eb1010" } }
        ], backgroundColor: "rgba(0,0,0,0)",
        subtitle: [
            { str: "Debug only! Break this if your base is out of date." }
        ]
    });
    //api.setTargetedPlayerSettingForEveryone(text3, "hasPriorityNametag", true);

    let [x3, y3, z3] = customText.debugReset;
    api.setPosition(text3, [x3 + 0.5, y3, z3 + 0.5]);
}

function setLightingMode(myId, on = true) {
    if (![true, false].includes(on)) { on = false; }
    if (on) {
        api.setClientOptions(myId, {
            "skyLightColourOverride": "#107eeb",
            "ambientLightColourOverride": "#107eeb"
        });
    } else {
        api.setClientOptions(myId, {
            "skyLightColourOverride": null,
            "ambientLightColourOverride": null
        });
    }
}

function beginRunPlayerJoin(myId) {
    playerJoinLevel[myId] = 0;
    shouldRunPlayerJoin[myId] = true;
    runPlayerJoin(myId);
}

function removeBrainrotStealingEffect(myId) {
    api.setPlayerPose(myId, "standing");
    api.updateEntityNodeMeshAttachment(myId, "HeadMesh", null);

    api.setTargetedPlayerSettingForEveryone(myId, "nameTagInfo", {});

    api.removeEffect(myId, "stealingBrainrot");
    api.setClientOptions(myId, {
        "speedMultiplier": 1,
        "jumpAmount": 8,
    });
}

function showBrainrotStealingEffect(myId, brainrotName = "67 Statue") {
    let trimmedName = brainrotName.replace("Statue", "");

    api.setPlayerPose(myId, "standing");
    api.updateEntityNodeMeshAttachment(myId, "HeadMesh", "BloxdBlock", {
        autoRotate: true,
        size: 1,
        blockName: brainrotName,
    }, [0, 0.59, 0], [0, 0, 0]);

    api.setTargetedPlayerSettingForEveryone(myId, "nameTagInfo", {
        subtitle: [
            { str: "Stealing " },
            { str: `${trimmedName}`, style: { color: "lightgray" } }
        ], subtitleBackgroundColor: "rgba(0,0,0,0)"
    });

    api.applyEffect(myId, "stealingBrainrot", null, { icon: "Thief", displayName: `Stealing: ${trimmedName}` });
    api.setClientOptions(myId, {
        "speedMultiplier": 0.5,
        "jumpAmount": 4,
    });
}

function ride67(myId, brainrotName = "67 Statue") {
    api.setPlayerPose(myId, "riding");
    api.updateEntityNodeMeshAttachment(myId, "LegLeftMesh", "BloxdBlock", {
        autoRotate: true,
        size: 0.8,
        blockName: "67 Statue",
    }, [-0.1, -0.1, -0.7], [1.5, 0, 0]);

    api.applyEffect(myId, "riding67", null, { icon: "Light Blue Neon", displayName: `Riding 67` });
    api.applyEffect(myId, "Speed", 0, { inbuiltLevel: 3 });

    api.setClientOption(myId, "jumpAmount", 0);
    api.setClientOption(myId, "airJumpCount", 0);
}

function stopRiding67(myId) {
    api.setPlayerPose(myId, "standing");
    api.updateEntityNodeMeshAttachment(myId, "TorsoNode", null);
    api.updateEntityNodeMeshAttachment(myId, "LegLeftMesh", null);

    api.removeEffect(myId, "riding67");
    api.removeEffect(myId, "Speed");

    api.setClientOption(myId, "jumpAmount", 8);
    api.setClientOption(myId, "airJumpCount", 0);
}

function isInOwnBase(myId) {
    let base = bases[myId];
    if (!base) { return; }
    let pos = api.getPosition(myId);

    let isInside = isInsideCube(pos, base.borders[0], base.borders[1]);
    return isInside;
}

function isInsideCube(pos, pos1, pos2) {
    const [x1, y1, z1] = pos1;
    const [x2, y2, z2] = pos2;
    const [x, y, z] = pos;

    const inX = x >= Math.min(x1, x2) && x <= Math.max(x1, x2);
    const inY = y >= Math.min(y1, y2) && y <= Math.max(y1, y2);
    const inZ = z >= Math.min(z1, z2) && z <= Math.max(z1, z2);

    if (inX && inY && inZ) {
        return true;
    }
    return false;
}

function applyCustomItems(myId) {
    //api.clearInventory(myId);

    api.setItemSlot(myId, 0, "Stick", 1, {
        customDisplayName: "Bat",
        customDescription: "Hit players with this to launch them away!",
        customAttributes: {
            enchantments: {
                "Vertical Knockback": 1,
                "Horizontal Knockback": 1,
            }, enchantmentTier: "Tier 5"
        }
    });

    api.setItemSlot(myId, 1, "Red Paintball", 1, {
        customDisplayName: "Reset Button",
        customDescription: "Click while holding this item to get sent back to spawn.",
        customAttributes: {
            enchantmentTier: "Tier 5"
        }
    });

    api.setItemSlot(myId, 7, "Gold Bar", 1, {
        customDisplayName: "Claim", customDescription: "Click a brainrot while holding this to claim the coins it earned.",
        customAttributes: {
            enchantmentTier: "Tier 5"
        }
    });
    api.setItemSlot(myId, 9, "Lime Paintball", 1, {
        customDisplayName: "Upgrade", customDescription: "Click a brainrot while holding this to upgrade it.",
        customAttributes: {
            enchantmentTier: "Tier 5"
        }
    });
    api.setItemSlot(myId, 8, "Bin", 1, {
        customDisplayName: "Sell", customDescription: "Click a brainrot while holding this to sell it.",
        customAttributes: {
            enchantmentTier: "Tier 5"
        }
    });
}

function minifyTime(time) {
    return Math.round((time - claimingStart) / 1000);
}

function deMinifyTime(time) {
    return Math.round(((time * 1000) + claimingStart));
}

function addCoins(myId, add) {
    let coins = api.getPlayerDbValue(pId, "coins");

    coins += add;

    api.setPlayerDbValue(pId, "coins", coins);
    api.applyEffect(pId, "Coins", null, { displayName: `${coins} Coins`, icon: "Gold Coin" });
}

function removeCoins(myId, remove) {
    let coins = api.getPlayerDbValue(pId, "coins");

    coins -= remove;

    api.setPlayerDbValue(pId, "coins", coins);
    api.applyEffect(pId, "Coins", null, { displayName: `${coins} Coins`, icon: "Gold Coin" });
}

function claimCoins(myId, brainrotIdx) {
    let level = getBrainrotValue(myId, brainrotIdx, "level");
    let cps = getBrainrotById(getBrainrotValue(myId, brainrotIdx, "id")).data.cps;

    let upgradedcps = level * cps;

    let lastclaimed = deMinifyTime(getBrainrotValue(myId, brainrotIdx, "lastClaimedAt"));

    let lastclaimeddist = Math.round(api.now() - lastclaimed) / 1000;


    let earned = Math.round(lastclaimeddist * upgradedcps);
    setBrainrotValue(myId, brainrotIdx, "lastClaimedAt", minifyTime(api.now()));
    addCoins(myId, earned);

    api.sendMessage(myId, [{ str: `Claimed ${earned} coins after ${lastclaimeddist} seconds of not claiming, which generated ${upgradedcps} coins per second.` }]);

    refreshBrainrotRender(myId);
}

function attemptUpgradeBrainrot(myId, brainrotIdx) {
    let level = getBrainrotValue(myId, brainrotIdx, "level");
    let cps = getBrainrotById(getBrainrotValue(myId, brainrotIdx, "id")).data.cps;
    let coins = api.getPlayerDbValue(myId, "coins");

    let cost = Math.max((level * (cps * 10)), 0);

    if (coins >= cost) {
        setBrainrotValue(myId, brainrotIdx, "level", level + 1);
        removeCoins(myId, cost);
        api.sendMessage(myId, [{ str: `Upgraded to level ${level + 1} for ${cost} coins!` }]);
    } else {
        api.sendMessage(myId, [{ str: `You'll need ${cost - coins} more coins in order to upgrade to level ${level + 1}.` }]);
    }

    refreshBrainrotRender(myId);
}

function resetBrainrots(myId) {
    api.deletePlayerDbValue(myId, "brainrots");
    attemptInitBrainrotDb(myId);
    refreshBrainrotRender(myId);
}

function debugResetAll() {
    for (let p of api.getPlayerIds()) {
        resetBrainrots(p);
        addBrainrot(p, { id: [0, 0], rarityName: "Uncommon", level: 1, lastClaimedAt: minifyTime(api.now()) });
        refreshBrainrotRender(p);
    }
}

function attemptSteal(myId) {
    let s = stealing[myId];

    if (s) {
        addBrainrot(myId, { id: s.brainrot.id, rarityName: s.brainrot.rarityName, level: s.brainrot.level, lastClaimedAt: minifyTime(api.now()) });
        removeBrainrotStealingEffect(myId);
        refreshBrainrotRender(myId);

        let stealingBrainrotConfig = getBrainrotById(s.id);
        api.sendFlyingMiddleMessage(s.from, [{ str: `Someone stole your ${stealingBrainrotConfig.name.replace(" Statue", "")}!` }], 100, 1000);
        api.sendFlyingMiddleMessage(myId, [{ str: `Congrats! You stole a ${stealingBrainrotConfig.name.replace(" Statue", "")}!` }], 100, 1000);

        delete stealing[myId];
        beingStolenFrom[s.from] = false;
    }
}

function attemptReturn(myId) { // myId = thief id
    let s = stealing[myId];

    if (s) {
        addBrainrot(s.from, { id: s.brainrot.id, rarityName: s.brainrot.rarityName, level: s.brainrot.level, lastClaimedAt: minifyTime(api.now()) });
        removeBrainrotStealingEffect(myId);
        refreshBrainrotRender(s.from);
        delete stealing[myId];
        beingStolenFrom[s.from] = false;
    }
}

function resetBrainrotsLastClaimedAt(myId) {
    let brainrots = getBrainrots(myId);
    for (let dbIdx in brainrots) {
        let b = brainrots[dbIdx];
        if (b) {
            setBrainrotValue(myId, dbIdx, "lastClaimedAt", minifyTime(api.now()));
        }
    }
}

function resetToStarter(myId) {
    resetBrainrots(myId);
    api.setPlayerDbValue(myId, "coins", 1000);

    api.sendMessage(myId, [{ str: `Reset brainrots and coins.` }]) 
}

function onPlayerDropItem(myId, x, y, z, itemName, itemAmount, fromIdx) {
    let username = api.getEntityName(myId);
    if (!admin.includes(username)) { return "preventDrop"; }
}

function resetLaserWalkthroughs(p) {
    for (let base of basesConfig) {

        let lsp = base.laserStartPos;
        api.setWalkThroughRect(p, [lsp[0], lsp[1] + 3, lsp[2]], [lsp[0], lsp[1] + 1, lsp[2] - 1], 2);

        let otherLasers = base.otherLasers;
        for (let laser of otherLasers) {
            let [olx, oy, oz] = laser;
            api.setWalkThroughRect(p, [olx, oy + 1, oz], [olx, oy + 3, oz], 2);
        }

    }
}

function resetLaserWalkthroughsForEveryone() {
    for (let base of basesConfig) {
        for (let p of api.getPlayerIds()) {
            let lsp = base.laserStartPos;
            api.setWalkThroughRect(p, [lsp[0], lsp[1] + 3, lsp[2]], [lsp[0], lsp[1] + 1, lsp[2] - 1], 2);

            let otherLasers = base.otherLasers;
            for (let laser of otherLasers) {
                let [olx, oy, oz] = laser;
                api.setWalkThroughRect(p, [olx, oy + 1, oz], [olx, oy + 3, oz], 2);
            }
        }
    }
}
