import { Button, Group, Loader } from '@mantine/core';
import { useDisclosure, useIntersection, useLocalStorage } from '@mantine/hooks';
import { useCollection } from '@tatsuokaniwa/swr-firestore';
import { ListManager, Load, MainLayout, Table } from 'components';
import { QueryConstraint, limit, orderBy, where } from 'firebase/firestore';
import { addTag } from 'lib/firebase/utils';
import { useEffect, useRef, useState } from 'react';
import { RiAddLine, RiSettings3Line } from 'react-icons/ri';
import { Expense, Tag } from 'types/expense';
import * as Filters from 'types/filters';
import { ExpenseFilters, ExpenseForm, ExpenseItem } from './components';

interface ExpensesPageProps {
  visibleNumbers: boolean;
}

const EXPENSES_LIMIT = 20;

export default function ExpensesPage({ visibleNumbers }: ExpensesPageProps) {
  const { data: tags } = useCollection<Tag>({ path: 'tags', orderBy: [['name', 'asc']] });

  const [filters, setFilters] = useLocalStorage<Filters.Expense>({
    key: 'expense-filters',
    defaultValue: {
      orderBy: 'date',
      direction: 'desc',
      tags: [],
    },
    getInitialValueInEffect: false,
  });
  const updateFilter = (value: Partial<Filters.Expense>) => {
    setFilters((prevState) => ({ ...prevState, ...value }));
  };

  const [expensesLimit, setExpensesLimit] = useState(EXPENSES_LIMIT);
  const queryConstraints: QueryConstraint[] = [
    orderBy(filters.orderBy, filters.direction),
    limit(expensesLimit),
  ];
  if (filters.tags.length) {
    queryConstraints.push(where('tagIds', 'array-contains-any', filters.tags));
  }
  const { data: expenses } = useCollection<Expense>({ path: 'expenses', queryConstraints });

  const [expenseFormOpened, expenseFormHandler] = useDisclosure(false);
  const [tagListOpened, tagListHandler] = useDisclosure(false);
  const [formValues, setFormValues] = useState<Expense>();

  const bodyRef = useRef<HTMLDivElement>();
  const { ref, entry } = useIntersection({ root: bodyRef.current, threshold: 0.5 });

  useEffect(() => {
    if (entry?.isIntersecting && !!expenses) {
      setExpensesLimit((prevState) => prevState + EXPENSES_LIMIT);
    }
  }, [entry?.isIntersecting]);

  return (
    <MainLayout>
      <MainLayout.Header
        title="Expenses"
        loading={!tags || !expenses}
        buttons={
          <>
            <Button
              leftIcon={<RiAddLine />}
              onClick={() => {
                setFormValues(undefined);
                expenseFormHandler.open();
              }}
            >
              New expense
            </Button>
            <Button variant="light" leftIcon={<RiSettings3Line />} onClick={tagListHandler.open}>
              Manage tags
            </Button>
          </>
        }
        filters={<ExpenseFilters tags={tags} filters={filters} updateFilter={updateFilter} />}
        withNumbersToggle
      />
      <MainLayout.Body ref={ref}>
        <ExpenseForm
          opened={expenseFormOpened}
          closeForm={expenseFormHandler.close}
          values={formValues}
          tags={tags}
        />
        <ListManager
          opened={tagListOpened}
          close={tagListHandler.close}
          label="tag"
          items={tags}
          addItem={addTag}
        />
        <Load in={!!(tags && expenses)}>
          <Table>
            <Table.Header>
              <th style={{ width: 0 }}>Tags</th>
              <th>Description</th>
              <th style={{ width: 0, textAlign: 'right' }}>Amount</th>
              <th style={{ width: 0, textAlign: 'center' }}>Date</th>
              <th style={{ width: 0 }} />
            </Table.Header>
            <Table.Body>
              {expenses?.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  tags={tags?.filter((tag) => expense.tagIds.includes(tag.id))}
                  visibleNumbers={visibleNumbers}
                  setFormValues={setFormValues}
                  openExpenseForm={expenseFormHandler.open}
                />
              ))}
            </Table.Body>
          </Table>
          {expenses?.length === expensesLimit && (
            <Group ref={ref} pt="xs" pb="lg" position="center">
              <Loader />
            </Group>
          )}
        </Load>
      </MainLayout.Body>
    </MainLayout>
  );
}
