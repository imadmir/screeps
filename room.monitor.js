var roomMonitor = {

    GetRoomInfo: function (roomName) {
        var roomInfo = _.filter(Memory.Settings.roomsInfo, (roomInfo) => roomInfo.name == roomName);

        return roomInfo;
    },

    GetHostilesInRoom: function (room) {
        var targets = room.find(FIND_HOSTILE_CREEPS,
                                {
                                    filter: (creep) =>
                                        _.contains(Memory.Settings.alliedPlayers, creep.owner.username) == false
                                });
        return targets;
    },

    GetConstructionSitesCount: function (room) {
        var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
        return constructionSites.length;
    },

    GetCreepCountByRole: function(roomName, role, ticksToLive)
    {
        if (ticksToLive == undefined) {
            ticksToLive = 0;
        }
        var totals = _.filter(Game.creeps, (creep) => creep.memory.role == role
                                                    && creep.memory.targetRoom == roomName
                                                    && creep.ticksToLive > ticksToLive);

        return totals.length;
    },

    GetCountBySource: function (sourceId, role, ticksToLive) {
        if (ticksToLive == undefined) {
            ticksToLive = 0;
        }
        var totals = _.filter(Game.creeps, (creep) => creep.memory.role == role
                                                    && creep.memory.mainSourceId == sourceId
                                                    && creep.ticksToLive > ticksToLive);
        return totals.length;
    },


    GetTargetedRooms: function (roomName) {
        var targetedRooms = _.filter(Memory.Settings.roomTargets, (t) => t.room == roomName);
        return targetedRooms;
    },


    GetRoomLevel: function(room)
    {
        var roomLevel = 0;
        var totalMiners = this.GetCreepCountByRole(room.name, 'miner');
        var totalCarriers = this.GetCreepCountByRole(room.name, 'carrier');
        if (totalMiners >= Memory.Settings.MinerPerSource && totalCarriers >= Memory.Settings.CarrierPerSource) {
            if (room.energyCapacityAvailable >= 1300) {
                roomLevel = 3;
            }
            else if (room.energyCapacityAvailable >= 800) {
                roomLevel = 2;
            }
            else if (room.energyCapacityAvailable >= 550) {
                roomLevel = 1;
            }
        }
        return roomLevel;
    }

};

module.exports = roomMonitor;
