import { graphqlClient } from "@/clients/api";
import { CreateTweetData } from "@/gql/graphql";
import { createTweetMutation } from "@/graphql/mutation/tweet";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetAllTweets = () => {
    const query = useQuery({
        queryKey: ['all-tweets'],
        queryFn: () => graphqlClient.request(getAllTweetsQuery),
    });

    return{...query, tweets: query.data?.getAllTweets}
}

export const useCreateTweet = () => {
    const queryClient = useQueryClient();
    const mutattion = useMutation({
        mutationFn: (payload: CreateTweetData) => graphqlClient.request(createTweetMutation, {payload}),
        onMutate: () => toast.loading("Creating Tweet...", {id: "1"}),
        onSuccess: async() => {
            queryClient.invalidateQueries(["all-tweets"])
            toast.success("Tweet Created", {id: "1"})
        }
    });
    return mutattion;
}