export const valid_exts = ["gif", "webp"];
export const valid_ext_regex = new RegExp(`\\.(${valid_exts.join("|")})$`);

export function getExt(a: string): string | undefined {
  return a.split(".").pop();
}
