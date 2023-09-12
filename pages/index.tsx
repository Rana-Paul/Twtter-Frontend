import Image from "next/image";

import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import FeedCard from "@/components/FeedCard";



interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}
const sideBarManuItem: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />,
  },
  {
    title: "Explore",
    icon: <BiHash />,
  },
  {
    title: "Notification",
    icon: <BsBell />,
  },
  {
    title: "Messages",
    icon: <BsEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark />,
  },
  {
    title: "Twitter Blue",
    icon: <BiMoney />,
  },
  {
    title: "Profile",
    icon: <BiUser />,
  },
  {
    title: "More Options",
    icon: <SlOptions />,
  },
  
];

export default function Home() {
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 pt-1 mr-2">
          <div className="text-2xl hover:bg-gray-600 rounded-full p-2 h-fit w-fit cursor-pointer transition-all">
            <BsTwitter />
          </div>

          <div className="mt-1 text-xl font-semibold pr-3">
            <ul>
              {sideBarManuItem.map((item) => (
                <li
                  key={item.title}
                  className="flex justify-start items-center gap-3 hover:bg-gray-600 rounded-full px-3 py-2 w-fit cursor-pointer mt-2 transition-all"
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 px-1">

            <button className="bg-[#1d9bf0] font-semibold text-lg py-2 px-2 rounded-full w-full ">Tweet</button>
            </div>
          </div>
        </div>
        <div className="col-span-6 border-r-[1px] h-screen overflow-scroll no-scrollbar border-l-[1px] border-gray-600">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3"></div>
      </div>
    </div>
  );
}
