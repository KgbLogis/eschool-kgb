import { useState } from "react";

export function ReFill (type) {
    const [reFill, setReFill] = useState(true);
    if (type) {
        setReFill(type);
    }
    return reFill
}