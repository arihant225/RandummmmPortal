export class StreamOffer {
    public name: string;
    public id: string;
    public streamOffer: RTCSessionDescriptionInit;

    constructor(name: string, id: string, streamOffer: RTCSessionDescriptionInit) {
        this.name = name;
        this.id = id;
        this.streamOffer = streamOffer;
    }
}
