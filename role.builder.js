var action = require('action');

var roleBuilder = {
    partsList : [[WORK, CARRY, CARRY, MOVE, MOVE],
                           [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                           [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                           [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]],
    partsCost: [300, 550, 800, 1300],

    role: 'builder',

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

        //builder will only work in the target room
        if (creep.memory.targetRoom != creep.room.name) {
            //travel to targetRoom
            action.TravelToRoom(creep.memory.targetRoom);
            return;
        }

        if (creep.memory.status != 'Getting Energy' && creep.carry.energy == 0) {
            creep.memory.status = 'Getting Energy';
            action.ClearDestination(creep);
        }
        if (creep.memory.status != 'Building' && creep.carry.energy == creep.carryCapacity) {
            creep.memory.status = 'Building';
            action.ClearDestination(creep);
        }

        if (creep.memory.status == 'Building') {
            //Build construction sites
            var actionResult = action.BuildStructures(creep);

           if (!actionResult) {
               //upgrade controller
               if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(creep.room.controller);
               }
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


module.exports = roleBuilder;
