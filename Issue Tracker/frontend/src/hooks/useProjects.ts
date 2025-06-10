import { useEffect, useState } from "react";
import axios from "axios";
import { IProject } from "../types";

export function useProjects(userId: string | undefined, role: string | undefined) {
    const [projects, setProjects] = useState<IProject[]>([]);

    const fetchProjects = async () => {
        try {
            const res = await axios.get(
                role === "admin" ? `/api/projects` : `/api/projects/member-of/${userId}`
            );
            setProjects(res.data);
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    useEffect(() => {
        if (userId) fetchProjects();
    }, [userId]);

    return { projects, setProjects };
}
