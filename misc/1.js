//update: a

let maxBaseNum = -1;
let bases = {};

basesConfig = [
    { nametagPos: [-1018, -994, -957], spawnPos: [-1021, -998, -957] },
    { nametagPos: [-1018, -994, -976], spawnPos: [-1020, -998, -976] },
    { nametagPos: [-1018, -994, -995], spawnPos: [-1020, -998, -995] },
    { nametagPos: [-1018, -994, -1014], spawnPos: [-1020, -998, -1014] },

    { nametagPos: [-984, -994, -957], spawnPos: [-984, -998, -957] },
    { nametagPos: [-984, -994, -976], spawnPos: [-984, -998, -976] },
    { nametagPos: [-984, -994, -995], spawnPos: [-984, -998, -995] },
    { nametagPos: [-984, -994, -1014], spawnPos: [-984, -998, -1014] },
];

const OWNER = ["JavisthejavisYT"];
const ADMINS = ["SKY_SPIRIT", "WanderingCannoli"];

const RANKS = {
    "JavisthejavisYT": {
        rank: "👑 OWNER",
        color: "gold",
        subtitle: "💸 Rich Kid",
    },

    "SKY_SPIRIT": {
        rank: "🛡 ADMIN",
        color: "cyan",
        subtitle: "😎 Cool Kid",
    },

    "WanderingCannoli": {
        rank: "🛡 ADMIN",
        color: "lime",
        subtitle: "🍄 Little Fungi",
    },
};

function isAdmin(name) {
    return ADMINS.includes(name) || OWNER.includes(name);
}

function isOwner(name) {
    return OWNER.includes(name);
}

function isCannoli(myId) {
    return myId == api.getPlayerId("WanderingCannoli");
};

function onPlayerJoin(myId) {

    api.setWalkThroughRect(myId, [-1000, -997, -942], [-999, -1000, -941], 0);

    let username = api.getEntityName(myId);

    bases[myId] = basesConfig[maxBaseNum + 1];
    maxBaseNum++;

    let nametag = api.attemptCreateMeshEntity("BloxdBlock", {
        blockName: "Invisible Solid",
        size: 1,
    }, `${username}'s Base`);

    api.setPosition(nametag, bases[myId].nametagPos);

    api.setOtherEntitySetting(
        myId,
        nametag,
        "nameTagInfo",
        {
            content: [{ str: `Your base` }]
        }
    );
    api.setOtherEntitySetting(
        myId,
        nametag,
        "hasPriorityNametag",
        true
    );

    if (isOwner(username)) {

        api.setClientOptions(myId, {
            creative: true,
            canChange: true,
            invincible: true,
            flySpeedMultiplier: 3,
        });

    } else if (isAdmin(username)) {

        api.setClientOptions(myId, {
            creative: true,
            canChange: true,
            flySpeedMultiplier: 2,
        });
    }

    if (RANKS[username]) {

        let data = RANKS[username];

        api.sendMessage(
            myId,
            `${data.rank} ${data.subtitle}`,
            { color: data.color }
        );
    }

    api.broadcastMessage(`${username} joined the game!`);

    //api.setPosition(myId, bases[myId].spawnPos);
}

onPlayerChat = (playerId, msg) => {

    let name = api.getEntityName(playerId);

    let tags = [];

    if (OWNER.includes(name)) {
        tags.push("👑 OWNER");
        tags.push("💸 Rich Kid");
    }
    else if (name == "SKY_SPIRIT") {
        tags.push("🛡 ADMIN");
        tags.push("😎 Cool Kid");
    }
    else if (name == "WanderingCannoli") {
        tags.push("🛡 ADMIN");
        tags.push("🍄 Little Fungi");
    }

    let color = "white";

    if (OWNER.includes(name)) color = "gold";
    else if (ADMINS.includes(name)) color = "cyan";

    api.broadcastMessage(
        `[${tags.join("] [")}] ${name}: ${msg}`,
        { color: color }
    );

    return false;
}

playerCommand = (playerId, command) => {

    let username = api.getEntityName(playerId);

    if (!isAdmin(username) && !isOwner(username)) {
        api.sendMessage(playerId, "No permission.");
        return true;
    }

    let args = command.split(" ");

    if (args[0] == "/spawn") {

        let mobType = args[1];

        if (!mobType) {
            api.sendMessage(playerId, "Usage: /spawn <mob>");
            return true;
        }

        let pos = api.getPosition(playerId);

        api.spawnMob(
            mobType,
            [pos[0] + 2, pos[1], pos[2]]
        );

        api.sendMessage(playerId, `Spawned ${mobType}`);
        return true;
    }

    if (args[0] == "/creative") {

        let targetName = args[1];

        let targetId = api.getPlayerId(targetName);

        if (!targetId) {
            api.sendMessage(playerId, "Player offline.");
            return true;
        }

        api.setClientOption(targetId, "creative", true);

        api.sendMessage(playerId, `${targetName} is now creative.`);
        return true;
    }

    return false;
}

function onWorldAttemptDespawnMob() {
    return true;
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
            { meshType: "BloxdBlock", blockName: "Monsieur Bedwar Statue", size: defSize, offset: defOffset, data: { cps: 100, cost: 100 } }
        ]
    }
];

function log(msg) {
    api.sendMessage(api.getPlayerId("WanderingCannoli"), JSON.stringify(msg));
}
