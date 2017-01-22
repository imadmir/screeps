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
            var targetId = '';
            if (creep.memory.movingTo != undefined) {
                targetId = creep.memory.movingTo;
            }
            else {
                var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                if (targets.length) {
                    targetId = targets[0].id;
                    creep.memory.movingTo = targetId;
                }
                else {
                    targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if (targets.length) {
                        targetId = targets[0].id;
                        creep.memory.movingTo = targetId;
                    }
                }
            }

            if (targetId != '') {
                var target = Game.getObjectById(targetId);
                var buildResult = creep.build(target);
                if (buildResult != OK) {
                    if (buildResult == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    } else {
                        //clear move to, building has been finished
                        creep.memory.movingTo = undefined;
                    }
                }
            }
            else {
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
