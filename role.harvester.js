var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var sourceId = creep.memory.sourceId;
            var source = Game.getObjectById(sourceId);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    },
    
    spawn: function() {
        var sourceId1 = 'da64e67d3dea4525ac964d7c';
        var sourceId2 = '36d3afe073e745bde77dcba4';
        var sourceId3 = 'f512c712bbc33bef95f4cc4a';
        
        var harvesters1 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.sourceId == sourceId1);
        var harvesters2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.sourceId == sourceId2);
        var harvesters3 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.sourceId == sourceId3);

        if(harvesters1.length < 1) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester', sourceId: sourceId1});
            console.log('Spawning new harvester: ' + newName);
        }
        if(harvesters2.length < 2) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester', sourceId: sourceId2});
            console.log('Spawning new harvester: ' + newName);
        }
        if(harvesters3.length < 4) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester', sourceId: sourceId3});
            console.log('Spawning new harvester: ' + newName);
        }
    }
    
};

module.exports = roleHarvester;
