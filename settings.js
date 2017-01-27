function GetRoomInfo(room)
{
    var sources = room.find(FIND_SOURCES);
    var sourceIds = [];
    for (var i in sources) {
        sourceIds.push(sources[i].id);
    }

    var spawns = room.find(FIND_MY_SPAWNS);
    var spawnNames = [];
    for (var i in spawns) {
        spawnNames.push(spawns[i].name);
    }

    //find the link that is next to a storage, and set that as the storageLink
    var storage = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE);
        }
    });
    var storageId = undefined;
    var storageLinkId = undefined;
    if (storage.length) {
        storageId = storage[0].id;
        var storageLink = storage[0].pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_LINK);
            }
          });
          if (storageLink != null) {
              storageLinkId = storageLink[0].id;
          }
    }
    var roomInfo = { name: room.name, sourceIds: sourceIds, spawnNames: spawnNames, storageLinkId: storageLinkId, storageId: storageId }
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

        var settings = {};
        settings.MaxBuilderPerRoom = 4;
        settings.UpgraderPerRoom = 2;
        settings.WallBuilderPerRoom = 1;
        settings.MinerPerSource = 1;
        settings.CarrierPerSource = 1;

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
        settings.roomTargets.push({ room: 'E83S33', targetRoom: 'E83S34', claim: false, reserve: true, buildRoads: true, worker: true });
        settings.roomTargets.push({ room: 'E83S33', targetRoom: 'E82S33', claim: false, reserve: true, buildRoads: true, worker: true });
        settings.roomTargets.push({ room: 'E83S33', targetRoom: 'E84S33', claim: false, reserve: true, buildRoads: true, worker: true });

        settings.alliedPlayers = [];
        settings.alliedPlayers.push('Orocket');

        Memory.Settings = settings;
        console.log('Initializing Completed. ');
        return true;
    },

    addRoomInfo: function(room)
    {
        var roomInfo = GetRoomInfo(room);

        Memory.Settings.roomsInfo.push(roomInfo);
        return true;
    }


};

module.exports = settings;
