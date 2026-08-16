import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { TemplateItemType } from '@prisma/client';

function trimString({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim() : value;
}

@ValidatorConstraint({ name: 'numericRange', async: false })
class NumericRangeConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments) {
    const item = args.object as TemplateItemDto;

    if (item.type !== TemplateItemType.NUMERIC) {
      return true;
    }

    if (item.minValue == null || item.maxValue == null) {
      return true;
    }

    return item.minValue <= item.maxValue;
  }

  defaultMessage() {
    return 'Minimum must be less than or equal to maximum';
  }
}

export class TemplateItemDto {
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @IsEnum(TemplateItemType)
  type!: TemplateItemType;

  @ValidateIf((item: TemplateItemDto) => item.type === TemplateItemType.NUMERIC)
  @IsOptional()
  @Transform(trimString)
  @IsString()
  @MaxLength(32)
  unit?: string;

  @ValidateIf((item: TemplateItemDto) => item.type === TemplateItemType.NUMERIC)
  @IsOptional()
  @IsNumber()
  minValue?: number;

  @ValidateIf((item: TemplateItemDto) => item.type === TemplateItemType.NUMERIC)
  @IsOptional()
  @IsNumber()
  @Validate(NumericRangeConstraint)
  maxValue?: number;
}

export class TemplateSectionDto {
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateItemDto)
  items!: TemplateItemDto[];
}
