let tasks = [];
let currentFilter = "all";

/* =========================
   🔵 ELEMENTOS DEL DOM
========================= */
const inputTask = document.getElementById("task");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const resume = document.getElementById("resume");

/* =========================
   🟢 INICIALIZACIÓN (NEW)
   - carga de storage
   - render inicial
   - eventos globales
========================= */
loadTasks();
setFilter(currentFilter);
renderTasks();

/* Enter para agregar tarea (NEW UX) */
inputTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

/* =========================
   🟡 ADD TASK
========================= */
function addTask() {
  const text = inputTask.value.trim();

  if (!text) {
    toastAlert("El campo de tarea debe ser completado", "error");
    return;
  }

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
  };

  tasks.push(newTask);
  inputTask.value = "";

  saveTasks(); // NEW: persistencia
  renderTasks();

  toastAlert("Tarea agregada correctamente", "success");
}

/* =========================
   🟣 FILTROS
========================= */
function getTasksByFilter() {
  if (currentFilter === "pending") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

/* =========================
   🔴 RENDER OPTIMIZADO (NEW)
   - fragment para performance
   - DOM API en vez de innerHTML inseguro
   - event delegation
========================= */
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = getTasksByFilter();

  /* Empty state */
  if (filteredTasks.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  const fragment = document.createDocumentFragment();

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = [
      "task-card task-intro flex items-center gap-3 bg-white border border-stone-100",
      "rounded-xl px-4 py-3 transition-all",
      task.completed ? "completada opacity-70" : "",
    ].join(" ");

    /* texto seguro */
    const span = document.createElement("span");
    span.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "ml-auto flex items-center gap-2";

    /* botón toggle */
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.completed ? "Reabrir" : "Completar";
    toggleBtn.className = "text-sm text-brand-400";
    toggleBtn.dataset.action = "toggle";
    toggleBtn.dataset.id = task.id;

    /* botón delete */
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.className = "text-sm text-red-500";
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.id = task.id;

    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);

    fragment.appendChild(li);
  });

  taskList.appendChild(fragment);

  updateResume();
}

/* =========================
   🟤 EVENT DELEGATION (NEW)
   - reemplaza onclick inline
========================= */
taskList.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;

  if (action === "toggle") toggleTask(id);
  if (action === "delete") deleteTask(id);
});

/* =========================
   🔵 RESUMEN
========================= */
function updateResume() {
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  resume.textContent = `Tareas: ${tasks.length} | Completadas: ${completedCount} | Pendientes: ${pendingCount}`;
}

/* =========================
   🟠 TOGGLE TASK
========================= */
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  );

  saveTasks(); // NEW
  renderTasks();

  toastAlert("Tarea actualizada correctamente", "success");
}

/* =========================
   🔴 DELETE TASK
========================= */
function deleteTask(id) {
  alertConfirm(
    "¿Estás seguro?",
    "Esta acción no se puede deshacer",
    "Sí, eliminar",
    "No, cancelar",
    () => {
      // Animar el elemento antes de eliminar para UX más suave
      const delBtn = document.querySelector(
        `button[data-action="delete"][data-id="${id}"]`,
      );
      const node = delBtn ? delBtn.closest("li") : null;
      const cleanup = () => {
        tasks = tasks.filter((task) => task.id !== id);
        saveTasks();
        renderTasks();
        toastAlert("Tarea eliminada correctamente", "success");
      };

      if (node) {
        node.classList.add("removing");
        let handled = false;
        const onEnd = () => {
          if (handled) return;
          handled = true;
          cleanup();
        };
        node.addEventListener("animationend", onEnd, { once: true });
        // Fallback in case animationend doesn't fire (e.g., CSS not loaded)
        setTimeout(() => {
          if (!handled) {
            handled = true;
            cleanup();
          }
        }, 400);
      } else {
        cleanup();
      }
    },
  );
}

/* =========================
   🟢 FILTROS UI
========================= */
function setFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.className =
      "filter-btn text-xs px-3 py-1.5 rounded-full border border-stone-200 text-stone-400 transition-all";
  });

  const btn = document.getElementById(`f-${filter}`);

  if (btn) {
    btn.className =
      "filter-btn text-xs px-3 py-1.5 rounded-full border bg-[#1D9E75] text-white border-[#1D9E75] transition-all";
  }

  renderTasks();
}

/* =========================
   💾 LOCALSTORAGE (NEW)
   - persistencia de datos
========================= */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
}
