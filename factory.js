var factory = {

    spawn: function () {
        //Remove dead creeps
        for (var name in Game.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }
        }
        
        //Spawn miner
        for (var i in Memory.Settings.SourceIds) {
            var sourceId = Memory.Settings.SourceIds[i];
            var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.sourceId == sourceId);

            if (miners.length < Memory.Settings.MinerPerSource && Game.spawns['Spawn1'].energy >= 300 && Game.spawns['Spawn1'].spawning == null) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, MOVE, MOVE], undefined, { role: 'miner', sourceId: sourceId });
                console.log('Spawning new miner: ' + newName);
                return;
            }
            var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.sourceId == sourceId);

            if (carriers.length < Memory.Settings.CarrierPerSource && Game.spawns['Spawn1'].energy >= 300 && Game.spawns['Spawn1'].spawning == null) {
                var newName = Game.spawns['Spawn1'].createCreep([CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], undefined, { role: 'carrier', sourceId: sourceId, working: false });
                console.log('Spawning new carrier: ' + newName);
                return;
            }
        }

        //spawn builder
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

        if (builders.length < Memory.Settings.BuilderPerRoom && Game.spawns['Spawn1'].energy >= 300 && Game.spawns['Spawn1'].spawning == null) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, CARRY, MOVE, MOVE], undefined, { role: 'builder', working: false });
            console.log('Spawning new Builder: ' + newName);
            return;
        }
        
    }

};

module.exports = factory;
