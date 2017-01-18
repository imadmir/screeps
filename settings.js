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
                //if there is hostiles in range, don't include it. 
                var hostiles = sources[count].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (hostiles.length == 0) {
                    settings.SourceIds.push(sources[count].id);
                }
            }
        }

        Memory.Settings = settings;
    }

};

module.exports = settings;