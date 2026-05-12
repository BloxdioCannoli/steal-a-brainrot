let basesConfig = [
    { nametagPos: [-1018, -994, -957], spawnPos: [-1021, -998, -957], borders: [[-1018, -999, -950], [-1029, -982, -963]], laserStartPos: [-1018, -999, -957], otherLasers: [[-1027, -990, -952], [-1028, -990, -952]], lockPos: [-1019, -996, -960] },
    { nametagPos: [-1018, -994, -976], spawnPos: [-1020, -998, -976], borders: [[-1018, -999, -969], [-1029, -982, -982]], laserStartPos: [-1018, -999, -976], otherLasers: [[-1027, -990, -971], [-1028, -990, -971]], lockPos: [-1019, -996, -979] },
    { nametagPos: [-1018, -994, -994], spawnPos: [-1020, -998, -995], borders: [[-1018, -999, -988], [-1029, -982, -1001]], laserStartPos: [-1018, -999, -994], otherLasers: [[-1027, -990, -989], [-1028, -990, -989]], lockPos: [-1019, -996, -997] },
    { nametagPos: [-1018, -994, -1013], spawnPos: [-1020, -998, -1014], borders: [[-1018, -999, -1007], [-1029, -982, -1020]], laserStartPos: [-1018, -999, -1013], otherLasers: [[-1027, -990, -1008], [-1028, -990, -1008]], lockPos: [-1019, -996, -1016] },

    { nametagPos: [-984, -994, -957], spawnPos: [-984, -998, -957], borders: [[-984, -982, -952], [-973, -999, -940]], laserStartPos: [-984, -999, -957], otherLasers: [[-975, -990, -1019], [-974, -990, -1019]], lockPos: [-983, -996, -960] },
    { nametagPos: [-984, -994, -976], spawnPos: [-984, -998, -976], borders: [[-984, -982, -965], [-973, -999, -953]], laserStartPos: [-984, -999, -976], otherLasers: [[-975, -990, -1000], [-974, -990, -1000]], lockPos: [-983, -996, -979] },
    { nametagPos: [-984, -994, -994], spawnPos: [-984, -998, -995], borders: [[-984, -982, -978], [-973, -999, -966]], laserStartPos: [-984, -999, -994], otherLasers: [[-975, -990, -982], [-974, -990, -982]], lockPos: [-983, -996, -997] },
    { nametagPos: [-984, -994, -1013], spawnPos: [-984, -998, -1014], borders: [[-984, -982, -991], [-973, -999, -979]], laserStartPos: [-984, -999, -1013], otherLasers: [[-975, -990, -963], [-974, -990, -963]], lockPos: [-983, -996, -1016] },
];

//-963, -982, -1000, -1019

clearAll()

/*
Issues:

*/

for (let baseNum in basesConfig) {
    let base = basesConfig[baseNum];
    let [x, y, z] = base.otherLasers[0];
    nametag = api.attemptCreateMeshEntity("BloxdBlock", {
        blockName: "Invisible Solid",
        size: 1,
    }, `Someone's Laser #${baseNum}`);
    api.setPosition(nametag, [x + 0.5, y, z + 0.5]);
}
