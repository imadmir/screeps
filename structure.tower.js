var structureTower = {

    run: function (tower) {
        if (tower == null) {
            return;
        }
        var targets = tower.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length) {
            tower.attack(targets[0]);
        }
        else if (tower.energy > tower.energyCapacity / 2) {
            //repair damaged units
            for (var name in Game.creeps) {
                var creep = Game.creeps[name];
                if (creep.hits < creep.hitsMax) {
                    tower.heal(creep);
                }
            }

            //repair damaged building
            var damagedBuildings = tower.room.find(FIND_STRUCTURES,
                { filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART });
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
