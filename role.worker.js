var action = require('action');
var settings = require('settings');
var roomMonitor = require('room.monitor');

var roleWorker = {
    partsList: [[WORK, CARRY, CARRY, MOVE, MOVE],
                [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]],

    partsCost: [300, 550, 800, 800],

    role: 'worker',

    spawnCreep: function (spawn, roomLevel, targetRoom) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, roomName: spawn.room.name, targetRoom: targetRoom, status: 'Getting Energy' });
            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + '[' + roomLevel + '] ' + targetRoom + ' - ' + newName);
            return true;
        }
        return false;
    },

    run: function (creep) {

        if (creep == null) {
            return;
        }

        //workers will only work in the target room
        if (creep.memory.targetRoom != creep.room.name) {
            //travel to targetRoom
            action.TravelToRoom(creep, creep.memory.targetRoom);
            return;
        }

        if (creep.memory.status != 'Getting Energy' && creep.carry.energy == 0) {
            creep.memory.status = 'Getting Energy';
            action.ClearDestination(creep);
        }
        if (creep.memory.status != 'Working' && creep.carry.energy == creep.carryCapacity) {
            creep.memory.status = 'Working';
            action.ClearDestination(creep);
        }

        if (creep.memory.targetRoom == creep.room.name) {
            var roomInfo = roomMonitor.GetRoomInfo(creep.room.name);
            if (!roomInfo.length) {
                settings.addRoomInfo(creep.room);
            }
        }

        if (creep.memory.status == 'Working') {
            var actionResult = action.BuildStructures(creep);
            if (!actionResult) {
                action.RepairRoadsAndContainers(creep);
            }
        }
        else {
            var actionResult = false;
            actionResult = action.PickUpDroppedEnergy(creep);
            if (!actionResult) {
                actionResult = action.PickUpStoredEnergy(creep);
            }
            if (!actionResult) {
                actionResult = action.MineEnergy(creep);
            }
        }

    }

};


module.exports = roleWorker;
