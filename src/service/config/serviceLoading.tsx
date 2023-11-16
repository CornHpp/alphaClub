"use client";
import ReactDOM from "react-dom/client";
import Loading from "@/components/custom/Loading";

let needLoadingRequestCount = 0;

// * 显示loading
export const showFullScreenLoading = (loadingText?: string) => {
  if (needLoadingRequestCount === 0) {
    const dom = document.createElement("div");
    dom.setAttribute("id", "baseLoading");
    document.body.appendChild(dom);
    ReactDOM.createRoot(dom).render(<Loading loadingText={loadingText} />);
  }

  needLoadingRequestCount++;
};

// * 隐藏loading
export const hideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) return;

  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    document.body.removeChild(
      document.getElementById("baseLoading") as HTMLElement
    );
  }
};
