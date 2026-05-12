//update: aaaa
/*
TODO:

- properly clear brainrots onUpdate
- sidebar
- stealing brainrots from other players
- purchasing brainrots
- selling brainrots
- claiming what brainrots earned you
- invis solid not removed when a player leaves with an active base lock

BUGS:

*/

let toHide = [];
let stealable = {};

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

function onPlayerDamagingMob(myId, mobId, dmgDealt, withItem, damagerDbId) {
    let ownedBrainrots = getBrainrots(myId);

    let mob;
    for (let m of mobs) {
        if (m.id == mobId) { mob = m; }
    }
    let rarityId = null;
    for (let rarity of brainrots) {
        for (let e of rarity.ents) {
            if (e.cid == mob.brainrotData.cid) {
                rarityId = rarity.cid;
                break;
            }
        }
        if (rarityId) { break; }
    }
    let hasAdded = addBrainrot(myId, { id: [rarityId, mob.brainrotData.cid] });
    //api.log(`rarityConfigId: ${rarityId}, brainrotConfigId: ${mob.brainrotData.cid}`);
    if (hasAdded) {
        api.despawnMob(mobId);

        let base = bases[myId];
        clearRenderedBrainrots(myId);

        updateBrainrots(myId, base.brainrotPlatforms);
    } else {
        api.sendMessage(myId, [{ str: "You have too many brainrots!" }]);
    }

    return "preventDamage";
}

let dbListSeparator = "|dbListSeparator|";

