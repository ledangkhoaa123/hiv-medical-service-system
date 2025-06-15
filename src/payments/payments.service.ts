import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { pick } from 'lodash';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: SoftDeleteModel<PaymentDocument>,
  ) { }
  async create(createpaymentDto: CreatePaymentDto, user: IUser) {
    const IsExist = await this.paymentModel.findOne({
      appointmentID: createpaymentDto.appointmentID,
    });
    if (IsExist) {
      throw new BadRequestException('PaymentId đã tồn tại');
    }

    const payment = await this.paymentModel.create({
      ...createpaymentDto
    });
    return {
      createdBy: {
        // _id: user._id,
        // email: user.email,
      },
      createdAt: payment.createdAt
    };
  }

  findAll() {
    return this.paymentModel.find();
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found payment with id=${id}`);
    }
    return this.paymentModel.findOne({ _id: id });
  }

  update(id: string, updatepaymentDto: UpdatePaymentDto, user: IUser) {
    const fieldsToUpdate = pick(updatepaymentDto, [
      'firstName',
      'lastName',
      'gender',
      'contactEmails',
      'contactPhones',
      'wallet',
    ]);

    return this.paymentModel.findOneAndUpdate(
      { _id: id },
      {
        ...fieldsToUpdate,
        updatedBy: {
          // _id: user._id,
          // email: user.email,
        },
      },
      { new: true }
    );
  }

  async remove(id: string, user: IUser) {
    await this.paymentModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          // _id: user._id,
          // email: user.email,
        },
      },
    );
    return this.paymentModel.softDelete({
      _id: id,
    });
  }
}
