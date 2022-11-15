import { useEffect } from "react";
import * as FullStory from "@fullstory/browser";

export function Fullstory() {
  useEffect(() => {
    FullStory.init({ orgId: "o-1F3R0Q-na1" });
  }, []);
  return <></>;
}
