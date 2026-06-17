import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsUUID } from "class-validator";

export class MoveReservationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  roomId?: string | null;

  @ApiProperty({ example: "2026-07-02" })
  @IsDateString()
  checkInDate!: string;

  @ApiProperty({ example: "2026-07-05" })
  @IsDateString()
  checkOutDate!: string;
}
