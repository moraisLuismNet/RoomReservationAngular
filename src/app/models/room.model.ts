export interface Room {
  roomId: number;
  roomNumber: string;
  roomTypeId: number;
  roomTypeName?: string;
  pricePerNight: number;
  description?: string;
  capacity: number;
  isActive: boolean;
  imageRoom?: string;
}
