
export class TextMessage {
    public message: string;
    public connectionId: string;
    public time: string;
    public name: string;
    public type:string|null=null;

    constructor(message: string, connectionId: string, time: string, name: string) {
        this.message = message;
        this.connectionId = connectionId;
        this.time = time;
        this.name = name;
    }
}