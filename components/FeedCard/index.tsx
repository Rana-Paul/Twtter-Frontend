import Image from "next/image";
import React from "react";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";

interface FeedCardProps {
  data: Tweet
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data } = props
  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-4 hover:bg-slate-900 transition-all cursor-pointer">
      <div className="flex  gap-3">
        <div className="col-span-3">
          {data.author?.profileImageURL && <Image
            alt="User Image"
            height={50}
            width={50}
            src={data.author?.profileImageURL}
            className="rounded-full"
          />}
        </div>
        <div className="w-full md:col-span-12">
        <div>
          <h5>
          <Link href={`/${data.author?.id}`}>
          {data.author?.firstName} {data.author?.lastName}
          </Link>
          </h5>
          <p>
            {data.content}
          </p>
          </div>
          {data.imageURL && <Image src={data.imageURL} alt="image" width={400} height={400} />}
          <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
            <div><BiMessageRounded /></div>
            <div><FaRetweet /></div>
            <div><AiOutlineHeart /></div>
            <div><BiUpload /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
