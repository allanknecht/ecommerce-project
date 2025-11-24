require('dotenv').config();
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Database configuration
const client = new Client({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'mydatabase'
});

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Insert categories
    console.log('📦 Inserting categories...');
    const categories = [
      { id: 1, nome: 'Masculino' },
      { id: 2, nome: 'Feminino' },
      { id: 3, nome: 'Acessórios' }
    ];

    for (const category of categories) {
      await client.query(
        'INSERT INTO categorias (id, nome) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
        [category.id, category.nome]
      );
    }
    console.log('✅ Categories inserted');

    // Insert products
    console.log('🛍️  Inserting products...');
    const products = [
      // Men's products
      {
        nome: 'Basic White T-Shirt',
        preco: 59.90,
        descricao: 'Comfortable cotton t-shirt, perfect for everyday use.',
        categoria_id: 1,
        estoque: 50,
        imagem: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        tamanho: 'M'
      },
      {
        nome: 'Classic Blue Jeans',
        preco: 159.90,
        descricao: 'Premium denim jeans with classic fit.',
        categoria_id: 1,
        estoque: 30,
        imagem: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        tamanho: 'G'
      },
      {
        nome: 'Sports Running Shoes',
        preco: 299.90,
        descricao: 'Lightweight running shoes with cushioning technology.',
        categoria_id: 1,
        estoque: 25,
        imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        tamanho: '42'
      },
      {
        nome: 'Leather Jacket',
        preco: 599.90,
        descricao: 'Genuine leather jacket with modern design.',
        categoria_id: 1,
        estoque: 15,
        imagem: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
        tamanho: 'GG'
      },
      {
        nome: 'Polo Shirt',
        preco: 89.90,
        descricao: 'Classic polo shirt in various colors.',
        categoria_id: 1,
        estoque: 40,
        imagem: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=400&h=400&fit=crop',
        tamanho: 'P'
      },
      {
        nome: 'Cargo Pants',
        preco: 179.90,
        descricao: 'Practical cargo pants with multiple pockets.',
        categoria_id: 1,
        estoque: 20,
        imagem: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
        tamanho: 'M'
      },
      // Women's products
      {
        nome: 'Floral Summer Dress',
        preco: 149.90,
        descricao: 'Elegant floral dress perfect for summer.',
        categoria_id: 2,
        estoque: 35,
        imagem: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
        tamanho: 'P'
      },
      {
        nome: 'High Heels',
        preco: 249.90,
        descricao: 'Elegant high heels in various colors.',
        categoria_id: 2,
        estoque: 20,
        imagem: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
        tamanho: '38'
      },
      {
        nome: 'Designer Handbag',
        preco: 399.90,
        descricao: 'Stylish handbag with premium materials.',
        categoria_id: 2,
        estoque: 18,
        imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        tamanho: null
      },
      {
        nome: 'Skinny Jeans',
        preco: 129.90,
        descricao: 'Comfortable skinny jeans with stretch fabric.',
        categoria_id: 2,
        estoque: 45,
        imagem: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        tamanho: 'G'
      },
      {
        nome: 'Silk Blouse',
        preco: 179.90,
        descricao: 'Elegant silk blouse for special occasions.',
        categoria_id: 2,
        estoque: 22,
        imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
        tamanho: 'M'
      },
      {
        nome: 'Denim Jacket',
        preco: 199.90,
        descricao: 'Classic denim jacket with modern fit.',
        categoria_id: 2,
        estoque: 28,
        imagem: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
        tamanho: 'GG'
      },
      // Accessories
      {
        nome: 'Leather Belt',
        preco: 79.90,
        descricao: 'Genuine leather belt with adjustable buckle.',
        categoria_id: 3,
        estoque: 60,
        imagem: 'https://images.unsplash.com/photo-1600289031464-74d374b64991?w=400&h=400&fit=crop',
        tamanho: 'M'
      },
      {
        nome: 'Sunglasses',
        preco: 149.90,
        descricao: 'UV protection sunglasses with polarized lenses.',
        categoria_id: 3,
        estoque: 50,
        imagem: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        tamanho: null
      },
      {
        nome: 'Leather Wallet',
        preco: 89.90,
        descricao: 'Premium leather wallet with card slots.',
        categoria_id: 3,
        estoque: 40,
        imagem: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
        tamanho: null
      },
      {
        nome: 'Watch',
        preco: 499.90,
        descricao: 'Elegant wristwatch with stainless steel band.',
        categoria_id: 3,
        estoque: 25,
        imagem: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        tamanho: null
      },
      {
        nome: 'Baseball Cap',
        preco: 49.90,
        descricao: 'Adjustable baseball cap with logo embroidery.',
        categoria_id: 3,
        estoque: 70,
        imagem: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
        tamanho: null
      },
      {
        nome: 'Scarf',
        preco: 69.90,
        descricao: 'Warm wool scarf in various patterns.',
        categoria_id: 3,
        estoque: 55,
        imagem: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
        tamanho: null
      },
      // More products
      {
        nome: 'Hoodie',
        preco: 129.90,
        descricao: 'Comfortable hoodie with front pocket.',
        categoria_id: 1,
        estoque: 30,
        imagem: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
        tamanho: 'G'
      },
      {
        nome: 'Sneakers',
        preco: 219.90,
        descricao: 'Casual sneakers for everyday wear.',
        categoria_id: 1,
        estoque: 40,
        imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        tamanho: '40'
      },
      {
        nome: 'Blazer',
        preco: 349.90,
        descricao: 'Elegant blazer for formal occasions.',
        categoria_id: 2,
        estoque: 20,
        imagem: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
        tamanho: 'M'
      },
      {
        nome: 'Backpack',
        preco: 179.90,
        descricao: 'Durable backpack with multiple compartments.',
        categoria_id: 3,
        estoque: 35,
        imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        tamanho: null
      }
    ];

    let inserted = 0;
    for (const product of products) {
      const id = uuidv4();
      await client.query(
        `INSERT INTO produtos (id, nome, preco, descricao, categoria_id, estoque, imagem, tamanho)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, product.nome, product.preco, product.descricao, product.categoria_id, product.estoque, product.imagem, product.tamanho || null]
      );
      inserted++;
    }
    console.log(`✅ ${inserted} products inserted`);

    console.log('🎉 Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };

