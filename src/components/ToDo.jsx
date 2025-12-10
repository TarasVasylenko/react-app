import { useState, useEffect } from 'react'

// Конфігурація API
const API_URL = 'https://kxqbxxxdg8.execute-api.eu-central-1.amazonaws.com/prod/todos'

// Об'єкт Todo: { id, content, createdAt, (можливо, updatedAt) }

function ToDo() {
    // Змінюємо початковий стан на порожній масив об'єктів
    const [todos, setTodos] = useState([])
    const [newTodoContent, setNewTodoContent] = useState('') // Назва змінної для ясності
    const [editingTodo, setEditingTodo] = useState(null) // Об'єкт todo, який редагується
    const [editedContent, setEditedContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null) // Для обробки помилок

    // Допоміжна функція для Fetch-запитів
    const apiCall = async (endpoint, method, data = null) => {
        const headers = {
            'Content-Type': 'application/json',
            // Якщо використовуєте токени авторизації, додайте їх тут
        }

        const config = {
            method: method,
            headers: headers,
            body: data ? JSON.stringify(data) : null,
        }

        try {
            setLoading(true)
            setError(null)
            const response = await fetch(endpoint, config)
            const jsonResponse = await response.json()
            setLoading(false)

            if (!response.ok) {
                // Викидаємо помилку з API-відповіді
                throw new Error(jsonResponse.message || `HTTP error! status: ${response.status}`)
            }

            return jsonResponse
        } catch (err) {
            setLoading(false)
            setError(err.message)
            console.error(`API ${method} error:`, err)
            throw err // Перекидаємо помилку для обробки у викликаючій функції
        }
    }


    // 1. ОТРИМАННЯ СПИСКУ (GET)
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                // Припускаємо, що GET /todos повертає масив об'єктів {id, content, createdAt}
                const data = await apiCall(API_URL, 'GET')
                // data може бути об'єктом, який містить список, наприклад { items: [...] }
                // Ми припускаємо, що Lambdа повертає { todos: [...] } або сам масив
                setTodos(data.todos || data)
            } catch (e) {
                // Помилка вже оброблена в apiCall
            }
        }
        fetchTodos()
    }, [])


    // 2. СТВОРЕННЯ (POST)
    const handleAddTodo = async () => {
        if (!newTodoContent.trim()) return

        // Потрібно надіслати лише вміст. ID та createdAt генеруються на бекенді.
        const payload = { content: newTodoContent.trim() }

        try {
            // Припускаємо, що POST повертає створений об'єкт Todo
            const newTodo = await apiCall(API_URL, 'POST', payload)
            setTodos((prev) => [...prev, newTodo])
            setNewTodoContent('')
        } catch (e) {
            // ...
        }
    }

    const handleEditTodo = (todo) => {
        setEditingTodo(todo) // Зберігаємо весь об'єкт, а не лише індекс
        setEditedContent(todo.content)
    }

    // 3. ОНОВЛЕННЯ (PUT)
    const handleSaveTodo = async () => {
        if (!editedContent.trim() || !editingTodo) return

        // НАДІСЛАННЯ СКЛАДЕНОГО КЛЮЧА (id та createdAt) разом з оновленим content
        const payload = {
            id: editingTodo.id,
            createdAt: editingTodo.createdAt,
            content: editedContent.trim(),
        }

        try {
            // Припускаємо, що PUT повертає оновлений об'єкт Todo
            // Викликаємо PUT на базовий ресурс, де Lambda обробляє оновлення
            const updatedTodo = await apiCall(API_URL, 'PUT', payload)

            setTodos((prev) =>
                prev.map(t =>
                    t.id === editingTodo.id && t.createdAt === editingTodo.createdAt ? updatedTodo : t
                )
            )
            setEditingTodo(null)
            setEditedContent('')
        } catch (e) {
            // ...
        }
    }

    const handleCancelEdit = () => {
        setEditingTodo(null)
        setEditedContent('')
    }

    // 4. ВИДАЛЕННЯ (DELETE)
    const handleDeleteTodo = async (todoToDelete) => {
        // Ми використовуємо DELETE з тілом запиту, як у ваших Lambda-х.
        // НАДІСЛАННЯ СКЛАДЕНОГО КЛЮЧА
        const payload = {
            id: todoToDelete.id,
            createdAt: todoToDelete.createdAt,
        }

        try {
            await apiCall(API_URL, 'DELETE', payload)

            // Фільтруємо масив, використовуючи ключі
            setTodos((prev) =>
                prev.filter(t =>
                    t.id !== todoToDelete.id || t.createdAt !== todoToDelete.createdAt
                )
            )
        } catch (e) {
            // ...
        }
    }

    // Відображення елемента, який редагується
    const isEditing = (todo) => editingTodo?.id === todo.id && editingTodo?.createdAt === todo.createdAt;


    // --- РЕНДЕР ---
    return (
        <div>
            <h2>ToDo List</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Показати помилку */}

            <textarea
                value={newTodoContent}
                onChange={(e) => setNewTodoContent(e.target.value)}
                placeholder="Write your todo here..."
                rows="4"
                style={{ width: '100%', marginBottom: '1rem' }}
            />
            <button onClick={handleAddTodo} style={{ marginBottom: '1rem' }} disabled={loading}>
                Add ToDo
            </button>
            <ul>
                {todos.map((todo) => (
                    <li key={`${todo.id}-${todo.createdAt}`} style={{ marginBottom: '0.5rem' }}>
                        {isEditing(todo) ? (
                            <>
                                <input
                                    type="text"
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                <button onClick={handleSaveTodo} style={{ marginRight: '0.5rem' }} disabled={loading}>
                                    Save
                                </button>
                                <button onClick={handleCancelEdit} disabled={loading}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                {todo.content} {/* Виводимо вміст */}
                                <button
                                    onClick={() => handleEditTodo(todo)}
                                    style={{ marginLeft: '0.5rem' }}
                                    disabled={loading}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteTodo(todo)}
                                    style={{ marginLeft: '0.5rem', color: 'red' }}
                                    disabled={loading}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ToDo
