var settings = {

    init: function () {
        console.log('Initializing Settings ....');

        var settings = {};
        settings.BuilderPerRoom = 4;
        settings.MinerPerSource = 1;
        settings.CarrierPerSource = 2;

        settings.SourceIds = [];
        for (var roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            var sources = room.find(FIND_SOURCES);
            for (var count in sources) {
                settings.SourceIds.push(sources[count].id);
            }
        }

        Memory.Settings = settings;
    }

};

module.exports = settings;
