import "reflect-metadata"
import "dotenv/config"
import {bot} from "./bot";
import {BotAPI, botContainer, BotContext} from "./di";
import {AgeConversation} from "./AgeConversation";
import {conversations, createConversation} from "@grammyjs/conversations";
import {run} from "@grammyjs/runner";
import {Bot} from "grammy";

async function main() {
    const myBot: Bot<BotContext, BotAPI> = await bot({})

    const ageConversation = botContainer.get<AgeConversation>(AgeConversation)

    myBot.use(conversations())
    myBot.use(createConversation(
        ageConversation.handle.bind(ageConversation),
        "ask_age"
    ))
    const runner = run(myBot)
    const stopRunner = async () => {
        if (runner.isRunning()) {
            await runner.stop()
            process.exit(0)
        }
        console.log("Bot stopped")
    }
    myBot.command("start", async (ctx) => await ctx.conversation.enter("ask_age"))
    process.once("SIGINT", stopRunner)
    process.once("SIGTERM", stopRunner)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
