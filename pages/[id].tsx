import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import Twitterlayout from "@/components/FeedCard/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import { UnFollowUserMutation, followUserMutation } from "@/graphql/mutation/user";
import { getUserByIdQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import type { NextPage, GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { BsArrowLeftShort } from "react-icons/bs";

interface ServerProps {
  userInfo?: User;
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  const router = useRouter();

  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const amIFollowing = useMemo(() => {
    if (!props.userInfo) return false;
    return (
      (currentUser?.following?.findIndex(
        (el) => el?.id === props.userInfo?.id
      ) ?? -1) >= 0
    );
  }, [currentUser?.following, props.userInfo]);

  const handelFollowUser = useCallback(async() => {
    if (!props.userInfo) return;
    await graphqlClient.request(followUserMutation, {to: props.userInfo?.id});
    await queryClient.invalidateQueries(["current-user"]);
  },[])
  const handelUnFollowUser = useCallback(async() => {
    if (!props.userInfo) return;
    await graphqlClient.request(UnFollowUserMutation, {to: props.userInfo?.id});
    await queryClient.invalidateQueries(["current-user"]);
  },[]);

  const handelLogoutUser = useCallback(() => {
    window.localStorage.removeItem("__twitter_token");
    router.push("/");
  },[]);

  return (
    <div>
      <Twitterlayout>
        <div >
          <nav className="flex lg:grid-cols-10 md:grid md:grid-cols-8 items-center gap-3 py-3 px-2">
            <BsArrowLeftShort onClick={() => router.back()} className="text-4xl col-span-1 rounded-full hover:bg-gray-600/25 cursor-pointer" />
            <div className="col-span-7">
              <h1 className="font-bold w-full">
                {props.userInfo?.firstName} {props.userInfo?.lastName}
              </h1>
              <h1 className="font-bold text-slate-500 text-sm">
                {props.userInfo?.tweets?.length} Tweets
              </h1>
            </div>
          </nav>

          <div className=" p-4 border-b border-slate-800">
            {props.userInfo?.profileImageURL && (
              <Image
                className="rounded-full"
                src={props.userInfo?.profileImageURL}
                alt="User Image"
                width={100}
                height={100}
              />
            )}
            <h1 className="font-bold mt-4">
              {props.userInfo?.firstName} {props.userInfo?.lastName}
            </h1>
            <div className="flex justify-between items-center">
              <div className="flex gap-4 mt-2 text-sm text-gray-400">
                <span>{props.userInfo?.followers?.length} followers</span>
                <span>{props.userInfo?.following?.length} following</span>
              </div>
              {currentUser && (
                <>
                {currentUser?.id !== props.userInfo?.id ? (
                  <>
                    {amIFollowing ? (
                      <button onClick={handelUnFollowUser} className="bg-white px-3 py-1 rounded-full text-black text-sm">
                        Unfollow
                      </button>
                    ) : (
                      <button onClick={handelFollowUser} className="bg-white px-3 py-1 rounded-full text-black text-sm">
                        Follow
                      </button>
                    )}
                  </>
                ): (
                  <>
                    <button onClick={handelLogoutUser} className="bg-white px-3 py-1 rounded-full text-black text-sm">
                        Logout
                      </button>
                  </>
                )}
                </>
              )}

            </div>
          </div>

          <div>
            {props.userInfo?.tweets?.map((tweet) => (
              <FeedCard data={tweet as Tweet} key={tweet?.id} />
            ))}
          </div>
        </div>
      </Twitterlayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const id = context.query.id as string | undefined;

  if (!id) {
    return { notFound: true, props: { userInfo: undefined } };
  }

  const userInfo = await graphqlClient.request(getUserByIdQuery, { id });

  if (!userInfo?.getUserById) {
    return { notFound: true };
  }

  return {
    props: { userInfo: userInfo.getUserById as User },
  };
};

export default UserProfilePage;
