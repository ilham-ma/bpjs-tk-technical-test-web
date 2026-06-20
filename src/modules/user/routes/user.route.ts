const routes = [
  {
    path: "/user",
    name: "User",
    component: () => import("../views/UserUI.vue"),
  },
];

export default routes;
