var action = require('action');

var roleBuilder = {

    run: function (creep) {

        if (creep == null) {
            return;
        }

        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
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
