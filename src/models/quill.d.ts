import { Quill as QuillType } from "quill";

declare module "quill" {
  interface QuillStatic extends QuillType {
    import(path: string): unknown; // any 대신 unknown
    register(path: string, def: unknown, overwrite?: boolean): void;
  }

  const Quill: QuillStatic;
  export default Quill;
}
