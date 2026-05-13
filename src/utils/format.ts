import { MeasurementPreference, Nullable } from '@/types';
import { in2cm, in2ftInches, lb2kg, roundNum } from './num';

/**
 * 将秒数格式化为 hh:mm:ss 或 mm:ss
 * @param duration 秒
 * @param showHours 是否显示小时，默认 true；为 false 时返回 mm:ss（总分钟:秒）
 */
export function formatDuration(duration: Nullable<number> = 0, showHours: boolean = true) {
  if (!duration) {
    return showHours ? '00:00:00' : '00:00';
  }

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  if (!showHours) {
    const totalMinutes = Math.floor(duration / 60);
    return `${String(totalMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * 通过年月计算年龄
 * @param birthYear 出生年份，格式为 MM/YYYY
 */
export function calculateAge(birthYear: string): number {
  const [month, year] = birthYear.split('/').map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;

  if (today.getMonth() + 1 < month) {
    age--;
  }

  return age;
}

export function weightDisplay(
  weightLb: Nullable<number>,
  displayUnit: MeasurementPreference,
): string {
  if (weightLb == null) {
    return '';
  }

  if (displayUnit === 'metric') {
    const weightKg = lb2kg(weightLb, 3);
    return `${weightKg} kg`;
  } else {
    return `${roundNum(weightLb)} lb`;
  }
}

export function heightDisplay(
  heightIn: Nullable<number>,
  displayUnit: MeasurementPreference,
): string {
  if (heightIn == null) {
    return '';
  }

  if (displayUnit === 'metric') {
    const heightCm = in2cm(heightIn);
    return `${heightCm} cm`;
  } else {
    const [ft, inches] = in2ftInches(heightIn);
    return `${ft} ft ${inches} in`;
  }
}

/**
 * 多语言序数词处理函数
 * @param num 排名数字
 * @returns 排名后缀字符串（如 "st", "nd", "rd", "th"）
 */
export const getOrdinalSuffix = (num: number, language?: string) => {
  switch (language) {
    case 'en':
      const remainder10 = num % 10;
      const remainder100 = num % 100;

      if (remainder100 >= 11 && remainder100 <= 13) {
        return 'th';
      }

      switch (remainder10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }

    case 'zh':
    case 'zh-CN':
    case 'zh-TW':
      return ''; // 中文不需要序数词后缀，直接返回空字符串

    case 'ja':
      return '位'; // 日文

    case 'ko':
      return '위'; // 韩文

    default:
      return ''; // 其他语言默认不添加后缀
  }
};
