# Architecture Documentation

## System Overview

The Forge 2 Kanban Board is a full-stack web application built with Laravel 13 (backend) and React 19 (frontend). It implements a Trello-style project management interface with a three-tier data hierarchy: **Board → List → Card**.

```
┌───────────────────────────────────────────────────────┐
│                     React Frontend                    │
│  ┌─────────────────────────────────────────────────┐  │
│  │  App.jsx (Single-file SPA)                      │  │
│  │  - Board selector (multi-board support)         │  │
│  │  - 3-column layout (To Do / Doing / Done)       │  │
│  │  - Card creation, editing, deletion             │  │
│  │  - HTML5 drag-and-drop between columns          │  │
│  │  - Search, stats dashboard                      │  │
│  └─────────────────────────────────────────────────┘  │
│                          │                            │
│              Vite Proxy (/api → :8000)                │
└──────────────────────────┼────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                   Laravel Backend                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  KanbanController                               │   │
│  │  - index()    : Board::with('lists.cards')      │   │
│  │  - storeBoard() : Create board + default lists  │   │
│  │  - store()    : Create card (validated)         │   │
│  │  - update()   : Update card (validated)         │   │
│  │  - destroy()  : Delete card                     │   │
│  │  - move()     : Move card to different list     │   │
│  │  - updateBoard() : Rename board                 │   │
│  │  - destroyBoard() : Cascade delete board        │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Eloquent Models                                │   │
│  │  Board ──→ BoardList ──→ Card                   │   │
│  │  (HasMany)  (HasMany)    (BelongsTo)            │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────────┼─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                     SQLite Database                    │
│  ┌──────────┐    ┌─────────────┐    ┌──────────────┐   │
│  │  boards  │───→│ board_lists │───→│    cards     │   │
│  │  id, name│    │ id, board_id│    │ id, board_   │   │
│  │          │    │ name, pos   │    │ list_id,     │   │
│  │          │    │             │    │ title, etc   │   │
│  └──────────┘    └─────────────┘    └──────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Models

#### Board (`app/Models/Board.php`)
```php
class Board extends Model
{
    protected $fillable = ['name'];

    public function lists()
    {
        return $this->hasMany(BoardList::class);
    }
}
```

#### BoardList (`app/Models/BoardList.php`)
```php
class BoardList extends Model
{
    protected $fillable = ['board_id', 'name', 'position'];

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }
}
```

#### Card (`app/Models/Card.php`)
```php
class Card extends Model
{
    protected $fillable = [
        'board_list_id', 'title', 'description',
        'label', 'assignee', 'due_date'
    ];

    public function list()
    {
        return $this->belongsTo(BoardList::class);
    }

    public function board()
    {
        return $this->belongsToThrough(Board::class, BoardList::class);
    }
}
```

### Controller (`app/Http/Controllers/Api/KanbanController.php`)

Single controller handling all operations with validation:

| Method | Function | Validation |
|--------|----------|------------|
| `GET /api/boards` | `index()` | None — returns all boards with lists.cards |
| `POST /api/boards` | `storeBoard()` | `name: required\|string\|max:255` |
| `PUT /api/boards/{id}` | `updateBoard()` | `name: sometimes\|string\|max:255` |
| `DELETE /api/boards/{id}` | `destroyBoard()` | None — cascade delete |
| `POST /api/cards` | `store()` | `board_list_id: required\|exists:board_lists,id`, `title: required\|string\|max:255`, `description/label/assignee/due_date: nullable` |
| `PUT /api/cards/{id}` | `update()` | Same fields with `sometimes` |
| `DELETE /api/cards/{id}` | `destroy()` | None |
| `PUT /api/cards/{id}/move` | `move()` | `board_list_id: required\|exists:board_lists,id` |

### Routes (`routes/api.php`)
```php
Route::get('/boards', [KanbanController::class, 'index']);
Route::post('/boards', [KanbanController::class, 'storeBoard']);
Route::put('/boards/{id}', [KanbanController::class, 'updateBoard']);
Route::delete('/boards/{id}', [KanbanController::class, 'destroyBoard']);
Route::get('/seed', [KanbanController::class, 'seed']);

