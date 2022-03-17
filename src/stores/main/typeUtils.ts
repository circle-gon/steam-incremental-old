import type {
  GenericObjectType,
  GenericArrayType,
  GenericObjectTypeType,
} from "./types";

function isInputTypeArray(obj: unknown): obj is GenericArrayType {
  return Array.isArray(obj);
}
function isInputTypeObject(obj: unknown): obj is GenericObjectType {
  return typeof obj === "object" && obj !== null && !isInputTypeArray(obj);
}

function isInputType(obj: unknown): obj is GenericObjectTypeType {
  return isInputTypeArray(obj) || isInputTypeObject(obj);
}

export { isInputTypeArray, isInputTypeObject, isInputType };
