const client = require('../../db/database');
const { v4: uuidv4 } = require('uuid');

async function listar(page = 1, limit = 10, busca = null, categoria = null) {
  try {
    const offset = (page - 1) * limit;
    
    // Construir condições WHERE dinamicamente
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;
    
    if (busca) {
      whereConditions.push(`(p.nome ILIKE $${paramIndex} OR p.descricao ILIKE $${paramIndex})`);
      queryParams.push(`%${busca}%`);
      paramIndex++;
    }
    
    if (categoria) {
      whereConditions.push(`c.nome ILIKE $${paramIndex}`);
      queryParams.push(`%${categoria}%`);
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';
    
    // Buscar produtos com paginação, filtros e nome da categoria
    const produtosQuery = `
      SELECT p.id, p.nome, p.preco, p.descricao, p.categoria_id, 
             c.nome as categoria_nome, p.estoque, p.imagem, p.tamanho,
             p.criado_em, p.atualizado_em
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ${whereClause}
      ORDER BY p.criado_em DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    queryParams.push(limit, offset);
    
    // Contar total de produtos com os mesmos filtros
    const countQuery = `
      SELECT COUNT(*) 
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ${whereClause}
    `;
    
    const [produtosResult, countResult] = await Promise.all([
      client.query(produtosQuery, queryParams),
      client.query(countQuery, queryParams.slice(0, -2)) // Remove limit e offset do count
    ]);
    
    const total = parseInt(countResult.rows[0].count);
    
    return {
      data: produtosResult.rows,
      pagination: { page, limit, total }
    };
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    throw new Error('Erro interno do servidor');
  }
}

async function buscarPorId(id) {
  try {
    const query = `
      SELECT p.id, p.nome, p.preco, p.descricao, p.categoria_id,
             c.nome as categoria_nome, p.estoque, p.imagem, p.tamanho,
             p.criado_em, p.atualizado_em
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = $1
    `;
    
    const result = await client.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    throw new Error('Erro interno do servidor');
  }
}

async function criar(produto) {
  try {
    const { nome, preco, descricao, categoria_id, estoque, imagem, tamanho } = produto;
    const id = uuidv4(); // Gera UUID automaticamente
    
    const query = `
      INSERT INTO produtos (id, nome, preco, descricao, categoria_id, estoque, imagem, tamanho)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, nome, preco, descricao, categoria_id, estoque, imagem, tamanho, criado_em, atualizado_em
    `;
    
    const result = await client.query(query, [
      id, nome, preco, descricao, categoria_id, estoque || 0, 
      imagem || null, tamanho || null
    ]);
    
    // Buscar com categoria_nome
    const produtoCriado = await buscarPorId(id);
    return produtoCriado;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw new Error('Erro interno do servidor');
  }
}

async function excluir(id) {
  try {
    // Hard delete - remover definitivamente
    const query = 'DELETE FROM produtos WHERE id = $1';
    const result = await client.query(query, [id]);
    
    return result.rowCount > 0;
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    throw new Error('Erro interno do servidor');
  }
}

async function atualizar(id, dados) {
  try {
    const { nome, preco, descricao, categoria_id, estoque, imagem, tamanho } = dados;
    
    const query = `
      UPDATE produtos 
      SET nome = COALESCE($2, nome),
          preco = COALESCE($3, preco),
          descricao = COALESCE($4, descricao),
          categoria_id = COALESCE($5, categoria_id),
          estoque = COALESCE($6, estoque),
          imagem = COALESCE($7, imagem),
          tamanho = COALESCE($8, tamanho),
          atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    
    const result = await client.query(query, [
      id, nome, preco, descricao, categoria_id, estoque, imagem, tamanho
    ]);
    
    if (result.rowCount === 0) {
      return null;
    }
    
    // Buscar com categoria_nome
    return await buscarPorId(id);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw new Error('Erro interno do servidor');
  }
}

module.exports = { listar, buscarPorId, criar, excluir, atualizar };
