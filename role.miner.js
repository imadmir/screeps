var action = require("action");

var roleMiner = {
    partsList: [[WORK, WORK, MOVE, MOVE],
                [WORK, WORK, WORK, WORK, WORK, MOVE],
                [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
                [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE]],

    partsCost: [300, 550, 700, 700],

    role: 'miner',

    spawnCreep: function (spawn, roomLevel, targetRoom, sourceId, buildRoads) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined,
                            { role: this.role, roomName: spawn.room.name, targetRoom: targetRoom, mainSourceId: sourceId, buildRoads: buildRoads });

            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + '[' + roomLevel + '] ' + targetRoom + ' ' + sourceId + ' - ' + newName);
            return true;
        }
        return false;
    },

    run: function (creep) {

        if (creep == null) {
            return;
        }
        if (creep.memory.targetRoom != creep.room.name) {
            //travel to targetRoom
            creep.say(creep.memory.targetRoom);
            var exits = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exits);
            creep.moveTo(exit);
            creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
        }
        else {
            action.MineEnergy(creep);
        }

    }

};

module.exports = roleMiner;
