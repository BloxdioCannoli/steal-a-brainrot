//update: aaaaa

brainrotSpawnPos = [-999, -999, -1025];
brainrotDeathPos = [-999, -997, -942.5];

/*
TODO:

- locking base [ADDING]
- sidebar
- stealing brainrots from other players
- purchasing brainrots
- persisting brainrots across sessions
- selling brainrots
- claiming what brainrots earned you

BUGS:

- mobs sometimes mysteriously despawn (use fallback values?)
*/

let defLockTime = 10;

let lockedBases = {};
let lockTime = {};

bases = {};
let baseNum = {};
basesConfig = [
    // laserStart pos is at the bottom-right of the laser at a base
    { nametagPos: [-1018, -994, -957], spawnPos: [-1021, -998, -957], borders: [[-1018, -999, -950], [-1029, -982, -963]], laserStartPos: [-1018, -999, -957], otherLasers: [[-1027, -990, -952], [-1028, -990, -952]], lockPos: [-1019, -996, -960] },
    { nametagPos: [-1018, -994, -976], spawnPos: [-1020, -998, -976], borders: [[-1018, -999, -969], [-1029, -982, -982]], laserStartPos: [-1018, -999, -976], lockPos: [-1019, -996, -979] },
    { nametagPos: [-1018, -994, -994], spawnPos: [-1020, -998, -995], borders: [[-1018, -999, -988], [-1029, -982, -1001]], laserStartPos: [-1018, -999, -994], lockPos: [-1019, -996, -997] },
    { nametagPos: [-1018, -994, -1014], spawnPos: [-1020, -998, -1014], borders: [[-1018, -999, -1007], [-1029, -982, -1020]], laserStartPos: [-1018, -999, -1013], lockPos: [-1019, -996, -1017] },

    { nametagPos: [-984, -994, -957], spawnPos: [-984, -998, -957], borders: [[-984, -982, -952], [-973, -999, -940]], laserStartPos: [], lockPos: [] },
    { nametagPos: [-984, -994, -976], spawnPos: [-984, -998, -976], borders: [[-984, -982, -965], [-973, -999, -953]], laserStartPos: [], lockPos: [] },
    { nametagPos: [-984, -994, -995], spawnPos: [-984, -998, -995], borders: [[-984, -982, -978], [-973, -999, -966]], laserStartPos: [], lockPos: [] },
    { nametagPos: [-984, -994, -1014], spawnPos: [-984, -998, -1014], borders: [[-984, -982, -991], [-973, -999, -979]], laserStartPos: [], lockPos: [] },
];

