import mongoose, { Schema } from "mongoose";

export interface IGuildSettings {
    guildId: string;
    prefix: string;
    welcomeChannel?: string,
    welcomeMessage?: string,
    welcomeEnabled?: boolean,
    leaveChannel?: string,
    leaveMessage?: string,
    leaveEnabled?: boolean,
    modLogChannel?: string,
    modLogMessage?: string,
    modLogEnabled?: boolean,
}

const GuildSettings = new Schema<IGuildSettings>({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    prefix: {
        type: String,
        required: true,
        default: "!"
    },
    welcomeChannel: {
        type: String,
        required: false
    },
    welcomeMessage: {
        type: String,
        required: false
    },
    welcomeEnabled: {
        type: Boolean,
        required: false,
        default: false
    },
    leaveChannel: {
        type: String,
        required: false
    },
    leaveMessage: {
        type: String,
        required: false
    },
    leaveEnabled: {
        type: Boolean,
        required: false,
        default: false
    },
    modLogChannel: {
        type: String,
        required: false
    },
    modLogEnabled: {
        type: Boolean,
        required: false,
        default: false
    }
});

const name = "mandler-guildsettings";

export default mongoose.model(name, GuildSettings, name);