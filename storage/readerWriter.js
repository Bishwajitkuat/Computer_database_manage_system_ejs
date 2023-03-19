"use strict";

const fs = require("fs");

async function readStorage(storageFilePath) {
  try {
    const data = await fs.promises.readFile(storageFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log("error from readStorage:", err);
    return [];
  }
}

// returns true on success and false if failed
async function writeStorage(storageFilePath, data) {
  try {
    await fs.promises.writeFile(
      storageFilePath,
      JSON.stringify(data, null, 4),
      {
        encoding: "utf-8",
        flag: "w",
      }
    );
    return "success";
  } catch (err) {
    return false;
  }
}

module.exports = { readStorage, writeStorage };
