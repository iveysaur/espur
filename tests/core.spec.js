var hippie = require('hippie');
var fs = require('fs');

var authkey = "";

function api() {
	return hippie()
		.json()
		.base('http://localhost:1299/api/')
		.header('x-x', authkey);
}

function expectStructure(body, structure) {
	for (key in structure) {
		if (typeof body[key] != structure[key])
			return new Error(key + " is a " + (typeof body[key]) + ", not a " + structure[key]);
	}
	return null;
}

describe("User signup", function() {
	it("should create a new user with valid data", function(done) {
		api()
			.post("user/create")
			.send({
				username: "joe",
				password: "test",
				email: "jaxbot@gmail.com"
			})
			.expectStatus(200)
			.end(done)
	});
});

describe("User signin", function() {
	it("should sign in successfully", function(done) {
		api()
			.post("user/login")
			.send({
				username: "joe",
				password: "test",
			})
			.expectStatus(200)
			.expect(function(res, body, next) {
				authkey = body;
				next();
			})
			.end(done);
	});
});

describe("Getting questions from API", function() {
	it("should get valid answer objects", function(done) {
		api()
			.get("question/answer")
			.expectStatus(200)
			.expect(function(res, body, next) {
				next(expectStructure(body[0], {
					id: "number",
					categoryid: "number",
					answer: "string"
				}));
			})
			.expect(function(res, body, next) {
				var err = null;

				if (!Array.isArray(body))
					err = new Error("Did not get array from server");

				next(err);
			})
			.end(done);
	});
	it("should not work if unauthenticated", function(done) {
		api()
			.header('x-x', '')
			.get("question/answer")
			.expectStatus(404)
			.end(done);
	});

	it("should get valid question objects", function(done) {
		api()
			.get("question/question")
			.expectStatus(200)
			.expect(function(res, body, next) {
				expect(Array.isArray(body.answers)).toBe(true);
				body.answers.forEach(function(answer) {
					expect(expectStructure(answer, {
						id: "number",
						categoryid: "number",
						answer: "string"
					})).toBe(null);
				});
				next();
			})
			.end(function(err, res, body) {
				console.log(body);
				done();
			});
	});
});

describe("Posting an entry", function() {
	var imageData = fs.readFileSync(__dirname + "/test.jpg", "base64");
	it("should be able to upload a selfie", function(done) {
		api()
			.post("question/upload/1/1")
			.send(imageData)
			.expectStatus(200)
			.end(done);
	});

	it("should not work if unauthenticated", function(done) {
		api()
			.header('x-x', '')
			.post("question/upload/1/1")
			.expectStatus(404)
			.end(done);
	});
});

