let tasks = [];
let currentFilter = 'all';

const inputTask = document.getElementById('task');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const resume = document.getElementById('resume');

renderTasks();

function addTask() {
    const text = inputTask.value.trim();

    if(!text){
        toastAlert('El campo de tarea debe ser completado', 'error');
        return;
    }

    const newTask = {
        id: Date.now(),
        text,
        completed: false
    };
    tasks.push(newTask);
    inputTask.value = '';
    renderTasks();
    toastAlert('Tarea agregada correctamente', 'success');
}

function getTasksByFilter() {
    if(currentFilter === 'pending') return tasks.filter(task => !task.completed);
    if(currentFilter === 'completed') return tasks.filter(task => task.completed);
    return tasks;
}

function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = getTasksByFilter();

    filteredTasks.length === 0 ? emptyState.classList.remove('hidden') : emptyState.classList.add('hidden');

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.className = [
            'tarea-enter flex items-center gap-3 bg-white border border-stone-100',
            'rounded-xl px-4 py-3 transition-all',
            task.completed ? 'completada opacity-70' : '',
        ].join(' ');

        li.innerHTML = `<span>${task.text}</span>
            <div class="ml-auto flex items-center gap-2">
                <button onclick="toggleTask(${task.id})" class="text-sm text-brand-400">${task.completed ? 'Reabrir' : 'Completar'}</button>
                <button onclick="deleteTask(${task.id})" class="text-sm text-red-500">Eliminar</button>
            </div>`;

        taskList.appendChild(li);
    });

    updateResume();
}

function updateResume() {
    const completedCount = tasks.filter(task => task.completed).length;
    const pendingCount = tasks.length - completedCount;
    resume.textContent = `Tareas: ${tasks.length} | Completadas: ${completedCount} | Pendientes: ${pendingCount}`;
}