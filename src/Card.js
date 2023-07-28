import React, { useState } from "react";

const Card = ({ name, image }) => {
    return <img
        alt={name}
        src={image}
    />;
}

export default Card;