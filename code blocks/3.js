function onPlayerJoinHidden(myId) {
    let username = api.getEntityName(myId);

    if (!admin.includes(username)) { api.matchmakePlayer(myId, "classic_survival", "banish_player"); }

    beginRunPlayerJoin(myId);
}

function tickHidden() {
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

                    let brainrotPool = brainrots[rarity.idx].ents;
                    let brainrotData = brainrotPool[random(0, brainrotPool.length - 1)];

                    if (mob) {
                        spawnBrainrotEntity(mob, brainrotData, rarity.name, x, y, z);
                    }
                    nextSpawnAt = api.now() + 10000;
                }
            }

            //api.log(`${mobs}`);
            for (let mNum = mobs.length - 1; mNum >= 0; mNum--) { // previously: for (let mNum in mobs) {
                let mob = mobs[mNum];
                let m = mobs[mNum].id;

                //api.log(`Mob exists (${m})!`);

                const remove = (m, mesh, mNum) => {
                    //api.log(`== Removing mob ==`);

                    delete mobSpawnTime[m];
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
                x = spawnx;

                //api.log(`${m} exists at ${x, y, newZ}`);

                //api.log(mobs[mNum].invisibleCount);
                if (mobs[mNum].invisibleCount > 0) {
                    if (hideMobs) {
                        api.applyEffect(m, "Invisible", null, {});

                    }
                    if (mobs[mNum].invisibleCount <= 1) {
                        api.scalePlayerMeshNodes(m, { TorsoNode: [2, 2, 2], ArmLeftMesh: [1, 1, 1], ArmRightMesh: [1, 1, 1], HeadMesh: [1, 1, 1], LegLeftMesh: [1, 1, 1], LegRightMesh: [1, 1, 1] });
                        api.setPosition(m, [spawnx, spawny, spawnz]);
                        api.addFollowingEntityToPlayer(m, mesh, [(mob.offset ?? [0, 0, 0])[0], (mob.offset ?? [0, 0, 0])[1], (mob.offset ?? [0, 0, 0])[2]], false);
                        mobSpawnTime[m] = api.now();
                        //api.log(`Set mobSpawnTime[m] to ${mobSpawnTime[m]}`);
                    }
                    mobs[mNum].invisibleCount--;
                } else {
                    if (!hasPlayedParticle[mob.id]) {
                        rarityParticles(mobs[mNum].rarityName);
                        hasPlayedParticle[mob.id] = true;
                    } else {

                    }

                    //api.log(mobSpawnTime);

                    let timeDifferenceInSeconds = (api.now() - mobSpawnTime[m]) / 1000;
                    let newZ = timeDifferenceInSeconds * 0.005;

                    //api.log(`newZ = ${newZ}`);

                    api.setPosition(m, [x, y, z+newZ]);

                    if (z+newZ >= brainrotDeathPos[2]) {
                        //api.log(`Close to death. Removing.`);
                        remove(m, mesh, mNum);
                    }
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
