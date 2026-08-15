import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ChangePasswordForm from "./ChangePassword";


const ChangePasswordPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    redirect("/sign-in");
  }

  return <ChangePasswordForm />;
};

export default ChangePasswordPage;