clearAll()

function updateBrainrots(myId, spawnAt) {
    stealable[myId] = [];

    let brainrots = getBrainrots(myId);
    for (let bNum in brainrots) {
        let b = brainrots[bNum];
        if (!b) { continue; }


        let [x, y, z] = (spawnAt[bNum] ?? [0, 0, 0]);

        api.log(`Spawning at ${[x, y, z]}`)

        //api.log(b.id);
        let brainrotConfig = getBrainrotById(b.id);
        //api.log(brainrotConfig);

        let mesh = api.attemptCreateMeshEntity("BloxdBlock", {
            size: brainrotConfig.size,
            autoRotate: true,

            blockName: (brainrotConfig.displayName ?? brainrotConfig.blockName),
            hideDist: 25,
        });
        api.setPosition(mesh, x + 0, y + 0, z + 0);

        let mob = api.attemptSpawnMob("Draugr Zombie", ...brainrotSpawnPos);
        let rarityName = b.rarityName;
        //api.log(`Called updateBrainrots`)
        api.setTargetedPlayerSettingForEveryone(mesh, "nameTagInfo", {
            content: [
                { str: `${brainrotConfig.blockName.replace(" Statue", "")}`, style: { fontSize: "85px", color: rarityColors[rarityName] } }
            ], backgroundColor: "rgba(0,0,0,0)",

            subtitle: [
                { str: `${rarityName}   Cost: ${brainrotConfig.data.cost}   Coins per Second: ${brainrotConfig.data.cps}` }
            ]
        });
        api.setPosition(mob, x + 0, y + 0, z + 0);

        stealable[myId].push(b.id);
        toHide.push({ id: mob, count: 1, pos: [x, y, z] });
        api.log(`Pushed to toHide`)
        api.setMobAiState(mob, "disabled", null);
    }
}


clearRenderedBrainrots(myId);
updateBrainrots(myId, bases[myId].brainrotPlatforms)
