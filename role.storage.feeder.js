var action = require('action');

var roleStorageFeeder = {
    partsList: [[CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]],

    partsCost: [300],

    role: 'storageFeeder',

    spawnCreep: function (spawn, roomLevel, targetRoom, sourceId) {
        roomLevel = 0;
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, status: 'Storage Feeder', roomName: spawn.room.name, targetRoom: targetRoom, dropOffRoom: spawn.room.name, mainSourceId: sourceId });
            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + '[' + roomLevel + '] ' + targetRoom + ' ' + sourceId + ' - ' + newName);
            return true;
        }
        return false;
    },

    run: function (creep) {

        if (creep == null) {
            return;
        }

        var roomsInfo = roomMonitor.GetRoomInfo(creep.room.name);
        if (roomsInfo.length) {
            if (roomsInfo[0].storageLinkId != undefined && roomsInfo[0].storageId != undefined) {
                var storageLink = Game.getObjectById(roomsInfo[0].storageLinkId);
                var storage = Game.getObjectById(roomsInfo[0].storageId);

                if (storageLink.energy > 0) {
                    if (creep.withdraw(storageLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storageLink);
                    }
                }
                if (creep.carry.energy > 0) {
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                }
            }

        }

    }

};


module.exports = roleStorageFeeder;
