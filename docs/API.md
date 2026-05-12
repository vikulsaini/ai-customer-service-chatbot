# API Documentation

Base URL: `/api`

## Auth

### POST `/auth/signup`

Body:

```json
{ "name": "Aarav Sharma", "email": "aarav@example.com", "password": "User@12345" }
```

Returns JWT token and public user profile.

### POST `/auth/login`

Body:

```json
{ "email": "aarav@example.com", "password": "User@12345" }
```

### POST `/auth/logout`

Clears the auth cookie.

### POST `/auth/forgot-password`

Body:

```json
{ "email": "aarav@example.com" }
```

Returns a demo reset token.

## Chat

All chat routes require `Authorization: Bearer <token>`.

### POST `/chat/message`

Body:

```json
{
  "chatId": "optional-existing-chat-id",
  "message": "My VPN is not connecting and this is urgent.",
  "attachments": []
}
```

Returns:

```json
{
  "chat": {},
  "reply": "AI or local NLP response",
  "analysis": {
    "intent": "vpn_support",
    "sentiment": "negative",
    "category": "network",
    "keywords": ["connecting", "urgent"]
  },
  "quickReplies": ["Create VPN ticket", "Show troubleshooting steps"],
  "ticket": {}
}
```

### GET `/chat/history?search=vpn`

Returns authenticated user's chats.

### DELETE `/chat/delete/:id`

Deletes a user-owned chat.

## Users

### GET `/users/profile`

Returns current user.

### PUT `/users/update`

Body:

```json
{ "name": "Updated Name", "profileImage": "https://..." }
```

## Tickets

### POST `/tickets`

Body:

```json
{ "issue": "VPN outage", "priority": "high", "category": "network" }
```

### GET `/tickets`

Users see their own tickets. Admins see all tickets.

### PUT `/tickets/:id`

Updates status, priority, assignee, or issue fields.

## Admin

Requires admin role.

### GET `/admin/users`

Lists users.

### GET `/admin/chats`

Lists chat logs with user details.

### GET `/admin/analytics`

Returns users, chats, tickets, resolved query count, active user count.

### PUT `/admin/users/:id/status`

Body:

```json
{ "status": "blocked" }
```
