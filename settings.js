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

    
    var roomInfo = { name: room.name, sourceIds: sourceIds, spawnNames: spawnNames }
    return roomInfo;
}

var settings = {

    init: function () {
        console.log('Initializing Settings ....');

        var settings = {};
        settings.BuilderPerRoom = 4;
        settings.WallBuilderPerRoom = 1;
        settings.MinerPerSource = 1;
        settings.CarrierPerSource = 2;

        settings.towerIds = [];
        settings.rooms = [];
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

            settings.rooms.push(roomInfo);
        }

        settings.roomTargets = [];
        settings.roomTargets.push({ room: 'E83S33', targetRoom: 'E83S34', targetType: 'Reserve' });
        settings.roomTargets.push({ room: 'E83S33', targetRoom: 'E82S33', targetType: 'Harvest' });

        settings.alliedPlayers = [];
        settings.alliedPlayers.push('Orocket');

        Memory.Settings = settings;
        console.log('Initializing Completed. ');
    },

    addRoomInfo: function(room)
    {
        var roomInfo = GetRoomInfo(room);

        Memory.Settings.rooms.push(roomInfo);
    }


};

module.exports = settings;
