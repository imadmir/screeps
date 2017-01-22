var roleMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {

        var sourceId = '';
        if (creep.memory.movingTo != undefined) {
            sourceId = creep.memory.movingTo;
        }
        else {
            sourceId = creep.memory.sourceId;
            var sourceMain = Game.getObjectById(sourceId);
            //if there is hostiles in range, don't go there. 
            var hostiles = sourceMain.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            if (hostiles.length == 0) {
                creep.memory.movingTo = sourceId;
            } else {
                creep.say('Enemy');
                var sourceNew = creep.pos.findClosestByRange(FIND_SOURCES);
                if (sourceNew != null) {
                    sourceId = sourceNew.id;
                    creep.memory.movingTo = sourceId;
                }
            }
        }
        var source = Game.getObjectById(sourceId);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            if (creep.room.controller.level > 1) {
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
            }
        }
    }

};

module.exports = roleMiner;
