import { notFound } from "next/navigation";

import ConnectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

import MessagePage from "./MessagePage";

interface ServerMessagePageProps {
  params: Promise<{
    username: string;
  }>;
}

const ServerMessagePage = async ({ params }: ServerMessagePageProps) => {
  const { username } = await params;

  await ConnectDB();

  const user = await UserModel.findOne({
    username,
    isDeleted: false,
  }).select("username");

  if (!user) {
    notFound();
  }

  return <MessagePage username={user.username} />;
};

export default ServerMessagePage;

