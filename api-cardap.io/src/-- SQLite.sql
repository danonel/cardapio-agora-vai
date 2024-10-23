CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);


INSERT INTO orders (table_id, status) VALUES 
('123', 'new'),  -- Order for table 1


INSERT INTO order_items (order_id, item_id, quantity) VALUES 
(1, 'e7c1e9b1-1e34-47f8-8ab0-32b64d5c8a1b', 2),  -- 2 Kimchi
(1, 'b1c8d65a-203f-4c44-8a91-44b8ff148dc2', 1),  -- 1 Bibimbap
(1, '27e4d93e-9a0e-464c-bd74-4b07b6b58b91', 1);  -- 1 Bulgogi