import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';
import { DatesRangeValue } from 'mantine-dates-6';
import { Deposit, Expense, Tag } from 'types/expense';

dayjs.extend(localeData);
dayjs.extend(isSameOrBefore);

export default function useChartData(
  dates: DatesRangeValue,
  filterTags: string[],
  tags?: Tag[],
  expenses?: Expense[],
  deposits?: Deposit[]
) {
  const data: BarDatum[] = [];
  const keys = new Set<string>();

  if (tags && deposits && expenses && dates.every((date) => !!date)) {
    let date = dayjs(dates[0]);
    while (date.isSameOrBefore(dates[1], 'month')) {
      const monthIndex = date.month();
      const item: BarDatum = { month: dayjs.monthsShort()[monthIndex] };
      date = date.add(1, 'month');

      for (const tag of tags) {
        let tagAmount = 0;

        for (const expense of expenses) {
          if (expense.tagIds.includes(tag.id) && dayjs(expense.date).month() === monthIndex) {
            tagAmount += expense.amount;
          }
        }

        if ((!filterTags.length || filterTags.includes(tag.id)) && tagAmount) {
          item[tag.name] = tagAmount;
          item[`${tag.name}Color`] = tag.color;
          keys.add(tag.name);
        }
      }
      data.push(item);
    }
  }

  return { data, keys: [...keys] };
}
