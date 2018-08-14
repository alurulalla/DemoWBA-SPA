import { IncidentRepository } from "./IncidentRepository";

export interface BotResponse {
    botMessage: string;
    incidentRepository: IncidentRepository[];
}