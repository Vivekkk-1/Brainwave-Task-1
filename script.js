const addBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const clearBtn = document.getElementById('clear-all');
const toggleModeBtn = document.getElementById('toggle-mode');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <span>${task.time} - ${task.desc}</span>
      <div class="task-controls">
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

addBtn.addEventListener('click', () => {
  const time = document.getElementById('task-time').value;
  const desc = document.getElementById('task-desc').value.trim();

  if (!time || !desc) {
    alert('Please enter both time and description!');
    return;
  }

  tasks.push({ time, desc, notified: false });
  saveTasks();
  renderTasks();

  document.getElementById('task-time').value = '';
  document.getElementById('task-desc').value = '';
});

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newDesc = prompt('Edit task description:', tasks[index].desc);
  if (newDesc !== null && newDesc.trim() !== '') {
    tasks[index].desc = newDesc.trim();
    tasks[index].notified = false;
    saveTasks();
    renderTasks();
  }
}

clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

toggleModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleModeBtn.innerText = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// ⏰ Alarm Check Every Minute
setInterval(() => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

  tasks.forEach((task, index) => {
    if (task.time === currentTime && !task.notified) {
      alert(`⏰ Reminder: ${task.desc}`);
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
      audio.play();
      tasks[index].notified = true;
      saveTasks();
    }
  });
}, 60000); // check every minute

// Initial render
renderTasks();
