var roomMonitor = {

    GetRoomInfo: function (roomName) {
        var roomInfo = _.filter(Memory.Settings.rooms, (roomInfo) => roomInfo.name == roomName);

        return roomInfo;
    },

    GetHostilesInRoom: function (room) {
        var targets = room.find(FIND_HOSTILE_CREEPS);

        return Targets;
    },

    GetCreepCountByRole: function(roomName, role)
    {
        var totals = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.targetRoom == roomName);
        return totals.length;
    },

    GetMinerCountBySource: function (sourceId) {
        var totals = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.mainSourceId == sourceId);
        return totals.length;
    },

    GetCarrierCountBySource: function (sourceId) {
        var totals = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.mainSourceId == sourceId);
        return totals.length;
    },

    GetTargetedRooms: function (roomName) {
        var targetedRooms = _.filter(Memory.Settings.roomTargets, (t) => t.room == roomName);
        return targetedRooms;
    },

    GetClaimersCount: function (roomName) {
        var totals = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer'
                                                    && creep.memory.targetRoom == roomName
                                                    && creep.ticksToLive > 100);
        return totals.length;
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
