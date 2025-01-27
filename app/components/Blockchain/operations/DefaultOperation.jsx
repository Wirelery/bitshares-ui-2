import React from "react";
import {Link} from "react-router-dom";

export const DefaultOperation = ({op, block}) => {
    console.log("unimplemented op:", op);
    return (
        <span>
            <Link to={`/exchange/block/${block}`}>#{block}</Link>
        </span>
    );
};
