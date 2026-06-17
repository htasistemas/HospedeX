import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsOptional, IsString, IsUUID, Min, ValidateNested } from "class-validator";

export class RoomingListItemDto {
  @ApiProperty()
  @IsString()
  guestName!: string;

  @ApiProperty()
  @IsUUID()
  roomTypeId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  roomId?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  adults!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  children!: number;
}

export class CreateGroupReservationDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  eventName?: string;

  @ApiProperty()
  @IsDateString()
  checkInDate!: string;

  @ApiProperty()
  @IsDateString()
  checkOutDate!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  blockedRoomIds!: string[];

  @ApiProperty({ type: [RoomingListItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomingListItemDto)
  roomingList!: RoomingListItemDto[];
}
