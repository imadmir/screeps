var action = require('action');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

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
            var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
                else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
        else {
            action.PickUpEnergy(creep);
        }
    }
};


module.exports = roleBuilder;
