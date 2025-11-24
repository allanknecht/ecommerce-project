const { Client } = require('pg');

// Configuração do banco
const client = new Client({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'mydatabase'
});

async function resetDatabase() {
  try {
    await client.connect();
    console.log('Conectado ao PostgreSQL');

    // Dropar todas as tabelas existentes
    console.log('🗑️  Removendo todas as tabelas...');
    await client.query('DROP TABLE IF EXISTS produtos CASCADE');
    await client.query('DROP TABLE IF EXISTS categorias CASCADE');
    console.log('✅ Tabelas removidas');

    // Criar tabela categorias
    console.log('🔨 Recriando tabela categorias...');
    const createCategoriasQuery = `
      CREATE TABLE categorias (
        id INTEGER NOT NULL,
        nome VARCHAR(255) NOT NULL UNIQUE,
        CONSTRAINT categorias_pkey PRIMARY KEY (id)
      )
    `;
    await client.query(createCategoriasQuery);
    console.log('✅ Tabela categorias criada');

    // Criar tabela produtos
    console.log('🔨 Recriando tabela produtos...');
    const createTableQuery = `
      CREATE TABLE produtos (
        id UUID NOT NULL,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco NUMERIC(10, 2) NOT NULL,
        estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
        categoria_id INTEGER,
        imagem TEXT,
        tamanho VARCHAR(10),
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT produtos_pkey PRIMARY KEY (id),
        CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
      )
    `;
    
    await client.query(createTableQuery);
    console.log('✅ Tabela produtos criada');

    // Criar índices
    console.log('📊 Criando índices...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos(nome)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_produtos_categoria_id ON produtos(categoria_id)');
    console.log('✅ Índices criados');

    // Criar trigger para atualizado_em
    console.log('⚡ Criando trigger para atualizado_em...');
    const triggerFunction = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.atualizado_em = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;
    
    await client.query(triggerFunction);
    
    const trigger = `
      CREATE TRIGGER update_produtos_updated_at 
          BEFORE UPDATE ON produtos 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column()
    `;
    
    await client.query(trigger);
    console.log('✅ Trigger criado');

    console.log('🎉 Banco de dados resetado com sucesso!');
    console.log('📋 Tabelas produtos e categorias criadas do zero, sem dados');

  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase };
