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
    "/auth/reset-password": { post: { summary: "Reset password with token", responses: { 200: { description: "Password updated" }, 400: { description: "Invalid token" } } } },
    "/chat/message": { post: { security: [{ bearerAuth: [] }], summary: "Send chatbot message", responses: { 200: { description: "AI response" } } } },
    "/chat/history": { get: { security: [{ bearerAuth: [] }], summary: "Get user chat history", responses: { 200: { description: "Chat list" } } } },
    "/chat/{id}": { delete: { security: [{ bearerAuth: [] }], summary: "Delete a user-owned chat", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Deleted" }, 404: { description: "Chat not found" } } } },
    "/faq": { get: { summary: "List searchable FAQ entries", responses: { 200: { description: "FAQ list" } } } },
    "/tickets": {
      post: { security: [{ bearerAuth: [] }], summary: "Create ticket", requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["issue"], properties: { issue: { type: "string" }, priority: { type: "string", enum: ["low", "medium", "high", "critical"] }, category: { type: "string" } } } } } }, responses: { 201: { description: "Ticket created" }, 422: { description: "Validation failed" } } },
      get: { security: [{ bearerAuth: [] }], summary: "List tickets", responses: { 200: { description: "Ticket list" } } }
    },
    "/tickets/{id}": { put: { security: [{ bearerAuth: [] }], summary: "Update ticket. Users can update issue, priority, and category; admins can also update status and assignee.", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Ticket updated" }, 400: { description: "No valid fields" }, 404: { description: "Ticket not found" }, 422: { description: "Validation failed" } } } },
    "/users/profile": { get: { security: [{ bearerAuth: [] }], summary: "Get current user profile", responses: { 200: { description: "Current user" } } } },
    "/users/update": { put: { security: [{ bearerAuth: [] }], summary: "Update current user profile", responses: { 200: { description: "Profile updated" }, 422: { description: "Validation failed" } } } },
    "/admin/users": { get: { security: [{ bearerAuth: [] }], summary: "Admin list users", responses: { 200: { description: "Users" } } } },
    "/admin/chats": { get: { security: [{ bearerAuth: [] }], summary: "Admin list chats", responses: { 200: { description: "Chats" } } } },
    "/admin/analytics": { get: { security: [{ bearerAuth: [] }], summary: "Admin analytics", responses: { 200: { description: "Analytics" } } } },
    "/admin/users/{id}/status": { put: { security: [{ bearerAuth: [] }], summary: "Admin block or restore user", responses: { 200: { description: "User updated" }, 404: { description: "User not found" }, 422: { description: "Validation failed" } } } }
  }
};
