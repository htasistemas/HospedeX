import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional, IsUUID } from "class-validator";

export enum AvailabilityViewMode {
  Day = "day",
  Week = "week",
  Fortnight = "fortnight",
  Month = "month"
}

export class AvailabilityQueryDto {
  @ApiProperty({ enum: AvailabilityViewMode })
  @IsEnum(AvailabilityViewMode)
  view!: AvailabilityViewMode;

  @ApiProperty({ example: "2026-07-01" })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  roomTypeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
