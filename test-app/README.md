## Test Application
This is a simple Socket.IO server application to run some tests to make sure the `socketio-v3` is working as expected.

## Running the test plan
To run the test plan:
1. cd into this directory
2. Install the dependencies by running `yarn` or `npm install`
3. To run the test plan execute `yarn test` or `npm test`

If all goes well there should not be any errors in output.

To test specific test scenarios from the `artillery` folder user the following command where the `[FILE NAME]` is the 
name of the file scenario you want to test:
```
SERVER_PORT=3009 npx artillery run artillery/[FILE NAME].yml
```
