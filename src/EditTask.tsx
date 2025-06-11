import './index.css';
import TaskForm from './components/taskform.tsx';

import type { Task } from './App.tsx';

interface EditTask {
    editTask: (task: Task) => void
    deleteTask: (uuid: string) => void
    task: Task
}

function EditTask(props: EditTask) {
  return (
    <TaskForm editTask={props.editTask} deleteTask={props.deleteTask}/>
  );
};

export default EditTask;