let form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let submitter = event.submitter.id;
    let action_url = event.submitter.formAction;

    let login = document.getElementById('login').value;
    let password = document.getElementById('password').value;
    fetch(action_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"login": login, "password": password}),
        redirect: "follow"
    })
     .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
        else if (response.status == 200)
            return response.json();
     })
     .then(json => {
        if (json != undefined) {
            if (json['ok'] == false)
                display_info(json['error'], 'error-text');
            else if (json['ok'] == true && submitter == 'button_create_new_account')
                display_info('account-created', 'success-text');
        }
     });
});

function display_info(info, type) {
    let info_element = document.getElementById('info');

    if (info_element == undefined) {
        info_element = document.createElement('p');
        info_element.id = 'info';

        document.getElementsByTagName('main')[0].appendChild(info_element);
    }

    if (info == 'incorrect_login_or_password')
        info_element.textContent = 'Неправильный логин или пароль';
    else if (info == 'user_exist')
        info_element.textContent = 'Пользователь с таким логином уже существует';
    else if (info == 'account-created')
        info_element.textContent = 'Аккаунт успешно создан';

    info_element.className = type;
}
