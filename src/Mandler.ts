import { Client } from "discord.js";
import EventEmitter from "events";
import { MandlerOptions, MandlerOptionsWithMongoDB } from "./typings";
import { Connection } from 'mongoose';
import mongoose from "mongoose";
import GuildSettings, { IGuildSettings } from "./models/mongodb/GuildSettings";
import Cooldowns, { ICooldown } from "./models/mongodb/Cooldowns";

// TODO: Add all the other options
// TODO: Implement mysql as a database
export default class Mandler extends EventEmitter {

    // undefined should never occur
    private _client: Client | undefined;
    private _defaultPrefix?: string;
    private _connection?: Connection;
    private _guildSettings?: IGuildSettings[];
    private _cooldowns?: ICooldown[];


    constructor(options: MandlerOptions) {
        super();
        this.setup(options);
    }

    private async setup(userOptions: MandlerOptions) {
        const options = {
            databaseOptions: {
                keepAlive: true,
            },
            messagesPath: "./messages.json",
            commandGuardsDirectory: "./guards",
            eventsDirectory: "./events",
            defaultLanguage: "en",
            fallbackLanguage: "en",
            defaultPrefix: "!",
            deleteErrorMessagesAfter: "5s",
            ephemeral: false,
            typeScript: true,
            useDefaultGuards: true,
            ignoreBots: true,
            showWarnings: true,
            showDebug: false,
            showErrors: true,
            showStartupInfo: true,
            ...userOptions,
        } as MandlerOptions;

        // Setup Client
        if (options.client) this._client = options.client;
        else {
            this._client = new Client({ intents: ["GUILDS", "GUILD_INTEGRATIONS"] });
            await this._client.login(options.token);
        }

        this._defaultPrefix = options.defaultPrefix;

        switch (options.databaseType) {
            case "mongodb":
                const mongoOptions: MandlerOptionsWithMongoDB = options as MandlerOptionsWithMongoDB;

                mongoose.connect(mongoOptions.databaseUri, mongoOptions.databaseOptions);

                const { connection } = mongoose;
                this._connection = connection;

                // Load Guild Settings
                this._guildSettings = await GuildSettings.find({});

                // Load Cooldowns
                this._cooldowns = await Cooldowns.find({});
                break;
            case "none":
                console.warn("No database type specified, no database will be used.");
                console.warn("A database is required to use some of Mandlers features.");
                console.warn("If your database is not supported, please open an issue on GitHub.");
                break;
            default:
                throw new Error(`Invalid database type: ${options.databaseType}`);
        }
    }
}

module.exports = Mandler;