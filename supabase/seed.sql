-- Seed Categories
INSERT INTO categories (name, slug) VALUES
('Electronics', 'electronics'),
('Apparel', 'apparel'),
('Home & Living', 'home');

-- Function to generate random products
DO $$
DECLARE
    cat_id UUID;
    prod_id UUID;
    i INT;
    j INT;
BEGIN
    FOR cat_id IN SELECT id FROM categories LOOP
        FOR i IN 1..34 LOOP -- Approx 100 products total
            INSERT INTO products (name, description, price, category_id, created_at)
            VALUES (
                'Product ' || i || ' in ' || (SELECT name FROM categories WHERE id = cat_id),
                'This is a premium minimalist product description for product ' || i || '.',
                (random() * 500 + 10)::NUMERIC(10,2),
                cat_id,
                NOW() - (random() * interval '30 days')
            ) RETURNING id INTO prod_id;

            -- Add 3 images per product
            FOR j IN 1..3 LOOP
                INSERT INTO product_images (product_id, url, "order")
                VALUES (
                    prod_id,
                    'https://lnrgqxxdlfgrsmtojurd.supabase.co/storage/v1/object/public/products/placeholder-' || ((i+j) % 10) || '.webp',
                    j
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
