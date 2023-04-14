import { Router } from "express";
import { createWarEffort, 
         getActiveWarEfforts,
         createWarEffortQuest } from "./controller.js";

export const loadWarEffortRoutes = () => {
    const router = Router();
    router.post('/create/war-effort', createWarEffort);
    router.get('/war-efforts', getActiveWarEfforts);
    router.post('/create/war-effort/quest', createWarEffortQuest);
    return router
}