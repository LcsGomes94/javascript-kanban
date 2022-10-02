const input = document.getElementById('text-input')
const formContainer = document.getElementById('input-form')
const confirmaButton = document.querySelector('.confirma')
const cancelButton = document.querySelector('.cancela')
const addTask = document.querySelector('.add')

function toggleForm() {
    formContainer.classList.toggle('formContainerShow')
}

formContainer.onclick = evento => {
    if (evento.target.id === formContainer.id) toggleForm()
}

cancelButton.onclick = evento => {
    evento.preventDefault()
    toggleForm()
}

function setEvents() {
    const dragPlaces = document.querySelectorAll('[draggable]')
    const allTasks = document.querySelectorAll('[draggable] > .task')
    const deletes = document.querySelectorAll('[delete]')
    const edits = document.querySelectorAll('[edit]')

    deletes.forEach(deleteButton => {
        const task = deleteButton.parentElement.parentElement
        deleteButton.onclick = evento => {
            evento.preventDefault()
            if (deleteButton.classList.contains('canDelete')) task.parentElement.removeChild(task)
            else {
                deleteButton.classList.toggle('canDelete')
                setTimeout(() => {
                    deleteButton.classList.toggle('canDelete')
                }, 1000)
            }
        }
    })

    edits.forEach(editButton => {
        const task = editButton.parentElement.parentElement
        const p = task.firstElementChild
        editButton.onclick = evento => {
            evento.preventDefault()
            input.value = p.textContent
            toggleForm()
            input.focus()

            confirmaButton.onclick = evento => {
                evento.preventDefault()
                p.textContent = input.value
                toggleForm()
            }

            input.onkeyup = evento => {
                if (evento.key === 'Enter') {
                    p.textContent = input.value
                    toggleForm()
                }
                else if (evento.key === 'Escape') toggleForm()
            }
        }
    })

    allTasks.forEach((task, index) => {
        task.draggable = true
        task.id = `task-${index}`
        task.ondragstart = evento => {
            evento.dataTransfer.setData('item-id', evento.target.id)
        }
    })

    dragPlaces.forEach(dragPlace => {
        dragPlace.ondragover = evento => {
            evento.preventDefault()
        }

        dragPlace.ondrop = evento => {
            const id = evento.dataTransfer.getData('item-id')
            const task = document.getElementById(id)
            try {
                if (evento.target === todoField) dragPlace.insertBefore(task, todoField.lastElementChild)
                else if (evento.target.classList.contains('task')) dragPlace.insertBefore(task, evento.target)
                else if (evento.target.parentElement.classList.contains('task')) dragPlace.insertBefore(task, evento.target.parentElement)
                else dragPlace.appendChild(task)
            }
            catch(e) {
                //
            }
        }
    })
}


const todoField = document.querySelector('[todo]')
function createNewTask(taskTexto) {
    const taskElement = document.createElement('div')
    const textoElement = document.createElement('p')
    const alterarElement = document.createElement('div')
    const linkEdit = document.createElement('a')
    const linkDelete = document.createElement('a')
    const imgEdit = document.createElement('img')
    const imgDelete = document.createElement('img')

    linkEdit.setAttribute('href', '')
    linkEdit.setAttribute('edit', '')
    linkDelete.setAttribute('href', '')
    linkDelete.setAttribute('delete', '')
    imgEdit.setAttribute('src', "/img/edit.png")
    imgEdit.setAttribute('height', '18px')
    imgDelete.setAttribute('src', "/img/delete.png")
    imgDelete.setAttribute('height', '18px')
    alterarElement.classList.add('alterar')
    textoElement.classList.add('texto')
    textoElement.textContent = taskTexto
    taskElement.classList.add('task')

    linkEdit.appendChild(imgEdit)
    linkDelete.appendChild(imgDelete)
    alterarElement.appendChild(linkEdit)
    alterarElement.appendChild(linkDelete)
    taskElement.appendChild(textoElement)
    taskElement.appendChild(alterarElement)

    todoField.insertBefore(taskElement, todoField.lastElementChild)
    setEvents()
}

addTask.onclick = evento => {
    evento.preventDefault()
    input.value = ''
    toggleForm()
    input.focus()
    confirmaButton.onclick = evento => {
        evento.preventDefault()
        createNewTask(input.value)
        toggleForm()
    }
    input.onkeyup = evento => {
        if (evento.key === 'Enter') {
            createNewTask(input.value)
            toggleForm()
        }
        else if (evento.key === 'Escape') toggleForm()
    }
}

setEvents()