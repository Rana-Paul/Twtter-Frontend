import Image from "next/image";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import {
  BiHash,
  BiHomeCircle,
  BiImageAlt,
  BiMoney,
  BiUser,
} from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import FeedCard from "@/components/FeedCard";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import React from "react";
import Link from "next/link";

interface TwitterLayoutProps {
  children: React.ReactNode;
}

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const Twitterlayout: React.FC<TwitterLayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const sideBarManuItem: TwitterSidebarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <BiHomeCircle />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <BiHash />,
        link: "/",
      },
      {
        title: "Notification",
        icon: <BsBell />,
        link: "/",
      },
      {
        title: "Messages",
        icon: <BsEnvelope />,
        link: "/",
      },
      {
        title: "Bookmarks",
        icon: <BsBookmark />,
        link: "/",
      },
      {
        title: "Twitter Blue",
        icon: <BiMoney />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <BiUser />,
        link: `/${user?.id}`,
      },
      {
        title: "More Options",
        icon: <SlOptions />,
        link: "/",
      },
    ],
    [user?.id]
  );

  const handelLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      console.log(cred);
      const googleToken = cred.credential;
      if (!googleToken) return toast.error("Google Token Not Found");

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("Verified Sucess");

      if (verifyGoogleToken)
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);

      await queryClient.invalidateQueries(["current-user"]);
    },
    [queryClient]
  );
  const indexofelement:any = user?.email.indexOf("@");

  return (
    <div className="lg:justify-center grid grid-flow-col grid-col-12 lg:flex">
      <div className="grid grid-flow-col grid-col-12">
        {/* left */}
        <div className="flex relative w-[60px] sm:w-[20%]">
          <div className="mt-1">
          <div className="text-4xl md:text-5xl hover:text-blue-500 p-2 h-fit w-fit cursor-pointer transition-all hidden sm:block sm:pl-5">
              <BsTwitter />
            </div>

            <div className="mt-16 sm:mt-1 text-xl font-semibold pr-3">
              <ul>
                {sideBarManuItem.map((item) => (
                  <li key={item.title}>
                    <Link
                      className="flex text-xs justify-start items-center gap-3 hover:bg-gray-500/25 rounded-full py-4 px-5 w-fit cursor-pointer transition-all"
                      href={item.link}
                    >
                      <span className=" md:text-[25px] ">{item.icon}</span>
                      <span className="hidden sm:inline text-[18px]">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 px-3">
                <button className="hidden sm:block bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full hover:bg-blue-500 ">
                  Tweet
                </button>
                <button className="block sm:hidden bg-[#1d9bf0] font-semibold text-2xs py-2 px-2 rounded-full w-full justify-center ">
                  <BsTwitter  />
                </button>
              </div>
            </div>
          </div>
          <div className="absolute top-2 sm:top-[90%] flex gap-2 items-center w-full p-1  rounded-full">
            {user && user.profileImageURL && (
              <Image
                className="rounded-full "
                src={user?.profileImageURL}
                alt="User-Img"
                height={50}
                width={50}
              />
            )}

            <div className=" hidden sm:block my-2">
              <h3 className=" text-[15px]">{user?.firstName}{" "}{user?.lastName}</h3>
              <h6 className="text-gray-400 ">{user?.email?"@":" "}{user?.email.slice(0,indexofelement)}</h6>
            </div>
          </div>
        </div>
        {/* Mid */}
        <div className="col-span-12 lg:col-span-10  sm:w-[80%] md:w-full sm:col-span-5 border-r-[1px] h-screen overflow-scroll no-scrollbar border-l-[1px] border-gray-600">
          {props.children}
        </div>
        {/* right */}
        <div className="col-span-0 hidden lg:block md:w-[350px] sm:col-span-3 p-5">
          {!user ? (
            <div className="p-5 border border-gray-600 hover:bg-slate-800/25 rounded-lg">
              <h1 className="my-2 text-2xl">New to Twitter</h1>
              <GoogleLogin onSuccess={handelLoginWithGoogle} />
            </div>
          ) : (
            <div className="px-4 py-2 bg-slate-900 rounded-lg mt-4">
              <h1 className="my-2 text-base font-bold mb-5">User you may know</h1>
              {user?.recommendedUsers?.map((el) => (
                <div className="flex items-center gap-3 mt-2" key={el?.id}>
                  {el?.profileImageURL && (
                    <Image
                      src={el.profileImageURL}
                      alt="User Image"
                      className="rounded-full"
                      height={60}
                      width={60}
                    />
                  )}
                  <div className="flex justify-between p-5 w-full">
                    <div className="text-lg">{el?.firstName} {el?.lastName}
                    <div className="text-xs text-gray-500">{user?.email?"@":" "}{el?.email.slice(0,indexofelement)}</div>
                    </div>
                   
                    <div><Link href={`/${el?.id}`} className="bg-white  text-black text-sm px-3 py-1 w-full rounded-[25px] hover:bg-gray-400 ">View</Link></div>
                    
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Twitterlayout;
