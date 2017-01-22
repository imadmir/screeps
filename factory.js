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

        var roomLevel = 0;
        for (var roomCount in Memory.Settings.rooms) {
            var roomInfo = Memory.Settings.rooms[roomCount];

            //if the room has a spawn
            if (roomInfo.spawnNames.length > 0) {

                var room = Game.rooms[roomInfo.name];
                var totalMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.room.name == roomInfo.name);
                var totalCarriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.room.name == roomInfo.name);
                if (totalMiners.length >= Memory.Settings.MinerPerSource && totalCarriers.length >= Memory.Settings.CarrierPerSource) {
                    if (room.energyCapacityAvailable >= 550) {
                        roomLevel = 1;
                    }
                }
                var requiredEnergy = 300;
                if (roomLevel == 1) {
                    requiredEnergy = 550;
                }

                for (var spawnCount in roomInfo.spawnNames) {
                    var spawnName = roomInfo.spawnNames[spawnCount]
                    var spawn = Game.spawns[spawnName]

                    //Spawn miner
                    for (var i in roomInfo.sourceIds) {
                        var sourceId = roomInfo.sourceIds[i];
                        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.mainSourceId == sourceId);

                        if (miners.length < Memory.Settings.MinerPerSource && room.energyAvailable >= requiredEnergy && spawn.spawning == null) {
                            var newName = spawn.createCreep(minerParts[roomLevel], undefined, { role: 'miner', mainSourceId: sourceId, roomName: roomInfo.name });
                            console.log('Spawning new miner: ' + newName + ' -  Room: ' + roomInfo.name + ' mainSourceId: ' + sourceId);
                            continue;
                        }
                        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.mainSourceId == sourceId);

                        if (carriers.length < Memory.Settings.CarrierPerSource && room.energyAvailable >= requiredEnergy && spawn.spawning == null) {
                            var newName = spawn.createCreep(carrierParts[roomLevel], undefined, { role: 'carrier', mainSourceId: sourceId, working: false, roomName: roomInfo.name });
                            console.log('Spawning new carrier: ' + newName + ' -  Room: ' + roomInfo.name + ' mainSourceId: ' + sourceId);
                            continue;
                        }
                    }

                    //spawn Guards if there is any hostiles
                    var hostileTargets = room.find(FIND_HOSTILE_CREEPS);
                    if (hostileTargets.lenth) {
                        var guards = _.filter(Game.creeps, (creep) => creep.memory.role == 'guard' && creep.room.name == roomInfo.name);

                        if (guards.length < hostileTargets.lenth + 1 && room.energyAvailable >= requiredEnergy && spawn.spawning == null) {
                            var newName = spawn.createCreep(guardParts[roomLevel], undefined, { role: 'guard' });
                            console.log('Spawning new Guard: ' + newName + ' -  Room: ' + roomInfo.name );
                            continue;
                        }
                    }

                    //spawn builder
                    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == roomInfo.name);

                    if (builders.length < Memory.Settings.BuilderPerRoom && room.energyAvailable >= requiredEnergy && spawn.spawning == null) {
                        var newName = spawn.createCreep(builderParts[roomLevel], undefined, { role: 'builder', working: false });
                        console.log('Spawning new Builder: ' + newName + ' -  Room: ' + roomInfo.name );
                        continue;
                    }

                }
            }
        }

    }

};

module.exports = factory;
