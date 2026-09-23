/** Metro resolves a bundled font file to its asset id. */
declare module "*.ttf" {
  const asset: number;
  export default asset;
}
