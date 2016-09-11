# Shopping Cart
Example REST API working with a shopping cart developed using Node.js

#How to deploy this app
First of all, this app needs to have Docker Machine installed on the host and also Docker and Docker Compose on the droplet where the app will be deployed. After you do these steps, all you have to do in order to deploy the project is the following command:
    
    docker-compose up --build
    
#What commands and features this REST API  expose
* `Create a basket with basket items`
* `Retrieve basket with basket items based on criteria (basket_id)`
* `Add an item(product) to the basket`
* `Checkout -> Just show basket total`
* `API Security using JWT`

#Work in progress
* `Get an item(product) from the basket`
* `Remove an item(product) from the basket`
* `Automatic test using mocha and supertest`
