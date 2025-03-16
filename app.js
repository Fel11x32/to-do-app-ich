window.addEventListener('load', () => {
	// Загружаем задачи из localStorage или инициализируем пустой массив
	let todos = JSON.parse(localStorage.getItem('todos')) || []

	// Глобальное состояние фильтра и поискового запроса
	let filterState = 'all' // Возможные значения: 'all', 'active', 'done'
	let searchQuery = ''

	// Получаем ссылки на элементы DOM
	const createForm = document.querySelector('#create-form')
	const todoList = document.querySelector('#todo-list')
	const searchInput = document.querySelector('.search-field__input')
	const headerMain = document.querySelector('.header-group .main-header')
	const floatButton = document.querySelector('.float-button')

	// Получаем ссылки на кнопки фильтрации
	const filterAllButton = document.querySelector('#filter-all')
	const filterActiveButton = document.querySelector('#filter-active')
	const filterDoneButton = document.querySelector('#filter-done')

	// Устанавливаем текущую дату в заголовок
	headerMain.textContent = formatDate(new Date())

	// Обработка отправки формы для добавления новой задачи
	createForm.addEventListener('submit', e => {
		e.preventDefault()
		const description = e.target.elements.description.value.trim()
		let startDate = e.target.elements.startDate.value // поле не обязательно
		if (!description) return
		// Если дата не указана, выставляем текущую дату
		if (!startDate) {
			startDate = new Date().toISOString()
		}

		// Создаём объект задачи с уникальным идентификатором
		const todo = {
			id: new Date().getTime().toString(),
			description: description,
			startDate: startDate,
			done: false,
		}

		todos.push(todo)
		localStorage.setItem('todos', JSON.stringify(todos))
		e.target.reset()
		DisplayTodos()
	})

	// Фильтрация по поисковому запросу
	searchInput.addEventListener('input', e => {
		searchQuery = e.target.value.toLowerCase()
		DisplayTodos()
	})

	// Плавающая кнопка для скролла к форме создания задачи
	floatButton.addEventListener('click', () => {
		createForm.scrollIntoView({ behavior: 'smooth' })
	})

	// Обработчики событий для кнопок фильтрации
	filterAllButton.addEventListener('click', () => {
		filterState = 'all'
		filterAllButton.classList.add('split-button__button--active')
		filterActiveButton.classList.remove('split-button__button--active')
		filterDoneButton.classList.remove('split-button__button--active')
		DisplayTodos()
	})

	filterActiveButton.addEventListener('click', () => {
		filterState = 'active'
		filterActiveButton.classList.add('split-button__button--active')
		filterAllButton.classList.remove('split-button__button--active')
		filterDoneButton.classList.remove('split-button__button--active')
		DisplayTodos()
	})

	filterDoneButton.addEventListener('click', () => {
		filterState = 'done'
		filterDoneButton.classList.add('split-button__button--active')
		filterActiveButton.classList.remove('split-button__button--active')
		filterAllButton.classList.remove('split-button__button--active')
		DisplayTodos()
	})

	// Функция для отображения списка задач с требуемой структурой
	function DisplayTodos() {
		todoList.innerHTML = ''

		// Фильтрация задач по поисковому запросу и состоянию
		const filteredTodos = todos.filter(todo => {
			if (
				searchQuery &&
				!todo.description.toLowerCase().includes(searchQuery)
			) {
				return false
			}
			if (filterState === 'active' && todo.done) return false
			if (filterState === 'done' && !todo.done) return false
			return true
		})

		filteredTodos.forEach(todo => {
			const id = todo.id
			const startDateFormatted = formatDate(new Date(todo.startDate))

			// Создаем основной элемент <li class="todo-block">
			const li = document.createElement('li')
			li.className = 'todo-block'

			// Создаем элемент <label class="checkbox" for="{id}">
			const label = document.createElement('label')
			label.className = 'checkbox'
			label.setAttribute('for', id)

			// Создаем элемент <input type="checkbox" name="{id}" id="{id}">
			const input = document.createElement('input')
			input.type = 'checkbox'
			input.name = id
			input.id = id
			input.checked = todo.done
			// Обработчик переключения состояния задачи
			input.addEventListener('change', e => {
				todo.done = e.target.checked
				localStorage.setItem('todos', JSON.stringify(todos))
				DisplayTodos()
			})
			label.appendChild(input)

			// Создаем элемент <span class="material-symbols-rounded checkbox__check-icon">check</span>
			const checkSpan = document.createElement('span')
			checkSpan.className = 'material-symbols-rounded checkbox__check-icon'
			checkSpan.textContent = 'check'
			label.appendChild(checkSpan)

			li.appendChild(label)

			// Создаем контейнер данных задачи <div class="todo-block__data">
			const dataDiv = document.createElement('div')
			dataDiv.className = 'todo-block__data'

			// Создаем элемент даты <p class="todo-block__date">{startDateFormatted}</p>
			const dateP = document.createElement('p')
			dateP.className = 'todo-block__date'
			dateP.textContent = startDateFormatted
			dataDiv.appendChild(dateP)

			// Создаем элемент заголовка задачи <h3 class="todo-block__title">{todo.description}</h3>
			const titleH3 = document.createElement('h3')
			titleH3.className = 'todo-block__title'
			titleH3.textContent = todo.description
			dataDiv.appendChild(titleH3)

			li.appendChild(dataDiv)

			// Создаем кнопку удаления <span class="material-symbols-rounded">close</span>
			const deleteSpan = document.createElement('span')
			deleteSpan.className = 'material-symbols-rounded'
			deleteSpan.textContent = 'close'
			// Обработчик удаления задачи
			deleteSpan.addEventListener('click', () => {
				todos = todos.filter(t => t.id !== id)
				localStorage.setItem('todos', JSON.stringify(todos))
				DisplayTodos()
			})
			li.appendChild(deleteSpan)

			todoList.appendChild(li)
		})
	}

	// Вспомогательная функция для форматирования даты
	function formatDate(date) {
		const options = { year: 'numeric', month: 'long', day: 'numeric' }
		return date.toLocaleDateString(undefined, options)
	}

	DisplayTodos()
})
