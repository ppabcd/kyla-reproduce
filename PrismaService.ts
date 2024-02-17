import { PrismaClient } from "@prisma/client"
import { injectable } from "./di"

@injectable()
export class PrismaService {
    client: PrismaClient

    constructor() {
        this.client = new PrismaClient()
    }
}
