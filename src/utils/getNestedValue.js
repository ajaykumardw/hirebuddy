export function getNestedValue(obj, path, defaultValue = undefined) {
  return path
    .split('.')
    .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj)
    ?? defaultValue;
}
