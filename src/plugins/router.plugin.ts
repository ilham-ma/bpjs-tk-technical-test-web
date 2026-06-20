import { createWebHistory, createRouter, type RouteRecord } from "vue-router";

function loadRoutes(): RouteRecord[] {
  const modules: Record<string, { default: RouteRecord[] }> = import.meta.glob(
    "/src/modules/**/*.route.*",
    {
      eager: true,
    },
  );

  const routes: { default: RouteRecord[] }[] = Object.values(modules);

  return routes.reduce((acc: RouteRecord[], item) => {
    acc.push(...item.default);
    return acc;
  }, []);
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...loadRoutes(),
    {
      path: "/",
      name: "EntryPoint",
      redirect: () => ({ name: "User" }),
    },
  ],
});
