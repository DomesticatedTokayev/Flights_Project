import React from "react";

function DetailsEntry() {
    return <>
        <div className="entry">
            <div className="entry__name">Entry Name</div>
            <div className="entry__userdata">User detail</div>
            <div>
                <button className="entry__button button">Save</button>
                <button className="entry__button button">Cancel</button>
            </div>
            <div className="entry__edit">Edit</div>
        </div>
    </>
}

export default DetailsEntry;