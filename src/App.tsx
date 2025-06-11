import { useState, useEffect } from 'react';
import TaskOverview from './TaskOverview.tsx';
import TaskForm from './components/taskform.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import type { Task } from './components/api/task.ts';
import {
    getTasks,
    getTask,
    deleteTasks,
    addTask,
    editTask
} from './components/api/task.ts';


function App() {  
  const [loading, setLoading] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // console.log("Initial Call");
    updateTaskList();
    
  }, []);

  const updateTaskList = () => {
    setLoading(true);
    getTasks().then(res => {
      // console.log(res);
      setTasks(res);
      setLoading(false);
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*<Route path='*' element={<NotFound />} />*/}
          <Route index element={
            <TaskOverview
              tasks={tasks}
              isLoading={loading}
              deleteTasks={deleteTasks}
              updateTaskList={updateTaskList}
            />
          }/>
          <Route path="/edit/:id" element={
              <TaskForm
                getTask={getTask}
                editTask={editTask}
                deleteTasks={deleteTasks}
                updateTaskList={updateTaskList}
              />
            }/>
          <Route path="/add" element={
            <TaskForm
              addTask={addTask}
              updateTaskList={updateTaskList}
            />
          }/>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
