var action = require("action");

var roleMiner = {
    partsList: [[WORK, WORK, CARRY, MOVE],
                [WORK, WORK, WORK, WORK, CARRY, MOVE],
                [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE],
                [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE]],

    partsCost: [300, 500, 750, 750],

    role: 'miner',

    spawnCreep: function (spawn, roomLevel, targetRoom, sourceId, containerId, linkId, buildRoads) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined,
                            {
                                role: this.role, roomName: spawn.room.name, targetRoom: targetRoom, buildRoads: buildRoads,
                                mainSourceId: sourceId, containerId: containerId, linkId: linkId
                            });

            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + '[' + roomLevel + '] ' + targetRoom + ' ' + sourceId + ' ' + containerId + ' ' + linkId + ' - ' + newName);
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
            action.MineResource(creep);
        }

    }

};

module.exports = roleMiner;
