//update: a

function onPlayerDamagingMob(myId, mobId, dmgDealt, withItem, damagerDbId) {
    api.log('damaged');
    return "preventDamage";
}

brainrots = [
    {
        ents: [

        ], name: "Common", chance: 1
    },

    {
        ents: [

        ], name: "Uncommon", chance: 0.5
    },

    {
        ents: [

        ], name: "Rare", chance: 0.25
    },

    {
        ents: [

        ], name: "Legendary", chance: 0.1
    },

    {
        ents: [

        ], name: "Secret", chance: 0.05
    },
];

brainrotSpawnPos = [-999, -999, -1025];
brainrtoDeathPos = [-999, -997, -942];

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
                        api.setMobAiState(mob, "walkingToPosition", { pos: brainrtoDeathPos });

                        mobs.push({ id: mob, type: usedType });
                    }
                } else if (usedType == "mesh") {
                    let mob = api.attemptSpawnMob("NPC", ...brainrotSpawnPos);

                    if (mob) {
                        api.setMobAiState(mob, "walkingToPosition", { pos: brainrtoDeathPos });

                        let mesh = api.attemptCreateMeshEntity("BloxdBlock", {
                            size: 2.5,
                            autoRotate: true,

                            blockName: "67 Statue",
                        });
                        api.setPosition(mesh, x, y, z);

                        api.applyEffect(mob, "Slowness", null, { inbuiltLevel: 1 });

                        if (mesh) {
                            mobs.push({ id: mob, mesh: mesh, type: usedType, invisibleCount: 5 });
                        }
                    }
                }
            }

            for (let mNum in mobs) {
                let m = mobs[mNum].id;
                let type = mobs[mNum].type;

                let [x, y, z] = api.getPosition(m);

                if (type == "mob") {
                    if (z >= brainrtoDeathPos[2]) {
                        api.despawnMob(m);
                        mobs.splice(m, 1);
                    }

                } else if (type == "mesh") {
                    let mesh = mobs[mNum].mesh;
                    api.setPosition(mesh, [x, y - 1.1, z]);
                    if (mobs[mNum].invisibleCount > 0) {
                        api.applyEffect(m, "Invisible", null, {});
                        mobs[mNum].invisibleCount--;
                    }

                    if (z >= brainrtoDeathPos[2]) {
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

function log(msg) { api.sendMessage(api.getPlayerId("WanderingCannoli"), JSON.stringify(msg)); }
