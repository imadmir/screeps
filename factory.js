var factory = {

    spawn: function () {
        //Remove dead creeps
        for (var name in Game.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Game.creeps[name];
            }
        }

        //Spawn harvester
        //for (var i in Memory.Settings.SourceIds) {
        //    var sourceId = Memory.Settings.SourceIds[i];
        //    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.sourceId == sourceId);

        //    if (harvesters.length < Memory.Settings.MinHarvesterNumber && Game.spawns['Spawn1'].energy >= 300 && Game.spawns['Spawn1'].spawning == null) {
        //        var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'harvester', sourceId: sourceId, harvesting: true });
        //        console.log('Spawning new harvester: ' + newName);
        //        return;
        //    }
        //}

        //Spawn miner
        for (var i in Memory.Settings.SourceIds) {
            var sourceId = Memory.Settings.SourceIds[i];
            var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.sourceId == sourceId);

            if (miners.length < Memory.Settings.MinerPerSource && Game.spawns['Spawn1'].energy >= 300 && Game.spawns['Spawn1'].spawning == null) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, MOVE], undefined, { role: 'miner', sourceId: sourceId });
                console.log('Spawning new miner: ' + newName);
                return;
            }
        }

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

        if (harvesters.length >= Memory.Settings.MinHarvesterNumber) {

            //spawn upgrader
            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

            if (upgraders.length < Memory.Settings.MinUpgraderNumber && Game.spawns['Spawn1'].energy >= 300 && Game.spawns['Spawn1'].spawning == null) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'upgrader' });
                console.log('Spawning new Upgrader: ' + newName);
                return;
            }

            //spawn builder
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

            if (builders.length < Memory.Settings.MinBuilderNumber && Game.spawns['Spawn1'].energy >= 300 && Game.spawns['Spawn1'].spawning == null) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, CARRY, MOVE], undefined, { role: 'builder' });
                console.log('Spawning new Builder: ' + newName);
                return;
            }
        }

    }

};

module.exports = factory;
