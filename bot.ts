import {BotAPI, botContainer, BotContext, getSessionKey, i18n} from "./di";
import {Container} from "inversify";
import {Bot, enhanceStorage, session} from "grammy";
import {autoRetry} from "@grammyjs/auto-retry";
import {hydrateFiles} from "@grammyjs/files";
import {hydrateReply} from "@grammyjs/parse-mode";
import {PrismaAdapter} from "@grammyjs/storage-prisma";
import {PrismaService} from "./PrismaService";

export async function bot({container = botContainer, botToken = process.env.BOT_API}: {
    container?: Container,
    botToken?: string
}): Promise<Bot<BotContext, BotAPI>> {
    const prismaService: PrismaService = container.get<PrismaService>(PrismaService)

    const bot: Bot<BotContext, BotAPI> = new Bot<BotContext, BotAPI>(botToken ?? "")

    bot.api.config.use(autoRetry({
        maxRetryAttempts: Infinity,
        maxDelaySeconds: 10,
        retryOnInternalServerErrors: true
    }))
    bot.api.config.use(hydrateFiles(bot.token))
    bot.use(hydrateReply)
    bot.use(session({
        initial(){
            return {}
        },
        getSessionKey: getSessionKey,
        storage: enhanceStorage({
            storage: new PrismaAdapter(prismaService.client.session)
        })
    }))
    // Translation
    bot.use(i18n)
    return bot
}
