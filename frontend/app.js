let books = [];

function loadData() {
    let saved = localStorage.getItem('books');
    if (saved) {
        books = JSON.parse(saved);
    }
}

function saveData() {
    localStorage.setItem('books', JSON.stringify(books));
}

function showMessage(text, type) {
    let msg = document.getElementById('notification');
    msg.textContent = text;
    msg.className = 'notification ' + type;
    msg.style.display = 'block';
    setTimeout(function() {
        msg.style.display = 'none';
    }, 2000);
}

function updateCounters() {
    let ns = books.filter(b => b.status === 'NS').length;
    let s = books.filter(b => b.status === 'S').length;
    let p = books.filter(b => b.status === 'P').length;
    let f = books.filter(b => b.status === 'F').length;
    
    document.getElementById('countNS').textContent = ns;
    document.getElementById('countS').textContent = s;
    document.getElementById('countP').textContent = p;
    document.getElementById('countF').textContent = f;
    document.getElementById('totalBooks').textContent = books.length;
}

function renderBoard() {
    let filter = document.getElementById('filterStatus').value;
    let sort = document.getElementById('sortBy').value;
    
    let filtered = books;
    if (filter !== 'all') {
        filtered = books.filter(b => b.status === filter);
    }
    
    if (sort === 'date') {
        filtered.sort((a, b) => b.id - a.id);
    } else if (sort === 'dateOld') {
        filtered.sort((a, b) => a.id - b.id);
    } else if (sort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'nameDesc') {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    document.getElementById('nsList').innerHTML = '';
    document.getElementById('sList').innerHTML = '';
    document.getElementById('pList').innerHTML = '';
    document.getElementById('fList').innerHTML = '';
    
    for (let i = 0; i < filtered.length; i++) {
        let book = filtered[i];
        let card = createCard(book);
        
        if (book.status === 'NS') {
            document.getElementById('nsList').appendChild(card);
        } else if (book.status === 'S') {
            document.getElementById('sList').appendChild(card);
        } else if (book.status === 'P') {
            document.getElementById('pList').appendChild(card);
        } else if (book.status === 'F') {
            document.getElementById('fList').appendChild(card);
        }
    }
    
    updateCounters();
}

function createCard(book) {
    let card = document.createElement('div');
    card.className = 'book-card';
    card.setAttribute('data-id', book.id);
    card.setAttribute('draggable', 'true');
    
    let statusName = '';
    if (book.status === 'NS') statusName = '📖 Не прочитана';
    if (book.status === 'S') statusName = '🎯 Взята';
    if (book.status === 'P') statusName = '⚙️ В процессе';
    if (book.status === 'F') statusName = '✅ Закончена';
    
    card.innerHTML = `
        <div class="book-title">${book.name}</div>
        <div class="book-meta">
            <span>${statusName}</span>
            <span class="book-date">${book.date}</span>
        </div>
        <div class="book-actions">
            <button class="edit-btn" onclick="editBook(${book.id})">✏️</button>
            <button class="delete-btn" onclick="deleteBook(${book.id})">✖</button>
        </div>
    `;
    
    card.addEventListener('dragstart', function(e) {
        draggedId = book.id;
        card.classList.add('dragging');
    });
    
    card.addEventListener('dragend', function() {
        card.classList.remove('dragging');
        draggedId = null;
    });
    
    return card;
}

let draggedId = null;

function setupDragDrop() {
    let columns = document.querySelectorAll('.column');
    
    for (let i = 0; i < columns.length; i++) {
        let col = columns[i];
        
        col.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        col.addEventListener('dragenter', function() {
            col.classList.add('drag-over');
        });
        
        col.addEventListener('dragleave', function() {
            col.classList.remove('drag-over');
        });
        
        col.addEventListener('drop', function(e) {
            col.classList.remove('drag-over');
            let newStatus = col.getAttribute('data-status');
            
            if (draggedId !== null) {
                for (let j = 0; j < books.length; j++) {
                    if (books[j].id === draggedId) {
                        books[j].status = newStatus;
                        break;
                    }
                }
                saveData();
                renderBoard();
                showMessage('Книга перемещена', 'info');
            }
        });
    }
}

function addBook() {
    let name = document.getElementById('bookName').value;
    let status = document.getElementById('bookStatus').value;
    
    if (name === '') {
        showMessage('Введите название книги', 'error');
        return;
    }
    
    let newId = 1;
    for (let i = 0; i < books.length; i++) {
        if (books[i].id >= newId) {
            newId = books[i].id + 1;
        }
    }
    
    let today = new Date();
    let dateStr = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
    
    let newBook = {
        id: newId,
        name: name,
        status: status,
        date: dateStr
    };
    
    books.push(newBook);
    saveData();
    renderBoard();
    showMessage('Книга добавлена', 'success');
    
    document.getElementById('bookForm').reset();
}

function deleteBook(id) {
    let bookName = '';
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === id) {
            bookName = books[i].name;
            break;
        }
    }
    
    if (confirm('Удалить книгу "' + bookName + '"?')) {
        let newBooks = [];
        for (let i = 0; i < books.length; i++) {
            if (books[i].id !== id) {
                newBooks.push(books[i]);
            }
        }
        books = newBooks;
        saveData();
        renderBoard();
        showMessage('Книга удалена', 'warning');
    }
}

function editBook(id) {
    let oldName = '';
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === id) {
            oldName = books[i].name;
            break;
        }
    }
    
    let newName = prompt('Редактировать книгу:', oldName);
    if (newName && newName.trim() !== '') {
        for (let i = 0; i < books.length; i++) {
            if (books[i].id === id) {
                books[i].name = newName.trim();
                break;
            }
        }
        saveData();
        renderBoard();
        showMessage('Книга изменена', 'success');
    }
}

loadData();
renderBoard();
setupDragDrop();

document.getElementById('bookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addBook();
});

document.getElementById('filterStatus').addEventListener('change', function() {
    renderBoard();
});

document.getElementById('sortBy').addEventListener('change', function() {
    renderBoard();
});