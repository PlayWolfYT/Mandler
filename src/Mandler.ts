import { Awaitable, Client, ClientEvents } from "discord.js";
import EventEmitter from "events";
import { MandlerClientEvents, MandlerOptions, MandlerOptionsWithMongoDB } from "./typings";
import { Connection } from 'mongoose';
import mongoose from "mongoose";
import GuildSettings, { IGuildSettings } from "./models/mongodb/GuildSettings";
import Cooldowns, { ICooldown } from "./models/mongodb/Cooldowns";

// TODO: Add all the other options
// TODO: Implement mysql as a database
export default class Mandler extends EventEmitter {
    public readonly _client: Client;

    private _connection?: Connection;
    private _guildSettings?: IGuildSettings[];
    private _cooldowns?: ICooldown[];

    private _options: MandlerOptions;

    constructor(options: MandlerOptions) {
        super();
        this._options = options;

        // Setup Client
        if (options.client) {
            if (!(options.client instanceof Client)) {
                throw new Error("Client is not an instance of Discord.js Client");
                return;
            }
            this._client = options.client;
            if (options.showDebug) console.log("Client set");
        } else {
            this._client = new Client({ intents: ["GUILDS", "GUILD_INTEGRATIONS"] });
        }

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
                if (options.showWarnings) {
                    console.warn("No database type specified, no database will be used.");
                    console.warn("A database is required to use some of Mandlers features.");
                    console.warn("If your database is not supported, please open an issue on GitHub.");
                }
                break;
            default:
                throw new Error(`Invalid database type: ${options.databaseType}. If you don't want to use a database, use "none" as database type.`);
        }

        // Setup Client Events
        this._client.on("ready", () => {
            if (options.showStartupInfo) console.log("[Mandler] Client ready.");
            this.emit("mandlerReady");
        });

        // Log the client in, if it's not already logged in
        if (!this._client.user?.bot) {
            try {
                await this._client.login(options.token);
            } catch (err) {
                console.error("[Mandler] Error while logging in:", err);
            }
            if (options.showDebug) console.log("[Mandler] Client logged in.");
        }
    }
}

module.exports = Mandler;