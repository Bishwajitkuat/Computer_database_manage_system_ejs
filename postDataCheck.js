function newPCDataCheck(obj) {
  if (obj.id && obj.name && obj.type && obj.processor && obj.amount) {
    return Object.assign(obj, { id: +obj.id, amount: +obj.amount });
  } else return false;
}

module.exports = { newPCDataCheck };
