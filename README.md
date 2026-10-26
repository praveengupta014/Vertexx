# Vertexx

Corporate website with an AI booking assistant.

- `client/` React 18 + Vite + Tailwind CSS + React Router (JavaScript)
- `server/` Node.js + Express + MongoDB (Mongoose), REST API and the AI assistant

## Setup

Requirements: Node.js 18+ and MongoDB (local, or a MongoDB Atlas connection string).

```bash
npm run install:all
cp server/.env.example server/.env     # then edit MONGODB_URI and ADMIN_KEY
npm run seed                           # loads products and the knowledge base
npm run dev:server                     # API on http://localhost:5000
npm run dev:client                     # website on http://localhost:5173
```

Open the website and click **Book with AI** (bottom right). The Vite dev server forwards `/api` to port 5000.

## How the AI booking assistant works

No external AI service or API key is used.

1. **Details first.** The assistant collects name, email, phone and company (optional).
2. **Product list.** Only then it shows the products from MongoDB. The client can pick a card, type a name, or describe what they need.
3. **Quantity, date, notes, confirmation.** It checks the date against the product's lead time, shows a summary and asks for confirmation.
4. **Stored in MongoDB.** The booking, the customer and the whole chat are saved.

**RAG.** `server/src/ai/retriever.js` is a local BM25 search over your products and the FAQ documents in the `knowledge` collection. It is used to:
- recognise what the client needs ("I need robots for picking" leads to Vertexx Flow),
- answer questions at any step (prices, timelines, support hours), then return to the current step.
Answers come only from retrieved text. If nothing matches, it gives the team's phone and email instead of guessing.

**System prompt.** `server/src/ai/systemPrompt.js` holds the rules (order of steps, answer only from context, never invent prices, no payment details). The step order is enforced in code in `chatEngine.js`.

**Optional local LLM.** By default replies are built from retrieved text. If you run [Ollama](https://ollama.com) locally and set `LLM_URL` in `server/.env`, the same system prompt and retrieved context are sent to it for more natural answers. It stays on your machine; leave it unset to use pure RAG.

Add or edit products and FAQ text in MongoDB and the assistant picks them up. Product changes through the API refresh it immediately; after editing `knowledge` directly, restart the server.

## API

Public endpoints are open. Admin endpoints need the header `x-admin-key: <ADMIN_KEY>`.

| Method and path | Access | Purpose |
| --- | --- | --- |
| `GET /api/health` | public | Health check |
| `GET /api/products` | public | List products (`type`, `industry`, `q`, `sort=name\|price\|timeline`) |
| `GET /api/products/:slug` | public | One product |
| `POST /api/products`, `PUT /api/products/:slug`, `DELETE /api/products/:slug` | admin | Manage products (delete is a soft delete) |
| `POST /api/bookings` | public | Create a booking: `{ customer:{name,email,phone,company}, productId, quantity, preferredDate, notes }` |
| `GET /api/bookings/track/:bookingId?email=` | public | Customer checks their booking status |
| `GET /api/bookings`, `GET /api/bookings/:bookingId` | admin | List (`status`, `page`, `limit`) and details |
| `PATCH /api/bookings/:bookingId/status` | admin | `pending, confirmed, in_progress, completed, cancelled` |
| `POST /api/inquiries` | public | Save an inquiry (the website's inquiry form sends this) |
| `GET /api/inquiries`, `PATCH /api/inquiries/:leadId/status` | admin | Leads and status (`new, contacted, proposal, won`) |
| `GET /api/customers`, `GET /api/customers/:id/bookings` | admin | Customers and their bookings |
| `POST /api/chat/start`, `POST /api/chat/message`, `GET /api/chat/:sid` | public | The AI assistant |

Example:
```bash
curl -X POST http://localhost:5000/api/bookings -H "Content-Type: application/json" \
  -d '{"customer":{"name":"Asha Rao","email":"asha@acme.com","phone":"9829012345"},"productId":"flow","quantity":2,"preferredDate":"2027-03-01"}'
curl http://localhost:5000/api/bookings -H "x-admin-key: YOUR_ADMIN_KEY"
```

## Tests

`npm test` runs the assistant tests (conversation order, validation, RAG answers, product suggestion, lead-time check, date parsing) without needing MongoDB.

## Before going live

- Set a long random `ADMIN_KEY`, set `CORS_ORIGIN` to your site's address, and serve over HTTPS.
- The built-in rate limiter is per server instance. Use a shared store if you run several instances.
- Product, FAQ, client and news content is sample data. Replace it with your real content.
- The admin endpoints have no web screen yet. Use an API client such as Postman, or ask for an admin dashboard.
- The website's Services, Insights and Lead status pages still use in-browser sample data. Only the AI assistant and the inquiry form talk to the server.
