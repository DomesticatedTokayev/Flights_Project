import React from "react";

function UseOutsideClick(callback) {
    const ref = React.useRef();

    React.useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }

        document.addEventListener("click", handleClick, true);

        return () => {
            document.removeEventListener("click", handleClick, false);
        }
    }, [ref])

    return ref;
}

export default UseOutsideClick;