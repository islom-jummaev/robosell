import React, { useState } from "react";
import { Spinner } from "@ui/spinner";

export const VideoUi = (props: { url: string }) => {
  const { url } = props;

  const [canPlay, setCanPlay] = useState(false);

  return (
    <>
      <div>
        {!canPlay && (
          <div>
            <Spinner />
          </div>
        )}
        <video {...(!canPlay ? { width: 0 } : { height: 500 })} controls onCanPlay={() => setCanPlay(true)}>
          <source src={url} type="video/mp4" />
        </video>
      </div>
    </>
  )
};