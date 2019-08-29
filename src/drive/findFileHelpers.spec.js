const findFileHelpers = require("./findFileHelpers.js");
const mock = [{
	tagsCopy: [
		"faculty",
		"custard",
		"custaru",
		"jump",
		"dishwasher",
		"kitchen",
		"long"
	]
}, {
	tagsCopy: ["faculty",
		"professor",
		"custard",
		"knocks",
		"down",
		"ripple",
		"rug",
		"for",
		"his",
		"lesson",
		"really",
		"custard",
		"mailbag",
		"2017-06-17",
		"lagshiga"]
}, {
	tagsCopy: ["faculty",
		"custard",
		"custaru",
		"dj",
		"shaka",
		"let",
		"me",
		"out",
		"custard",
		"2017-12-09",
		"confuse"]
}, {
	tagsCopy: ["quiche",
		"lorraine",
		"faculty",
		"custard",
		"custard",
		"checks",
		"up",
		"on",
		"quiche",
		"2017",
		"01",
		"02",
		"leeloosdad"]
}, {
	tagsCopy: ["faculty", "custard", "custaru", "dishwasher", "jump", "kitchen"]
}, {
	tagsCopy: ["faculty",
		"custard",
		"maggie",
		"custard",
		"stuck",
		"in",
		"shoe",
		"maggie",
		"attacks",
		"2017-12-28",
		"leeloosdad"]
}];
const mockDistinct = [{
	tagsCopy:
		["faculty",
			"custard",
			"custaru",
			"jump",
			"dishwasher",
			"kitchen",
			"long"]
},
{
	tagsCopy:
		["faculty",
			"professor",
			"custard",
			"knocks",
			"down",
			"ripple",
			"rug",
			"for",
			"his",
			"lesson",
			"really",
			"mailbag",
			"2017-06-17",
			"lagshiga"]
},
{
	tagsCopy:
		["faculty",
			"custard",
			"custaru",
			"dj",
			"shaka",
			"let",
			"me",
			"out",
			"2017-12-09",
			"confuse"]
},
{
	tagsCopy:
		["quiche",
			"lorraine",
			"faculty",
			"custard",
			"checks",
			"up",
			"on",
			"2017",
			"01",
			"02",
			"leeloosdad"]
},
{
	tagsCopy:
		["faculty", "custard", "custaru", "dishwasher", "jump", "kitchen"]
},
{
	tagsCopy:
		["faculty",
			"custard",
			"maggie",
			"stuck",
			"in",
			"shoe",
			"attacks",
			"2017-12-28",
			"leeloosdad"]
}];
const mockWithMatches = [
	{
		"matches": 2,
		"tagsCopy": [
			"faculty",
			"custard",
			"custaru",
			"jump",
			"dishwasher",
			"kitchen",
			"long"]
	},
	{
		"matches": 1,
		"tagsCopy": [
			"faculty",
			"professor",
			"custard",
			"knocks", "down", "ripple", "rug", "for", "his", "lesson", "really", "mailbag", "2017-06-17", "lagshiga"]
	}, {
		"matches": 1,
		"tagsCopy": [
			"faculty", "custard", "custaru", "dj", "shaka", "let", "me", "out", "2017-12-09", "confuse"]
	}, {
		"matches": 1,
		"tagsCopy": ["quiche", "lorraine", "faculty", "custard", "checks", "up", "on", "2017", "01", "02", "leeloosdad"]
	}, {
		"matches": 2, "tagsCopy": ["faculty", "custard", "custaru", "dishwasher", "jump", "kitchen"]
	}, { "matches": 1, "tagsCopy": ["faculty", "custard", "maggie", "stuck", "in", "shoe", "attacks", "2017-12-28", "leeloosdad"] }];

describe("makeTagsDistinct", () => {
	test("butts", () => {
		const input = Object.assign([], mock);
		const actual = findFileHelpers.makeTagsDistinct(input);
		const expected = mockDistinct;
		expect(actual).toEqual(expected);
	});
});
describe("findMatches", () => {
	test("butts", () => {
		const input = Object.assign([], mockDistinct);
		const actual = findFileHelpers.findMatches(["custard", "dishwasher"], input);
		const expected = mockWithMatches;
		expect(actual).toEqual(expected);
	});
});
describe("bestMatches", () => {
	test("butts", () => {
		const input = Object.assign([], mockWithMatches);
		const actual = findFileHelpers.bestMatches(input);
		const expected = [{ "matches": 2, "tagsCopy": ["faculty", "custard", "custaru", "jump", "dishwasher", "kitchen", "long"] }, {
			"matches": 2, "tagsCopy": ["faculty", "custard", "custaru", "dishwasher", "jump", "kitchen"]
		}];
		expect(actual).toEqual(expected);
	});
});