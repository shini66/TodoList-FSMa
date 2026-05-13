let tasks = [];
let currentFilter = 'all';

const inputTask = document.getElementById('task');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const resume = document.getElementById('resume');

setFilter(currentFilter);
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

function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);
    renderTasks();
    toastAlert('Tarea actualizada correctamente', 'success');
}

function deleteTask(id) {
    alertConfirm(
        '¿Estás seguro?',
        'Esta acción no se puede deshacer',
        'Sí, eliminar',
        'No, cancelar',
        () => {
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
            toastAlert('Tarea eliminada correctamente', 'success');
        }
    );
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList = 'filter-btn text-xs px-3 py-1.5 rounded-full border border-stone-200 text-stone-400 transition-all';
    });
    const btn = document.getElementById(`f-${filter}`);
    if (btn) {
        btn.classList = `filter-btn text-xs px-3 py-1.5 rounded-full border bg-[#1D9E75] text-white border-[#1D9E75] transition-all`;
    } else {
        console.warn(`Botón de filtro no encontrado: f-${filter}`);
    }
    renderTasks();
}