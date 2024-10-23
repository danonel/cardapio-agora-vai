
CREATE TABLE tables (
    id TEXT PRIMARY KEY,    -- Store UUID as TEXT
    members TEXT            -- Store JSON array as TEXT
);

CREATE TABLE items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    imageUrl TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL
);


CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'canceled', 'preparing', 'done')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);

CREATE TABLE users (
    id TEXT PRIMARY KEY,  
    username TEXT NOT NULL UNIQUE, -- browser session id
    role TEXT NOT NULL CHECK(role IN ('customer', 'kitchen'))  
);