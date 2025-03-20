import { useState } from "react";

interface SeeMoreTextProps {
    text: string;
    maxLength?: number;
}

export default function SeeMoreText({ text, maxLength = 100 }: SeeMoreTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div>
            <p>
                {isExpanded ? text : text.length > maxLength ? `${text.substring(0, maxLength)}...` : text}
            </p>
            {text.length > maxLength && (
                <button onClick={toggleExpand} className="text-blue-500 underline">
                    {isExpanded ? "See less" : "See more"}
                </button>
            )}
        </div>
    );
}
