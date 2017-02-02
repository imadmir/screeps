var action = require("action");

var roleMiner = {
    partsList: [[WORK, WORK, MOVE, MOVE],
                [WORK, WORK, WORK, WORK, WORK, MOVE],
                [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
                [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE]],

    partsCost: [300, 550, 800, 1300],

    role: 'mineralMiner',

    spawnCreep: function (spawn, roomLevel, targetRoom, sourceId, buildRoads, mineType) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined,
                            { role: this.role, roomName: spawn.room.name, targetRoom: targetRoom, mainSourceId: sourceId, buildRoads: buildRoads, mineType: mineType });

            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + '[' + roomLevel + '] ' + targetRoom + ' ' + sourceId + ' - ' + newName);
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
            action.TravelToRoom(creep, creep.memory.targetRoom);
            if (creep.memory.buildRoads) {
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
            }
            return;
        }
        else {
            action.MineMinerals(creep);
        }

    }

};

module.exports = roleMiner;
