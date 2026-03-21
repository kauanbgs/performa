import { useEffect, useState } from "react";
import Text from "./Text";

export default function Alert({ type, message }: { type: string, message: string }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
        }
    }, [message]);

    if (!message) return null;

    const isSuccess = type === "success";

    return (
        <div
            className={`flex items-center p-4 rounded-xl border w-[50%] h-12 mx-auto justify-center font-secondary
                ${isSuccess
                    ? "bg-green-50 border-green-300 text-green-800"
                    : "bg-red-100 border-red-300 text-red-800"
                }
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
            `}
        >
            <Text variant="text" className="text-center" font="secondary">{message}</Text>
        </div>
    );
}