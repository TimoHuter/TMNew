export interface Task {
    id: string;
    //creationDate: string;
    title: string;
    description: string | undefined;
    deadline: Date | undefined;
    estimatedWorkload: number;
    currentWorkload: number;
    state: number;
}

//const API_URL: string = 'https://683ee97c1cd60dca33dd8abe.mockapi.io/tasks';
const API_URL: string = 'http://localhost:8888/index.php/users/1/tasks';

/*
function generateUUIDv4(): string {
    let uuid = '', i, random;
    for (i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-';
        } else if (i === 14) {
            uuid += '4'; //UUID version 4
        } else if (i === 19) {
            random = (Math.random() * 16) | 0;
            uuid += ((random & 0x3) | 0x8).toString(16); //variant 10xxxxxx
        } else {
            random = (Math.random() * 16) | 0;
            uuid += random.toString(16);
        }
    }
    console.log(uuid.length);
    return uuid;
}
*/

function getTasks(): Promise<Task[]> {
    return fetch(API_URL /*+ "?test=hallo&test2=moin"*/, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    }).then(res => res.json());
}

function getTask(id: string): Promise<Task> {
    return fetch(API_URL + "/" + id, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    }).then(res => res.json());
}

function deleteTask(id: string): Promise<any> {
    return fetch(API_URL + "/" + id, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
    }).then(res => res.json());
}

async function deleteTasks(ids: string[]): Promise<any[]> {
    //console.log(ids);

    for (const id of ids) {
        const res = await deleteTask(id);
    }

    return Promise.resolve([]);

    //return Promise.all(ids.map((id) => deleteTask(id)));
}

function addTask(task: Task): Promise<any> {
    return fetch(API_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },

        body: JSON.stringify(task),
    }).then(res => res.json());
}

function editTask(task: Task): Promise<any> {
    //update timestamp
    return fetch(API_URL + "/" + task.id, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },

        body: JSON.stringify(task),
    }).then(res => res.json());
}

export {
    getTasks,
    getTask,
    deleteTasks,
    addTask,
    editTask
}