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
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, roomName: spawn.room.name, targetRoom: targetRoom });
            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + '[' + roomLevel + '] ' + ' ' + targetRoom + ' - ' + newName);
            return true;
        }
        return false;
    },

    run: function (creep) {

        if (creep == null) {
            return;
        }

        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.movingTo = undefined;
            creep.memory.movingTime = undefined;
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.movingTo = undefined;
            creep.memory.movingTime = undefined;
        }
        if (creep.memory.targetRoom != creep.room.name) {
            //travel to targetRoom
            creep.say(creep.memory.targetRoom);
            var exits = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exits);
            creep.moveTo(exit);
            return;
        }

        if (creep.memory.targetRoom == creep.room.name) {
            var roomInfo = roomMonitor.GetRoomInfo(creep.room.name);
            if (!roomInfo.length) {
                settings.addRoomInfo(creep.room);
            }
        }

        if (creep.memory.working) {
            var actionResult = action.BuildStructures(creep);
            if (!actionResult) {
                action.RepairRoadsAndContainers(creep);
            }
        }
        else {
            var actionResult = action.GatherEnergy(creep);
            if (!actionResult) {
                action.MineEnergy(creep);
            }
        }

    }

};


module.exports = roleWorker;
