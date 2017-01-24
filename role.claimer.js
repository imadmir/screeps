var action = require("action");

var roleMiner = {
    partsList: [[MOVE],
                [MOVE],
                [CLAIM, MOVE],
                [CLAIM, CLAIM, MOVE, MOVE]],

    partsCost: [300, 550, 650, 1300],

    role: 'claimer',

    spawnCreep: function (spawn, roomLevel, targetRoom) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, roomName: spawn.room.name, targetRoom: targetRoom });
            console.log(newName + ': ' + spawn.room.name + ' ' + spawn.name + ' ' + this.role + ' ' + targetRoom);
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
        }
        else {
            action.ReserveRoom(creep, true);
        }

    }

};

module.exports = roleMiner;
