var action = require('action');

var roleWallBuilder = {

    run: function (creep) {

        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {
            //Repair walls and ramparts
            var targets = creep.room.find(FIND_STRUCTURES,
                { filter: (s) => s.hits < s.hitsMax && (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) });
            targets.sort(function (a,b) {return (a.hits - b.hits)});

            if (targets.length) {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
        else {
            action.PickUpEnergy(creep);
        }
    }
};


module.exports = roleWallBuilder;
