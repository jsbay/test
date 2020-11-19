import { Context } from "egg";

export default {
  isAjax,
};

const isAjax = function (this: Context) {
  return this.get("X-Requested-With") === "XMLHttpRequest";
};
