
import React from "react";
import ImageGallery from "react-image-gallery";

function Gallerry() {
    const images = [
        {
            original: "../../images/img_01.jpg",
            description: "",
        },
        {
            original: "../../images/img_02.jpg",
            description: "",

        },
        {
            original: "../../images/img_03.jpg",
            description: "",
        },
        {
            original: "../../images/img_04.png",
            description: "",
        },
    ];

    return <ImageGallery items={images} autoPlay={true} showPlayButton={false} slideDuration={5000} slideInterval={7000} disableSwipe={true} showNav={false} />;
}

export default Gallerry;