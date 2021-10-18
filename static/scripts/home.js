function logout() {
    fetch('/api/users/logout', {method: 'POST', redirect: 'follow'})
     .then(response => {
        if (response.redirected)
            window.location.href = response.url;
     });
}

function show_new_task_form() {
    document.getElementById('new_task').showModal();
}

document.getElementById('close').addEventListener('click', (event) => {
    close_dialog();
});

document.getElementById('new_task_form').addEventListener('submit', (event) => {
    event.preventDefault();
    let action_url = event.path[0]['action'];
    let task_id = document.getElementById('new_task_form').dataset.id;
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    fetch(action_url, {
        method: 'post',
        body: JSON.stringify({
            "id": task_id,
            "title": title,
            "description": description
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
     .then(response => {
        if (response.status == 200)
            return response.json();
     })
     .then(json => {
            let unchecked_tasks_container = document.getElementById('unchecked_tasks');
            unchecked_tasks_container.appendChild(create_new_task(json['id'], title));
         }
     });
     close_dialog();
});

function create_new_task(id, title) {
    let row_container = document.createElement('div');
    row_container.classList.add('task');
    row_container.setAttribute('data-id', id);

    let checkbox = document.createElement('input');
    checkbox.onchange = changed_checkbox;
    checkbox.type = 'checkbox';
    checkbox.value = 'task';
    checkbox.checked = 0;

    let title_input = document.createElement('input');
    title_input.type = 'text';
    title_input.value = title;
    title_input.id = 'task-description-unchecked';
    title_input.name = 'task-description';
    title_input.ondblclick = show_all;
    title_input.required = true;

    let trash_icon = document.createElement('img');
    trash_icon.src = 'https://api.iconify.design/bx/bx-trash.svg?color=red&height=28';
    trash_icon.alt = 'trash-icon';

    row_container.appendChild(checkbox);
    row_container.appendChild(title_input);
    row_container.appendChild(trash_icon);

    return row_container;
}

function close_dialog() {
    let dialog_form = document.getElementById('new_task_form');
    dialog_form.removeAttribute('data-id');

    dialog_form.action = '/api/tasks/create-task';
    dialog_form.querySelector('button[type="submit"]').textContent = "Создать задачу";
    dialog_form.querySelector('button[type="submit"]').className = '';
    dialog_form.querySelector('input[type="text"]').value = '';
    dialog_form.querySelector('textarea').value = '';


    document.getElementById('new_task').close("Task create cancelled");
}

function delete_task() {
    let task_element = event.target.parentElement;
    fetch('/api/tasks/delete-task', {
        method: "post",
        body: JSON.stringify({"id": task_element.dataset.id}),
        headers: {"Content-Type": "application/json"}
    })
     .then(response => {
        if (response.status == 200) {
            task_element.remove();
        }
     });
}

function changed_checkbox() {
    let checkbox_element = event.srcElement;
    let task_element = checkbox_element.parentElement;

    fetch('/api/tasks/update-task', {
        method: "post",
        body: JSON.stringify({
            "id": task_element.dataset.id,
            "status": checkbox_element.checked
        }),
        headers: {"Content-Type": "application/json"}
    })
     .then(response => {
        if (response.status == 200) {
            task_element.remove();
            if (checkbox_element.checked)
                document.getElementById('checked_tasks').appendChild(task_element);
            else
                document.getElementById('unchecked_tasks').appendChild(task_element);
        }
     });
}

function show_all() {
    let title_input = event.srcElement;
    let task_element = title_input.parentElement;
    window.location.href = `/tasks/${task_element.dataset.id}`;
}
