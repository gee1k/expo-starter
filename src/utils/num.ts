// 转换常数
const KG_TO_LB_FACTOR = 2.204_622_621_8;
const CM_TO_IN_FACTOR = 2.54;

/**
 * 安全地将值转换为数字
 * @param value - 要转换的值
 * @param defaultValue - 转换失败时的默认值
 * @returns 转换后的数字
 */
export function safeToNumber(value: unknown, defaultValue = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : defaultValue;
}

/**
 * 将数字四舍五入到指定的小数位数
 * @param num - 要四舍五入的数字（支持数字、字符串等类型）
 * @param decimalPlaces - 小数位数，默认为2
 * @returns 四舍五入后的数字
 */
export function roundNum(num: unknown, decimalPlaces = 2): number {
  const numValue = safeToNumber(num);
  if (!Number.isFinite(numValue)) {
    return 0;
  }

  const factor = 10 ** Math.max(0, Math.floor(decimalPlaces));
  return Math.round(numValue * factor) / factor;
}

/**
 * 格式化数字，添加千分位分隔符
 * @param num - 要格式化的数字（支持数字、字符串等类型）
 * @param options - 格式化选项
 * @returns 格式化后的字符串
 */
export function formatNumber(num: unknown, options: Intl.NumberFormatOptions = {}): string {
  const numValue = safeToNumber(num);
  if (!Number.isFinite(numValue)) {
    return '0';
  }

  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(numValue);
}

/**
 * 将数字转换为百分比格式
 * @param num - 要转换的数字（0-1之间的小数，支持数字、字符串等类型）
 * @param decimalPlaces - 小数位数，默认为1
 * @returns 百分比字符串
 */
export function toPercent(num: unknown, decimalPlaces = 1): string {
  const numValue = safeToNumber(num);
  if (!Number.isFinite(numValue)) {
    return '0%';
  }

  return `${roundNum(numValue * 100, decimalPlaces)}%`;
}

/**
 * 限制数字在指定范围内
 * @param num - 要限制的数字
 * @param min - 最小值
 * @param max - 最大值
 * @returns 限制后的数字
 */
export function clamp(num: number, min: number, max: number): number {
  if (!Number.isFinite(num)) {
    return min;
  }

  return Math.min(Math.max(num, min), max);
}

/**
 * 检查数字是否在指定范围内
 * @param num - 要检查的数字
 * @param min - 最小值
 * @param max - 最大值
 * @returns 是否在范围内
 */
export function isInRange(num: number, min: number, max: number): boolean {
  return Number.isFinite(num) && num >= min && num <= max;
}

/**
 * 通用单位转换函数
 * @param value - 要转换的值
 * @param factor - 转换系数
 * @param precision - 精度，如果为true则使用Math.round，如果为数字则使用roundNum
 * @returns 转换后的数字
 */
function convertUnit(value: unknown, factor: number, precision: boolean | number = true): number {
  const num = safeToNumber(value);
  const result = num * factor;

  if (precision === true) {
    return Math.round(result);
  } else if (typeof precision === 'number') {
    return roundNum(result, precision);
  } else {
    return result;
  }
}

/**
 * 将公斤转换为磅
 * @param kg - 公斤数
 * @param precision - 精度设置，true为整数，数字为小数位数，false为原始值
 * @returns 转换后的磅数
 */
export function kg2lb(kg: unknown, precision: boolean | number = true): number {
  return convertUnit(kg, KG_TO_LB_FACTOR, precision);
}

/**
 * 将磅转换为公斤
 * @param lb - 磅数
 * @param precision - 精度设置，true为整数，数字为小数位数，false为原始值
 * @returns 转换后的公斤数
 */
export function lb2kg(lb: unknown, precision: boolean | number = true): number {
  return convertUnit(lb, 1 / KG_TO_LB_FACTOR, precision);
}

/**
 * 将厘米转换为英寸
 * @param cm - 厘米数
 * @param precision - 精度设置，true为整数，数字为小数位数，false为原始值
 * @returns 转换后的英寸数
 */
export function cm2in(cm: unknown, precision: boolean | number = true): number {
  return convertUnit(cm, 1 / CM_TO_IN_FACTOR, precision);
}

/**
 * 将英寸转换为厘米
 * @param inches - 英寸数
 * @param precision - 精度设置，true为整数，数字为小数位数，false为原始值
 * @returns 转换后的厘米数
 */
export function in2cm(inches: unknown, precision: boolean | number = true): number {
  return convertUnit(inches, CM_TO_IN_FACTOR, precision);
}

/**
 * 将厘米转换为英尺和英寸的数组
 * @param cm - 厘米
 * @param precision - 精度设置，true为整数，数字为小数位数，false为原始值
 * @returns 包含英尺和英寸的数组
 */
export function cm2ftInches(cm: unknown, precision: boolean | number = true): [number, number] {
  const inches = cm2in(cm, precision);
  return in2ftInches(inches);
}

/**
 * 将英寸转换为英尺和英寸的数组
 * @param inches - 英寸数
 * @returns 包含英尺和英寸的数组
 */
export function in2ftInches(inches: unknown): [number, number] {
  const num = safeToNumber(inches);
  const ft = Math.floor(num / 12);
  const inRest = Math.round(num % 12);
  return [ft, inRest];
}

/**
 * 将英尺和英寸转换为总英寸数
 * @param ft 英尺
 * @param inches 英寸
 * @returns 英寸数
 */
export function ftInches2in(ft: unknown, inches: unknown): number {
  const ftNum = safeToNumber(ft);
  const inchesNum = safeToNumber(inches);

  const totalInches = ftNum * 12 + inchesNum;
  return totalInches;
}

/**
 * 将英尺和英寸转换为总厘米数
 * @param ft 英尺
 * @param inches 英寸
 * @returns 厘米数
 */
export function ftInches2cm(
  ft: unknown,
  inches: unknown,
  precision: boolean | number = true,
): number {
  const totalInches = ftInches2in(ft, inches);
  return in2cm(totalInches, precision);
}

/**
 * 生成指定范围内的随机整数
 * @param min - 最小值（包含）
 * @param max - 最大值（包含）
 * @returns 随机整数
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成指定范围内的随机浮点数
 * @param min - 最小值
 * @param max - 最大值
 * @param decimalPlaces - 小数位数，默认为2
 * @returns 随机浮点数
 */
export function randomFloat(min: number, max: number, decimalPlaces = 2): number {
  const random = Math.random() * (max - min) + min;
  return roundNum(random, decimalPlaces);
}
