import {SignUpViews} from "@/modules/auth/ui/views/sign-up-views";
import {caller} from "@/trpc/server";
import {redirect} from "next/navigation";

const Page = async () => {
    const session = await caller.auth.session()
    if(session.user) {
        redirect('/')
    }
  return (
      <SignUpViews/>
  );
};

export default Page;