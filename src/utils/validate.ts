import { StandardSchemaV1Issue } from '@tanstack/react-form';

export function flattenErrors(errors: Record<string, StandardSchemaV1Issue[]>[]): string[] {
  const flattenedErrors: string[] = [];

  for (const errorObj of errors) {
    for (const key in errorObj) {
      if (!Object.hasOwn(errorObj, key)) continue;
      const element = errorObj[key];
      if (element.length > 0) {
        flattenedErrors.push(element[0].message);
      }
    }
  }

  return flattenedErrors;
}
