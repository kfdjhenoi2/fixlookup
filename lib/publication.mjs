/**
 * The public publication gate. Records that fail this check may remain in the
 * editorial knowledge files, but they must never be exposed by public routes,
 * search, navigation, metadata, structured data, or sitemaps.
 *
 * @template {{ verificationStatus: string, isFictional?: boolean }} T
 * @param {T} record
 */
export function isVerifiedForPublication(record) {
  return record.verificationStatus === "verified" && record.isFictional !== true;
}

/**
 * @template {{ verificationStatus: string, isFictional?: boolean }} T
 * @param {T[]} records
 */
export function verifiedForPublication(records) {
  return records.filter(isVerifiedForPublication);
}
