import React from 'react'

const FormInformation = ({type, value}) => {
    let text = value
    if (value === 'incorrect_login_or_password')
        text = 'Неправильный логин или пароль'
    else if (value === 'user_exist')
        text = 'Пользователь уже существует'
    else if (value === 'empty_data')
        text = 'Не все данные заполнены'
    else if (value === 'account_created')
        text = 'Аккаунт успешно создан'
    return (
        value !== ''?
            <p className={type}>{text}</p>:
            null
    )
}

export default FormInformation
