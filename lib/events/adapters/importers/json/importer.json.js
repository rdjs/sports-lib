"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_1 = require("../../../event");
var activity_1 = require("../../../../activities/activity");
var lap_1 = require("../../../../laps/lap");
var creator_1 = require("../../../../creators/creator");
var intensity_zones_1 = require("../../../../intensity-zones/intensity-zones");
var data_store_1 = require("../../../../data/data.store");
var lap_types_1 = require("../../../../laps/lap.types");
var activity_types_1 = require("../../../../activities/activity.types");
var stream_1 = require("../../../../streams/stream");
var data_ibi_1 = require("../../../../data/data.ibi");
var ibi_stream_1 = require("../../../../streams/ibi-stream");
var EventImporterJSON = /** @class */ (function () {
    function EventImporterJSON() {
    }
    EventImporterJSON.getEventFromJSON = function (json) {
        // debugger;
        var event = new event_1.Event(json.name, new Date(json.startDate), new Date(json.endDate), json.privacy);
        Object.keys(json.stats).forEach(function (statName) {
            event.addStat(data_store_1.DynamicDataLoader.getDataInstanceFromDataType(statName, json.stats[statName]));
        });
        return event;
    };
    EventImporterJSON.getCreatorFromJSON = function (json) {
        var creator = new creator_1.Creator(json.name);
        if (json.hwInfo) {
            creator.hwInfo = json.hwInfo;
        }
        if (json.swInfo) {
            creator.swInfo = json.swInfo;
        }
        if (json.serialNumber) {
            creator.serialNumber = json.serialNumber;
        }
        return creator;
    };
    EventImporterJSON.getLapFromJSON = function (json) {
        var lap = new lap_1.Lap(new Date(json.startDate), new Date(json.endDate), lap_types_1.LapTypes[json.type]);
        Object.keys(json.stats).forEach(function (statName) {
            lap.addStat(data_store_1.DynamicDataLoader.getDataInstanceFromDataType(statName, json.stats[statName]));
        });
        return lap;
    };
    EventImporterJSON.getStreamFromJSON = function (json) {
        if (json.type === data_ibi_1.DataIBI.type) {
            return new ibi_stream_1.IBIStream(json.data);
        }
        return new stream_1.Stream(json.type, json.data);
    };
    EventImporterJSON.getIntensityZonesFromJSON = function (json) {
        var zones = new intensity_zones_1.IntensityZones(json.type);
        zones.zone1Duration = json.zone1Duration;
        zones.zone2Duration = json.zone2Duration;
        zones.zone2LowerLimit = json.zone2LowerLimit;
        zones.zone3Duration = json.zone3Duration;
        zones.zone3LowerLimit = json.zone3LowerLimit;
        zones.zone4Duration = json.zone4Duration;
        zones.zone4LowerLimit = json.zone4LowerLimit;
        zones.zone5Duration = json.zone5Duration;
        zones.zone5LowerLimit = json.zone5LowerLimit;
        return zones;
    };
    EventImporterJSON.getActivityFromJSON = function (json) {
        var activity = new activity_1.Activity(new Date(json.startDate), new Date(json.endDate), activity_types_1.ActivityTypes[json.type], EventImporterJSON.getCreatorFromJSON(json.creator));
        Object.keys(json.stats).forEach(function (statName) {
            activity.addStat(data_store_1.DynamicDataLoader.getDataInstanceFromDataType(statName, json.stats[statName]));
        });
        json.laps.forEach(function (lapJSON) {
            activity.addLap(EventImporterJSON.getLapFromJSON(lapJSON));
        });
        json.intensityZones.forEach(function (intensityZonesJSON) {
            activity.intensityZones.push(EventImporterJSON.getIntensityZonesFromJSON(intensityZonesJSON));
        });
        return activity;
    };
    return EventImporterJSON;
}());
exports.EventImporterJSON = EventImporterJSON;