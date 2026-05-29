function randomPlayerInPrestigeItemRadius(myId) {
    let players = getPlayersInPrestigeItemRadius(myId);
    if (!players || !(players.length >= 1)) { return false; }

    let player = players[random(0, players.length - 1)];
    return player;
}

function getPlayersInPrestigeItemRadius(myId) {
    let pos = api.getPosition(myId);
    let [x, y, z] = pos;
    let players = api.getEntitiesInRect([x + 2.5, y + 2, z + 2.5], [x - 2.5, y - 2, z - 2.5]);
    players.splice(players.indexOf(myId), 1);

    return players;
}

function getPrestigeItems(myId) {
    api.clearInventory(myId);


    api.giveItem(myId, "White Torch", 1, {
        customDisplayName: "Flashbang",
        customDescription: "A player in a 5 block radius has their screen go white for a few seconds.",

        customAttributes: {
            enchantments: {},
            enchantmentTier: "Tier 5"
        }
    });

    api.giveItem(myId, "Fireball Block", 1, {
        customDisplayName: "Swap Crystal",
        customDescription: "Swap with a player in a 5 block radius.",

        customAttributes: {
            enchantments: {},
            enchantmentTier: "Tier 5"
        }
    });

    api.giveItem(myId, "Iceball Block", 1, {
        customDisplayName: "Freeze Ray",
        customDescription: "Freeze a player in a 5 block radius.",

        customAttributes: {
            enchantments: {},
            enchantmentTier: "Tier 5"
        }
    });

    api.giveItem(myId, "Stick", 1, {
        customDisplayName: "Galaxy Bat",
        customDescription: "Launch a player into the next galaxy.",

        customAttributes: {
            enchantments: {
                "Vertical Knockback": 3,
                "Horizontal Knockback": 3,
            },
            enchantmentTier: "Tier 5"
        }
    });

    api.giveItem(myId, "Spirit Saddle", 1, {
        customDisplayName: "67 Saddle",
        customDescription: "Ride a six-seveeven six-seeeeeven",

        customAttributes: {
            enchantments: {},
            enchantmentTier: "Tier 5"
        }
    });

    api.giveItem(myId, "Black Concrete Slab", 1, {
        customDisplayName: "Invisibility Hat",
        customDescription: "Become invisible until you perform an action like stealing.",

        customAttributes: {
            enchantments: {},
            enchantmentTier: "Tier 5"
        }
    });
}

function refreshBrainrotRender(myId) {
    let base = bases[myId];
    clearRenderedBrainrots(myId);
    updateBrainrots(myId, base.brainrotPlatforms);
}

function canHit(myId) {
    return !api.hasEffect(myId, "Hit cooldown");
}
function applyHitCooldown(myId, type = "bat") {
    if (type == "bat") {
        api.applyEffect(myId, "Hit cooldown", 1000, { displayName: "Hit cooldown", icon: "Fist" });
    } else if (type == "galaxybat") {
        api.applyEffect(myId, "Hit cooldown", 1500, { displayName: "Hit cooldown", icon: "Fist" });
    }
}
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
    globalThis.shouldUpdatePlayerBrainrots[myId] = true;
}

function updateBrainrotsVisual(myId, spawnAt) {
    stealable[myId] = [];

    try {
        if (!globalThis.savedPlayerMobNum) { globalThis.savedPlayerMobNum = {}; }
    } catch { globalThis.savedPlayerMobNum = {}; }
    try {
        if (!globalThis.savedPlayerMobNum[myId]) { globalThis.savedPlayerMobNum[myId] = 0; }
    } catch { globalThis.savedPlayerMobNum[myId] = 0; }
    
    let brainrots = getBrainrots(myId);

    for (let bNum = globalThis.savedPlayerMobNum[myId]; bNum <= brainrots.length; bNum++) {        
        if (api.isNearInterrupt()) { return false; }
        let b = brainrots[bNum];
        if (!b) { continue; }


        let [x, y, z] = (spawnAt[bNum] ?? [0, 0, 0]);
        y -= 0.5;

        let brainrotConfig = getBrainrotById(b.id);

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

        api.setMobAiState(mob, "disabled", null);

        globalThis.savedPlayerMobNum = bNum;
    }
    globalThis.savedPlayerMobNum[myId] = 0;
    globalThis.shouldUpdatePlayerBrainrots[myId] = false;

    return true;
}

