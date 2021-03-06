var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleWorker = require('role.worker');
var roleGuard = require('role.guard');
var roleWallBuilder = require('role.wall.builder');
var roleClaimer = require('role.claimer');
var roleUpgrader = require('role.upgrader');
var roleStorageFeeder = require('role.storage.feeder');
var roleMineralCarrier = require('role.mineral.carrier');
var roleMineralMiner = require('role.mineral.miner');
var roleDistributor = require('role.distributor');
var settings = require('settings');
var factory = require('factory');
var structureTower = require('structure.tower');
var structureLink = require('structure.link');


var cpuStats = {};

module.exports.loop = function () {
    
    if (Memory.Settings == undefined || Memory.Settings.time == undefined || Memory.Settings.time < Game.time - 1000) {
        settings.init();
    }
    cpuStats.start = Game.cpu.getUsed();

    factory.spawn();
    var cpuAfterFactory = Game.cpu.getUsed();
    cpuStats.totalFactory = Game.cpu.getUsed() - cpuStats.start;
    cpuStats.creeps = [];
    for (var name in Game.creeps) {
        var cpuCreepStart = Game.cpu.getUsed();
        var creep = Game.creeps[name];
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if (creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        if (creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }
        if (creep.memory.role == 'guard') {
            roleGuard.run(creep);
        }
        if (creep.memory.role == 'wallBuilder') {
            roleWallBuilder.run(creep);
        }
        if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'storageFeeder') {
            roleStorageFeeder.run(creep);
        }
        if (creep.memory.role == 'distributor') {
            roleDistributor.run(creep);
        }
        if (creep.memory.role == 'mineralCarrier') {
            roleMineralCarrier.run(creep);
        }
        if (creep.memory.role == 'mineralMiner') {
            roleMineralMiner.run(creep);
        }
        cpuStats.creeps.push(creep.memory.role + ' ' + name + ' ' + (Game.cpu.getUsed() - cpuCreepStart))
    }

    var cpuAftercreeps = Game.cpu.getUsed();
    cpuStats.TotalScreeps = Game.cpu.getUsed() - cpuAfterFactory;

    for (var i in Memory.Settings.towerIds) {
        var towerId = Memory.Settings.towerIds[i];
        var tower = Game.getObjectById(towerId);
        structureTower.run(tower);
    }
    for (var i in Memory.Settings.links) {
        var linkInfo = Memory.Settings.links[i];
        var link = Game.getObjectById(linkInfo.id);
        structureLink.run(link);
    }

    cpuStats.totalStructure = Game.cpu.getUsed() - cpuAftercreeps;

    cpuStats.end = Game.cpu.getUsed();

    //console.log(JSON.stringify(cpuStats))
}
