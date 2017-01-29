var action = require('action');

var roleUpgrader = {
    partsList : [[WORK, CARRY, CARRY, MOVE, MOVE],
                           [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
                           [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                           [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]],
    partsCost: [300, 550, 800, 1300],

    role: 'upgrader',

    spawnCreep: function (spawn, roomLevel, targetRoom) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, status: 'Getting Energy', requireEnergy: true, roomName: spawn.room.name, targetRoom: targetRoom });
            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + '[' + roomLevel + '] ' + targetRoom + ' - ' + newName);
            return true;
        }
        return false;
    },

    run: function (creep) {

        if (creep == null) {
            return;
        }

        //upgrader will only work in the target room
        if (creep.memory.targetRoom != creep.room.name) {
            //travel to targetRoom
            action.TravelToRoom(creep, creep.memory.targetRoom);
            return;
        }

        if (creep.memory.status != 'Getting Energy' && creep.carry.energy == 0) {
            creep.memory.status = 'Getting Energy';
            action.ClearDestination(creep);
        }
        if (creep.memory.status != 'Upgrading' && creep.carry.energy == creep.carryCapacity) {
            creep.memory.status = 'Upgrading';
            action.ClearDestination(creep);
        }

        if (creep.memory.status == 'Upgrading') {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var actionResult = action.PickUpStoredEnergy(creep);
            if (!actionResult) {
                action.PickUpDroppedEnergy(creep);
            }
        }
    }
};


module.exports = roleUpgrader;
