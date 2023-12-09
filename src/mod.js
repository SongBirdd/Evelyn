"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
// New trader settings
const baseJson = __importStar(require("../db/base.json"));
const assortJson = __importStar(require("../db/assort.json"));
class SampleTrader {
    mod;
    logger;
    configServer;
    ragfairConfig;
    constructor() {
        this.mod = "Evelyn";
    }
    preAkiLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const imageRouter = container.resolve("ImageRouter");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        this.registerProfileImage(preAkiModLoader, imageRouter);
        Traders_1.Traders[baseJson._id] = baseJson._id;
        this.setupTraderUpdateTime(traderConfig);
        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }
    postAkiLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const configServer = container.resolve("ConfigServer");
    }
    postDBLoad(container) {
        this.logger.debug(`[${this.mod}] postDb Loading... `);
        this.configServer = container.resolve("ConfigServer");
        this.ragfairConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const databaseServer = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const jsonUtil = container.resolve("JsonUtil");
        const tables = databaseServer.getTables();
        this.addTraderToDb(baseJson, tables, jsonUtil);
        this.addTraderToLocales(tables, baseJson.name, "Evelyn", baseJson.nickname, baseJson.location, "A trained American soldier who leads a small USEC group and seeks to join the High Command at the Military Base.");
        this.ragfairConfig.traders[baseJson._id] = true;
        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
    registerProfileImage(preAkiModLoader, imageRouter) {
        const imageFilepath = `./${preAkiModLoader.getModPath(this.mod)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/Evelyn.jpg`);
    }
    setupTraderUpdateTime(traderConfig) {
        const traderRefreshRecord = { traderId: baseJson._id, seconds: 3600 };
        traderConfig.updateTime.push(traderRefreshRecord);
    }
    addTraderToDb(Evelyn, tables, jsonUtil) {
        tables.traders[Evelyn._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)),
            base: jsonUtil.deserialize(jsonUtil.serialize(Evelyn)),
            questassort: {
                started: {},
                success: {
                    "6577bf95c9b1f9d904dadade": "TheLittleCrew",
                    "47f669ab803c025d0e9bpupu": "TheLittleCrew",
                    "96ocuidcon2q62tndagyat69": "TheWestPart1",
                    "9a697338df84xaxa6c219f5c": "TheWestPart1",
                    "eaza16427540f0a28d0acb90": "TheWestPart1",
                    "wazp53d5f67c52f55ca0cd84": "BattleReady",
                    "a75dd0e9f3119a3696b8deck": "BattleReady",
                    "yat6942c099f83522bcf1aa2": "BattleReady",
                    "3dba6127e876d75e5798bvbv": "TheWestPart2",
                    "flo5369a11ad8dc828348f41": "Cleanout",
                    "13dead58646c7dbe20096acq": "Cleanout",
                    "53ab150266d9a475038blose": "WelcomeGift",
                    "hgo72351f2a2aefebc5ed960": "WelcomeGift",
                    "13dead58646c7dbe2009662a": "TheWestPart3",
                    "13dead58646c7dbe2009662s": "TheWestPart3"
                },
                fail: {}
            }
        };
    }
    /**
     * Add traders name/location/description to the locale table
     * @param tables database tables
     * @param fullName fullname of trader
     * @param firstName first name of trader
     * @param nickName nickname of trader
     * @param location location of trader
     * @param description description of trader
     */
    addTraderToLocales(tables, fullName, firstName, nickName, location, description) {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global);
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }
    addItemToLocales(tables, itemTpl, name, shortName, Description) {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global);
        for (const locale of locales) {
            locale[`${itemTpl} Name`] = name;
            locale[`${itemTpl} ShortName`] = shortName;
            locale[`${itemTpl} Description`] = Description;
        }
    }
}
module.exports = { mod: new SampleTrader() };
//# sourceMappingURL=mod.js.map