let consec = 0; let wait = 0; function tick() {
    if (wait > 0) { wait--; return; } else { if (consec >= maxConsec) { consec = 0; wait = waitNum; } else { consec++; } };

    players = api.getPlayerIds();
    if (!pNum) { pNum = 0; };
    pNum = (pNum + 1) % (players.length + 1);
    tickNum++;

    if (pNum == players.length) {
        if (!hasspawnedmesh) {
            let meshPos = [-999, -1000, -941];

            let mesh = api.attemptCreateMeshEntity("Box", {
                height: 1,
                width: 2,
                depth: 2,

                texture: "lava0",
            });
            api.setPosition(mesh, meshPos);

            let particles = api.attemptCreateMeshEntity("ParticleEmitter", {
                dir1: [-0.5, 0, -0.5],
                dir2: [0.5, 2.5, 0.5],

                emitRate: 10,
                texture: "square_particle",
                minLifeTime: 1,
                maxLifeTime: 1,
                minEmitPower: 1,
                maxEmitPower: 2,
                minSize: 0.2,
                maxSize: 0.2,
                manualEmitCount: 20,
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
            api.setPosition(particles, meshPos);

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
                        api.setMobAiState(mob, "walkingToPosition", { pos: brainrotDeathPos });

                        mobs.push({ id: mob, type: usedType });
                    }
                } else if (usedType == "mesh") {
                    let rarity = randomRarity();
                    let mob = api.attemptSpawnMob("NPC", ...brainrotSpawnPos);

                    let brainrotPool = brainrots[rarity.idx].ents;
                    let brainrotData = brainrotPool[random(0, brainrotPool.length - 1)];

                    if (mob) {
                        api.setMobAiState(mob, "walkingToPosition", { pos: brainrotDeathPos });

                        let mesh = api.attemptCreateMeshEntity(brainrotData.meshType, {
                            size: brainrotData.size,
                            autoRotate: true,

                            blockName: brainrotData.blockName,
                        });
                        api.setPosition(mesh, x, y, z);

                        api.applyEffect(mob, "Slowness", null, { inbuiltLevel: 1 });

                        if (mesh) {
                            api.setTargetedPlayerSettingForEveryone(mesh, "nameTagInfo", {
                                content: [
                                    { str: `${brainrotData.blockName.replace(" Statue", "")}`, style: { fontSize: "85px", color: rarityColors[rarity.name] } }
                                ], backgroundColor: "rgba(0,0,0,0)",

                                subtitle: [
                                    { str: `${rarity.name}   Cost: ${brainrotData.data.cost}   Coins per Second: ${brainrotData.data.cps}` }
                                ]
                            });
                            mobs.push({ id: mob, mesh: mesh, type: usedType, invisibleCount: 5, offset: brainrotData.offset });
                        }
                    }
                }
            }

            for (let mNum in mobs) {
                let mob = mobs[mNum];
                let m = mobs[mNum].id;
                let type = mobs[mNum].type;

                let [x, y, z] = api.getPosition(m);

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
                        mobs[mNum].invisibleCount--;
                    }

                    if (z >= brainrotDeathPos[2]) {
                        api.despawnMob(m);
                        api.deleteMeshEntity(mesh);
                        mobs.splice(m, 1);
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
    let borders = basesConfig[idx].borders;

    let [x1, y1, z1] = borders[0];
    let [x2, y2, z2] = borders[1];

    for (let e of api.getEntitiesInRect([x1, y1, z1], [x2, y2, z2])) {
        let type = api.getEntityType(e);
        if (type == "Mesh") {
            api.deleteMeshEntity(e);
        }
    }

    delete bases[myId];
}

function onPlayerJoin(myId) {
    api.setItemStat(myId, "Invisible Solid", "showInCreativeInven", true);
    api.setMaxPlayers(8, 8);
    api.setWalkThroughRect(myId, [-1000, -997, -942], [-999, -1000, -941], 0);

    let username = api.getEntityName(myId);
    let freeBaseIdx = getFreeBase();
    baseNum[myId] = freeBaseIdx;
    bases[myId] = { ...basesConfig[freeBaseIdx] }; bases[myId].idx = freeBaseIdx;
    let base = bases[myId];

    let lsp = base.laserStartPos;
    api.setWalkThroughRect(myId, [lsp[0], lsp[1] + 3, lsp[2]], [lsp[0], lsp[1] + 1, lsp[2] - 1], 1);

    nametag = api.attemptCreateMeshEntity("BloxdBlock", {
        blockName: "Invisible Solid",
        size: 1,
    }, `${username}'s Base`);
    api.setPosition(nametag, bases[myId].nametagPos);

    lockTime[myId] = defLockTime;

    api.setOtherEntitySetting(myId, nametag, "nameTagInfo", { content: [{ str: `Your base` }] });
    api.setOtherEntitySetting(myId, nametag, "hasPriorityNametag", true);

    createLockNotif(myId, base.lockPos);

    //api.setPosition(myId, bases[myId].spawnPos);
}

function onWorldAttemptDespawnMob(mobId) {
    for (let m of mobs) {
        //api.log(`${m.id} == ${mobId}`);
        if (m.id == mobId) { return "preventDespawn"; }
    }
}

function onPlayerDamagingMob(myId, mobId, dmgDealt, withItem, damagerDbId) {
    if (isCannoli(myId)) {
        log('damaged');
    }
    return "preventDamage";
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
    {
        ents: [
            { meshType: "BloxdBlock", blockName: "67 Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
            { meshType: "BloxdBlock", blockName: "Bobzilla Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
            { meshType: "BloxdBlock", blockName: "Brra Brra Pachim Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
            { meshType: "BloxdBlock", blockName: "Monsieur Bedwar Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
        ], name: "Common", chance: 1
    },

    {
        ents: [
            { meshType: "BloxdBlock", blockName: "Duo Blocchino Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
            { meshType: "BloxdBlock", blockName: "Capitano Explovissimo Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
            { meshType: "BloxdBlock", blockName: "Il Wizardini Del Porko Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
        ], name: "Uncommon", chance: 0.5
    },

    {
        ents: [
            { meshType: "BloxdBlock", blockName: "Bebek Bebek Bebek Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
            { meshType: "BloxdBlock", blockName: "Chimpanzano Bananano Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
            { meshType: "BloxdBlock", blockName: "Twirlina Cappucina Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
        ], name: "Rare", chance: 0.25
    },

    {
        ents: [
            { meshType: "BloxdBlock", blockName: "Bobino Musculino Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
            { meshType: "BloxdBlock", blockName: "Cappuccino Ninjino", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
        ], name: "Legendary", chance: 0.1
    },

    {
        ents: [
            { meshType: "BloxdBlock", blockName: "Lucchia Blocchi Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } },
        ], name: "Mythical", chance: 0.05
    },
];

let spawnFreq = 23;

const maxConsec = 5;
const waitNum = 5;

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
        hideDist: 5,
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

    api.log(base.laserStartPos);
    let [lx, ly, lz] = base.laserStartPos;
    let otherLasers = base.otherLasers;

    if (type == "locked") {
        api.setBlockRect([lx, ly + 2, lz - 1], [lx, ly + 2, lz], "Invisible Solid");
        createLaser(lx, ly - 2, lz);
        createLaser(lx, ly - 2, lz - 1);

        for (let laser of otherLasers) {
            let [olx, oy, oz] = laser;

            createLaser(olx, oy, oz, 3);
            api.setBlock([olx, oy + 2, oz], "Invisible Solid");
        }
    } else if (type == "unlocked") {
        api.setBlockRect([lx, ly + 2, lz - 1], [lx, ly + 2, lz], "Air");
        removeLaser(lx, ly - 2, lz);
        removeLaser(lx, ly - 2, lz - 1);

        for (let laser of otherLasers) {
            let [olx, oy, oz] = laser;

            removeLaser(olx, oy, oz);
            api.setBlock([olx, oy + 2, oz], "Air");
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
