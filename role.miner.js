var action = require("action");

var roleMiner = {

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
            action.MineEnergy(creep, true);
        }

    }

};

module.exports = roleMiner;
