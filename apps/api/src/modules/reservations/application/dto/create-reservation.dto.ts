import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { ReservationOrigin } from "@hospedex/contracts";

export class CreateReservationDto {
  @ApiProperty()
  @IsUUID()
  guestId!: string;

  @ApiProperty({ example: "Maria Silva" })
  @IsString()
  guestName!: string;

  @ApiProperty()
  @IsUUID()
  roomTypeId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  roomId?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  adults!: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  children!: number;

  @ApiProperty({ example: "2026-07-01" })
  @IsDateString()
  checkInDate!: string;

  @ApiProperty({ example: "2026-07-04" })
  @IsDateString()
  checkOutDate!: string;

  @ApiProperty({ enum: ReservationOrigin })
  @IsEnum(ReservationOrigin)
  origin!: ReservationOrigin;

  @ApiProperty()
  @IsUUID()
  ratePlanId!: string;

  @ApiProperty({ example: 390.9 })
  @IsNumber()
  @Min(0)
  dailyRate!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  allowOverbooking?: boolean;
}
