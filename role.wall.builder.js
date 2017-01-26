var action = require('action');

var roleWallBuilder = {
    partsList: [[WORK, CARRY, CARRY, MOVE, MOVE],
                       [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                       [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                       [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]],
    partsCost: [300, 550, 800, 1200],

    role: 'wallBuilder',

    spawnCreep: function (spawn, roomLevel, targetRoom) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, status: 'Getting Energy', roomName: spawn.room.name, targetRoom: targetRoom });
            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + '[' + roomLevel + '] ' + targetRoom + ' - ' + newName);
            return true;
        }
        return false;
    },

    run: function (creep) {

        if (creep == null) {
            return;
        }

        //upgrader will only work in the target room
        if (creep.memory.targetRoom != creep.room.name) {
            //travel to targetRoom
            action.TravelToRoom(creep.memory.targetRoom);
            return;
        }

        if (creep.memory.status != 'Getting Energy' && creep.carry.energy == 0) {
            creep.memory.status = 'Getting Energy';
            action.ClearDestination(creep);
        }
        if (creep.memory.status != 'Upgrading Wall' && creep.carry.energy == creep.carryCapacity) {
            creep.memory.status = 'Upgrading Wall';
            action.ClearDestination(creep);
        }

        if (creep.memory.status == 'Upgrading Wall') {
            //Repair walls and ramparts
            action.RepairWallsAndRamparts(creep);

        }
        else {
            action.PickUpStoredEnergy(creep);
        }
    }
};


module.exports = roleWallBuilder;
