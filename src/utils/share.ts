import { addToast } from "@common/components/Toast";
import { copyToClipboard } from "./clipboard";

export const shareOrCopy = (
  data: Required<Pick<ShareData, "url" | "text">>
) => {
  if (!navigator.canShare) {
    copyToClipboard(data.url).then(() =>
      addToast("Link copied to clipboard", "info")
    );
  } else if (navigator.canShare(data)) {
    navigator.share(data);
  }
};
