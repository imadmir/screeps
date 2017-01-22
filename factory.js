var factory = {

    spawn: function () {
        //Remove dead creeps
        for (var name in Game.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }
        }


        var minerParts = [[WORK, WORK, MOVE, MOVE],
                           [WORK, WORK, WORK, WORK, WORK, MOVE]];

        var carrierParts = [[CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                             [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]];

        var builderParts = [[WORK, CARRY, CARRY, MOVE, MOVE],
                           [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]];

        var guardParts = [[ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE],
                           [ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE]];

        var level = 0;
        for (var spawnName in Game.spawns) {
            var spawn = Game.spawns[spawnName]

            var totalMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
            var totalCarriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
            if (totalMiners.length >= Memory.Settings.MinerPerSource && totalCarriers.length >= Memory.Settings.CarrierPerSource) {
                if (spawn.room.energyCapacityAvailable >= 550) {
                    level = 1;
                }
            }
            var requiredEnergy = 300;
            if (level == 1) {
                requiredEnergy = 550;
            }
            //Spawn miner
            for (var i in Memory.Settings.SourceIds) {
                var sourceId = Memory.Settings.SourceIds[i];
                var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.sourceId == sourceId);

                if (miners.length < Memory.Settings.MinerPerSource && spawn.room.energyAvailable >= requiredEnergy && spawn.spawning == null) {
                    var newName = spawn.createCreep(minerParts[level], undefined, { role: 'miner', sourceId: sourceId });
                    console.log('Spawning new miner: ' + newName);
                    return;
                }
                var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.sourceId == sourceId);

                if (carriers.length < Memory.Settings.CarrierPerSource && spawn.room.energyAvailable >= requiredEnergy && spawn.spawning == null) {
                    var newName = spawn.createCreep(carrierParts[level], undefined, { role: 'carrier', sourceId: sourceId, working: false });
                    console.log('Spawning new carrier: ' + newName);
                    return;
                }
            }

            //spawn builder
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

            if (builders.length < Memory.Settings.BuilderPerRoom && spawn.room.energyAvailable >= requiredEnergy && spawn.spawning == null) {
                var newName = spawn.createCreep(builderParts[level], undefined, { role: 'builder', working: false });
                console.log('Spawning new Builder: ' + newName);
                return;
            }

            //spawn Guards if there is any hostiles
            var hostileTargets = spawn.room.find(FIND_HOSTILE_CREEPS);
            if (hostileTargets.lenth) {
                var guards = _.filter(Game.creeps, (creep) => creep.memory.role == 'guard');

                if (guards.length < hostileTargets.lenth + 1 && spawn.room.energyAvailable >= requiredEnergy && spawn.spawning == null) {
                    var newName = spawn.createCreep(guardParts[level], undefined, { role: 'guard' });
                    console.log('Spawning new Guard: ' + newName);
                    return;
                }
            }
        }

    }

};

module.exports = factory;
