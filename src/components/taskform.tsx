import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { addDays, format } from "date-fns";
import '../index.css';
import { useNavigate, useLocation } from 'react-router-dom';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { Task } from './api/task.ts';

interface TaskFormProps {
    addTask?: (task: Task) => Promise<void>;

    editTask?: (task: Task) => Promise<void>;
    deleteTasks?: (uuid: string[]) => Promise<void[]>;
    getTask?: (uuid: string) => Promise<Task>;

    updateTaskList: () => void;
}


function TaskForm(props: TaskFormProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const [id, setId] = useState<string>("");
  const [uuid, setUuid] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<Date | undefined>(new Date());
  const [estimatedWorkload, setEstimatedWorkload] = useState<number>(0);
  const [currentWorkload, setCurrentWorkload] = useState<number>(0);
  const [state, setState] = useState<number>(0);

  //Der Einfachheit halber, damit im HTML nicht durchgehend die lange Abfrage geschrieben werden muss
  const [mode, setMode] = useState(-1);

  useEffect(() => {
    if (typeof props.addTask === "function") {
      setMode(0);
    } else if (
      typeof props.editTask === "function" &&
      typeof props.deleteTasks === "function" &&
      typeof props.getTask === "function"
    ) {
      if(typeof props.getTask === "function")
      {
        setLoading(true);
        props.getTask(getIdFromPath(location.pathname)).then(task => {
          if(task) {
            setId(task.id);
            setUuid(task.uuid);
            setTitle(task.title);
            setDescription(task.description);
            setDeadline(task.deadline);
            setEstimatedWorkload(task.estimatedWorkload);
            setCurrentWorkload(task.currentWorkload);
            setState(task.state);
            setMode(1);
          } else {
            console.log("Seite nicht gefunden");
            navigate('/'); //oder 404-Seite (hab keine)
          }
          setLoading(false);
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }, [location.pathname]);

  const getIdFromPath = (pathname: string): string => {
    const pathParts: string[] = pathname.split('/');

    return pathParts[pathParts.length - 1];
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Titel darf nicht leer sein!");
      return;
    }

    const task = {
      id: id,
      uuid: uuid,
      title: title,
      description: description,
      deadline: deadline,
      estimatedWorkload: estimatedWorkload,
      currentWorkload: currentWorkload,
      state: state
    }

    if (mode === 0) {
      acceptAdd(false, task);
    } else if (mode === 1 && task) {
      acceptEdit(task);
    }
  };

  const acceptAdd = (multiAdd: boolean, task: Task) => {
    if (typeof props.addTask === "function") {
      props.addTask(task).then(() => {
        props.updateTaskList();
      }).catch(err => {
        console.log(err);
      });
    }

    if (!multiAdd) {
      navigate('/');
    }
  };

  const acceptEdit = (task: Task) => {
    if (typeof props.editTask === "function") {
      props.editTask(task).then(() => {
        props.updateTaskList();
      }).catch(err => {
        console.log(err);
      });
    }
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleDelete = () => {
    if (typeof props.deleteTasks === "function" && id) {
      props.deleteTasks([id]).then(() => {
        props.updateTaskList();
      }).catch(err => {
        console.log(err);
      });
    }
    navigate('/');
  };

  const onChangeEstimatedWorkload = (event: ChangeEvent<HTMLInputElement>) => {
    setEstimatedWorkload(Number(event.target.value));
  };

  const onChangeCurrentWorkload = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentWorkload(Number(event.target.value));
  };

  return (
    <>
      {mode !== -1 && loading === false && (
        <form onSubmit={handleSubmit} className="container-item space-y-2 p-4 w-full">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="title">Title</Label>
            <Input type="text" id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </div>

          <div className="grid w-full gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea className="w-[24rem]" id="description" placeholder="Your description" value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[16rem] justify-start text-left font-normal",
                  !deadline && "text-muted-foreground"
                )}
              >
                {deadline ? format(deadline, "PPP") : <span>Select Deadline</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="flex w-auto flex-col space-y-2 p-2"
            >
              <Select
                onValueChange={(value) =>
                  setDeadline(addDays(new Date(), parseInt(value)))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Presets"/>
                </SelectTrigger>

                <SelectContent position="popper">
                  <SelectItem value="0">Today</SelectItem>
                  <SelectItem value="1">Tomorrow</SelectItem>
                  <SelectItem value="3">In 3 days</SelectItem>
                  <SelectItem value="7">In a week</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar mode="single" selected={deadline} onSelect={setDeadline}/>
              </div>
            </PopoverContent>
          </Popover>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="whest">Estimated Workload</Label>
            <Input type="number" id="whest" placeholder="Estimated Workload (h)" value={estimatedWorkload} onChange={onChangeEstimatedWorkload} />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="whcur">Current Workload</Label>
            <Input type="number" id="whcur" placeholder="Current Workload (h)" value={currentWorkload} onChange={onChangeCurrentWorkload}/>
          </div>

          <Select defaultValue={state.toString()} onValueChange={(value) => setState(parseInt(value))}>
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="0">Open</SelectItem>
              <SelectItem value="1">In Progress</SelectItem>
              {mode === 1 && (
                <>
                  <SelectItem value="2">Done</SelectItem>
                  <SelectItem value="3">Deprecated</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          <div>
            {mode === 0 && (
              <>
                <Button variant="secondary" type="submit" className="bg-blue-500">Add Task</Button>
                {/*<Button className="mx-2 bg-blue-500" variant="secondary" type="submit">Add multiple Tasks</Button>*/}
                <Button className="mx-2" variant="secondary" type="button" onClick={handleCancel}>Cancel</Button>
              </>
            )}
            {mode === 1 && (
              <>
                <Button variant="secondary" type="submit" className="bg-blue-500">Confirm Changes</Button>
                <Button className="mx-2" variant="secondary" type="button" onClick={handleCancel}>Cancel</Button>
                <Button variant="destructive" type="button" onClick={handleDelete}>Delete Task</Button>
              </>
            )}
          </div>
        </form>
      )}
      {loading === true && (
        <>
          <p>Load Data...</p>
        </>
      )}
    </>
  );
};

export default TaskForm;