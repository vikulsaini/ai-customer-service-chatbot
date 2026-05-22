export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "AI Customer Service Chatbot API",
    version: "1.0.0",
    description: "REST API for an AI-powered IT-sector customer service chatbot with auth, chat, FAQ, tickets, and admin monitoring."
  },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  paths: {
    "/health": {
      get: {
        summary: "API health and database mode",
        responses: { 200: { description: "API status" } }
      }
    },
    "/auth/register": {
      post: {
        summary: "Register a user",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name", "email", "password"], properties: { name: { type: "string" }, email: { type: "string" }, password: { type: "string" } } } } } },
        responses: { 201: { description: "Registered" }, 409: { description: "Email exists" } }
      }
    },
    "/auth/login": {
      post: {
        summary: "Login user",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["email", "password"], properties: { email: { type: "string" }, password: { type: "string" } } } } } },
        responses: { 200: { description: "Logged in" }, 401: { description: "Invalid credentials" } }
      }
    },
    "/auth/logout": { post: { summary: "Logout user", responses: { 200: { description: "Logged out" } } } },
    "/auth/forgot-password": { post: { summary: "Generate reset token", responses: { 200: { description: "Reset flow started" } } } },
    "/chat/message": { post: { security: [{ bearerAuth: [] }], summary: "Send chatbot message", responses: { 200: { description: "AI response" } } } },
    "/chat/history": { get: { security: [{ bearerAuth: [] }], summary: "Get user chat history", responses: { 200: { description: "Chat list" } } } },
    "/chat/{id}": { delete: { security: [{ bearerAuth: [] }], summary: "Delete a chat", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Deleted" } } } },
    "/faq": { get: { summary: "List searchable FAQ entries", responses: { 200: { description: "FAQ list" } } } },
    "/tickets": {
      post: { security: [{ bearerAuth: [] }], summary: "Create ticket", responses: { 201: { description: "Ticket created" } } },
      get: { security: [{ bearerAuth: [] }], summary: "List tickets", responses: { 200: { description: "Ticket list" } } }
    },
    "/tickets/{id}": { put: { security: [{ bearerAuth: [] }], summary: "Update ticket", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Ticket updated" } } } },
    "/admin/users": { get: { security: [{ bearerAuth: [] }], summary: "Admin list users", responses: { 200: { description: "Users" } } } },
    "/admin/chats": { get: { security: [{ bearerAuth: [] }], summary: "Admin list chats", responses: { 200: { description: "Chats" } } } },
    "/admin/analytics": { get: { security: [{ bearerAuth: [] }], summary: "Admin analytics", responses: { 200: { description: "Analytics" } } } }
  }
};
