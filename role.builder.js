var action = require('action');

var roleBuilder = {
    partsList : [[WORK, CARRY, CARRY, MOVE, MOVE],
                           [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
                           [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                           [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]],
    partsCost: [300, 550, 800, 800],

    role: 'builder',

    spawnCreep: function (spawn, roomLevel, targetRoom) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, working: false, requireEnergy: true, roomName: spawn.room.name, targetRoom: targetRoom });
            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + ' ' + targetRoom + ' - ' + newName);
            return true;
        }
        return false;
    },

    run: function (creep) {

        if (creep == null) {
            return;
        }

        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.movingTo = undefined;
            creep.memory.movingTime = undefined;
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.movingTo = undefined;
            creep.memory.movingTime = undefined;
        }

        if (creep.memory.working) {
            if (creep.room.controller.ticksToDowngrade < 2000) {
                //upgrade controller
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                return;
            }

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
            action.PickUpEnergy(creep);
        }
    }
};


module.exports = roleBuilder;
