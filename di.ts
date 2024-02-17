import {Conversation, ConversationFlavor} from "@grammyjs/conversations"
import {Api, Composer, Context, SessionFlavor} from "grammy"
import type {ParseModeFlavor} from "@grammyjs/parse-mode"
import {I18n, I18nFlavor} from "@grammyjs/i18n"
import {FileApiFlavor, FileFlavor} from "@grammyjs/files"
import {Container, injectable as originalInjectable} from "inversify"

export interface SessionData {
    __language_code?: string
}

export type BotContext = FileFlavor<ParseModeFlavor<Context & ConversationFlavor & I18nFlavor> & SessionFlavor<SessionData>>
export const botContainer = new Container()
export const botComposer = new Composer<BotContext>()
export type BotConversation = Conversation<BotContext>;
export type BotAPI = FileApiFlavor<Api>
export function getSessionKey(ctx: Omit<BotContext, "session">): string | undefined {
    // Give every user their one personal session storage per chat with the bot
    // (an independent session for each group and their private chat)
    return ctx.from === undefined || ctx.chat === undefined
        ? undefined
        : `${ctx.from.id}/${ctx.chat.id}`
}
export const i18n = new I18n<BotContext>({
    defaultLocale: "en",
    directory: "locales",
    useSession: true,
})
/**
 * Inject the constructor with the container
 * @param container
 */
export function injectable(container: Container = botContainer) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function <T extends { new(...args: any[]): unknown }>(constructor: T) {
        injectConstructor(constructor, container)
    }
}
/**
 * Register the constructor to the container and make it injectable
 * @param constructor
 * @param container
 */
export function injectConstructor<T>(
    constructor: new (...args: any[]) => T,
    container: Container = botContainer
) {
    originalInjectable()(constructor)
    container.bind(constructor).toSelf().inSingletonScope()
}

