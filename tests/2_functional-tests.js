const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");

suite("Functional Tests", () => {
  test("Translation with text and locale fields", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        locale: "british-to-american",
        text: "Tea time is usually around 4 or 4.30.\n"
      })
      .end(function(err, res) {
        assert.strictEqual(err, null);
        assert.isObject(res.body);
        assert.property(res.body, "text");
        assert.property(res.body, "translation");
        assert.strictEqual(
          res.body.text,
          "Tea time is usually around 4 or 4.30.\n"
        );
        assert.strictEqual(
          res.body.translation,
          'Tea time is usually around 4 or <span class="highlight">4:30</span>.\n'
        );
        done();
      });
  });
  test("Translation with text and invalid locale field", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        locale: "invalid",
        text: "Tea time is usually around 4 or 4.30.\n"
      })
      .end(function(err, res) {
        assert.strictEqual(err, null);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.strictEqual(res.body.error, "Invalid value for locale field");
        done();
      });
  });
  test("Translation with missing text field", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        locale: "british-to-american"
      })
      .end(function(err, res) {
        assert.strictEqual(err, null);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.strictEqual(res.body.error, "Required field(s) missing");
        done();
      });
  });
  test("Translation with missing locale field", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "text"
      })
      .end(function(err, res) {
        assert.strictEqual(err, null);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.strictEqual(res.body.error, "Required field(s) missing");
        done();
      });
  });
  test("Translation with empty text", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "",
        locale: "british-to-american"
      })
      .end(function(err, res) {
        assert.strictEqual(err, null);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.strictEqual(res.body.error, "No text to translate");
        done();
      });
  });
  test("Translation with text that needs no translation", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "Have you met Mrs Kalyani?\n",
        locale: "american-to-british"
      })
      .end(function(err, res) {
        assert.strictEqual(err, null);
        assert.isObject(res.body);
        assert.property(res.body, "text");
        assert.property(res.body, "translation");
        assert.strictEqual(res.body.text, "Have you met Mrs Kalyani?\n");
        assert.strictEqual(
          res.body.translation,
          "Everything looks good to me!"
        );
        done();
      });
  });
});
