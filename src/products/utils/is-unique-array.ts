import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown[]) {
          if (!Array.isArray(value)) return false;
          const uniqueValues = new Set(value);
          return uniqueValues.size === value.length;
        },
        defaultMessage() {
          return `${propertyName} must contain unique values`;
        },
      },
    });
  };
}
