async function loadBoard() {
  const res = await fetch("/api");
  const data = await res.json();

  for (const col in data) {
    const list = document.getElementById(col);
    list.innerHTML = "";
    data[col].forEach(task => {
      const div = document.createElement("div");
      div.className = "task";
      div.draggable = true;
      div.textContent = task;
      div.addEventListener("dragstart", dragStart);
      list.appendChild(div);
    });
  }
}

async function saveBoard(board) {
  await fetch("/api", {
    method: "POST",
    body: JSON.stringify(board)
  });
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.textContent);
  e.dataTransfer.setData("origin", e.target.parentElement.id);
}

document.querySelectorAll(".column").forEach(col => {
  col.addEventListener("dragover", e => e.preventDefault());
  col.addEventListener("drop", async e => {
    e.preventDefault();
    const task = e.dataTransfer.getData("text/plain");
    const origin = e.dataTransfer.getData("origin");
    const target = col.dataset.column;

    const board = await (await fetch("/api")).json();

    board[origin] = board[origin].filter(t => t !== task);
    board[target].push(task);

    await saveBoard(board);
    loadBoard();
  });
});

document.getElementById("addTaskBtn").onclick = async () => {
  const input = document.getElementById("newTaskInput");
  const task = input.value.trim();
  if (!task) return;

  const board = await (await fetch("/api")).json();
  board.todo.push(task);

  await saveBoard(board);
  input.value = "";
  loadBoard();
};

loadBoard();
