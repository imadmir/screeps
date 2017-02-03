function GetRoomInfo(room) {
    var sourceList = room.find(FIND_SOURCES);
    var sources = [];
    for (var i in sourceList) {
        var containerId = undefined;
        var linkId = undefined;
        var source = Game.getObjectById(sourceList[i].id);
        if (source != undefined) {
            var surroundingStructures = source.pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_LINK || structure.structureType == STRUCTURE_CONTAINER);
                }
            });
            if (surroundingStructures.length) {
                for (var i in surroundingStructures) {
                    if (surroundingStructures[i].structureType == STRUCTURE_CONTAINER) {
                        containerId = surroundingStructures[i].id;
                    } else if (surroundingStructures[i].structureType == STRUCTURE_LINK) {
                        linkId = surroundingStructures[i].id;
                    }
                }
            }
        }

        sources.push({ id: source.id, containerId: containerId, linkId: linkId });
    }

    var spawnNames = [];
    var minerals = {};
    var storageId = undefined;
    var storageLinkId = undefined;

    var spawns = room.find(FIND_MY_SPAWNS);
    if (spawns.length) {
        for (var i in spawns) {
            spawnNames.push(spawns[i].name);
        }

        var extractors = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTRACTOR);
            }
        });
        if (extractors.length) {
            
            var mineralsList = room.find(FIND_MINERALS);
            if (mineralsList.length) {
                minerals.Id = mineralsList[0].id;
                minerals.mineralType = mineralsList[0].mineralType;
                minerals.extractorId = extractors[0].id;
            }
        }
        //find the link that is next to a storage, and set that as the storageLink
        var storage = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE);
            }
        });
        if (storage.length) {
            storageId = storage[0].id;
            var storageLink = storage[0].pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_LINK);
                }
            });
            if (storageLink.length) {
                storageLinkId = storageLink[0].id;
            }
        }

    }
    var roomInfo = {
        name: room.name, sources: sources, spawnNames: spawnNames, storageLinkId: storageLinkId, storageId: storageId,
        minerals: minerals
    }
    return roomInfo;
}

function GetLinks(roomsInfo) {
    var links = [];

    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var roomInfo = _.filter(roomsInfo, (roomInfo) => roomInfo.name == roomName);
        if (roomInfo.length) {
            var storageLinkId = roomInfo[0].storageLinkId;
            if (storageLinkId != undefined) {
                var allLinks = room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_LINK);
                    }
                });
                for (var i in allLinks) {
                    links.push({ id: allLinks[i].id, storageLinkId: storageLinkId });
                }
            }
        }
    }

    return links;
}

var settings = {

    init: function () {
        console.log('Initializing Settings ....');
        var startCpu = Game.cpu.getUsed();

        var settings = {};
        settings.time = Game.time;
        settings.MaxBuilderPerRoom = 4;
        settings.UpgraderPerRoom = 2;
        settings.WallBuilderPerRoom = 1;
        settings.MinerPerSource = 1;
        settings.CarrierPerSource = 1;
        settings.DistributorPerRoom = 2;

        settings.towerIds = [];
        settings.roomsInfo = [];
        for (var roomName in Game.rooms) {
            var room = Game.rooms[roomName];


            var towers = room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER);
                }
            });
            for (var i in towers) {
                settings.towerIds.push(towers[i].id);
            }

            var roomInfo = GetRoomInfo(room);

            settings.roomsInfo.push(roomInfo);
        }

        settings.links = GetLinks(settings.roomsInfo);

        settings.roomTargets = [];
        settings.roomTargets.push({ room: 'E83S32', targetRoom: 'E84S32', type: 'reserve', buildRoads: true });
        settings.roomTargets.push({ room: 'E83S32', targetRoom: 'E83S31', type: 'reserve', buildRoads: true });
        settings.roomTargets.push({ room: 'E83S33', targetRoom: 'E83S34', type: 'reserve', buildRoads: true });
        settings.roomTargets.push({ room: 'E83S33', targetRoom: 'E82S33', type: 'reserve', buildRoads: true });
        settings.roomTargets.push({ room: 'E83S33', targetRoom: 'E84S33', type: 'reserve', buildRoads: true });

        settings.alliedPlayers = [];
        settings.alliedPlayers.push('Orocket');

        Memory.Settings = settings;
        var EndCpu = Game.cpu.getUsed();

        console.log('Init used ' + (EndCpu - startCpu) + ' CPU');
        return true;
    },

    addRoomInfo: function (room) {
        var roomInfo = GetRoomInfo(room);

        Memory.Settings.roomsInfo.push(roomInfo);
        return true;
    }


};

module.exports = settings;
