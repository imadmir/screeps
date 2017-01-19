var roleCarrier = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.carrying && creep.carry.energy == 0) {
            creep.memory.carrying = false;
            creep.memory.movingTo = undefined;
        }
        if (!creep.memory.carrying && creep.carry.energy == creep.carryCapacity) {
            creep.memory.carrying = true;
            creep.memory.movingTo = undefined;
        }

        if (creep.memory.carrying) {
            var transferTo = '';
            if (creep.memory.movingTo != undefined) {
                transferTo = creep.memory.movingTo;
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                if (targets.length > 0) {
                    transferTo = targets[0].id;
                    creep.memory.movingTo = transferTo;
                }
            }
            var target = Game.getObjectById(transferTo);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }

        }
        else {

            var sourceId = '';
            if (creep.memory.movingTo != undefined) {
                sourceId = creep.memory.movingTo;
            }
            else {
                sourceId = creep.memory.sourceId;
                var sourceMain = Game.getObjectById(sourceId);
                //if there is hostiles in range, don't go there. 
                var droppedSource = sourceMain.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
                if (droppedSource.length == 0) {
                    creep.memory.movingTo = sourceId;
                } else {
                    var sourceNew = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    sourceId = sourceNew.id;
                    creep.memory.movingTo = sourceId;
                }
            }
            var source = Game.getObjectById(sourceId);
            creep.moveTo(source);
            creep.pickup(source, source.amount - 1);

        }

    }

};

module.exports = roleCarrier;
