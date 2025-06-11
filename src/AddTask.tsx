import './index.css';
import TaskForm from './components/taskform.tsx';

import type { Task } from './App.tsx';

interface AddTask {
    addTask: (task: Task) => void
}

function AddTask(props: AddTask) {
  return (
    <TaskForm addTask={props.addTask}/>
  );
};

export default AddTask;

