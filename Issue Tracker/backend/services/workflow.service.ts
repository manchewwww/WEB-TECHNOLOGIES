import { StatusType } from "../constants/StatusType";
import { ITicket } from "../db/interfaces/ticket.interface";
import InvalidStatusError from "../exceptions/InvalidStatusException";

interface Workflow {
    status: string;
    transitions: string[];
}

const workflows: Record<string, Workflow> = {
    "open": { status: "open", transitions: ["in_progress"] },
    "in_progress": { status: "in_progress", transitions: ["review"] },
    "review": { status: "review", transitions: ["in_progress", "closed"] },
    "closed": { status: "closed", transitions: [] },
};

const canTransition = (currentStatus: StatusType, newStatus: StatusType): boolean => {
    const workflow = workflows[currentStatus.toString()];
    return workflow ? workflow.transitions.includes(newStatus.toString()) : false;
};

export const updateWorkflow = (ticket: ITicket, newStatus: StatusType): ITicket => {
    if (!canTransition(ticket.status, newStatus)) {
        throw new InvalidStatusError(`Cannot transition from ${ticket.status} to ${newStatus}`);
    }
    ticket.status = newStatus;
    return ticket;
};
