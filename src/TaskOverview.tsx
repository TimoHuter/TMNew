import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';
import './index.css';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import type { Task } from './components/api/task.ts';

interface TaskOverview {
    tasks: Task[];
    isLoading: boolean;
    deleteTasks: (uuid: string[]) => Promise<void[]>;
    updateTaskList: () => void;
}


function TaskOverview(props: TaskOverview) {
    const navigate = useNavigate();
    
    const onEditTaskClick = (index: number) => {
        navigate(`/edit/${props.tasks[index].id}`);
    }

    const onAddTaskClick = () => {
        navigate('/add');
    }

    const getStateAsString = (state: number) => {
        switch(state) {
            case 3: { 
                return "Deprecated";
            } 
            case 2: { 
                return "Done";
            }
            case 1: { 
                return "In Progress";
            } 
            default: { 
                return "Open";
            } 
        }
    }

    const getFormattedDeadline = (deadline: Date |undefined) => {
        if (deadline && deadline !== undefined)
        {
            return format(deadline, "dd MMMM yyyy");
        }

        return "";
    }

    //TODO
    //Funktioniert nicht, da sich die Formate unterscheiden.
    const isReached = (deadline: Date | undefined) => {
        if (deadline)
        {
            const deadlineDate = new Date(deadline);
            const now = new Date();
            const nowUTC = new Date(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds(),
                now.getUTCMilliseconds()
            );

            // console.log(deadlineDate);
            // console.log(nowUTC);
            if (nowUTC < deadlineDate) {
                return true;
            }
        }
        return false;
    }

    const onClearTasksClicked = () => {
        let allTasks: string[] = [];
        for (const task of props.tasks) {
            allTasks = [...allTasks, task.id];
        }
        console.log(allTasks);

        props.deleteTasks(allTasks).then(() => {
            props.updateTaskList();
        }).catch(err => {
            console.log(err);
        });
        
    }

    const onDeleteTaskClicked = (index: number) => {
        props.deleteTasks([props.tasks[index].id]).then(() => {
            props.updateTaskList();
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <>
            {props.isLoading === false && (
                <div className="mx-2">
                    <Button className="bg-red-500 shadow-xl my-2" onClick={onClearTasksClicked}>
                        Clear Tasks
                    </Button>

                    <ul className="w-full">
                        {props.tasks.map((item, index) => (
                            <li key={index} className="shadow-xs">
                                <div className="mb-2 mt-1 p-2 border border-gray-500 rounded-md TaskGroup">

                                    <Label className="TaskOverviewLabel TaskOverviewTitle">
                                        {item.title}
                                    </Label>

                                    <Label className="TaskOverviewLabel TaskOverviewDescription">
                                        {item.description}
                                    </Label>

                                    <div className="TaskOverviewGroup gap-10">
                                        <Label className="w-full TaskOverviewLabel">
                                            Status: 

                                            <span className={cn("text-red-500", {
                                                "text-blue-500": item.state === 1,
                                                "text-green-500": item.state === 2,
                                                "text-gray-500": item.state === 3,
                                            })}>
                                                {getStateAsString(item.state)}
                                            </span>
                                        </Label>

                                        <Label className="w-full TaskOverviewLabel">
                                            Deadline: 

                                            <span className={cn("text-red-500", {
                                                "text-green-600": isReached(item.deadline) === true,
                                            })}>
                                                {getFormattedDeadline(item.deadline)}
                                            </span>
                                        </Label>

                                        <Label className="w-full TaskOverviewLabel">
                                            {`Estimated Workload: ${item.estimatedWorkload}h`}
                                        </Label>

                                        <Label className="w-full TaskOverviewLabel">
                                            {`Current Workload: ${item.currentWorkload}h`}
                                        </Label>
                                    </div>
                                

                                    <div className="BtnGroup mt-2">
                                        <Button className="shadow-md bg-orange-400" onClick={() => onEditTaskClick(index)}>
                                            Edit
                                        </Button>
                                        
                                        <Button className="shadow-md bg-gray-500 mx-3" onClick={() => onDeleteTaskClicked(index)}>
                                            Delete
                                        </Button>
                                    </div>

                                </div>
                            </li>
                        ))}
                    </ul>

                    <Button className="shadow-md bg-blue-500 my-2 mx-3" onClick={() => onAddTaskClick()}>
                        Add Task
                    </Button>
                </div>
            )}
            {props.isLoading === true && (
              <>
                <p>Load Data...</p>
              </>
            )}
        </>
    );
};

export default TaskOverview;