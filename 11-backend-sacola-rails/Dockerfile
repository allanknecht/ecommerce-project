FROM ruby:3.2-slim

# Instalar dependências do sistema
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    libpq-dev \
    libsqlite3-dev \
    nodejs \
    npm \
    tzdata \
    git \
    libyaml-dev \
    pkg-config \
    libxml2-dev \
    libxslt1-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Criar diretório da aplicação
WORKDIR /app

# Expor porta
EXPOSE 3002

# Comando padrão (será sobrescrito pelo docker-compose)
CMD ["sh"]
