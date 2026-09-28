/**
 * Validates hand-edited progress content (src/_data/shipping.json) at build
 * time. Mirrors parseProgressItems in the SolidStart rebuild
 * (src/lib/progressItems.ts), so one JSON file works in both.
 *
 * Throws on unknown fields and statuses, so a typo fails the Vercel build and
 * the live site keeps its last good deploy instead of rendering wrong tiles.
 * Lives outside src/ so it is never copied to the public site.
 */

const PROGRESS_STATUSES = ["done", "in-progress", "planned"];
// Brand hues; a tile without an image uses the hue's light stop.
const PROGRESS_COLORS = ["red", "blue", "green", "blush", "blonde", "orange"];
const OPTIONAL_KEYS = ["note", "href", "image", "imageAlt"];
const KNOWN_KEYS = new Set(["title", "status", "color", ...OPTIONAL_KEYS]);

const isUrl = (value) => value.startsWith("/") || value.startsWith("https://");

function parseProgressItems(raw) {
	if (!Array.isArray(raw)) {
		throw new Error("Progress items must be an array");
	}

	return raw.map((entry, index) => {
		const where = `Progress item ${index + 1}`;
		if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
			throw new Error(`${where} must be an object`);
		}

		for (const key of Object.keys(entry)) {
			if (!KNOWN_KEYS.has(key)) {
				throw new Error(`${where} has an unknown field "${key}"`);
			}
		}

		const { title, status } = entry;
		if (typeof title !== "string" || title.trim() === "") {
			throw new Error(`${where} needs a title`);
		}
		if (!PROGRESS_STATUSES.includes(status)) {
			throw new Error(
				`${where} ("${title}") has status "${String(status)}"; use one of ${PROGRESS_STATUSES.join(", ")}`,
			);
		}

		const item = { title, status };
		if (entry.color !== undefined) {
			if (!PROGRESS_COLORS.includes(entry.color)) {
				throw new Error(
					`${where} ("${title}") has color "${String(entry.color)}"; use one of ${PROGRESS_COLORS.join(", ")}`,
				);
			}
			item.color = entry.color;
		}
		for (const key of OPTIONAL_KEYS) {
			const value = entry[key];
			if (value === undefined) continue;
			if (typeof value !== "string" || value.trim() === "") {
				throw new Error(`${where} ("${title}") has an empty or non-text "${key}"`);
			}
			if ((key === "href" || key === "image") && !isUrl(value)) {
				throw new Error(
					`${where} ("${title}") has "${key}" "${value}"; use a path starting with "/" or an https URL`,
				);
			}
			item[key] = value;
		}
		return item;
	});
}

module.exports = { parseProgressItems };
