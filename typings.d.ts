import { Client } from 'discord.js';

// Utilities
type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?:
        Required<Pick<T, K>>
        & Partial<Record<Exclude<Keys, K>, undefined>>
    }[Keys];

// Database Options
// MySQL will be added in the future, but for now, only MongoDB is supported
interface MandlerOptionsWithMySQL extends MandlerOptionsInterface {
    databaseType: "mysql";
    databaseHost?: string = "localhost";
    databasePort?: number = 3306;
    databaseUser?: string = "root";
    databasePassword?: string = "";
    databaseName?: string = "mandler";
    databaseKeepAlive?: boolean = true;
}

interface MandlerOptionsWithMongoDB extends MandlerOptionsInterface {
    databaseType: "mongodb";
    databaseUri: string;
    databaseOptions?: any;
}

interface MandlerOptionsWithoutDatabase extends MandlerOptionsInterface {
    databaseType: "none";
}

// Mandler General Options
interface MandlerOptionsInterface {
    // User Code
    commandsDirectory: string;
    commandGuardsDirectory?: string;
    eventsDirectory?: string;

    // Database (Defined from other interfaces)
    databaseType: string;

    // Messages
    messagesPath?: string;
    defaultLanguage?: string = "en";
    fallbackLanguage?: string = "en";
    deleteErrorMessagesAfter?: TimeString | number | false = "5s";

    // Logging
    showWarnings?: boolean = true;
    showErrors?: boolean = true;
    showDebug?: boolean = false;
    showStartupInfo?: boolean = true;

    // Utilities
    ignoreBots?: boolean = true;
    testServers?: string | string[];
    disabledDefaultCommands?: string | string[];
    typeScript?: boolean = true;
    ephemeral?: boolean = false;
    defaultPrefix?: string = "!";
    useDefaultGuards?: boolean = true;

    // Discord Client/Token
    client?: Client;
    token?: string;
}

type MandlerOptions = RequireOnlyOne<MandlerOptionsWithMongoDB, "client" | "token"> | RequireOnlyOne<MandlerOptionsWithMySQL, "client" | "token"> | RequireOnlyOne<MandlerOptionsWithoutDatabase, "client" | "token">;

// TimeString
{
    // Any amount of digits
    type TimeStringMilliSeconds = `${Number}ms`;
    type TimeStringSeconds = `${Number}s`;
    type TimeStringMinutes = `${Number}m`;
    type TimeStringHours = `${Number}h`;
    type TimeStringDays = `${Number}d`;
    type TimeStringWeeks = `${Number}w`;
    type TimeStringMonths = `${Number}M`;
    type TimeStringYears = `${Number}y`;

    type TimeString = TimeStringMilliSeconds | TimeStringSeconds | TimeStringMinutes | TimeStringHours | TimeStringDays | TimeStringWeeks | TimeStringMonths | TimeStringYears;

}