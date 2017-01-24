var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleWorker = require('role.worker');
var roleGuard = require('role.guard');
var roleWallBuilder = require('role.wall.builder');
var roleClaimer = require('role.claimer');

var factory = {

    spawn: function () {
        //Remove dead creeps
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        var roomLevel = 0;
        for (var roomCount in Memory.Settings.rooms) {
            var roomInfo = Memory.Settings.rooms[roomCount];

            //if the room has a spawn
            if (roomInfo.spawnNames.length > 0) {

                var room = Game.rooms[roomInfo.name];
                var totalMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.targetRoom == roomInfo.name);
                var totalCarriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.targetRoom == roomInfo.name);
                if (totalMiners.length >= Memory.Settings.MinerPerSource && totalCarriers.length >= Memory.Settings.CarrierPerSource) {
                    if (room.energyCapacityAvailable >= 1300) {
                        roomLevel = 3;
                    }
                    else if (room.energyCapacityAvailable >= 800) {
                        roomLevel = 2;
                    }
                    else if (room.energyCapacityAvailable >= 550) {
                        roomLevel = 1;
                    }
                }

                for (var spawnCount in roomInfo.spawnNames) {
                    var spawnName = roomInfo.spawnNames[spawnCount]
                    var spawn = Game.spawns[spawnName]

                    if (spawn.spawning != null) {
                        break;
                    }

                    var spawning = false;

                    //Spawn miner
                    for (var j in roomInfo.sourceIds) {
                        var sourceId = roomInfo.sourceIds[j];
                        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.mainSourceId == sourceId);

                        if (miners.length < Memory.Settings.MinerPerSource) {
                            roleMiner.spawnCreep(spawn, roomLevel, roomInfo.name, sourceId);
                            spawning = true;
                            break;
                        }
                        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.mainSourceId == sourceId);

                        if (carriers.length < Memory.Settings.CarrierPerSource) {
                            roleCarrier.spawnCreep(spawn, roomLevel, roomInfo.name, sourceId);
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

                        if (guards.length < hostileTargets.lenth + 1) {
                            roleGuard.spawnCreep(spawn, roomLevel, roomInfo.name);
                            break;
                        }
                    }

                    //spawn builder
                    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == roomInfo.name);

                    if (builders.length < Memory.Settings.BuilderPerRoom) {
                        roleBuilder.spawnCreep(spawn, roomLevel, roomInfo.name);
                        break;
                    }

                    var wallBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallBuilder' && creep.room.name == roomInfo.name);

                    if (wallBuilders.length < Memory.Settings.WallBuilderPerRoom) {
                        roleWallBuilder.spawnCreep(spawn, roomLevel, roomInfo.name);
                        break;
                    }



                    //Target another room
                    var targetedRooms = _.filter(Memory.Settings.roomTargets, (t) => t.room == roomInfo.name);
                    if (targetedRooms.length) {
                        for (var i in targetedRooms) {
                            if (Game.rooms[targetedRooms[i].targetRoom] == undefined) {
                                //send a level 0 worker to scout the area
                                var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker' && creep.memory.roomName == roomInfo.name && creep.memory.targetRoom == targetedRooms[i].targetRoom);
                                if (workers.length < 1) {
                                    roleWorker.spawnCreep(spawn, 0, targetedRooms[i].targetRoom, sourceId);
                                }
                                break;
                            }
                            //send creeps if there is no hostiles detected there
                            var hostileTargets = Game.rooms[targetedRooms[i].targetRoom].find(FIND_HOSTILE_CREEPS);
                            if (!hostileTargets.lenth) {

                                var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker' && creep.memory.roomName == roomInfo.name && creep.memory.targetRoom == targetedRooms[i].targetRoom);

                                if (workers.length < 1) {
                                    roleWorker.spawnCreep(spawn, roomLevel, targetedRooms[i].targetRoom, sourceId);
                                    break;
                                }
                                var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.roomName == roomInfo.name && creep.memory.targetRoom == targetedRooms[i].targetRoom);

                                if (claimers.length < 1) {
                                    roleClaimer.spawnCreep(spawn, roomLevel, targetedRooms[i].targetRoom, sourceId);
                                    break;
                                }

                                var targetRoomInfo = _.filter(Memory.Settings.rooms, (roomInfo) => roomInfo.name == targetedRooms[i].targetRoom);
                                if (targetRoomInfo.length) {
                                    for (var j in targetRoomInfo[0].sourceIds) {
                                        var sourceId = targetRoomInfo[0].sourceIds[j];
                                        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.mainSourceId == sourceId);

                                        if (miners.length < Memory.Settings.MinerPerSource) {
                                            roleMiner.spawnCreep(spawn, roomLevel, targetedRooms[i].targetRoom, sourceId);
                                            spawning = true;
                                            break;
                                        }
                                        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.mainSourceId == sourceId);

                                        if (carriers.length < Memory.Settings.CarrierPerSource) {
                                            roleCarrier.spawnCreep(spawn, roomLevel, targetedRooms[i].targetRoom, sourceId);
                                            spawning = true;
                                            break;
                                        }
                                    }
                                }
                                if (spawning) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

    }

};

module.exports = factory;
