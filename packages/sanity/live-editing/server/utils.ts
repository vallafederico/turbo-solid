import type { SanityClient } from "@sanity/client"
import {validatePreviewUrl} from "@sanity/preview-url-secret"

export const isValidPreviewUrl = async (client: SanityClient, url: URL) => {

  return await validatePreviewUrl(client, url.pathname).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });

};

// export const validatePreviewUrl = async (client: Client, url: string) => {
//   const { isValid, redirectTo, studioPreviewPerspective } = await previewUrlSecret.validatePreviewUrl(client, url);
//   return { isValid, redirectTo, studioPreviewPerspective };
// };
