var action = require('action');

var roleWallBuilder = {

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
            //Repair walls and ramparts
            var targetId = '';
            if (creep.memory.movingTo != undefined) {
                targetId = creep.memory.movingTo;
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES,
                    { filter: (s) => s.hits < s.hitsMax && (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) });
                targets.sort(function (a, b) { return (a.hits - b.hits) });

                if (targets.length) {
                    targetId = targets[0].id;
                    creep.memory.movingTo = targetId;
                    if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            }

            if (targetId != '') {
                var target = Game.getObjectById(targetId);
                if (target != null) {
                    var repairResult = creep.repair(target);
                    if (repairResult == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }

                if (target == null || target.hits == target.hitsMax || creep.carry.energy == 0) {
                    //clear move to, building has been finished
                    creep.memory.movingTo = undefined;
                }
            }

        }
        else {
            action.PickUpEnergy(creep);
        }
    }
};


module.exports = roleWallBuilder;
