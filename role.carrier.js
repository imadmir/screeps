var action = require('action');

var roleCarrier = {
    partsList: [[CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]],

    partsCost: [300, 550, 750, 1050],

    role: 'carrier',

    spawnCreep: function (spawn, roomLevel, targetRoom, dropOffRoom, sourceId) {
        if (spawn.room.energyAvailable >= this.partsCost[roomLevel] && spawn.spawning == null) {
            var newName = spawn.createCreep(this.partsList[roomLevel], undefined, { role: this.role, status: 'Getting Energy', roomName: spawn.room.name, targetRoom: targetRoom, dropOffRoom: dropOffRoom, mainSourceId: sourceId });
            console.log(spawn.room.name + ' ' + spawn.name + ' ' + this.role + '[' + roomLevel + '] ' + targetRoom + ' ' + sourceId + ' - ' + newName);
            return true;
        }
        return false;
    },

    run: function (creep) {

        if (creep == null) {
            return;
        }

        //Get the energy from the target Room
        if (creep.memory.status != 'Getting Energy' && creep.carry.energy == 0) {
            creep.memory.status = 'Getting Energy';
            action.ClearDestination(creep);
        }
        if (creep.memory.status != 'Delivering' && creep.carry.energy == creep.carryCapacity) {
            creep.memory.status = 'Delivering';
            action.ClearDestination(creep);
        }

        if (creep.memory.status == 'Delivering') {
            //The carrier will deliver to the dropOffRoom
            if (creep.memory.dropOffRoom != creep.room.name) {
                action.TravelToRoom(creep, creep.memory.dropOffRoom);
                return;
            }

            var actionResult = false;
            actionResult = action.DeliverEnergy(creep);
            if (!actionResult) {
                actionResult = action.FeedTower(creep);
            } if (!actionResult) {
                actionResult = action.FeedCreeps(creep);
            }
        }
        else {
            //The carrier will gather energy from the target room
            if (creep.memory.targetRoom != creep.room.name) {
                //travel to targetRoom
                action.TravelToRoom(creep, creep.memory.targetRoom);
                return;
            }
            //if a main source is assigned, get the energy from the miners
            if (creep.memory.mainSourceId != undefined) {
                action.PickUpMinedEnergy(creep);
            }
            else {
                //else get the energy from storage
                action.PickUpStoredEnergy(creep);
            }
        }

    }

};


module.exports = roleCarrier;
