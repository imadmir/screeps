var settings = {

    init: function () {
        console.log('Initializing Settings ....');

        var settings = {};
        settings.BuilderPerRoom = 4;
        settings.MinerPerSource = 1;
        settings.CarrierPerSource = 2;

        settings.SourceIds = [];
        settings.rooms = [];
        for (var roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            var sources = room.find(FIND_SOURCES);
            for (var count in sources) {
                settings.SourceIds.push(sources[count].id);
            }
            var roomInfo = { name: roomName, sources: settings.SourceIds }
            settings.rooms.push(roomInfo);
        }

        Memory.Settings = settings;
    }

};

module.exports = settings;
