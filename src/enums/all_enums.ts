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
  AgeGroup = 'AgeGroup',
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
  PENDING_HOLD='Đang chờ thanh toán',
  PENDING = 'Đang xét duyệt',
  BOOKED = 'Đã đặt',
  UNAVAILABLE = ' Không khả dụng',
}
export enum AppointmentStatus {
  pending = 'Đang xét duyệt',
  pending_payment = 'Chờ thanh toán',
  confirmed = 'Đã đặt lịch và đã được duyệt',
  checkin = 'Khách hàng đã checkin',
  payment_failed = 'Thanh toán thất bại',
  cancelled_by_user = 'Hủy bởi người khách hàng',
  cancelled_by_staff = 'Hủy bởi nhân viên',
  refunded_by_staff = 'Đã hủy & hoàn tiền bởi nhân viên',
  completed = 'Hoàn tất quá trình khám',
  checkout = 'Khách hàng đã checkout',
  no_show = 'Không đến khám',
}
export enum AppointmentShiftName {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  FullDay = 'full',
}
export enum RoleName {
  CUSTOMER_ROLE = 'CUSTOMER_ROLE',
  STAFF_ROLE = 'STAFF_ROLE',
  ADMIN_ROLE = 'ADMIN_ROLE',
  DOCTOR_ROLE = 'DOCTOR_ROLE',
  MANAGER_ROLE = 'MANAGER_ROLE'
}
export enum WalletType {
  REFUND = 'Giao dịch hoàn trả',
  PAYMENT = 'Giao dịch thanh toán',
  DEPOSIT = 'Nạp tiền vào ví'
}
export enum Operator {
  ANY = 'any',
  EQUAL = '=',
  NOT_EQUAL = '!=',
  GREATER_THAN = '>',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN = '<',
  LESS_THAN_OR_EQUAL = '<=',
}