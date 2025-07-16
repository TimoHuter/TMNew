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

    const updateTaskList = () => {
        setLoading(true);
        getTasks().then(res => {
            //console.log(res);
            setTasks(res);
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        });
    }

    const addTask2 = (task: Task) => {
        addTask(task).then(() => {
            updateTaskList();
        }).catch(err => {
            console.log(err);
        });
    };

    const editTask2 = (task: Task) => {
        editTask(task).then(() => {
            updateTaskList();
        }).catch(err => {
            console.log(err);
        });
    };


    const deleteTasks2 = (ids: string[]) => {
        deleteTasks(ids).then(() => {
            updateTaskList();
        }).catch(err => {
            console.log(err);
        });
    };

    useEffect(() => {
        //console.log("Initial Call");
        updateTaskList();
    }, []);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/*<Route path='*' element={<NotFound />} />*/}
                    <Route index element={
                        <TaskOverview
                            tasks={tasks}
                            isLoading={loading}
                            deleteTasks={deleteTasks2}
                        />
                    } />
                    <Route path="/edit/:id" element={
                        <TaskForm
                            getTask={getTask}
                            editTask={editTask2}
                            deleteTasks={deleteTasks2}
                        />
                    } />
                    <Route path="/add" element={
                        <TaskForm
                            addTask={addTask2}
                        />
                    } />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
