const axios = require("axios");

const baseurl = "http://localhost:5000/api";

describe("Users Route Test", () => {
    let token;
    test("sign up of new user", () => {
        return axios
            .post(baseurl + "/signup", {
                firstname: 'Anjana',
                lastname: 'Thapa',
                password: '123456',
                email: 'atm13138@gmail.com',
               
            })
            .then(response => {
                expect(response.data.status).toMatch("Signup success!");
            })
            .catch(err => { });
    });

    test("login of existing user", () => {
        return axios
            .post(baseurl + "/login", {
                email: "anjanathapamagar13138@gmail.com",
                password: "123456"
            })
            .then(response => {
                token = response.data.token;
                expect(response.status).toBe(200);
                expect(response.data.status).toMatch("Login Successful!");
            })
            .catch(err => { });
    });
});
