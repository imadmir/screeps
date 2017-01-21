var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleGuard = require('role.guard');
var settings = require('settings');
var factory = require('factory');

module.exports.loop = function () {

    if (Memory.Settings == undefined) {
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
    }
}
