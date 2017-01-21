var action = require('action');

var roleCarrier = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.movingTo = undefined;
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.movingTo = undefined;
        }

        if (creep.memory.working) {
            var transferTo = '';
            if (creep.memory.movingTo != undefined) {
                transferTo = creep.memory.movingTo;
            }
            else {

                var targetId = findTargetToGiveEnergy(creep);
                if (targetId != '') {
                    transferTo = targetId;
                    creep.memory.movingTo = targetId;
                }
            }

            var target = Game.getObjectById(transferTo);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }  
            else { //if the target is full, clear the movingTo to look for a different target
                creep.memory.movingTo = undefined;
            }
        }
        else {
            action.PickUpEnergy(creep);
        }

    }

};

//function isTargetFull(target) {
//    if (target !== null) {
//        if (target.energy != undefined && target.energy == target.energyCapacity) {
//            return true;
//        }
//        if (target.carry != undefined && target.carry.energy == target.carryCapacity) {
//            return true;
//        }
//        return false;
//    }
//    return true;
//}

function findTargetToGiveEnergy(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
    });
    if (targets.length > 0) {
        return targets[0].id;
    }
        //If all structures are full, give energy to builders
    else {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.carry.energy < (creep.carryCapacity / 2));
        if (builders.length > 0) {
            return builders[0].id;
        }
    }

    return '';
}


module.exports = roleCarrier;
