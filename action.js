function sortStructures(structure)
		{
			if(structure.structureType == STRUCTURE_SPAWN)
				return 10;
			if(structure.structureType == STRUCTURE_EXTENSION)
				return 8;
			if(structure.structureType == STRUCTURE_TOWER)
				return 6;
			if(structure.structureType == STRUCTURE_STORAGE)
				return 0;
		}
		
var action = {

	var sortStructures = function(structure)
		{
			if(structure.structureType == STRUCTURE_SPAWN)
				return 10;
			if(structure.structureType == STRUCTURE_EXTENSION)
				return 8;
			if(structure.structureType == STRUCTURE_TOWER)
				return 6;
			if(structure.structureType == STRUCTURE_STORAGE)
				return 0;
		}
	
    //get dropped energy, or energy from a container
    PickUpEnergy: function (creep) {
        var sourceId = '';
        //if the creep is moving, keep on moving, no need to find a new source
        if (creep.memory.movingTo != undefined && creep.memory.movingTime != undefined && (Game.time - creep.memory.movingTime) < 20 ) {
            sourceId = creep.memory.movingTo;
        }
        else {
            //if the creep has a mainSource id in memory
            if (creep.memory.mainSourceId != undefined) {
                var sourceMain = Game.getObjectById(creep.memory.mainSourceId);

                var droppedSources = sourceMain.pos.findInRange(FIND_DROPPED_RESOURCES, 2);
                if (droppedSources.length > 0) {
                    sourceId = droppedSources[0].id;
                    creep.memory.movingTo = sourceId;
                    creep.memory.movingTime = Game.time;
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
                        creep.memory.movingTo = sourceId;
                        creep.memory.movingTime = Game.time;
                    }
                }
            }
            if (sourceId == '') {
                var sourceNew = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (sourceNew != null) {
                    sourceId = sourceNew.id;
                    creep.memory.movingTo = sourceId;
                    creep.memory.movingTime = Game.time;
                }
                else {
                    var sourceContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER &&
                                    structure.store[RESOURCE_ENERGY] > 0);
                        }
                    });
                    if (sourceContainer != null) {
                        sourceId = sourceContainer.id;
                        creep.memory.movingTo = sourceId;
                        creep.memory.movingTime = Game.time;
                    }
                }
            }
        }

        if (sourceId != '') {
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
            creep.memory.movingTime = undefined;

        }

        return false;

    },

    //transfer energy to the spawn/extension/tower, else give it to a builder
    GiveEnergy: function (creep) {
        var transferTo = '';
        //if the creep is moving, keep on moving, he already has a target for his transfer
        if (creep.memory.movingTo != undefined && creep.memory.movingTime != undefined && (Game.time - creep.memory.movingTime) < 20) {
            transferTo = creep.memory.movingTo;
        }
        else {

            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity)
							|| (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.9)
							|| (structure.structureType == STRUCTURE_STORAGE && structure.energy < structure.energyCapacity * 0.9);
                }
            });
            if (targets.length > 0) {
				targets.sort(function(a, b){return sortStructures(b) - sortStructures(a)});
                transferTo = targets[0].id;
            }
            else {
				//If all structures are full, give energy to builders
				var needEnergy = _.filter(Game.creeps, (creep) => (creep.memory.requireEnergy) && creep.carry.energy < (creep.carryCapacity / 2));
				if (needEnergy.length > 0) {
					transferTo = needEnergy[0].id;
				}
                
            }
        }

        if (transferTo != '') {
            creep.memory.movingTo = transferTo;
            creep.memory.movingTime = Game.time;

            var target = Game.getObjectById(transferTo);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else { //if the target is full, clear the movingTo to look for a different target
                creep.memory.movingTo = undefined;
                creep.memory.movingTime = undefined;
            }
        }
    },

    BuildStructures: function(creep)
    {
        //Build construction sites
        var targetId = '';
        if (creep.memory.movingTo != undefined && creep.memory.movingTime != undefined && (Game.time - creep.memory.movingTime) < 20) {
            targetId = creep.memory.movingTo;
        }
        else {
            //Make sure to send at most 2 for my construction jobs, and only 1 builder per road, wall.
            var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES,
                                        { filter: (s) => !(_.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.movingTo == s.id).length > 1) });
            if (targets.length) {
                targetId = targets[0].id;
                creep.memory.movingTo = targetId;
                creep.memory.movingTime = Game.time;
            }
            else {
                targets = creep.room.find(FIND_CONSTRUCTION_SITES,
                                        { filter: (s) => !(_.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.movingTo == s.id).length > 0) });
                if (targets.length) {
                    targetId = targets[0].id;
                    creep.memory.movingTo = targetId;
                    creep.memory.movingTime = Game.time;
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
                    creep.memory.movingTime = undefined;
                }
            }
            return true;
        }
        //if no target found, return false;
        return false;
    }

};

module.exports = action;
