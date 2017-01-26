var action = require("action");

var roleMiner = {
    partsList: [[MOVE],
                [MOVE],
                [CLAIM, MOVE],
                [CLAIM, CLAIM, MOVE, MOVE]],

    partsCost: [300, 550, 650, 1300],

    role: 'claimer',

    spawnCreep: function (spawn, roomLevel, targetRoom, buildRoads) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined,
                            { role: this.role, roomName: spawn.room.name, targetRoom: targetRoom, buildRoads: buildRoads, status: 'claiming' });

            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + '[' + roomLevel + '] ' + targetRoom + ' - ' + newName);
            return true;
        }
        return false;
    },

    run: function (creep) {

        if (creep == null) {
            return;
        }
        if (creep.memory.targetRoom != creep.room.name) {
            //travel to targetRoom
            action.TravelToRoom(creep.memory.targetRoom);
            return;
        }
        else {
            action.ReserveRoom(creep);
        }

    }

};

module.exports = roleMiner;
