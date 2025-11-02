# 🔥 Guia de Configuração do Firebase - Passo a Passo

Este guia vai te ajudar a configurar o Firebase do zero para o projeto Realtime Q&A.

## 📋 Índice
1. [Criar Projeto Firebase](#1-criar-projeto-firebase)
2. [Configurar Firestore Database](#2-configurar-firestore-database)
3. [Configurar Authentication](#3-configurar-authentication)
4. [Obter Credenciais](#4-obter-credenciais)
5. [Configurar Variáveis de Ambiente](#5-configurar-variáveis-de-ambiente)
6. [Testar a Aplicação](#6-testar-a-aplicação)

---

## 1. Criar Projeto Firebase

### Passo 1.1: Acessar Firebase Console
1. Acesse: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Clique no botão **"Adicionar projeto"** (ou "Add project")

### Passo 1.2: Criar o Projeto
1. **Nome do projeto**: Digite `realtime-qanda` (ou o nome que preferir)
2. Clique em **"Continuar"**
3. **Google Analytics**: Você pode desativar (não é necessário para este projeto)
4. Clique em **"Criar projeto"**
5. Aguarde a criação (pode levar alguns segundos)
6. Clique em **"Continuar"** quando o projeto estiver pronto

---

## 2. Configurar Firestore Database

### Passo 2.1: Criar o Database
1. No menu lateral esquerdo, clique em **"Firestore Database"** (ícone de banco de dados)
2. Clique no botão **"Criar banco de dados"** (ou "Create database")

### Passo 2.2: Escolher Modo de Segurança
Você verá duas opções:

**Opção 1: Modo de produção (Recomendado para aprender)**
- Selecione **"Iniciar no modo de produção"**
- Este modo vai exigir que configuremos as regras de segurança manualmente
- Clique em **"Avançar"**

**Opção 2: Modo de teste (Mais fácil, mas menos seguro)**
- Selecione **"Iniciar no modo de teste"**
- Permite leitura/escrita por 30 dias sem autenticação
- ⚠️ Não recomendado para produção
- Clique em **"Avançar"**

### Passo 2.3: Escolher Local
1. Selecione o local mais próximo de você (ex: `southamerica-east1` para São Paulo)
2. Clique em **"Ativar"**
3. Aguarde alguns segundos enquanto o Firestore é criado

### Passo 2.4: Configurar Regras de Segurança (IMPORTANTE!)

#### Se você escolheu "Modo de produção":

1. No menu superior, clique na aba **"Regras"** (Rules)
2. Substitua TODO o conteúdo pelo seguinte:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Regras para a coleção de salas
    match /rooms/{roomId} {
      // Qualquer pessoa pode ler salas
      allow read: if true;

      // Apenas usuários autenticados podem criar salas
      allow create: if request.auth != null;

      // Apenas o admin da sala pode atualizar/deletar
      allow update, delete: if request.auth != null &&
                                request.auth.uid == resource.data.adminId;

      // Sub-coleção de perguntas
      match /questions/{questionId} {
        // Qualquer pessoa pode ler perguntas
        allow read: if true;

        // Usuários autenticados podem criar perguntas
        allow create: if request.auth != null;

        // Usuários autenticados podem atualizar (para votar)
        allow update: if request.auth != null;

        // Apenas o admin da sala pode deletar perguntas
        allow delete: if request.auth != null &&
                         get(/databases/$(database)/documents/rooms/$(roomId)).data.adminId == request.auth.uid;
      }
    }
  }
}
```

3. Clique em **"Publicar"** (Publish)

#### Se você escolheu "Modo de teste":
- As regras já permitem acesso temporário
- Você pode adicionar as regras acima depois para maior segurança

---

## 3. Configurar Authentication

### Passo 3.1: Acessar Authentication
1. No menu lateral esquerdo, clique em **"Authentication"** (ícone de pessoa)
2. Clique no botão **"Vamos começar"** (ou "Get started")

### Passo 3.2: Ativar Login Anônimo
1. Você verá uma lista de **"Provedores de login"** (Sign-in providers)
2. Procure por **"Anônimo"** (ou "Anonymous") na lista
3. Clique nele
4. Ative o switch **"Ativar"** (Enable)
5. Clique em **"Salvar"**

✅ Pronto! A autenticação anônima está configurada.

---

## 4. Obter Credenciais

### Passo 4.1: Registrar App Web
1. Volte para a página inicial do projeto (clique no ícone de casa 🏠 no topo)
2. Na seção **"Comece adicionando o Firebase ao seu app"**, clique no ícone **Web** `</>`
   - Se não aparecer, clique no ícone de engrenagem ⚙️ > **Configurações do projeto** > Role até **"Seus apps"**
3. Um modal vai abrir

### Passo 4.2: Registrar o App
1. **Apelido do app**: Digite `Realtime Q&A Web`
2. **Não** marque a opção "Firebase Hosting" (não vamos usar por enquanto)
3. Clique em **"Registrar app"**

### Passo 4.3: Copiar as Credenciais
Você verá um código JavaScript similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijk",
  authDomain: "realtime-qanda.firebaseapp.com",
  projectId: "realtime-qanda",
  storageBucket: "realtime-qanda.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**IMPORTANTE**: Copie esses valores! Você vai precisar deles no próximo passo.

4. Clique em **"Continuar no console"**

---

## 5. Configurar Variáveis de Ambiente

### Passo 5.1: Abrir o arquivo .env
No seu projeto, você já tem um arquivo `.env` criado. Abra-o no seu editor.

### Passo 5.2: Preencher as Variáveis
Usando os valores que você copiou do Firebase, preencha o arquivo `.env`:

```bash
# Exemplo - substitua pelos SEUS valores do Firebase
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijk
VITE_FIREBASE_AUTH_DOMAIN=realtime-qanda.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=realtime-qanda
VITE_FIREBASE_STORAGE_BUCKET=realtime-qanda.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**Dica**: Certifique-se de que:
- Não há espaços antes ou depois do `=`
- Você copiou os valores corretamente (sem aspas)
- Todas as 6 variáveis estão preenchidas

### Passo 5.3: Salvar o Arquivo
Salve o arquivo `.env` e **reinicie o servidor de desenvolvimento**:

```bash
# Pare o servidor (Ctrl + C)
# Inicie novamente
npm run dev
```

---

## 6. Testar a Aplicação

### Passo 6.1: Acessar a Aplicação
1. Abra o navegador
2. Acesse: http://localhost:5174/ (ou a porta que aparecer no terminal)

### Passo 6.2: Verificar se Funcionou
Se tudo estiver correto, você verá:
- ✅ Página inicial com duas opções: "Criar Sala" e "Entrar na Sala"
- ✅ Sem erros no console do navegador (F12)

### Passo 6.3: Testar Criação de Sala
1. Clique em **"Criar Nova Sala"**
2. Digite um nome (ex: "Teste 123")
3. Clique em **"Criar Sala"**
4. Você deve ser redirecionado para a página do administrador
5. Você verá um código como `ABC-123` no topo

### Passo 6.4: Testar como Participante
1. Copie o código da sala
2. Abra uma nova aba anônima (Ctrl+Shift+N no Chrome)
3. Acesse http://localhost:5174/
4. Clique em **"Entrar na Sala"**
5. Cole o código e clique em **"Entrar"**
6. Você deve ver a sala como participante

### Passo 6.5: Testar Perguntas e Votos
1. Na aba do participante, clique em **"Fazer uma Pergunta"**
2. Digite uma pergunta e clique em **"Enviar Pergunta"**
3. Volte para a aba do administrador
4. Você deve ver a pergunta aparecer em tempo real! 🎉

---

## ✅ Configuração Completa!

Parabéns! Seu Firebase está configurado e funcionando. Agora você pode:

- Criar salas de Q&A
- Participantes podem fazer perguntas
- Votar em perguntas
- Administradores podem moderar (fixar, marcar como respondida, excluir)

## 🚨 Problemas Comuns

### Erro: "Firebase configuration missing"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Verifique se todas as variáveis estão preenchidas
- Reinicie o servidor (`npm run dev`)

### Erro: "Permission denied"
- Verifique as regras de segurança no Firestore
- Certifique-se de que a autenticação anônima está ativada

### Erro ao criar sala ou pergunta
- Abra o console do navegador (F12) e veja a mensagem de erro
- Verifique se a autenticação anônima está funcionando
- Verifique as regras do Firestore

### Perguntas não aparecem em tempo real
- Verifique sua conexão com a internet
- Abra o console e veja se há erros
- Tente recarregar a página

---

## 📚 Recursos Adicionais

- [Documentação do Firebase](https://firebase.google.com/docs)
- [Documentação do Firestore](https://firebase.google.com/docs/firestore)
- [Regras de Segurança do Firestore](https://firebase.google.com/docs/firestore/security/get-started)

Se precisar de ajuda, consulte o arquivo `README.md` do projeto!
