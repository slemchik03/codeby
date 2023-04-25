export default interface IServerResponse<T> {
    status: boolean;
    errors: { [key: string]: string } | null;
    data: T
}