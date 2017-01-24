var action = require('action');

var roleCarrier = {
    partsList: [[CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]],

    partsCost: [300, 550, 800, 800],

    role: 'carrier',

    spawnCreep: function (spawn, roomLevel, targetRoom, sourceId) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, working: false, roomName: spawn.room.name, targetRoom: targetRoom, mainSourceId: sourceId });
            console.log(newName + ': ' + spawn.room.name + ' ' + spawn.name + ' ' + this.role + ' ' + targetRoom + '' + sourceId);
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

        if (creep.memory.working) {
            action.GiveEnergy(creep);
        }
        else {
            action.GatherEnergy(creep);
        }

    }

};


module.exports = roleCarrier;
