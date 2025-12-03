## Telegram AI Bot (RMQ + ChatGPT)

Микросервисное приложение на NestJS, в котором Telegram-бот общается с ChatGPT через RabbitMQ (RPC-паттерн).

- `gateway` — принимает апдейты от Telegram (Telegraf), отправляет вопросы в очередь и возвращает ответы пользователю.
- `assistant` — отдельный Nest microservice, который слушает очередь, вызывает OpenAI и присылает результат обратно.

## Требования

- Node.js 20+
- PNPM 9+
- RabbitMQ 3.12+ (с включённым AMQP 0-9-1)
- Токены Telegram-бота и OpenAI

## Переменные окружения

Создайте `.env` (значения примерные):

```
TELEGRAM_BOT_TOKEN=8484422754:AAF4X5eirt2qvlzCSsbNYB7-ZfuDiW_8cBY
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
RABBITMQ_URL=amqp://localhost:5672
CHAT_QUEUE=chatgpt_rpc
```

## Установка

```bash
pnpm install
```

## Запуск

В отдельных терминалах:

```bash
# Telegram gateway (Telegraf + RMQ client)
pnpm run start:dev

# Assistant microservice (RMQ consumer + OpenAI)
pnpm run start:assistant
```

Для продакшена соберите обе части:

```bash
pnpm run build
node dist/main.js             # gateway
node dist/assistant/main.js   # assistant
```

## Скрипты

- `pnpm run start` — gateway в режиме prod.
- `pnpm run start:dev` — gateway в watch-режиме.
- `pnpm run start:assistant` — запуск воркера, слушающего RabbitMQ.
- `pnpm test` / `pnpm lint` — стандартные проверки.

## Поток сообщений

1. Пользователь пишет боту в Telegram.
2. `TelegramService` отправляет сообщение в RabbitMQ (`chatgpt_rpc`).
3. `AssistantService` получает payload, вызывает OpenAI Responses API и возвращает текст.
4. Gateway отвечает пользователю тем же чатом.

## Дополнительно

- При ошибке OpenAI или RabbitMQ пользователь получает понятное уведомление.
- Все настройки вынесены в `.env`, разумные дефолты настроены для локального запуска.
