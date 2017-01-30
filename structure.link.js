var roomMonitor = require('room.monitor');

var structureLink = {

    run: function (link) {
        if (link == null) {
            return;
        }

        var linkInfo = _.filter(Memory.Settings.links, (linkInfo) => linkInfo.id == link.id);
        if (linkInfo.length) {
            var storageLinkId = linkInfo[0].storageLinkId;
            if (storageLinkId != undefined && link.id != storageLinkId) {
                if (link.cooldown == 0 && link.energy > link.energyCapacity/2)
                {
                    var storageLink = Game.getObjectById(storageLinkId);
                    link.transferEnergy(storageLink);
                }
            }
        }
    }

};

module.exports = structureLink;
