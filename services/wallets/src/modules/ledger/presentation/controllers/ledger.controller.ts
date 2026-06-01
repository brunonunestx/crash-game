import { Controller, Get, Query } from "@nestjs/common";
import { ListLedgerUseCase } from "../../application/use-cases/list-ledger.use-case";

@Controller("ledger")
export class LedgerController {
  constructor(private readonly listLedgerUseCase: ListLedgerUseCase) {}

  @Get()
  async listLedger(
    @Query("userEmail") userEmail: string,
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("orderBy") orderBy: "asc" | "desc" = "desc",
  ) {
    return this.listLedgerUseCase.execute(userEmail, page, limit, orderBy);
  }
}
