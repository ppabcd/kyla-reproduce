import {BotContext, BotConversation, injectable} from "./di";

@injectable()
export class AgeConversation {

    async handle(conversation: BotConversation, ctx: BotContext): Promise<void> {
        await this.promtForAge(ctx)
        const age = -1
        do {
            const age = await conversation.form.number()
            if (age < 0 && age > 60) {
                await ctx.reply(ctx.t("age.invalid"))
            }
        } while (age < 0 && age > 60)
    }

    private async promtForAge(ctx: BotContext) {
        await ctx.reply(ctx.t("age.ask"))
    }
}
