var action = require('action');

var roleWallBuilder = {
    partsList: [[WORK, CARRY, CARRY, MOVE, MOVE],
                       [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                       [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                       [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]],
    partsCost: [300, 550, 800, 800],

    role: 'wallBuilder',

    spawnCreep: function (spawn, roomLevel, targetRoom) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, working: false, roomName: spawn.room.name, targetRoom: targetRoom });
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

        if (creep.memory.working) {
            //Repair walls and ramparts
            var targetId = '';
            if (creep.memory.movingTo != undefined && creep.memory.movingTime != undefined && (Game.time - creep.memory.movingTime) < 20) {
                targetId = creep.memory.movingTo;
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES,
                    { filter: (s) => s.hits < s.hitsMax && (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) });
                targets.sort(function (a, b) { return (a.hits - b.hits) });

                if (targets.length) {
                    targetId = targets[0].id;
                    creep.memory.movingTo = targetId;
                    creep.memory.movingTime = Game.time;
                    if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            }

            if (targetId != '') {
                var target = Game.getObjectById(targetId);
                if (target != null) {
                    var repairResult = creep.repair(target);
                    if (repairResult == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }

                if (target == null || target.hits == target.hitsMax || creep.carry.energy == 0) {
                    //clear move to, building has been finished
                    creep.memory.movingTo = undefined;
                    creep.memory.movingTime = undefined;
                }
            }

        }
        else {
            action.PickUpEnergy(creep);
        }
    }
};


module.exports = roleWallBuilder;
