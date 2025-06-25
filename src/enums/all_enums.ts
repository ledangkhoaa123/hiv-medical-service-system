export enum TreatmentStatus {
  PENDING_APPROVAL = 'pending_approval',
  PENDING_PAYMENT = 'pending_payment',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PENDING_REFUND = 'pending_refund',
  ENDED = 'ended',
}
export enum DrugGroup {
  NRTIs = 'NRTIs',
  NNRTIs = 'NNRTIs',
  PIs = 'PIs',
  INSTIs = 'INSTIs',
  FI = 'FI',
  EICCR5 = 'EI/CCR5',
  PAIs = 'PAIs',
  AIs = 'AIs',
}
export enum TestType {
  HIV_ViralLoad = 'HIV_ViralLoad',
  CD4Count = 'CD4Count',
  HIV_Antibody = 'HIV_Antibody',
  GenotypeResistance = 'GenotypeResistance',
  LiverFunction = 'LiverFunction',
  RenalFunction = 'RenalFunction',
  CBC = 'CBC',
  HepatitisB = 'HepatitisB',
  HepatitisC = 'HepatitisC',
  PregnancyTest = 'PregnancyTest',
}
export enum RegimenType {
  FirstLine = 'FirstLine',
  SecondLine = 'SecondLine',
  PEP = 'PEP',
  PrEP = 'PrEP',
  Child = 'Child',
  Adult = 'Adult',
}
export enum DoctorScheduleStatus {
  PENDING = 'Chờ bác sĩ xác nhận',
  AVAILABLE = 'Bác sĩ đã xác nhận',
  UNAVAILABLE = 'Không khả dụng',
}
export enum DoctorSlotStatus {
  AVAILABLE = 'Sẵn sàng khám',
  PENDING = 'Đang xét duyệt',
  BOOKED = 'Đã đặt',
  UNAVAILABLE = ' Không khả dụng',
}
export enum ServiceName {
  BASIC_CHECKUP = 'Basic Checkup',
  HIV_TREATMENT = 'HIV Treatment',
  FOLLOW_UP = 'Follow Up',
}
export enum AppointmentStatus {
  pending = 'Đang xét duyệt',
  pending_payment = 'Chờ thanh toán',
  confirmed = 'Hoàn tất đặt lịch',
  payment_failed = 'Thanh toán thất bại',
  cancelled_by_user = 'Hủy bởi người khách hàng',
  cancelled_by_staff_refund_required = 'Hủy bởi Staff và chờ hoàn tiền',
  refund_completed = 'Hoàn tiền thành công',
  completed = 'Hoàn tất quá trình khám',
}
export enum AppointmentShiftName {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  FullDay = 'full',
}
