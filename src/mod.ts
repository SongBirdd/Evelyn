import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderAssort, ITraderBase } from "@spt-aki/models/eft/common/tables/ITrader";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { Item } from "@spt-aki/models/eft/common/tables/IItem";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { Money } from "@spt-aki/models/enums/Money";
import { Traders } from "@spt-aki/models/enums/Traders";
import { IQuestConfig } from "@spt-aki/models/spt/config/IQuestConfig";

// New trader settings
import * as baseJson from "../db/base.json";
import * as assortJson from "../db/assort.json";

class SampleTrader implements IPreAkiLoadMod, IPostDBLoadMod {
    mod: string
    logger: ILogger
    private configServer: ConfigServer;
    private ragfairConfig: IRagfairConfig; 

    constructor() {
        this.mod = "Evelyn";
    }

    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);

        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        
        this.registerProfileImage(preAkiModLoader, imageRouter);
        Traders[baseJson._id] = baseJson._id
        this.setupTraderUpdateTime(traderConfig);
        
        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }

    public postAkiLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
    }

    public postDBLoad(container: DependencyContainer): void {

        this.logger.debug(`[${this.mod}] postDb Loading... `);
        this.configServer = container.resolve("ConfigServer");
        this.ragfairConfig = this.configServer.getConfig(ConfigTypes.RAGFAIR);
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig(ConfigTypes.TRADER);
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");

        const tables = databaseServer.getTables();
        this.addTraderToDb(baseJson, tables, jsonUtil);

        this.addTraderToLocales(tables, baseJson.name, "Evelyn", baseJson.nickname, baseJson.location, "A trained American soldier who leads a small USEC group and seeks to join the High Command at the Military Base.");
        this.ragfairConfig.traders[baseJson._id] = true;
        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }

    private registerProfileImage(preAkiModLoader: PreAkiModLoader, imageRouter: ImageRouter): void
    {
        const imageFilepath = `./${preAkiModLoader.getModPath(this.mod)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/Evelyn.jpg`);
    }

    private setupTraderUpdateTime(traderConfig: ITraderConfig): void
    {
        const traderRefreshRecord: UpdateTime = { traderId: baseJson._id, seconds: 3600 }
        traderConfig.updateTime.push(traderRefreshRecord);
    }
    
    private  addTraderToDb(Evelyn: any, tables: IDatabaseTables, jsonUtil: JsonUtil): void
    {
        tables.traders[Evelyn._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)) as ITraderAssort, // assorts are the 'offers' trader sells, can be a single item (e.g. carton of milk) or multiple items as a collection (e.g. a gun)
            base: jsonUtil.deserialize(jsonUtil.serialize(Evelyn)) as ITraderBase,
            questassort: {
                started: {},
                success: {
                    "6577bf95c9b1f9d904dadade" : "TheLittleCrew",
                    "47f669ab803c025d0e9bpupu" : "TheLittleCrew",
                    "96ocuidcon2q62tndagyat69" : "TheWestPart1",
                    "9a697338df84xaxa6c219f5c" : "TheWestPart1",
                    "eaza16427540f0a28d0acb90" : "TheWestPart1",
                    "wazp53d5f67c52f55ca0cd84" : "BattleReady",
                    "a75dd0e9f3119a3696b8deck" : "BattleReady",
                    "yat6942c099f83522bcf1aa2" : "BattleReady",
                    "3dba6127e876d75e5798bvbv" : "TheWestPart2",
                    "flo5369a11ad8dc828348f41" : "Cleanout",
                    "13dead58646c7dbe20096acq" : "Cleanout",
                    "53ab150266d9a475038blose" : "WelcomeGift",
                    "hgo72351f2a2aefebc5ed960" : "WelcomeGift",
                    "13dead58646c7dbe2009662a" : "TheWestPart3",
                    "13dead58646c7dbe2009662s" : "TheWestPart3"
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
    private addTraderToLocales(tables: IDatabaseTables, fullName: string, firstName: string, nickName: string, location: string, description: string,)
    {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }

    private addItemToLocales(tables: IDatabaseTables, itemTpl: string, name: string, shortName: string, Description: string)
    {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        for (const locale of locales) {
            locale[`${itemTpl} Name`] = name;
            locale[`${itemTpl} ShortName`] = shortName;
            locale[`${itemTpl} Description`] = Description;
        }
    }
}
module.exports = { mod: new SampleTrader() }