# How to run the project locally?

1. Git clone the project
2. ```
   npm i
   ```
3. Build the project using tsc compiler
   ```
   tsc -b
   ```
4. Run the project
   ```
   node dist/index.js
   ```
5. Go to https://hoppscotch.io/realtime/websocket and connect to ws://localhost:8080 , this connects your client to the ws server
6. Send a raw message that contains a userId, let's say 101

    ### By this time we have made a successful connection to the web socket server and also subscribed the redis client to "events"

7. Open the redis-cli in your terminal (you can use docker for it)
8. Publish an event from the redis-cli
   ```
    PUBLISH events '{"userId": "101"}'
   ```

   ### If the websocket client receives
   ```
   Subscribed successfully to user: 101
   ```
   ### then the implementation was correct, else we've some issue here.
