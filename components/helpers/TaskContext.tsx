import React, { createContext, useContext, useReducer } from 'react';
export type ErDeContextType = {
  state?: { tasks: any[]; };
  dispatch?: React.Dispatch<{ type: any; payload: any; }>;
};
const TaskContext = createContext<ErDeContextType>({ state: { tasks: [] } });

const initialState = {
  tasks: [],
};

const taskReducer = (state: { tasks: any[]; }, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);