import { graphql } from "@/gql"
export const createTweetMutation = graphql(`
    #graphql
    mutation CreateTweet($payload: CreateTweetData!) {
        createTweet(payload: $payload) {
            id
            content
            imageURL
            author {
                id
                firstName
                profileImageURL
            }
        }
    }
`)