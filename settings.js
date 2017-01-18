var settings = {

    init: function () {
        console.log('Initializing Settings ....');

        var settings = {};
        settings.MinHarvesterNumber = 2;
        settings.MinUpgraderNumber = 4;
        settings.MinBuilderNumber = 1;

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