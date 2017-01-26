function sortStructures(structure) {
    if (structure.structureType == STRUCTURE_SPAWN)
        return 100;
    if (structure.structureType == STRUCTURE_EXTENSION)
        return 10 + structure.pos.y;
    if (structure.structureType == STRUCTURE_TOWER)
        return 6;
    if (structure.structureType == STRUCTURE_STORAGE)
        return 0;
}

var action = {

    GetDestinationId: function (creep) {
        var destinationId = '';
        //if the creep is moving, keep on moving, no need to find a new source
        if (creep.memory.destinationId != undefined && creep.memory.movingTime != undefined && (Game.time - creep.memory.movingTime) < 20) {
            destinationId = creep.memory.destinationId;
        }

        return destinationId;
    },

    SetDestination: function (creep, destinationId) {
        creep.memory.destinationId = destinationId;
        creep.memory.movingTime = Game.time;
    },

    ClearDestination: function (creep) {
        creep.memory.destinationId = undefined;
        creep.memory.movingTime = undefined;
    },

    TravelToRoom: function (roomName) {
        var roomFlag = Game.flags[creep.memory.targetRoom];
        creep.moveTo(roomFlag.pos);
    },

    //pick up any dropped energy
    PickUpDroppedEnergy: function (creep) {

        var destinationId = this.GetDestinationId(creep);

        if (destinationId == '') {
            var sourceNew = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (sourceNew != null) {
                destinationId = sourceNew.id;
                this.SetDestination(creep, destinationId);
            }
        }

        if (destinationId != '') {
            var source = Game.getObjectById(destinationId);
            if (source !== null && source.amount != undefined) {
                creep.moveTo(source);
                creep.pickup(source, source.amount - 1);
                return true;
            }

            //if there is no source. look for a new one
            this.ClearDestination(creep);

        }

        return false;

    },

    //pick up energy from storage, container 
    PickUpStoredEnergy: function (creep) {

        var destinationId = this.GetDestinationId(creep);

        if (destinationId == '') {
            var sourcestructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_CONTAINER
                            || structure.structureType == STRUCTURE_STORAGE)
                            && structure.store[RESOURCE_ENERGY] > 0);
                }
            });
            if (sourcestructure != null) {
                destinationId = sourcestructure.id;
                this.SetDestination(creep, destinationId);
            }
        }

        if (destinationId != '') {
            var source = Game.getObjectById(destinationId);

            //if the source is a contrainer or storage, transfer energy
            if (source !== null && source.store != undefined && structure.store[RESOURCE_ENERGY] > 0) {
                if (source.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                return true;
            }

            //isource is empty. look for a new one
            this.ClearDestination(creep);

        }

        return false;

    },

    //Get Energy from either dropped, or container
    PickUpMinedEnergy: function (creep) {

        var destinationId = this.GetDestinationId(creep);

        if (destinationId == '') {
            //if the creep has a mainSource id in memory
            if (creep.memory.mainSourceId != undefined) {
                var sourceMain = Game.getObjectById(creep.memory.mainSourceId);
                if (sourceMain != null) {
                    var droppedSources = sourceMain.pos.findInRange(FIND_DROPPED_RESOURCES, 2);
                    if (droppedSources.length > 0) {
                        destinationId = droppedSources[0].id;
                        this.SetDestination(creep, destinationId);
                    }
                    else {
                        var containers = sourceMain.pos.findInRange(FIND_STRUCTURES, 2, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_CONTAINER &&
                                        structure.store[RESOURCE_ENERGY] > 0);
                            }
                        });
                        if (containers.length > 0) {
                            destinationId = containers[0].id;
                            this.SetDestination(creep, destinationId);
                        }
                    }

                }
            }
        }

        if (destinationId != '') {
            var source = Game.getObjectById(destinationId);
            if (source !== null && source.amount != undefined && source.amount > 0) {
                creep.moveTo(source);
                creep.pickup(source, source.amount - 1);
                return true;
            }
            //if the source is a contrainer, transfer energy
            if (source !== null && source.store != undefined && source.store[RESOURCE_ENERGY] > 0) {
                if (source.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                return true;
            }

            //if there is no source. look for a new one
            this.ClearDestination(creep);

        }

        return false;

    },

    //transfer energy to the spawn/extension/tower/storage, else give it to a builder
    FeedSpawn: function (creep) {

        var destinationId = this.GetDestinationId(creep);

        if (destinationId == '') {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)
                        && structure.energy < structure.energyCapacity
                       && _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.movingTo == structure.id).length == 0;
                }
            });

            if (target != null) {
                destinationId = target.id;
                this.SetDestination(creep, destinationId);
            }
        }

        if (destinationId != '') {
            var target = Game.getObjectById(destinationId);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                this.ClearDestination(creep);
            }
            return true;
        }
        return false;
    },

    FeedTower: function (creep) {

        var destinationId = this.GetDestinationId(creep);

        if (destinationId == '') {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.9)
                        && _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.memory.movingTo == structure.id).length == 0;
                }
            });

            if (target != null) {
                destinationId = target.id;
                this.SetDestination(creep, destinationId);
            }
        }

        if (destinationId != '') {
            var target = Game.getObjectById(destinationId);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                this.ClearDestination(creep);
            }
            return true;
        }
        return false;
    },

    FeedCreeps: function (creep) {

        var destinationId = this.GetDestinationId(creep);

        if (destinationId == '') {
            var needEnergy = _.filter(Game.creeps, (creep) => (creep.memory.requireEnergy) && creep.carry.energy < (creep.carryCapacity / 2));
            if (needEnergy.length > 0) {
                destinationId = needEnergy[0].id;
                this.SetDestination(creep, destinationId);
            }
        }

        if (destinationId != '') {
            var target = Game.getObjectById(destinationId);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                this.ClearDestination(creep);
            }
            return true;
        }
        return false;
    },

    StoreEnergy: function (creep) {

        var destinationId = this.GetDestinationId(creep);

        if (destinationId == '') {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                }
            });

            if (target != null) {
                destinationId = target.id;
                this.SetDestination(creep, destinationId);
            }
        }

        if (destinationId != '') {
            var target = Game.getObjectById(destinationId);
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                this.ClearDestination(creep);
            }
            return true;
        }
        return false;
    },

    MineEnergy: function (creep) {
        //if the creep is moving, keep on moving, he already has a target for his transfer
        var destinationId = this.GetDestinationId(creep);

        if (destinationId == '') {
            if (creep.memory.mainSourceId != undefined) {
                destinationId = creep.memory.mainSourceId;
                this.SetDestination(creep, destinationId);
            }
            else {
                var sourceNew = creep.pos.findClosestByRange(FIND_SOURCES);
                if (sourceNew != null) {
                    destinationId = sourceNew.id;
                    this.SetDestination(creep, destinationId);
                }
            }
        }
        if (destinationId != '') {
            var source = Game.getObjectById(destinationId);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                if (creep.memory.buildRoads) {
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                }
            }
        }
    },

    BuildStructures: function (creep) {
        //Build construction sites
        var destinationId = this.GetDestinationId(creep);

        if (destinationId == '') {

            var target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            if (target != null) {
                destinationId = target.id;
                this.SetDestination(creep, destinationId);
            }
        }

        if (destinationId != '') {
            var target = Game.getObjectById(destinationId);
            var buildResult = creep.build(target);
            if (buildResult != OK) {
                if (buildResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else {
                    this.ClearDestination(creep);
                }
            }
            return true;
        }
        //if no target found, return false;
        return false;
    },

    RepairRoadsAndContainers: function (creep) {

        var destinationId = this.GetDestinationId(creep);

        if (destinationId == '') {
            //Make sure to send only 1 builder.
            var targets = creep.room.find(FIND_STRUCTURES,
                                        {
                                            filter: (s) => s.hits < s.hitsMax / 2 && (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_ROAD)
                                                && !(_.filter(Game.creeps, (creep) => (creep.memory.role == 'builder' || creep.memory.role == 'worker') && creep.memory.movingTo == s.id).length > 0)
                                        });
            if (targets.length) {
                destinationId = targets[0].id;
                this.SetDestination(creep, destinationId);
            }
        }

        if (destinationId != '') {
            var target = Game.getObjectById(targetId);
            var repairResult = creep.repair(target);
            if (repairResult != OK) {
                if (repairResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else {
                    //clear move to, building has been finished
                    this.ClearDestination(creep);
                }
            }
            return true;
        }
        //if no target found, return false;
        return false;
    },

    RepairWallsAndRamparts: function (creep) {
        var destinationId = this.GetDestinationId(creep);

        if (destinationId == '') {
            var targets = creep.room.find(FIND_STRUCTURES,
                { filter: (s) => s.hits < s.hitsMax && (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) });
            targets.sort(function (a, b) { return (a.hits - b.hits) });

            if (targets.length) {
                destinationId = targets[0].id;
                this.SetDestination(creep, destinationId);
            }
        }

        if (destinationId != '') {
            var target = Game.getObjectById(targetId);
            if (target != null) {
                var repairResult = creep.repair(target);
                if (repairResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }

            if (target == null || target.hits == target.hitsMax ) {
                //clear move to, building has been finished 
                this.ClearDestination(creep);
            }
            return true;
        }

        return false;
    },

    ReserveRoom(creep) {
        if (creep.room.controller) {
            if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);

                if (creep.memory.buildRoads) {
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                }
            }
        }

    }

};

module.exports = action;
