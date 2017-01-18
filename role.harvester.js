var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.memory.movingTo = undefined;
            creep.say('full');
        }
        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.memory.movingTo = undefined;
            creep.say('harvesting');
        }

        if (creep.memory.harvesting) {
            var sourceId = '';
            if (creep.memory.movingTo != undefined) {
                sourceId = creep.memory.movingTo;
            }
            else {
                sourceId = creep.memory.sourceId;
                var sourceMain = Game.getObjectById(sourceId);
                //if there is hostiles in range, don't go there. 
                var hostiles = sourceMain.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (hostiles.length == 0) {
                    creep.memory.movingTo = sourceId;
                } else {
                    creep.say('Hostile near source');
                    var sourceNew = creep.pos.findClosestByRange(FIND_SOURCES);
                    sourceId = sourceNew.id;
                    creep.memory.movingTo = sourceId;
                }
            }
            var source = Game.getObjectById(sourceId);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
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
                }//if everything is full upgrade the controller
                else {
                    creep.say('upgrading');
                    transferTo = creep.room.controller.id;
                    creep.memory.movingTo = transferTo;
                }
                var target = Game.getObjectById(transferTo);
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }

            }
        }

    }

};

module.exports = roleHarvester;
