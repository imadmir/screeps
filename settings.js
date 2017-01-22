var settings = {

    init: function () {
        console.log('Initializing Settings ....');
        Memory.ReloadSettings = undefined;

        var settings = {};
        settings.BuilderPerRoom = 4;
        settings.MinerPerSource = 1;
        settings.CarrierPerSource = 2;

        settings.rooms = [];
        for (var roomName in Game.rooms) {
            var room = Game.rooms[roomName];

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

            var roomInfo = { name: roomName, sourceIds: sourceIds, spawnNames: spawnNames }
            settings.rooms.push(roomInfo);
        }

        Memory.Settings = settings;
    }

};

module.exports = settings;
