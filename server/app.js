const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require("../schema/schema")
const mongoose = require('mongoose')

const app = express();
const PORT = 3005;

const url = `mongodb+srv://lev:pas123@cluster0.nokxp.mongodb.net/GraphqlTutorial?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, err => {
    err ? console.log(err) : console.log("Server started!");
})