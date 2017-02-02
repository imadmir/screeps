var roomMonitor = require('room.monitor');

var structureTower = {

    run: function (tower) {
        if (tower == null) {
            return;
        }
        var targets = roomMonitor.GetHostilesInRoom(tower.room); 
        if (targets.length) {
            tower.attack(targets[0]);
        }
        else if (tower.energy > tower.energyCapacity * 0.7) {
            //repair damaged units
            var creeps = roomMonitor.GetInjuredInRoom(tower.room);
            if (creeps.length) {
                tower.heal(creeps[0]);
                return;
            }

            //repair damaged building
            var damagedBuildings = tower.room.find(FIND_STRUCTURES,
                { filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART });
            damagedBuildings.sort(function (a, b) { return (a.hits - b.hits) });

            if (damagedBuildings.length) {
                tower.repair(damagedBuildings[0])
            }
                //if no building is damaged, fix ramparts
            else {
                var damagedRamparts = tower.room.find(FIND_STRUCTURES,
                { filter: (s) => s.hits < s.hitsMax && s.structureType == STRUCTURE_RAMPART });
                damagedRamparts.sort(function (a, b) { return (a.hits - b.hits) });
                if (damagedRamparts.length) {
                    tower.repair(damagedRamparts[0])
                }
            }
        }
    }

};

module.exports = structureTower;
