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

function rarityParticles(rarity) {
    let [x, y, z] = brainrotSpawnPos;

    let rarityRgb = {
        "Common": [
            [255, 250, 247, 1],
            [255, 250, 247, 0.5],
        ],
        "Uncommon": [
            [65, 252, 3, 1],
            [65, 252, 3, 0.5],
        ],
        "Rare": [
            [3, 144, 252, 1],
            [3, 144, 252, 0.5],
        ],
        "Legendary": [
            [232, 214, 49, 1],
            [232, 214, 49, 0.5],
        ],
        "Mythical": [
            [86, 49, 232, 1],
            [86, 49, 232, 0.5],
        ],
    };
    if (!rarityRgb[rarity]) { return false; }

    api.playParticleEffect({
        dir1: [-1, -1, 1],
        dir2: [1, 1, 2],
        pos1: [x - 2, y - 1, z - 1],
        pos2: [x + 2, y + 2, z + 1],
        texture: "glint",
        minLifeTime: 1.0,
        maxLifeTime: 1.0,
        minEmitPower: 3,
        maxEmitPower: 3,
        minSize: 0.3,
        maxSize: 0.3,
        manualEmitCount: 30,
        gravity: [0, -10, 0],
        colorGradients: [
            {
                timeFraction: 0,
                minColor: rarityRgb[rarity][0],
                maxColor: rarityRgb[rarity][1],
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
    });
}

function runPlayerJoin(myId) {
    if (!playerJoinLevel[myId]) { playerJoinLevel[myId] = 0; }

    api.setCanChangeBlockType(myId, "Fireball Block");

    api.setItemStat(myId, "Fireball Block", "ttb", 1000);

    resetLaserWalkthroughs(myId);

    resetBrainrotsLastClaimedAt(myId);

    let username = api.getEntityName(myId);

    if (!hasSetMax) { api.setMaxPlayers(8, 8); hasSetMax = true; }

    if (playerJoinLevel[myId] <= 0) {// *****-side setup
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

    if (playerJoinLevel[myId] <= 4) { // *****-side base setup
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

function getHeldActionType(myId) {
    let item = api.getHeldItem(myId);
    let customName = item?.attributes.customDisplayName;

    if (customName == "Upgrade") { return "upgrade"; }
    if (customName == "Claim") { return "claim"; }
    if (customName == "Sell") { return "sell"; }

    if (customName == "Bat") { return "bat"; }

    if (customName == "Reset Button") { return "resetbutton"; }

    if (customName == "67 Saddle") { return "67saddle"; }
    if (customName == "Galaxy Bat") { return "galaxybat"; }
    if (customName == "Freeze Ray") { return "freezeray"; }
    if (customName == "Swap Crystal") { return "swapcrystal"; }
    if (customName == "Invisibility Hat") { return "invisibilityhat"; }
    if (customName == "Flashbang") { return "flashbang"; }

    return null;
}

api.log("2 loaded")
