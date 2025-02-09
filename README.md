# Internal Error Codes

| Code | Message                |
| ---- | ---------------------- |
| 1000 | User already exists.   |
| 1010 | Failed to create user. |
| 1020 | Passwords don't match. |
| 5000 | Database error         |

# How to generate token secrets

```bash
node
require("crypto").randomBytes(64).toString("hex")
```
