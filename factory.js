var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleWorker = require('role.worker');
var roleGuard = require('role.guard');
var roleWallBuilder = require('role.wall.builder');
var roleClaimer = require('role.claimer');
var roleStorageFeeder = require('role.storage.feeder');
var roleMineralCarrier = require('role.mineral.carrier');
var roleMineralMiner = require('role.mineral.miner');
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

            this.spawnNext(roomInfo);
            
        }

    },

    spawnNext: function (roomInfo)
    {
        var roomLevel = 0;
        var spawn = undefined;
        //if the room has a spawn
        if (roomInfo.spawnNames.length > 0) {
            var room = Game.rooms[roomInfo.name];
            var spawns = room.find(FIND_MY_SPAWNS, {
                filter: (spawn) => !spawn.spawning
            });

            if (spawns.length) {
                roomLevel = roomMonitor.GetRoomLevel(room);
                spawn = spawns[0];
            } else {
                return;
            }
        }

        if (spawn == undefined || spawn.spawning != null) {
            return;
        }

        //if the room has a storage, make sure to spawn a distributor first
        if (roomInfo.storageId != undefined) {
            //spawn distributors
            var distributorCount = roomMonitor.GetCreepCountByRole(room.name, 'distributor', 20);
            if (distributorCount == 0) {
                roleDistributor.spawnCreep(spawn, roomLevel, roomInfo.name);
                return;
            }
        }

        //Spawn miner and carrier for every resource in the room
        for (var j in roomInfo.sources) {
            var sourceId = roomInfo.sources[j].id;
            var containerId = roomInfo.sources[j].containerId;
            var linkId = roomInfo.sources[j].linkId;
            var minersCount = roomMonitor.GetCountBySource(sourceId, 'miner', 50);

            if (minersCount < Memory.Settings.MinerPerSource) {
                roleMiner.spawnCreep(spawn, roomLevel, roomInfo.name, sourceId, containerId, linkId, true);
                return;
            }
            var carriersCount = roomMonitor.GetCountBySource(sourceId, 'carrier', 50);

            if (carriersCount < Memory.Settings.CarrierPerSource) {
                roleCarrier.spawnCreep(spawn, roomLevel, roomInfo.name, roomInfo.name, sourceId, containerId);
                return;
            }
        }

        //spawn Guards if there is any hostiles
        var hostileTargets = roomMonitor.GetHostilesInRoom(room);
        if (hostileTargets.length) {
            var guardsCount = roomMonitor.GetCreepCountByRole(room.name, 'guard', 50);

            if (guardsCount < hostileTargets.length + 1) {
                roleGuard.spawnCreep(spawn, roomLevel, roomInfo.name);
                return;
            }
        }


        if (roomInfo.storageId != undefined) {
            //spawn distributors
            var distributorCount = roomMonitor.GetCreepCountByRole(room.name, 'distributor', 20);
            if (distributorCount < Memory.Settings.DistributorPerRoom) {
                roleDistributor.spawnCreep(spawn, roomLevel, roomInfo.name);
                return;
            }
        }

        if (roomInfo.storageLinkId != undefined && roomInfo.storageId != undefined) {
            //spawn storageFeeder
            var storageFeederCount = roomMonitor.GetCreepCountByRole(room.name, 'storageFeeder', 20);
            if (storageFeederCount == 0) {
                roleStorageFeeder.spawnCreep(spawn, roomLevel, roomInfo.name);
                return;
            }
        }

        if (roomInfo.extractorId != undefined && roomInfo.mineralSourceId != undefined) {
            //spawn mineral miners
            var mineralMinersCount = roomMonitor.GetCountBySource(roomInfo.mineralSourceId, 'mineralMiner', 50);
            if (mineralMinersCount < 1) {
                roleMineralMiner.spawnCreep(spawn, roomLevel, roomInfo.name, roomInfo.mineralSourceId, true, roomInfo.mineralType);
                return;
            }

            var mineralCarriersCount = roomMonitor.GetCountBySource(roomInfo.mineralSourceId, 'mineralCarrier', 20);
            if (mineralCarriersCount < 1) {
                roleMineralCarrier.spawnCreep(spawn, 0, roomInfo.name, roomInfo.name, roomInfo.mineralSourceId, roomInfo.mineralType);
                return;
            }
        }

        //spawn upgrader
        var upgradersCount = roomMonitor.GetCreepCountByRole(room.name, 'upgrader', 50);

        if (upgradersCount < Memory.Settings.UpgraderPerRoom) {
            roleUpgrader.spawnCreep(spawn, roomLevel, roomInfo.name);
            return;
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
                return;
            }
        }

        var WallBuildersCount = roomMonitor.GetCreepCountByRole(room.name, 'wallBuilder', 50);

        if (WallBuildersCount < Memory.Settings.WallBuilderPerRoom) {
            roleWallBuilder.spawnCreep(spawn, roomLevel, roomInfo.name);
            return;
        }

        this.spawnForTargetRooms(spawn, roomLevel);
        return;

    },

    spawnForTargetRooms: function(spawn, roomLevel)
    {

        //Target another room
        var targetedRooms = roomMonitor.GetTargetedRooms(spawn.room.name);
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
                        return;
                    }
                }

                var targetedRoom = Game.rooms[targetedRoomName];

                //send creeps if there is no hostiles detected there
                var hostileTargets = roomMonitor.GetHostilesInRoom(targetedRoom);
                if (hostileTargets.length == 0) {

                    if (roomLevel > 1 && (type == 'claim' || type == 'reserve')) {
                        if (targetedRoom.controller.reservation == undefined || targetedRoom.controller.reservation.ticksToEnd < 4000) {
                            var claimerCount = roomMonitor.GetCreepCountByRole(targetedRoomName, 'claimer', 100);

                            if (claimerCount < 1) {
                                roleClaimer.spawnCreep(spawn, roomLevel, targetedRoomName, buildRoads, type == 'claim');
                                return;
                            }
                        }

                    }

                    if (type == 'reserve') {
                        var targetedRoomInfo = roomMonitor.GetRoomInfo(targetedRoomName);
                        if (targetedRoomInfo.length) {
                            for (var j in targetedRoomInfo[0].sources) {
                                var sourceId = targetedRoomInfo[0].sources[j].id;
                                var containerId = targetedRoomInfo[0].sources[j].containerId;
                                var linkId = targetedRoomInfo[0].sources[j].linkId;
                                var minersCount = roomMonitor.GetCountBySource(sourceId, 'miner', 50);

                                if (minersCount < 1) {
                                    roleMiner.spawnCreep(spawn, roomLevel, targetedRooms[i].targetRoom, sourceId, containerId, linkId, buildRoads);
                                    return;
                                }
                                var carriersCount = roomMonitor.GetCountBySource(sourceId, 'carrier', 50);

                                if (carriersCount < Memory.Settings.CarrierPerSource) {
                                    var dropOffRoom = spawn.room.name
                                    if (type == 'claim' || type == 'help') {
                                        dropOffRoom = targetedRooms[i].targetRoom;
                                    }
                                    roleCarrier.spawnCreep(spawn, roomLevel, targetedRooms[i].targetRoom, dropOffRoom, sourceId, containerId);
                                    return;
                                }
                            }
                        }
                        //if there is any construction needed, send a worker
                        var ConstructionSitesCount = roomMonitor.GetConstructionSitesCount(targetedRoom);
                        if (ConstructionSitesCount > 0) {
                            var workerCount = roomMonitor.GetCreepCountByRole(targetedRoomName, 'worker', 50);

                            if (workerCount < 1) {
                                roleWorker.spawnCreep(spawn, roomLevel, targetedRoomName);
                                return;
                            }
                        }
                    }

                    if (type == 'help') {
                        //var helpersCount = roomMonitor.GethelpersCount(sourceId, 'carrier', 50);

                        //if (helpersCount < 1) {
                        //    var dropOffRoom = targetedRooms[i].targetRoom;
                        //    var targetRoom = spawn.room.name;

                        //    roleCarrier.spawnCreep(spawn, roomLevel, targetRoom, dropOffRoom, undefined);
                        //    return;
                        //}
                    }
                }
            }
        }
    }

};

module.exports = factory;
