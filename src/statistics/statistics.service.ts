import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Appointment, AppointmentDocument } from "src/appointments/schemas/appointment.schema";
import { AppointmentStatus } from "src/enums/all_enums";
import { Service, ServiceDocument } from "src/services/schemas/service.schema";

// statistics.service.ts
@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async getAppointmentStatsByDate(filter: 'day' | 'month' | 'year') {
    const groupByFormat = {
      day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      year: { $dateToString: { format: '%Y', date: '$createdAt' } },
    };

    return this.appointmentModel.aggregate([
      { $match: { isDeleted: false,
        status:"Khách hàng đã checkin"  
       } },
      { $group: {
          _id: groupByFormat[filter],
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getRevenueStatsByDate(filter: 'day' | 'month' | 'year') {
  const groupByFormat = {
    day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
    month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
    year: { $dateToString: { format: '%Y', date: '$createdAt' } },
  };

  return this.appointmentModel.aggregate([
    {
      $match: {
        isDeleted: false,
        status: 'Hoàn tất đặt lịch',
      },
    },
    {
      $lookup: {
        from: 'services',
        localField: 'serviceID',
        foreignField: '_id',
        as: 'service',
      },
    },
    { $unwind: '$service' },
    {
      $group: {
        _id: groupByFormat[filter],
        totalRevenue: { $sum: '$service.price' },
        totalAppointments: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
}


  async getTopUsedServices(limit: number | string = 5) {
  const numericLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;

  return this.appointmentModel.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$serviceID',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: numericLimit },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'service'
      }
    },
    { $unwind: '$service' },
    {
      $project: {
        serviceName: '$service.name',
        count: 1
      }
    }
  ]);
}
}
