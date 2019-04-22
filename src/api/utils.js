import uuidv4 from "uuid/v4";
import sh from "shorthash";

function getNewGuid() {
  return uuidv4();
}

function getNewGuidWithHash() {
  const id = uuidv4();
  console.log("getNewGuidWithHash", id);
  const hash = sh.unique(id);
  return { id, hash };
}

export default { getNewGuid, getNewGuidWithHash }