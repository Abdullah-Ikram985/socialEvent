import appleSignin from "apple-signin-auth";

export async function verifyAppleIdentityToken(identityToken) {
  return appleSignin.verifyIdToken(identityToken, {
    audience: "com.nodemobileapp",
    ignoreExpiration: false,
  });
}
