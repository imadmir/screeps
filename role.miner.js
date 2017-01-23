var roleMiner = {

    run: function (creep) {

        if (creep == null) {
            return;
        }

        var sourceId = '';
        if (creep.memory.movingTo != undefined && creep.memory.movingTime != undefined && (Game.time - creep.memory.movingTime) < 10) {
            sourceId = creep.memory.movingTo;
        }
        else {

            sourceId = creep.memory.mainSourceId;
            var sourceMain = Game.getObjectById(sourceId);
            //if there is hostiles in range, don't go there. 
            var hostiles = sourceMain.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            if (hostiles.length == 0) {
                creep.memory.movingTo = sourceId;
                creep.memory.movingTime = Game.time;
            } else {
                creep.say('Enemy');
                var sourceNew = creep.pos.findClosestByRange(FIND_SOURCES);
                if (sourceNew != null) {
                    sourceId = sourceNew.id;
                    creep.memory.movingTo = sourceId;
                    creep.memory.movingTime = Game.time;
                }
            }
        }
        var source = Game.getObjectById(sourceId);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
        }
    }

};

module.exports = roleMiner;