function spawnBrainrotEntity(mob, brainrotData, rarityName, x, y, z, hideDist = 250) {
    api.setMobAiState(mob, "walkingToPosition", { pos: brainrotDeathPos });

    let mesh = api.attemptCreateMeshEntity(brainrotData.meshType, {
        size: brainrotData.size,
        autoRotate: true,

        blockName: (brainrotData.blockName),
        hideDist: hideDist,
    });
    //api.setPosition(mesh, x, y, z);
    api.setPosition(mesh, 0, 0, 0);

    api.applyEffect(mob, "Slowness", null, { inbuiltLevel: 1 });

    if (mesh) {
        api.setTargetedPlayerSettingForEveryone(mesh, "nameTagInfo", {
            content: [
                { str: `${brainrotData.displayName ?? brainrotData.blockName.replace(" Statue", "")}`, style: { fontSize: "85px", color: rarityColors[rarityName] } }
            ], backgroundColor: "rgba(0,0,0,0)",

            subtitle: [
                { str: `${rarityName}   Cost: ${brainrotData.data.cost}   Coins per Second: ${brainrotData.data.cps}` }
            ]
        });
        brainrotData.rarityName = rarityName;
        mobs.push({ rarityName: rarityName, id: mob, mesh: mesh, type: "mesh", invisibleCount: 5, offset: brainrotData.offset, brainrotData: brainrotData });
    } else { return false; }

    api.setPosition(mesh, [0, 0, 0]);
    api.setPosition(mob, [0, 0, 0]);

    return true;
}

function getBrainrotById(id = []) {
    let brainrotConfig = null;
    for (let b of brainrots) {
        if (b.cid == id[0]) {
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

    api.applyEffect(myId, "riding67", null, { icon: "67 Base Projectile", displayName: `Riding 67` });
    api.applyEffect(myId, "Speed", 0, { inbuiltLevel: 3 });

    api.setClientOption(myId, "jumpAmount", 0);
    api.setClientOption(myId, "airJumpCount", 0);

    api.setTargetedPlayerSettingForEveryone(myId, "nameTagInfo", {
        subtitle: [
            { str: "Riding " },
            { str: `67`, style: { color: "lightgray" } }
        ], subtitleBackgroundColor: "rgba(0,0,0,0)"
    });
}

function stopRiding67(myId) {
    api.setPlayerPose(myId, "standing");
    api.updateEntityNodeMeshAttachment(myId, "TorsoNode", null);
    api.updateEntityNodeMeshAttachment(myId, "LegLeftMesh", null);

    api.removeEffect(myId, "riding67");
    api.removeEffect(myId, "Speed");

    api.setClientOption(myId, "jumpAmount", 8);
    api.setClientOption(myId, "airJumpCount", 0);

    api.setTargetedPlayerSettingForEveryone(myId, "nameTagInfo", {});
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
    api.clearInventory(myId);

    api.setItemSlot(myId, 0, "Stick", 1, {
        customDisplayName: "Bat",
        customDescription: "Hit players with this to launch them away!",
        customAttributes: {
            enchantments: {
                "Vertical Knockback": 1,
                "Horizontal Knockback": 1,
            }, enchantmentTier: "Tier 4"
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
    let coins = api.getPlayerDbValue(myId, "coins");

    coins += add;

    api.setPlayerDbValue(myId, "coins", coins);
    api.applyEffect(myId, "Coins", null, { displayName: `${coins} Coins`, icon: "Gold Coin" });
}
