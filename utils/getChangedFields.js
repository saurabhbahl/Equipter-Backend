/**
 * Compare two record objects and return the changed fields.
 * 
 * @param {Object} oldRecord - The old record object from old_records array
 * @param {Object} newRecord - The new record object from new_records array
 * @returns {Object} An object listing changed fields with old/new values
 */
export default function getChangedFields(oldRecord, newRecord) {
  const changedFields = {};

  // Combine all unique keys that appear in either oldRecord or newRecord.
  const allKeys = new Set([
    ...Object.keys(oldRecord), 
    ...Object.keys(newRecord)
  ]);

  for (const key of allKeys) {
    const oldVal = oldRecord[key];
    const newVal = newRecord[key];

    // If they are strictly not equal (both value and type)
    if (oldVal !== newVal) {
      changedFields[key] = {
        oldValue: oldVal,
        newValue: newVal
      };
    }
  }
  return changedFields;
}
