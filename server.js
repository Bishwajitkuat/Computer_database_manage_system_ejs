"use strict";
const express = require("express");
const app = express();
const { port, host } = require("./config.json");
const path = require("path");
const {
  getAllFormStorage,
  getFormStorage,
  addToStorage,
  updateStorage,
  removeFromStorage,
} = require("./storage/storageLayer");
const { newPCDataCheck } = require("./postDataCheck");
const { urlencoded } = require("express");
// express usages
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
urlencoded({ extended: false });
// server listening
app.listen(port, host, () => console.log(`serving at ${host}:${port}`));
// server at root
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/template/home.html"))
);
// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "template"));

// response at all
app.get("/all", async (req, res) => {
  const data = await getAllFormStorage();
  res.render("allComputers", { result: data, header: "All Computers" });
});

// response at searchById
app.get("/searchById", (req, res) => {
  res.render("searchId", {
    header: "Search by ID",
    btnTxt: "Search by ID",
    action: "/searchId",
  });
});

app.post("/searchId", async (req, res) => {
  try {
    const id = await req.body.id;
    const found = await getFormStorage(id);
    if (found.length > 0) {
      res.render("allComputers", { result: found, header: "Search Result" });
    } else
      throw new Error(
        `Computer with id: ${id} con not be found in the database.`
      );
  } catch (error) {
    res.render("notify", {
      header: "Search Result",
      message: error.message,
      status: "reject",
    });
  }
});

// response at addComputer

app.get("/addComputer", (req, res) => {
  res.render("addComputer", {
    header: "Add new Computer",
    action: "/addComputer",
  });
});

app.post("/addComputer", async (req, res) => {
  try {
    const newPc = await req.body;
    const checkData = newPCDataCheck(newPc);
    if (checkData) {
      const addStatus = await addToStorage(checkData);
      const resSuccessObj = {
        header: "Success!",
        message: "New computer is added successfully!",
        status: "done",
      };
      res.render("notify", resSuccessObj);
    } else {
      throw new Error("Please fill up all the fields with correct values!");
    }
  } catch (error) {
    const resRejectObj = {
      header: "Failed",
      message: error.message,
      status: "reject",
    };
    res.render("notify", resRejectObj);
  }
});
// removing computer from database
app.get("/removeComputer", (req, res) =>
  res.render("searchId", {
    header: "Remove Computer",
    btnTxt: "Remove by ID",
    action: "/removeComputer",
  })
);

app.post("/removeComputer", async (req, res) => {
  try {
    const id = await req.body.id;
    const removeStatus = await removeFromStorage(id); // return success or false
    if (removeStatus) {
      const rmvObj = {
        header: "Remove success!",
        message: `Computer with id: ${id} is removed successfully!`,
        status: "done",
      };
      res.render("notify", rmvObj);
    } else
      throw new Error(
        `Computer with id: ${id} con not be found in the database.`
      );
  } catch (error) {
    res.render("notify", {
      header: "Removing failded",
      message: error.message,
      status: "reject",
    });
  }
});
