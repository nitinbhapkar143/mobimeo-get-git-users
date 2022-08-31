export default interface IUserResponse {
    total: number;
    users : Array<ISingleUser>;
}

export interface ISingleUser {
    username : string,
    name : string,
    avatar_url : string,
    followers : number,
    following : number,
    location : string
}


