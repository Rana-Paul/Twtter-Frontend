import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import Twitterlayout from "@/components/FeedCard/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import { getUserByIdQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import type { NextPage, GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { BsArrowLeftShort } from "react-icons/bs";

interface ServerProps {
  userInfo?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  const router = useRouter();
  console.log(props);
  

  console.log(router.query.id);
  return (
    <div>
      <Twitterlayout>
        <div>
          <nav className="flex items-center gap-3 py-3 px-2">
            <BsArrowLeftShort className="text-4xl" />
            <div>
              <h1 className="font-bold">Rana Paul</h1>
              <h1 className="font-bold text-slate-500 text-sm">{props.userInfo?.tweets?.length} Tweets</h1>
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
            <h1 className="font-bold mt-4">Rana Paul</h1>
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

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
  const id = context.query.id as string | undefined;

  if (!id) {
    return {notFound: true, props: {userInfo: undefined}}
  }

  const userInfo  = await graphqlClient.request(getUserByIdQuery, { id });

  if(!userInfo?.getUserById) {
    return {notFound: true}
  }

  return {
    props: {userInfo: userInfo.getUserById as User }
  }
}

export default UserProfilePage;
