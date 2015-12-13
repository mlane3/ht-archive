## User Setup

The following are the minimal priveleges needed by the user running the app.

```
use <db-for-app>
db.createRole({
    "role": "appDA",
    "privileges": [
        {"resource": {"db": "crawler", "collection": "users"}, "actions": ["find", "update", "insert"]},
        {"resource": {"db": "crawler", "collection": "headers"}, "actions": ["find"]},
        {"resource": {"db": "crawler", "collection": "sessions"}, "actions": ["find", "remove", "insert"]},
        {"resource": {"db": "crawler", "collection": "search"}, "actions": ["find"]}
    ],
    "roles": []
})
db.createUser({"user":"app", "pwd": "some-pass", "roles":["appDA"]})
```
