
import React from "react";
import ImageGallery from "react-image-gallery";

function Gallerry(props) {
    return <ImageGallery
        items={props.images}
        autoPlay={true}
        showPlayButton={false}
        slideDuration={0}
        slideInterval={7000}
        disableSwipe={true}
        showNav={false}
        showFullscreenButton={false}
    />;
}

export default Gallerry;