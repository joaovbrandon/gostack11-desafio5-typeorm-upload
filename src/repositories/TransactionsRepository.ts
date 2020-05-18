import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    return transactions.reduce(
      ({ income, outcome, total }: Balance, { type, value }: Transaction) => {
        const current = Number(value);

        return {
          income: type === 'income' ? income + current : income,
          outcome: type === 'outcome' ? outcome + current : outcome,
          total: type === 'income' ? total + current : total - current,
        };
      },
      { income: 0, outcome: 0, total: 0 },
    );
  }
}

export default TransactionsRepository;
