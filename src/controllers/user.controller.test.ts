import GitUsers from "./user.controller"
import IUserRequest from "../interfaces/userRequest";

test("it should pass", async () => {
    expect(true).toBe(true);
});

test("should have total and users property", async () => {
    const controller = new GitUsers();
    const query : IUserRequest = {
        language : "Golang",
        per_page : 10
    }
    const response = await controller.getUsers(query);
    expect(response).toHaveProperty('total')
    expect(response).toHaveProperty('users')
});

test("should return 10 users", async () => {
    const controller = new GitUsers();
    const query : IUserRequest = {
        language : "Golang",
        per_page : 10
    }
    const response = await controller.getUsers(query);
    expect(response.users.length).toBe(10);
});

test("should return 30 users", async () => {
    const controller = new GitUsers();
    const query : IUserRequest = {
        language : "Golang",
        per_page : 30
    }
    const response = await controller.getUsers(query);
    expect(response.users.length).toBe(30);
});
