var action = {

    //get dropped energy, or energy from a container
    PickUpEnergy: function (creep) {
        var sourceId = '';
        //if the creep is moving, keep on moving, no need to find a new source
        if (creep.memory.movingTo != undefined) {
            sourceId = creep.memory.movingTo;
        }
        else {
            //if the creep has a mainSource id in memory
            if (creep.memory.mainSourceId != undefined) {
                var sourceMain = Game.getObjectById(creep.memory.mainSourceId);

                var droppedSources = sourceMain.pos.findInRange(FIND_DROPPED_RESOURCES, 2);
                if (droppedSources.length > 0) {
                    sourceId = droppedSources[0].id;
                }
                else {
                    var containers = sourceMain.pos.findInRange(FIND_STRUCTURES, 2, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER &&
                                    structure.store[RESOURCE_ENERGY] > 0);
                        }
                    });
                    if (containers.length > 0) {
                        sourceId = containers[0].id;
                    }
                }
            }
            if (sourceId == '') {
                var sourceNew = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (sourceNew != null) {
                    sourceId = sourceNew.id;
                }
            }
        }

        if (sourceId != '') {
            creep.memory.movingTo = sourceId;
            var source = Game.getObjectById(sourceId);
            if (source !== null && source.amount != undefined) {
                creep.moveTo(source);
                creep.pickup(source, source.amount - 1);
                return true;
            }
            //if the source is a contrainer, transfer energy
            if (source !== null && source.store != undefined) {
                if (source.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                return true;
            }

            //if there is no source. look for a new one
            creep.memory.movingTo = undefined;

        }

        return false;

    },
    //transfer energy to the spawn/extension/tower, else give it to a builder
    GiveEnergy: function (creep) {
        var transferTo = '';
        //if the creep is moving, keep on moving, he already has a target for his transfer
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
            }
                //If all structures are full, give energy to builders
            else {
                var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.carry.energy < (creep.carryCapacity / 2));
                if (builders.length > 0) {
                    transferTo = builders[0].id;
                }
            }
        }

        if (transferTo != '') {
            creep.memory.movingTo = transferTo;
            var target = Game.getObjectById(transferTo);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else { //if the target is full, clear the movingTo to look for a different target
                creep.memory.movingTo = undefined;
            }
        }
    }

};

module.exports = action;