Route::post('/cards', [KanbanController::class, 'store']);
Route::put('/cards/{id}', [KanbanController::class, 'update']);
Route::delete('/cards/{id}', [KanbanController::class, 'destroy']);
Route::put('/cards/{id}/move', [KanbanController::class, 'move']);
```

---

## Frontend Architecture

### Single-File Application (`src/App.jsx`)

All components and logic in one file:

```
App (root)
├── State: boards, selectedBoard, inputs, editCard, dragCard, loading, error
├── API helper: api() function with error handling
├── Board CRUD: addBoard(), deleteBoard()
├── Card CRUD: addCard(), deleteCard(), saveEdit()
├── Drag & Drop: handleDragStart(), handleDrop()
├── Search: filterCards()
├── Stats: totalTasks, completed, totalLists, overdue
│
├── Card (component)
│   ├── Tag badge (label)
│   ├── Title, description
│   ├── Assignee, due date with overdue indicator
│   └── Edit/Delete buttons
│
└── EditModal (component)
    ├── Title, tag, description inputs
    ├── Date picker for due_date
    ├── Assignee input
    └── Save/Cancel buttons
```

### State Flow

```
mount → fetchBoards() → setBoards(data) → setSelectedBoard(first board)
                                                      ↓
user creates board → POST /api/boards → setBoards([...prev, newBoard])
                                          ↓
user adds card → POST /api/cards → fetchBoards() → re-render
```

### Key Design Decisions

1. **No external state management** — React `useState` is sufficient for this scale
2. **Stale state handling** — `addCard()` and `handleDrop()` refetch from API if state is stale
3. **Client-side search** — Filtering happens on already-loaded data (no API round-trip)
4. **HTML5 Drag & Drop** — Native browser API, no library needed for simple column-to-column moves

---

## Database Schema

### Migrations

| File | Purpose |
|------|---------|
| `2026_06_21_102706_create_boards_table.php` | Creates `boards` (id, name, timestamps) |
| `2026_06_21_102706_create_board_lists_table.php` | Creates `board_lists` (id, board_id FK, name, position, timestamps) |
| `2026_06_21_102708_create_cards_table.php` | Creates `cards` (id, board_list_id FK, title, description, label, assignee, due_date, timestamps) |
| `2026_06_24_add_board_id_to_cards_table.php` | Adds nullable `board_id` FK to `cards` (direct board reference) |

### Foreign Keys

| From | To | On Delete |
|------|-----|-----------|
| `board_lists.board_id` | `boards.id` | CASCADE |
| `cards.board_list_id` | `board_lists.id` | CASCADE |
| `cards.board_id` | `boards.id` | CASCADE (nullable) |

---

## API Contract

### GET /api/boards
Returns all boards with nested lists and cards.

```json
[
  {
    "id": 1,
    "name": "Board Name",
    "created_at": "2026-06-24T20:33:15.000000Z",
    "updated_at": "2026-06-24T20:33:15.000000Z",
    "lists": [
      {
        "id": 1,
        "board_id": 1,
        "name": "To Do",
        "position": 1,
        "created_at": "...",
        "updated_at": "...",
        "cards": [
          {
            "id": 1,
            "board_list_id": 1,
            "title": "Card Title",
            "description": "Description",
            "label": "Backend",
            "assignee": "Shreya",
            "due_date": "2026-12-31",
            "board_id": null,
            "created_at": "...",
            "updated_at": "..."
          }
        ]
      }
    ]
  }
]
```

### POST /api/cards
Creates a card in the specified list.

```json
// Request
{"board_list_id": 1, "title": "New Card", "label": "Tag", "assignee": "Name", "due_date": "2026-12-31"}

// Response (201)
{
  "id": 2,
  "board_list_id": 1,
  "title": "New Card",
  "label": "Tag",
  "assignee": "Name",
  "due_date": "2026-12-31",
  "board_id": null
}
```

### PUT /api/cards/{id}/move
Moves a card to a different list.

```json
// Request
{"board_list_id": 3}

// Response
{
  "id": 1,
  "board_list_id": 3,
  "title": "Card Title",
  ...
}
```

---

## Environment Configuration

### Backend (.env)
```
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=sqlite
# Database path: database/database.sqlite

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

### Frontend (vite.config.js)
```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

---

## Security Considerations

- **Input Validation**: All inputs validated via Laravel's `$request->validate()`
- **SQL Injection**: Protected by Eloquent ORM (parameterized queries)
- **Cascade Deletes**: Foreign keys ensure data integrity on deletion
- **No Authentication**: User model exists but no auth system implemented (future improvement)

---

## Performance Notes

- **Eager Loading**: `Board::with('lists.cards')` performs 3 queries total (boards, lists, cards) regardless of data size
- **Client-side Search**: No API call needed for filtering; operates on loaded state
- **Minimal Re-renders**: `fetchBoards()` called only after mutations, not on every keystroke
- **SQLite**: File-based, no network overhead, suitable for this scale
