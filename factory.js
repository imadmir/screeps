var factory = {

    spawn: function () {

        //Spawn harvester
        for (var i in Memory.Settings.SourceIds) {
            var sourceId = Memory.Settings.SourceIds[i];
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.sourceId == sourceId);

            if (harvesters.length < Memory.Settings.MinHarvesterNumber && Game.spawns['Spawn1'].energy >= 300 && Game.spawns['Spawn1'].spawning == null) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'harvester', sourceId: sourceId });
                console.log('Spawning new harvester: ' + newName);
                break;
            }
        }

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

        if (harvesters.length >= Memory.Settings.MinHarvesterNumber) {

            //spawn upgrader
            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

            if (upgraders.length < Memory.Settings.MinUpgraderNumber && Game.spawns['Spawn1'].energy >= 300 && Game.spawns['Spawn1'].spawning == null) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'upgrader' });
                console.log('Spawning new Upgrader: ' + newName);
            }

            //spawn builder
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

            if (builders.length < Memory.Settings.MinBuilderNumber && Game.spawns['Spawn1'].energy >= 300 && Game.spawns['Spawn1'].spawning == null) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, CARRY, MOVE], undefined, { role: 'builder' });
                console.log('Spawning new Builder: ' + newName);
            }
        }

        //Remove dead creeps
        for (var name in Game.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Game.creeps[name];
            }
        }
    }

};

module.exports = factory;
