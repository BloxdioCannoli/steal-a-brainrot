function log(msg) { api.sendMessage(api.getPlayerId("WanderingCannoli"), JSON.stringify(msg)); }

brainrotSpawnPos = [-999, -998.5, -1025];
brainrtoDeathPos = [-998, -996.5, -940];

let spawnFreq = 23;

const maxConsec = 5;
const waitNum = 5;

tickNum = 0;

let pId = 0;
let pNum = 0;

let startWorldTickAt = 20;

let consec = 0; let wait = 0; function tick() {
    if (wait > 0) { wait--; return; } else { if (consec >= maxConsec) { consec = 0; wait = waitNum; } else { consec++; } };

    let players = api.getPlayerIds();
    if (!pNum) { pNum = 0; }; pNum = (pNum + 1) % players.length + 1;
    tickNum++;

    if (pNum == players.length) {
        // world tick
        if (tickNum >= startWorldTickAt) {
            if (tickNum % spawnFreq == 1) {
                let mob = api.attemptSpawnMob("67", ...brainrotSpawnPos);

                if (mob) {
                    api.setMobAiState(mob, "walkingToPosition", { pos: brainrtoDeathPos });
                }
                //log(mob);
            }
        }
    } else {
        // player tick
        pId = players[pNum];
    }
}

for (let e of api.getMobIds()) {
    api.despawnMob(e);
}
