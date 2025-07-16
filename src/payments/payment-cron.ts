import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WalletTransaction,
  WalletTransactionDocument,
} from './schemas/walletTransaction.schema';

@Injectable()
export class WalletTransactionCronService {
  private readonly logger = new Logger(WalletTransactionCronService.name);

  constructor(
    @InjectModel(WalletTransaction.name)
    private readonly walletTransactionModel: Model<WalletTransactionDocument>,
  ) {}

  @Cron('*/1 * * * *') // Chạy mỗi phút
  async removeStaleWalletTransactions() {
    const now = new Date();
    const timeoutThreshold = new Date(now.getTime() - 5 * 60 * 1000); // 5 phút trước
    const staleTransactions = await this.walletTransactionModel.find({
      status: 'pending',
      createdAt: { $lt: timeoutThreshold },
    });

    if (staleTransactions.length === 0) return;

    const result = await this.walletTransactionModel.deleteMany({
      _id: { $in: staleTransactions.map((tx) => tx._id) },
    });

    this.logger.log(
      `Đã xoá ${result.deletedCount} giao dịch ví quá hạn chưa hoàn tất.`,
    );
  }
}
