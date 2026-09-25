import test from "node:test";
import assert from "node:assert/strict";
import { assignCourts, compactPlayerName, eloDelta, isValidScore } from "../lib/domain";

test("scores need a winner and a two-point lead", () => {
  assert.equal(isValidScore(2, 0), true);
  assert.equal(isValidScore(11, 10), false);
  assert.equal(isValidScore(13, 11), true);
  assert.equal(isValidScore(0, 0), false);
});
test("Elo rewards an upset more than an expected result", () => {
  assert.ok(eloDelta(900, 1100, 11, 8) > eloDelta(1100, 900, 11, 8));
});
test("court assignment never gives a player two matches", () => {
  const result = assignCourts([{ id:"a", status:"ready", order:1, participants:["p1","p2"], courtNumber:null }, { id:"b", status:"ready", order:2, participants:["p1","p3"], courtNumber:null }, { id:"c", status:"ready", order:3, participants:["p4","p5"], courtNumber:null }], 2);
  assert.equal(result.filter(m => m.status === "assigned").length, 2);
  assert.equal(result.find(m => m.id === "b")?.status, "ready");
});
test("the next eligible match takes the court that becomes free", () => {
  const result = assignCourts([
    { id:"court-one-finished", status:"completed", order:1, participants:["p1","p2"], courtNumber:null },
    { id:"court-two-active", status:"assigned", order:2, participants:["p3","p4"], courtNumber:2 },
    { id:"next", status:"ready", order:3, participants:["p5","p6"], courtNumber:null }
  ], 2);
  const next = result.find(match => match.id === "next");
  assert.equal(next?.status, "assigned");
  assert.equal(next?.courtNumber, 1);
});
test("compact player names retain the final name", () => {
  assert.equal(compactPlayerName("Ton That Nhat Minh"), "TTNMinh");
  assert.equal(compactPlayerName("Minh"), "Minh");
});
