const graphql = require("graphql");
const Movies = require("../server/models/movie")
const Directors = require("../server/models/director")

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
} = graphql


const MovieType = new GraphQLObjectType({
    name: "Move",
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString)},
        watched: { type: new GraphQLNonNull(GraphQLBoolean)},
        rate: { type: GraphQLInt},
        director: {
            type: DirectorType,
            resolve(parent, args) {
                return Directors.findById(parent.directorId)
            }
        }
    })
})

const DirectorType = new GraphQLObjectType({
    name: "Director",
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        age: { type: GraphQLInt},
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                return Movies.find({directorId: parent.id})
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {

        //CREATE

        addDirector: {
            type: DirectorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt}
            },
            resolve(parent, args) {
                const director = new Directors({
                    name: args.name,
                    age: args.age
                });
                return director.save()
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString)},
                directorId: { type: GraphQLID},
                watched: { type: new GraphQLNonNull(GraphQLBoolean)},
                rate: { type: GraphQLInt},
            },
            resolve(parent, args) {
                const movies = new Movies({
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId,
                    watched: args.watched,
                    rate: args.rate
                });
                return movies.save()
            }
        },

        // DELETE

        deleteDirector: {
            type: DirectorType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args) {
                return Directors.findByIdAndRemove(args.id)
            }
        },
        deleteMovie: {
            type: MovieType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args) {
                return Movies.findByIdAndRemove(args.id)
            }
        },

        // UPDATE

        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                age: { type: GraphQLInt}
            },
            resolve(parent, args) {
                return Directors.findByIdAndUpdate(
                    args.id,
                    { $set: { name: args.name, age: args.age } },
                    { new: true},
                )
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString)},
                directorId: { type: GraphQLID},
                watched: { type: new GraphQLNonNull(GraphQLBoolean)},
                rate: { type: GraphQLInt},
            },
            resolve(parent, args) {
                return Movies.findByIdAndUpdate(
                    args.id,
                    { $set:
                            {
                                name: args.name,
                                age: args.age,
                                directorId: args.directorId,
                                watched: args.watched,
                                rate: args.rate
                            }
                    },
                    { new: true},
                )
            }
        },
    }
})

const Query = new GraphQLObjectType({
    name: "Query",
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID} },
            resolve(parent, args) {
                return Movies.findById(args.id)
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID} },
            resolve(parent, args) {
                return Directors.findById(args.id)
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                return Movies.find({})
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                return Directors.find({})
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})