var frisby = require("frisby");

var URL = "http://localhost:1299/";
var API = URL + "api/";

var authkey = "";

function frisbyAuth(description) {
	var c = frisby.create(description);
	c.current.request = { headers: { 'x-x': authkey, 'x-test': description }};
	return c;
}

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

describe("User signin", function() {
	it("Should sign in successfully", function(done) {
		frisby.create("Sign in as test user we just created")
			.post(API + "user/login", {
				username: "joe",
				password: "test",
			}, { json: true })
			.expectStatus(200)
			.after(function(err, res, body) {
				authkey = body;
				frisbyAuth("Get answer using new authkey")
					.get(API + "question/answer")
					.expectStatus(200)
					.after(function(err, res, body) {
						console.log(body);
					})
				.toss();
			})
			.toss();
		done();
	});
});

describe("Getting questions from API", function() {
	it("Should get valid answer objects", function() {
		frisbyAuth("Get valid answer object")
			.get(API + "question/answer")
			.expectStatus(200)
			.expectJSONTypes('0', {
				answer: String,
				id: Number,
				categoryid: Number
			})
			.toss();
	});
});

