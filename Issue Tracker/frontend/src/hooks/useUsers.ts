import { useEffect, useState } from "react";
import axios from "axios";
import { IUser, IUserOption } from "../types";

export function useUsers() {
    const [userOptions, setUserOptions] = useState<IUserOption[]>([]);
    const [userIdToName, setUserIdToName] = useState<Record<string, string>>({});

    useEffect(() => {
        axios.get("/api/users").then(res => {
            const options: IUserOption[] = [];
            const mapping: Record<string, string> = {};

            res.data.forEach((user: IUser) => {
                options.push({ value: user.id, label: user.username });
                mapping[user.id] = user.username;
            });

            setUserOptions(options);
            setUserIdToName(mapping);
        });
    }, []);

    return { userOptions, userIdToName };
}
