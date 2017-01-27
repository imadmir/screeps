var action = require('action');

var roleDistributor = {
    partsList: [[CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]],

    partsCost: [300, 550, 750, 1050],

    role: 'distributor',

    spawnCreep: function (spawn, roomLevel, targetRoom, sourceId) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, status: 'Getting Energy', roomName: spawn.room.name, targetRoom: targetRoom, dropOffRoom: spawn.room.name, mainSourceId: sourceId });
            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + '[' + roomLevel + '] ' + targetRoom + ' ' + sourceId + ' - ' + newName);
            return true;
        }
        return false;
    },

    run: function (creep) {

        if (creep == null) {
            return;
        }

        //The distributor will only work in the target room
        if (creep.memory.targetRoom != creep.room.name) {
            //travel to targetRoom
            action.TravelToRoom(creep, creep.memory.targetRoom);
            return;
        }

        if (creep.memory.status != 'Getting Energy' && creep.carry.energy == 0) {
            creep.memory.status = 'Getting Energy';
            action.ClearDestination(creep);
        }
        if (creep.memory.status != 'Distributing' && creep.carry.energy == creep.carryCapacity) {
            creep.memory.status = 'Distributing';
            action.ClearDestination(creep);
        }

        if (creep.memory.status == 'Distributing') {
            var actionResult = false;
            actionResult = action.FeedSpawn(creep);
            if (!actionResult) {
                actionResult = action.FeedTower(creep);
            }
            if (!actionResult) {
                actionResult = action.FeedCreeps(creep);
            }
        }
        else {

            action.PickUpStoredEnergy(creep);
        }

    }

};


module.exports = roleDistributor;
