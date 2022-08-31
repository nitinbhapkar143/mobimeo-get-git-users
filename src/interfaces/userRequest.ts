export default interface IUserRequest {
    language: string;
    sort ?: "followers" | "repositories" | "joined" | undefined;
    order ?: "asc" | "desc" | undefined;
    per_page ?: number;
    page ?: number;
}