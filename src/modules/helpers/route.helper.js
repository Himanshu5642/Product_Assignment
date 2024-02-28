import { checkError } from "./checkError.helper.js";

export const wrapAsync = (fn) => {
  return (req, res) => {
    return fn(req, res)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        console.log(err);
        let resp = checkError(err)
        res.status(401).send(resp);
      });
  };
};
