var settings = {

    init: function () {
        console.log('Initializing Settings ....');
        Memory.ReloadSettings = undefined;

        var settings = {};
        settings.BuilderPerRoom = 4;
        settings.MinerPerSource = 1;
        settings.CarrierPerSource = 2;

        settings.towerIds = [];
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

            var towers = room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER);
                }
            });

            for (var i in towers) {
                settings.towerIds.push(towers[i].id);
            }

            var roomInfo = { name: roomName, sourceIds: sourceIds, spawnNames: spawnNames, targets: [] }

            settings.rooms.push(roomInfo);
        }

        var roomE83S33 = _.filter(settings.rooms, (room) => room.name == 'E83S33');
        if (roomE83S33.length) {
            roomE83S33[0].targets.push('E83S34');
        }

        Memory.Settings = settings;
        console.log('Initializing Completed. ');
    }

};

module.exports = settings;
