var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleWorker = require('role.worker');
var roleGuard = require('role.guard');
var roleWallBuilder = require('role.wall.builder');
var roleClaimer = require('role.claimer');
var roomMonitor = require('room.monitor');

var factory = {

    spawn: function () {
        //Remove dead creeps
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        
        for (var roomCount in Memory.Settings.rooms) {
            var roomInfo = Memory.Settings.rooms[roomCount];

            //if the room has a spawn
            if (roomInfo.spawnNames.length > 0) {
                var room = Game.rooms[roomInfo.name];

                var roomLevel = roomMonitor.GetRoomLevel(room);
                
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
                        var minersCount = roomMonitor.GetMinerCountBySource(sourceId);

                        if (minersCount < Memory.Settings.MinerPerSource) {
                            roleMiner.spawnCreep(spawn, roomLevel, roomInfo.name, sourceId, true);
                            spawning = true;
                            break;
                        }
                        var carriersCount = roomMonitor.GetCarrierCountBySource(sourceId);

                        if (carriersCount < Memory.Settings.CarrierPerSource) {
                            roleCarrier.spawnCreep(spawn, roomLevel, roomInfo.name, sourceId);
                            spawning = true;
                            break;
                        }
                    }
                    if (spawning) {
                        break;
                    }
                    //spawn Guards if there is any hostiles
                    var hostileTargets = roomMonitor.GetHostilesInRoom(room);
                    if (hostileTargets.length) {
                        var guardsCount = roomMonitor.GetCreepCountByRole(room.name, 'guard');

                        if (guardsCount < hostileTargets.length + 1) {
                            roleGuard.spawnCreep(spawn, roomLevel, roomInfo.name);
                            break;
                        }
                    }

                    //spawn builder
                    var buildersCount = roomMonitor.GetCreepCountByRole(room.name, 'builder');

                    if (buildersCount < Memory.Settings.BuilderPerRoom) {
                        roleBuilder.spawnCreep(spawn, roomLevel, roomInfo.name);
                        break;
                    }

                    var WallBuildersCount = roomMonitor.GetCreepCountByRole(room.name, 'wallBuilder');

                    if (WallBuildersCount < Memory.Settings.WallBuilderPerRoom) {
                        roleWallBuilder.spawnCreep(spawn, roomLevel, roomInfo.name);
                        break;
                    }



                    //Target another room
                    var targetedRooms = roomMonitor.GetTargetedRooms(roomInfo.name);
                    if (targetedRooms.length) {
                        for (var i in targetedRooms) {
                            var targetedRoomName = targetedRooms[i].targetRoom;
                            var targetType = targetedRooms[i].targetType;

                            if (Game.rooms[targetedRoomName] == undefined) {
                                //send a level 0 worker to scout the area
                                var workers = roomMonitor.GetCreepCountByRole(targetedRoomName, 'worker'); 
                                if (workers.length < 1) {
                                    roleWorker.spawnCreep(spawn, 0, targetedRoomName);
                                }
                                break;
                            }

                            var targetedRoom = Game.rooms[targetedRoomName];

                            //send creeps if there is no hostiles detected there
                            var hostileTargets = roomMonitor.GetHostilesInRoom(targetedRoom);
                            if (hostileTargets.lenth == 0) {

                                if (targetType != "Harvest") {
                                    var workers = roomMonitor.GetCreepCountByRole(targetedRoomName, 'worker');

                                    if (workers.length < 1) {
                                        roleWorker.spawnCreep(spawn, roomLevel, targetedRoomName);
                                        break;
                                    }

                                    if (targetedRoom.controller.reservation.ticksToEnd < 4000) {
                                        var claimers = roomMonitor.GetClaimersCount(targetedRoomName);

                                        if (claimers.length < 1) {
                                            roleClaimer.spawnCreep(spawn, roomLevel, targetedRoomName, true);
                                            break;
                                        }
                                    }

                                }

                                var targetedRoomInfo = roomMonitor.GetRoomInfo(targetedRoomName);
                                if (targetedRoomInfo.length) {
                                    for (var j in targetedRoomInfo[0].sourceIds) {
                                        var sourceId = targetedRoomInfo[0].sourceIds[j];
                                        var minersCount = roomMonitor.GetMinerCountBySource(sourceId);

                                        if (minersCount < Memory.Settings.MinerPerSource) {
                                            var buildRoads = targetType != "Harvest";
                                            roleMiner.spawnCreep(spawn, roomLevel, targetedRooms[i].targetRoom, sourceId, buildRoads);
                                            spawning = true;
                                            break;
                                        }
                                        var carriersCount = roomMonitor.GetCarrierCountBySource(sourceId);

                                        if (carriersCount < Memory.Settings.CarrierPerSource) {
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
