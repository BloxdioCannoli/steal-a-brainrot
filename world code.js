//update: a

let maxBaseNum = -1;
let bases = {};
let baseNum = {};
basesConfig = [
    { nametagPos: [-1018, -994, -957], spawnPos: [-1021, -998, -957], borders: [[-1018, -999, -950], [-1029, -982, -963]] },
    { nametagPos: [-1018, -994, -976], spawnPos: [-1020, -998, -976], borders: [[-1018, -999, -969], [-1029, -982, -982]] },
    { nametagPos: [-1018, -994, -995], spawnPos: [-1020, -998, -995], borders: [[-1018, -999, -988], [-1029, -982, -1001]] },
    { nametagPos: [-1018, -994, -1014], spawnPos: [-1020, -998, -1014], borders: [[-1018, -999, -1007], [-1029, -982, -1020]] },

    { nametagPos: [-984, -994, -957], spawnPos: [-984, -998, -957] },
    { nametagPos: [-984, -994, -976], spawnPos: [-984, -998, -976] },
    { nametagPos: [-984, -994, -995], spawnPos: [-984, -998, -995] },
    { nametagPos: [-984, -994, -1014], spawnPos: [-984, -998, -1014] },
];


function isCannoli(myId) { return myId == api.getPlayerId("WanderingCannoli"); };

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

    maxBaseNum = idx - 2;
    delete bases[myId];
}

function onPlayerJoin(myId) {
    api.setWalkThroughRect(myId, [-1000, -997, -942], [-999, -1000, -941], 0);

    let username = api.getEntityName(myId);

    baseNum[myId] = maxBaseNum + 1;
    bases[myId] = basesConfig[maxBaseNum + 1];

    nametag = api.attemptCreateMeshEntity("BloxdBlock", {
        blockName: "Invisible Solid",
        size: 1,
    }, `${username}'s Base`);
    api.setPosition(nametag, bases[myId].nametagPos);

    api.setOtherEntitySetting(myId, nametag, "nameTagInfo", { content: [{ str: `Your base` }] });
    api.setOtherEntitySetting(myId, nametag, "hasPriorityNametag", true);

    api.setPosition(myId, bases[myId].spawnPos);
    maxBaseNum++;
}

function onWorldAttemptDespawnMob(mobId) {
    return (mobs.includes(mobId) ? "preventDespawn" : true);
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

brainrotSpawnPos = [-999, -999, -1025];
brainrotDeathPos = [-999, -997, -942];

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
    }
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

function log(msg) { api.sendMessage(api.getPlayerId("WanderingCannoli"), JSON.stringify(msg)); }
