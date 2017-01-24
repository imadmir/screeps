var action = require('action');
var settings = require('settings');

var roleWorker = {

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

        if (creep.memory.working) {
            if (creep.memory.targetRoom != creep.room.name) {
                //travel to targetRoom
                creep.say(creep.memory.targetRoom);
                var exits = Game.map.findExit(creep.room, creep.memory.targetRoom);
                var exit = creep.pos.findClosestByRange(exits);
                creep.moveTo(exit);
            }
            else if (creep.memory.targetRoom == creep.room.name) {
                var roomInfo = _.filter(Memory.Settings.rooms, (roomInfo) => roomInfo.name == creep.room.name);
                if (!roomInfo.length) {
                    settings.addRoomInfo(creep.room);
                }

                action.BuildStructures(creep);
            } 
            
        }
        else {
            action.GatherEnergy(creep);
        }

    }

};


module.exports = roleWorker;
