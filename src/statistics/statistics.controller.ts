import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { Public } from 'src/decorator/customize';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }

  @Get('/appointments')
  @ApiOperation({ summary: 'Tổng số bệnh nhân đến khám theo ngày/tháng/năm' })
  @ApiQuery({ name: 'filter', enum: ['day', 'month', 'year'], required: true })
  @ApiResponse({ status: 200, description: 'Danh sách thống kê số lượng bệnh nhân' })
  async getAppointmentStats(@Query('filter') filter: 'day' | 'month' | 'year') {
    return this.statisticsService.getAppointmentStatsByDate(filter);
  }
  @Get('/revenue')
  @ApiOperation({ summary: 'Doanh thu theo ngày/tháng/năm' })
  @ApiQuery({ name: 'filter', enum: ['day', 'month', 'year'], required: true })
  @ApiResponse({ status: 200, description: 'Thống kê doanh thu' })
  async getRevenueStats(@Query('filter') filter: 'day' | 'month' | 'year') {
    return this.statisticsService.getRevenueStatsByDate(filter);
  }
  @Get('/top-services')
  @ApiOperation({ summary: 'Các dịch vụ được sử dụng nhiều nhất' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số lượng dịch vụ trả về' })
  @ApiResponse({ status: 200, description: 'Danh sách dịch vụ được sử dụng nhiều nhất' })
  async getTopUsedServices(@Query('limit') limit = 5) {
    return this.statisticsService.getTopUsedServices(limit);
  }
}
