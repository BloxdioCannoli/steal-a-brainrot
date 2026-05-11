//update: a 

brainrotSpawnPos = [-999, -999, -1025];
brainrtoDeathPos = [-999, -997, -942];

let spawnFreq = 23;

const maxConsec = 5;
const waitNum = 5;

tickNum = 0;

let pId = 0;
let pNum = 0;

let startWorldTickAt = 20;

mobs = [];
let players;

let consec = 0; let wait = 0; function tick() {
    if (wait > 0) { wait--; return; } else { if (consec >= maxConsec) { consec = 0; wait = waitNum; } else { consec++; } };

    players = api.getPlayerIds();
    if (!pNum) { pNum = 0; };
    pNum = (pNum + 1) % (players.length + 1);
    tickNum++;

    if (pNum == players.length) {
        // world tick
        if (tickNum >= startWorldTickAt) {
            if (tickNum % (spawnFreq) == 1) {
                let mob = api.attemptSpawnMob("67", ...brainrotSpawnPos);

                if (mob) {
                    api.setMobAiState(mob, "walkingToPosition", { pos: brainrtoDeathPos });

                    mobs.push(mob);
                }
            }

            for (let mNum in mobs) {
                let m = mobs[mNum];
                let [x, y, z] = api.getPosition(m);

                if (z >= brainrtoDeathPos[2]) {
                    api.despawnMob(m);
                    mobs.splice(m, 1);
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

function log(msg) { api.sendMessage(api.getPlayerId("WanderingCannoli"), JSON.stringify(msg)); }
