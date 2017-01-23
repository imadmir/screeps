var action = require("action);
                     
var roleMiner = {

    run: function (creep) {

        if (creep == null) {
            return;
        }

        action.MineEnergy(creep, true);
    }

};

module.exports = roleMiner;
