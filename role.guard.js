var roleGuard = {

    run: function (creep) {

        if (creep == null) {
            return;
        }

        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length) {
            creep.moveTo(targets[0]);
            creep.attack(targets[0]);
        }

    }

};

module.exports = roleGuard;
