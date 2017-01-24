var roleGuard = {

    partsList: [[ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE],
                [ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE],
                [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE]],

    partsCost: [300, 550, 800],

    role: 'guard',

    spawnCreep: function (spawn, roomLevel, targetRoom) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, working: false, roomName: spawn.room.name, targetRoom: targetRoom });
            console.log(newName + ': ' + spawn.room.name + ' ' + spawn.name + ' ' + this.role + ' ' + targetRoom);
            return true;
        }
        return false;
    },

    run: function (creep) {

        if (creep == null) {
            return;
        }

        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length) {
            creep.moveTo(targets[0]);
            creep.attack(targets[0]);
        }

    }

};

module.exports = roleGuard;
