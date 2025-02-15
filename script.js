document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const prioritySelect = document.getElementById("priority-select");

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (taskText === "") return;

        const li = document.createElement("li");
        li.textContent = taskText;
        li.classList.add(priority);
        li.draggable = true; // Make it draggable
        li.dataset.priority = priority; // Store priority info

        // Drag events
        li.addEventListener("dragstart", handleDragStart);
        li.addEventListener("dragover", handleDragOver);
        li.addEventListener("drop", handleDrop);
        li.addEventListener("dragend", handleDragEnd);

        // Click to toggle completion
        li.addEventListener("click", () => {
            li.classList.toggle("completed");
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            li.remove();
        });

        li.appendChild(deleteBtn);
        
        insertTaskByPriority(li, priority);

        taskInput.value = "";
    }

    function insertTaskByPriority(taskElement, priority) {
        let tasks = Array.from(taskList.children);
        let index = tasks.findIndex(task => {
            return (priority === "high" && !task.classList.contains("high")) ||
                   (priority === "medium" && task.classList.contains("low"));
        });

        if (index === -1) {
            taskList.appendChild(taskElement);
        } else {
            taskList.insertBefore(taskElement, tasks[index]);
        }
    }

    // Drag & Drop Functions
    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = this;
        this.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
    }

    function handleDragOver(e) {
        e.preventDefault();
        const draggingOverItem = this;

        if (draggedItem !== draggingOverItem && draggedItem.dataset.priority === draggingOverItem.dataset.priority) {
            let items = Array.from(taskList.children);
            let draggedIndex = items.indexOf(draggedItem);
            let overIndex = items.indexOf(draggingOverItem);

            if (draggedIndex < overIndex) {
                taskList.insertBefore(draggedItem, draggingOverItem.nextSibling);
            } else {
                taskList.insertBefore(draggedItem, draggingOverItem);
            }
        }
    }

    function handleDrop(e) {
        e.preventDefault();
    }

    function handleDragEnd() {
        this.classList.remove("dragging");
        draggedItem = null;
    }

    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });
});
