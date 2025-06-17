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
export enum DoctorSlotStatus {
    PENDING = 'pending',
    AVAILABLE = 'available',
    PENDING_HOLD = 'pending_hold',
    BOOKED = 'booked',
    UNAVAILABLE = 'unavailable',
}