function addBrainrot(myId, brainrot) {
    let brainrots = getBrainrots(myId);
    let hasUpdated = false;

    for (let i = 0; i < brainrots.length; i++) {
        let b = brainrots[i];

        if (b === null) {
            brainrots[i] = brainrot;
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
        for (let i = 0; i <= maxBrainrots; i++) {
            let contents = null;
            newBrainrots.push(contents);
        }
        setBrainrots(myId, newBrainrots);
    }
}

function getBrainrots(myId) {
    let raw = api.getPlayerDbValue(myId, "brainrots");
    if (!raw) return [];

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

function setBrainrot(myId, idx, brainrot) {
    let brainrots = getBrainrots(myId);
    brainrots[idx] = brainrot;
    setBrainrots(myId, brainrots);
}

let lavaPos = [-999, -1002, -941];

brainrotSpawnPos = [-999, -999, -1025];
brainrotDeathPos = [-999, -997, -942.5];

let spawnFreq = 23;
const maxConsec = 2;
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

let consec = 0; let wait = 0; function tick() {
    if (wait > 0) { wait--; return; } else { if (consec >= maxConsec) { consec = 0; wait = waitNum; } else { consec++; } };

    players = api.getPlayerIds();
    if (!pNum) { pNum = 0; };
    pNum = (pNum + 1) % (players.length + 1);
    tickNum++;

    if (pNum == players.length) {
        // world tick
        if (toHide.length > 0) {
            for (let hNum in toHide) {
                let h = toHide[hNum];

                let m = h.id;
                let count = h.count;
                let [x, y, z] = h.pos;

                if (count <= 1) {
                    api.applyEffect(m, "Invisible", null, {});
                    api.scalePlayerMeshNodes(m, { TorsoNode: [2, 2, 2], ArmLeftMesh: [1, 1, 1], ArmRightMesh: [1, 1, 1], HeadMesh: [1, 1, 1], LegLeftMesh: [1, 1, 1], LegRightMesh: [1, 1, 1] });
                    api.setPosition(m, [x, y, z]);
                    toHide.splice(h, 1);
                } else {
                    h.count--;
                }
            }
        }
        if (!hasspawnedmesh) {
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
        // world tick
        if (tickNum >= startWorldTickAt) {
            if (tickNum % (spawnFreq) == 1) {
                let [x, y, z] = brainrotSpawnPos;
                let usedType = "mesh";

                if (usedType == "mob") {
                    let mob = api.attemptSpawnMob("67", ...brainrotSpawnPos);

                    if (mob) {
                        let [bx, by, bz] = brainrotDeathPos;
                        api.setMobAiState(mob, "walkingToPosition", { pos: [bx, by, bz + 3] });

                        mobs.push({ id: mob, type: usedType });
                    }
                } else if (usedType == "mesh") {
                    let rarity = randomRarity();
                    let mob = api.attemptSpawnMob("NPC", ...brainrotSpawnPos);

                    let brainrotPool = brainrots[rarity.idx].ents;
                    let brainrotData = brainrotPool[random(0, brainrotPool.length - 1)];

                    if (mob) {
                        spawnBrainrotEntity(mob, brainrotData, rarity.name, x, y, z);
                    }
                }
            }

            for (let mNum in mobs) {
                let mob = mobs[mNum];
                let m = mobs[mNum].id;
                let type = mobs[mNum].type;

                const remove = (m, mesh) => {
                    try { api.deleteMeshEntity(mesh); } catch { }
                    try { api.despawnMob(m); } catch { }
                    mobs.splice(m, 1);
                };

                let [x, y, z] = [null, null, null];
                try { [x, y, z] = api.getPosition(m); } catch {
                    remove(m, mobs[mNum]?.mesh); continue;
                }

                if (type == "mob") {
                    if (z >= brainrotDeathPos[2]) {
                        api.despawnMob(m);
                        mobs.splice(m, 1);
                    }

                } else if (type == "mesh") {
                    let mesh = mobs[mNum].mesh;
                    api.setPosition(mesh, [x - (mob.offset ?? [0, 0, 0])[0], y - (mob.offset ?? [0, 0, 0])[1], z - (mob.offset ?? [0, 0, 0])[2]]);
                    if (mobs[mNum].invisibleCount > 0) {
                        api.applyEffect(m, "Invisible", null, {});
                        if (mobs[mNum].invisibleCount <= 1) {
                            api.scalePlayerMeshNodes(m, { TorsoNode: [2, 2, 2], ArmLeftMesh: [1, 1, 1], ArmRightMesh: [1, 1, 1], HeadMesh: [1, 1, 1], LegLeftMesh: [1, 1, 1], LegRightMesh: [1, 1, 1] });
                        }
                        mobs[mNum].invisibleCount--;
                    }

                    if (z >= brainrotDeathPos[2]) {
                        remove(m, mesh);
                    }
                }
            }
        }
    } else {
        // player tick
        pId = players[pNum];

        if (lockedBases[pId]) {
            if (lockedBases[pId] <= api.now()) {
                setBaseLockedState(pId, "unlocked");
                delete lockedBases[pId];
            }
            updateBaseNametag(pId);
        }
    }
}

function onPlayerAltAction(myId, x, y, z, block, targetEId) {
    let [lx, ly, lz] = bases[myId].lockPos;

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
}

function onPlayerLeave(myId) {
    let idx = baseNum[myId];
    clearRenderedBrainrots(myId);

    delete bases[myId];
    delete lockTime[myId];
    delete lockedBases[myId];
    delete stealable[myId];
}

function onPlayerJoin(myId) {
    attemptInitBrainrotDb(myId);

    api.setWalkThroughType(myId, "Pink Portal");
    api.setMaxPlayers(8, 8);
    api.setWalkThroughRect(myId, [-1000, 0, -942], [-999, -10000, -941], 0);

    let username = api.getEntityName(myId);
    let freeBaseIdx = getFreeBase();
    baseNum[myId] = freeBaseIdx;
    bases[myId] = { ...basesConfig[freeBaseIdx] }; bases[myId].idx = freeBaseIdx;
    let base = bases[myId];

    updateBrainrots(myId, base.brainrotPlatforms);

    let lsp = base.laserStartPos;
    api.setWalkThroughRect(myId, [lsp[0], lsp[1] + 3, lsp[2]], [lsp[0], lsp[1] + 1, lsp[2] - 1], 1);

    let otherLasers = base.otherLasers;
    for (let laser of otherLasers) {
        let [olx, oy, oz] = laser;
        api.setWalkThroughRect(myId, [olx, oy + 1, oz], [olx, oy + 3, oz], 1);
    }

    nametag = api.attemptCreateMeshEntity("BloxdBlock", {
        blockName: "Invisible Solid",
        size: 1,
    }, `${username}'s Base`);
    api.setPosition(nametag, bases[myId].nametagPos);
    base.nametag = nametag;

    updateBaseNametag(myId, true);

    lockTime[myId] = defLockTime;

    createLockNotif(myId, base.lockPos);

    //api.setPosition(myId, bases[myId].spawnPos);
}

function onWorldAttemptDespawnMob(mobId) {
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
    for (let e of api.getEntitiesInRect([x - 1, y - 1, z - 1], [x + 1, y + 1, z + 1])) {
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
    });
    api.setOtherEntitySetting(myId, lockNotif, "nameTagInfo", {
        content: [
            { str: "Lock Base", style: { fontSize: "150px" } }
        ],
        subtitle: [
            { str: "Right-click on the Block of Iron to lock." }
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

function isCannoli(myId) { return myId == api.getPlayerId("WanderingCannoli"); };

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

    let timeleft = Math.ceil((lockedBases[pId] - api.now()) / 1000);

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

        //api.log(b.id);
        let brainrotConfig = getBrainrotById(b.id);
        //api.log(brainrotConfig);

        let mesh = api.attemptCreateMeshEntity("BloxdBlock", {
            size: brainrotConfig.size,
            autoRotate: true,

            blockName: (brainrotConfig.displayName ?? brainrotConfig.blockName),
            hideDist: 250,
        });
        api.setPosition(mesh, x + 0, y + 0, z + 0);

        let mob = api.attemptSpawnMob("NPC", ...brainrotSpawnPos);
        let rarityName = brainrotConfig.rarityName;
        api.setTargetedPlayerSettingForEveryone(mesh, "nameTagInfo", {
            content: [
                { str: `${brainrotConfig.blockName.replace(" Statue", "")}`, style: { fontSize: "85px", color: rarityColors[rarityName] } }
            ], backgroundColor: "rgba(0,0,0,0)",

            subtitle: [
                { str: `${rarityName}   Cost: ${brainrotConfig.data.cost}   Coins per Second: ${brainrotConfig.data.cps}` }
            ]
        });
        stealable[myId].push(brainrotConfig);
        toHide.push({ id: mob, count: 3, pos: [x, y, z] });
        api.setMobAiState(mob, "disabled", null);
    }
}

function spawnBrainrotEntity(mob, brainrotData, rarityName, x, y, z) {
    api.setMobAiState(mob, "walkingToPosition", { pos: brainrotDeathPos });

    let mesh = api.attemptCreateMeshEntity(brainrotData.meshType, {
        size: brainrotData.size,
        autoRotate: true,

        blockName: (brainrotData.displayName ?? brainrotData.blockName),
        hideDist: 250,
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
    }
}

// admin commands
function onPlayerChat(myId, message) {
    let name = api.getEntityName(myId);
    let admins = ["WanderingCannoli", "SKY_SPIRIT", "JavisthejavisYT"];

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
    let [x1, y1, z1] = base.borders[0];
    let [x2, y2, z2] = base.borders[1];
    for (let ent of api.getEntitiesInRect([x1, y1, z1], [x2, y2, z2])) {
        //log(`${ent}`);
        if (api.getEntityType(ent) == "Mesh" /*&& !api.getEntityName(e).includes("'")*/) {
            api.deleteMeshEntity(ent);
        }
    }
}
