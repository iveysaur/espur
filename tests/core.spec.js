var frisby = require("frisby");

var URL = "http://localhost:1299/";
var API = URL + "api/";

describe("User signup", function() {
	frisby.create("Create a new user with valid data")
		.post(API + "user/create", {
			username: "joe",
			password: "test",
			email: "jaxbot@gmail.com"
		}, { json: true })
		.expectStatus(200)
		.toss();
});
