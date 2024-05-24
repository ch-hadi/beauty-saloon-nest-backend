import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

/**
 * @param arr takes the array of objects
 * @returns returns an array with swagger api decorators
 */
export function ApiQueryArray(arr: Array<object>) {
  const finalResponse = arr.map((item: unknown) => ApiQuery(item));
  return applyDecorators(...finalResponse);
}
