import mongoose, { Schema } from "mongoose";

const name = "mandler-cooldowns";

export interface ICooldown {
    guildId?: string;
    userId?: string;
    command: string;
    cooldown: Date;
}

const Cooldowns = new Schema<ICooldown>({
    guildId: {
        type: String,
        required: false,
    },
    userId: {
        type: String,
        required: false
    },
    command: {
        type: String,
        required: true
    },
    cooldown: {
        type: Date,
        required: true
    }
});

export default mongoose.model(name, Cooldowns, name);