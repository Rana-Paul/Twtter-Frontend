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
  link: string
}


const Twitterlayout: React.FC<TwitterLayoutProps> = (props) => {

  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  

  const sideBarManuItem:TwitterSidebarButton[] = useMemo(() => [
    {
      title: "Home",
      icon: <BiHomeCircle />,
      link: '/'
    },
    {
      title: "Explore",
      icon: <BiHash />,
      link: '/'
    },
    {
      title: "Notification",
      icon: <BsBell />,
      link: '/'
    },
    {
      title: "Messages",
      icon: <BsEnvelope />,
      link: '/'
    },
    {
      title: "Bookmarks",
      icon: <BsBookmark />,
      link: '/'
    },
    {
      title: "Twitter Blue",
      icon: <BiMoney />,
      link: '/'
    },
    {
      title: "Profile",
      icon: <BiUser />,
      link: `/${user?.id}`
    },
    {
      title: "More Options",
      icon: <SlOptions />,
      link: '/'
    },
  ], [user?.id]);


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


  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
        <div className="col-span-2 pt-1 sm:col-span-3 flex sm:justify-end p-4 relative">
          <div>
          <div className="text-2xl hover:bg-gray-600 rounded-full p-2 h-fit w-fit cursor-pointer transition-all">
            <BsTwitter />
          </div>

          <div className="mt-1 text-xl font-semibold pr-3">
            <ul>
              {sideBarManuItem.map((item) => (
                <li
                  key={item.title}
                  
                >
                  <Link className="flex justify-start items-center gap-3 hover:bg-gray-600 rounded-full px-3 py-2 w-fit cursor-pointer mt-2 transition-all" href={item.link}>
                  <span className="text-3xl">{item.icon}</span>
                  <span className="hidden sm:inline">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <button className="hidden sm:block bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full ">
                Tweet
              </button>
              <button className="block sm:hidden bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full justify-center ">
                <BsTwitter />
              </button>
            </div>
          </div>
          </div>
          <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
            {user && user.profileImageURL && (
              <Image
                className="rounded-full"
                src={user?.profileImageURL}
                alt="User-Img"
                height={50}
                width={50}
              />
            )}
            <div className="hidden sm:block">
              <h3 className=" text-xl">{user?.firstName}</h3>
              <h3 className=" text-xl">{user?.lastName}</h3>
            </div>
          </div>
        </div>
        <div className="col-span-10 sm:col-span-5 border-r-[1px] h-screen overflow-scroll no-scrollbar border-l-[1px] border-gray-600">
          {props.children}
        </div>
        <div className="col-span-0 sm:col-span-3 p-5">
          {!user && (
            <div className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-2xl">New to Twitter</h1>
              <GoogleLogin onSuccess={handelLoginWithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Twitterlayout;
