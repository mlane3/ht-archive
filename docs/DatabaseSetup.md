# Database setup required to run the app

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
db.createUser({"user":"app", "pwd": "your-pass", "roles":["appDA"]})
```

## List of Areas Searched

Create a `headers` collection and insert a document with all of the unique areas in the database.
The document should have a `key` value which should be the same as the url and a `name` attribute
which will be the name that is displayed by the search app.

```
db.headers.count()
db.headers.insert({
            "_id": "areas",
            "areas": [
                {
                    "key": "atlanta",
                    "name": "Atlanta, GA"
                },
                {
                    "key": 'albanyga',
                    "name": "Albany, GA"
                },
                {
                    "key": 'athensga',
                    "name": "Athens, GA"
                },
                {
                    "key": 'augusta',
                    "name": "Augusta, GA"
                },
                {
                    "key": "brunswick",
                    "name": "Brunswick, GA"
                },
                {
                    "key": 'columbusga',
                    "name": "Columbus, GA"
                },
                {
                    "key": 'macon',
                    "name": "Macon, GA"
                },
                {
                    "key": 'nwga',
                    "name": "Northwest GA"
                },
                {
                    "key": 'savannah',
                    "name": "Savannah, GA"
                },
                {
                    "key": 'statesboro',
                    "name": "Statesboro, GA"
                },
                {
                    "key": 'valdosta',
                    "name": "Valdosta, GA"
                }
            ]
        })
```
