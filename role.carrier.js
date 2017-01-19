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
            //if the target is full, clear the movingTo to look for a different target
            if ( !(target !== null) || target.energy == target.energyCapacity) {
                creep.memory.movingTo = undefined;
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

                var droppedSources = sourceMain.pos.findInRange(FIND_DROPPED_RESOURCES, 2);
                if (droppedSources.length > 0) {
                    sourceId = droppedSource[0].id;
                    creep.memory.movingTo = droppedSource[0].id;
                } else {
                    var sourceNew = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    sourceId = sourceNew.id;
                    creep.memory.movingTo = sourceId;
                }
            }

            var source = Game.getObjectById(sourceId);
            if (source !== null) {
                creep.moveTo(source);
                creep.pickup(source, source.amount - 1);
            } else {
                //if there is no source. look for a new one
                creep.memory.movingTo = undefined;
            }

        }

    }

};

module.exports = roleCarrier;
