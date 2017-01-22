var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleGuard = require('role.guard');
var roleWallBuilder = require('role.wall.builder');
var settings = require('settings');
var factory = require('factory');
var structureTower = require('structure.tower');

module.exports.loop = function () {

    if (Memory.Settings == undefined || Memory.ReloadSettings != undefined) {
        settings.init();
    }

    factory.spawn();  
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if (creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        if (creep.memory.role == 'guard') {
            roleGuard.run(creep);
        }
        if (creep.memory.role == 'guard') {
            roleWallBuilder.run(creep);
        }
    }

    for (var i in Memory.Settings.towerIds) {
        var towerId = Memory.Settings.towerIds[i];
        var tower = Game.getObjectById(towerId);
        structureTower.run(tower);
    }
}
