var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleWorker = require('role.worker');
var roleGuard = require('role.guard');
var roleWallBuilder = require('role.wall.builder');
var roleClaimer = require('role.claimer');
var roleStorageFeeder = require('role.storage.feeder');
var roleUpgrader = require('role.upgrader');
var roleDistributor = require('role.distributor');
var roomMonitor = require('room.monitor');

var factory = {

    spawn: function () {
        //Remove dead creeps
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        
        for (var roomCount in Memory.Settings.roomsInfo) {
            var roomInfo = Memory.Settings.roomsInfo[roomCount];

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
                        var minersCount = roomMonitor.GetCountBySource(sourceId, 'miner', 50);

                        if (minersCount < Memory.Settings.MinerPerSource) {
                            roleMiner.spawnCreep(spawn, roomLevel, roomInfo.name, sourceId, true);
                            spawning = true;
                            break;
                        }
                        var carriersCount = roomMonitor.GetCountBySource(sourceId, 'carrier', 50);

                        if (carriersCount < Memory.Settings.CarrierPerSource) {
                            roleCarrier.spawnCreep(spawn, roomLevel, roomInfo.name, roomInfo.name, sourceId);
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
                        var guardsCount = roomMonitor.GetCreepCountByRole(room.name, 'guard', 50);

                        if (guardsCount < hostileTargets.length + 1) {
                            roleGuard.spawnCreep(spawn, roomLevel, roomInfo.name);
                            break;
                        }
                    }

                    if (roomInfo.storageLinkId != undefined && roomInfo.storageId != undefined) {
                        //spawn storageFeeder
                        var storageFeederCount = roomMonitor.GetCreepCountByRole(room.name, 'storageFeeder', 20);
                        if (storageFeederCount == 0) {
                            roleStorageFeeder.spawnCreep(spawn, roomLevel, roomInfo.name);
                            break;
                        }
                    }

                    if (roomInfo.storageId != undefined) {
                        //spawn distributors
                        var distributorCount = roomMonitor.GetCreepCountByRole(room.name, 'distributor', 20);
                        if (distributorCount < Memory.Settings.DistributorPerRoom) {
                            roleDistributor.spawnCreep(spawn, roomLevel, roomInfo.name);
                            break;
                        }
                    }
                    //spawn builder
                    var upgradersCount = roomMonitor.GetCreepCountByRole(room.name, 'upgrader', 50);

                    if (upgradersCount < Memory.Settings.UpgraderPerRoom) {
                        roleUpgrader.spawnCreep(spawn, roomLevel, roomInfo.name);
                        break;
                    }

                    //spawn builder
                    var ConstructionSitesCount = roomMonitor.GetConstructionSitesCount(room);
                    if (ConstructionSitesCount > 0) {
                        var buildersCount = roomMonitor.GetCreepCountByRole(room.name, 'builder', 50);
                        var buildersPerRoom = Math.ceil(ConstructionSitesCount / 4);
                        if (buildersPerRoom > Memory.Settings.MaxBuilderPerRoom) {
                            buildersPerRoom = Memory.Settings.MaxBuilderPerRoom;
                        }
                        if (buildersCount < buildersPerRoom) {
                            roleBuilder.spawnCreep(spawn, roomLevel, roomInfo.name);
                            break;
                        }
                    }

                    var WallBuildersCount = roomMonitor.GetCreepCountByRole(room.name, 'wallBuilder', 50);

                    if (WallBuildersCount < Memory.Settings.WallBuilderPerRoom) {
                        roleWallBuilder.spawnCreep(spawn, roomLevel, roomInfo.name);
                        break;
                    }



                    //Target another room
                    var targetedRooms = roomMonitor.GetTargetedRooms(roomInfo.name);
                    if (targetedRooms.length) {
                        for (var i in targetedRooms) {
                            var targetedRoomName = targetedRooms[i].targetRoom;
                            var type = targetedRooms[i].type;
                            var buildRoads = targetedRooms[i].buildRoads;
                            var worker = targetedRooms[i].worker;

                            if (Game.rooms[targetedRoomName] == undefined) {
                                //send a level 0 worker to scout the area
                                var workerCount = roomMonitor.GetCreepCountByRole(targetedRoomName, 'worker', 0); 
                                if (workerCount < 1) {
                                    roleWorker.spawnCreep(spawn, 0, targetedRoomName);
                                    break;
                                }
                                continue;
                            }

                            var targetedRoom = Game.rooms[targetedRoomName];

                            //send creeps if there is no hostiles detected there
                            var hostileTargets = roomMonitor.GetHostilesInRoom(targetedRoom);
                            if (hostileTargets.length == 0) {

                                if (worker) {
                                    var workerCount = roomMonitor.GetCreepCountByRole(targetedRoomName, 'worker', 50);

                                    if (workerCount < 1) {
                                        roleWorker.spawnCreep(spawn, roomLevel, targetedRoomName);
                                        break;
                                    }
                                }
                                if (type == 'claim' || type =='reserve') {
                                    if (targetedRoom.controller.reservation == undefined || targetedRoom.controller.reservation.ticksToEnd < 4000) {
                                        var claimerCount = roomMonitor.GetCreepCountByRole(targetedRoomName, 'claimer', 100);

                                        if (claimerCount < 1) {
                                            roleClaimer.spawnCreep(spawn, roomLevel, targetedRoomName, buildRoads, type == 'claim');
                                            break;
                                        }
                                    }

                                }

                                if (type == 'reserve') {
                                    var targetedRoomInfo = roomMonitor.GetRoomInfo(targetedRoomName);
                                    if (targetedRoomInfo.length) {
                                        for (var j in targetedRoomInfo[0].sourceIds) {
                                            var sourceId = targetedRoomInfo[0].sourceIds[j];
                                            var minersCount = roomMonitor.GetCountBySource(sourceId, 'miner', 50);

                                            if (minersCount < 1) {
                                                roleMiner.spawnCreep(spawn, roomLevel, targetedRooms[i].targetRoom, sourceId, buildRoads);
                                                spawning = true;
                                                break;
                                            }
                                            var carriersCount = roomMonitor.GetCountBySource(sourceId, 'carrier', 50);

                                            if (carriersCount < Memory.Settings.CarrierPerSource) {
                                                var dropOffRoom = spawn.room.name
                                                if (type == 'claim' || type == 'help') {
                                                    dropOffRoom = targetedRooms[i].targetRoom;
                                                }
                                                roleCarrier.spawnCreep(spawn, roomLevel, targetedRooms[i].targetRoom, dropOffRoom, sourceId);
                                                spawning = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (spawning) {
                                        break;
                                    }
                                }
                                
                                if (type == 'help') {
                                    var helpersCount = roomMonitor.GethelpersCount(sourceId, 'carrier', 50);

                                    if (helpersCount < 1) {
                                        var dropOffRoom = targetedRooms[i].targetRoom;
                                        var targetRoom = spawn.room.name;

                                        roleCarrier.spawnCreep(spawn, roomLevel, targetRoom, dropOffRoom, undefined);
                                        spawning = true;
                                        break;
                                    }
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
