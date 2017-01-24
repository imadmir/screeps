var factory = {

    spawn: function () {
        //Remove dead creeps
        for (var name in Game.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }
        }


        var minerParts = [[WORK, WORK, MOVE, MOVE],
                           [WORK, WORK, WORK, WORK, WORK, MOVE],
                           [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE]];
        var minerPartsCost = [300, 550, 700];

        var carrierParts = [[CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                             [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                             [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]];
        var carrierPartsCost = [300, 550, 800];

        var builderParts = [[WORK, CARRY, CARRY, MOVE, MOVE],
                           [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
                           [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]];
        var builderPartsCost = [300, 550, 800];

        var workerParts = [[WORK, CARRY, CARRY, MOVE, MOVE],
                          [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                          [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]];
        var workerPartsCost = [300, 550, 800];

        var guardParts = [[ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE],
                           [ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE],
                           [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE]];
        var guardPartsCost = [300, 550, 800];

        var roomLevel = 0;
        for (var roomCount in Memory.Settings.rooms) {
            var roomInfo = Memory.Settings.rooms[roomCount];

            //if the room has a spawn
            if (roomInfo.spawnNames.length > 0) {

                var room = Game.rooms[roomInfo.name];
                var totalMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.targetRoom == roomInfo.name);
                var totalCarriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.targetRoom == roomInfo.name);
                if (totalMiners.length >= Memory.Settings.MinerPerSource && totalCarriers.length >= Memory.Settings.CarrierPerSource) {
                    if (room.energyCapacityAvailable >= 800) {
                        roomLevel = 2;
                    }
                    else if (room.energyCapacityAvailable >= 550) {
                        roomLevel = 1;
                    }
                }

                for (var spawnCount in roomInfo.spawnNames) {
                    var spawnName = roomInfo.spawnNames[spawnCount]
                    var spawn = Game.spawns[spawnName]

                    var spawning = false;

                    //Spawn miner
                    for (var i in roomInfo.sourceIds) {
                        var sourceId = roomInfo.sourceIds[i];
                        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.mainSourceId == sourceId);

                        if (miners.length < Memory.Settings.MinerPerSource && room.energyAvailable >= minerPartsCost[roomLevel] && spawn.spawning == null) {
                            var newName = spawn.createCreep(minerParts[roomLevel], undefined, { role: 'miner', mainSourceId: sourceId, targetRoom: roomInfo.name, roomName: roomInfo.name });
                            console.log('Spawning new miner: ' + newName + ' -  Room: ' + roomInfo.name + ' mainSourceId: ' + sourceId);
                            spawning = true;
                            break;
                        }
                        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.mainSourceId == sourceId);

                        if (carriers.length < Memory.Settings.CarrierPerSource && room.energyAvailable >= carrierPartsCost[roomLevel] && spawn.spawning == null) {
                            var newName = spawn.createCreep(carrierParts[roomLevel], undefined, { role: 'carrier', mainSourceId: sourceId, working: false, targetRoom: roomInfo.name, roomName: roomInfo.name });
                            console.log('Spawning new carrier: ' + newName + ' -  Room: ' + roomInfo.name + ' mainSourceId: ' + sourceId);
                            spawning = true;
                            break;
                        }
                    }
                    if (spawning) {
                        break;
                    }
                    //spawn Guards if there is any hostiles
                    var hostileTargets = room.find(FIND_HOSTILE_CREEPS);
                    if (hostileTargets.lenth) {
                        var guards = _.filter(Game.creeps, (creep) => creep.memory.role == 'guard' && creep.room.name == roomInfo.name);

                        if (guards.length < hostileTargets.lenth + 1 && room.energyAvailable >= guardPartsCost[roomLevel] && spawn.spawning == null) {
                            var newName = spawn.createCreep(guardParts[roomLevel], undefined, { role: 'guard', roomName: roomInfo.name });
                            console.log('Spawning new Guard: ' + newName + ' -  Room: ' + roomInfo.name );
                            break;
                        }
                    }

                    //spawn builder
                    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == roomInfo.name);

                    if (builders.length < Memory.Settings.BuilderPerRoom && room.energyAvailable >= builderPartsCost[roomLevel] && spawn.spawning == null) {
                        var newName = spawn.createCreep(builderParts[roomLevel], undefined, { role: 'builder', working: false, requireEnergy: true, roomName: roomInfo.name });
                        console.log('Spawning new Builder: ' + newName + ' -  Room: ' + roomInfo.name );
                        break;
                    }

                    var wallBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallBuilder' && creep.room.name == roomInfo.name);

                    if (wallBuilders.length < Memory.Settings.WallBuilderPerRoom && room.energyAvailable >= builderPartsCost[roomLevel] && spawn.spawning == null) {
                        var newName = spawn.createCreep(builderParts[roomLevel], undefined, { role: 'wallBuilder', working: false, roomName: roomInfo.name });
                        console.log('Spawning new wallBuilder: ' + newName + ' -  Room: ' + roomInfo.name);
                        break;
                    }



                    //Target another room
                    var targetedRooms = _.filter(Memory.Settings.roomTargets, (t) => t.room == roomInfo.name);
                    if (targetedRooms.length) {
                        for(var i in targetedRooms)
                        {
                            var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker' && creep.room.name == roomInfo.name && creep.memory.targetRoom == targetedRooms[i].targetRoom);
                            
                            if (workers.length < 1 && room.energyAvailable >= workerPartsCost[roomLevel] && spawn.spawning == null) {
                                var newName = spawn.createCreep(workerParts[roomLevel], undefined, { role: 'worker', working: true, roomName: roomInfo.name , targetRoom : targetedRooms[i].targetRoom});
                                console.log('Spawning new wallBuilder: ' + newName + ' -  Room: ' + roomInfo.name);
                                break;
                            }

                        }
                    }
                }
            }
        }

    }

};

module.exports = factory;
