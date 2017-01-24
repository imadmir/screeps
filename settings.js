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

    var towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER);
        }
    });

    for (var i in towers) {
        settings.towerIds.push(towers[i].id);
    }

    var roomInfo = { name: roomName, sourceIds: sourceIds, spawnNames: spawnNames }
    return roominfo;
}

var settings = {

    init: function () {
        console.log('Initializing Settings ....');
        Memory.ReloadSettings = undefined;

        var settings = {};
        settings.BuilderPerRoom = 4;
        settings.WallBuilderPerRoom = 1;
        settings.MinerPerSource = 1;
        settings.CarrierPerSource = 2;

        settings.towerIds = [];
        settings.rooms = [];
        for (var roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            
            var roomInfo = GetRoomInfo(room);

            settings.rooms.push(roomInfo);
        }

        settings.roomTargets = [];
        settings.roomTargets.push({ room: 'E83S33', targetRoom: 'E83S34', targetType: 'Harvest' });

        Memory.Settings = settings;
        console.log('Initializing Completed. ');
    }



};

module.exports = settings;
