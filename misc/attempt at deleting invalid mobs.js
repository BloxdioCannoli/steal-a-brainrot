for (let m of api.getEntitiesInRect([-10000, -10000, -10000], [10000, 10000, 10000])) {
    let included = { mesh: false, mob: false };
    for (let m2 of mobs) {
        if (m2.id) {
            included.id = true;
        }
        if (m2.mesh) {
            included.mesh = true;
        }
        //api.log(`${JSON.stringify(m)}`)
    }
    let type = api.getEntityType(m);
    //api.log(included)
    if ((!included.mesh) && (type == "Mesh")) { api.deleteMeshEntity(m); }
}
