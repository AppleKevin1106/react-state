// @flow

import React, { type Node, useEffect } from 'react';
import {
  TodosContainer,
  useTodos,
  useTodosCount,
  useTodosFiltered,
} from '../components/todos';

const RenderBlocker = React.memo<*>(({ children }: any) => children);

function TodosHeader({ children }: any) {
  useTodosCount();
  return children;
}

function TodosDoneCount({ children }: any) {
  const [{ data }] = useTodosFiltered({ isDone: true });
  return (
    <>
      <span>{data.length}</span>
      <br />
      {children}
    </>
  );
}

const scheduleAction = (todosState, { toggle }) => {
  const todo = todosState.data[0];
  if (todo) {
    setTimeout(() => toggle(todo.id));
  }
};

function TodosTrigger({ children, enabled }: any) {
  const [todosState, todosActions] = useTodos();
  useEffect(() => {
    if (enabled) scheduleAction(todosState, todosActions);
  });
  return children;
}

function TodosApp({ n, depth, children }: any) {
  return (
    <RenderBlocker>
      <TodosContainer scope={String(n)} n={n}>
        <span>Container {n}</span>
        <RenderBlocker>
          <TodosHeader>
            <RenderBlocker>
              <TodosTrigger enabled={depth < 2}>
                <RenderBlocker>
                  <TodosDoneCount>
                    <RenderBlocker>{children}</RenderBlocker>
                  </TodosDoneCount>
                </RenderBlocker>
              </TodosTrigger>
            </RenderBlocker>
          </TodosHeader>
        </RenderBlocker>
      </TodosContainer>
    </RenderBlocker>
  );
}

export function Tree({ n, depth = 0 }: any): Node {
  return (
    <RenderBlocker>
      <TodosApp n={n} depth={depth}>
        {Array.from({ length: n - 1 }).map((__, i) => (
          <Tree key={i + 1} n={i + 1} depth={depth + 1} />
        ))}
      </TodosApp>
    </RenderBlocker>
  );
}
