import { Injectable } from "@nestjs/common";
import { LedgerRepository } from "../../infrastructure/repositories/ledger.repository";
import { Ledger } from "../../domain/entities/ledger.entity";

@Injectable()
export class ListLedgerUseCase {
  constructor(private readonly ledgerRepository: LedgerRepository) {}

  async execute(
    userEmail: string,
    page: number,
    limit: number,
    orderBy: "asc" | "desc" = "desc",
  ): Promise<{
    ledgerItems: Ledger[];
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    const skip = (page - 1) * limit;
    const ledgerItems = await this.ledgerRepository.findByUserEmail(
      userEmail,
      skip,
      limit,
      orderBy,
    );

    const totalItems =
      await this.ledgerRepository.findTotalByUserEmail(userEmail);

    return {
      ledgerItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems: totalItems,
    };
  }
}
