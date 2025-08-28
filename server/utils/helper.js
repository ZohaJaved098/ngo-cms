const toArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
    if (val.includes(",")) {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return val.trim() ? [val.trim()] : [];
  }
  return [];
};

const toBool = (val) => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const v = val.toLowerCase();
    return v === "true" || v === "1" || v === "yes";
  }
  return false;
};

module.exports = {
  toArray,
  toBool,
};
