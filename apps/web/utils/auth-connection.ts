import { authClient } from "@meetzeen/auth/client/index";

export const signInWithGoogle = async () => {
  const response = await authClient.signIn.social({
    provider: "google",
    callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/create`,
  });

  if (response.error) {
    console.log(response.error);
    throw new Error(response.error.message);
  }

  return response.data
};

export const getSession = async () => {
  const response = await authClient.getSession()
  return response.data?.user;
};