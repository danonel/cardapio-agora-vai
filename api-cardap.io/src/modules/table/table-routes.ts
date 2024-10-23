import { Router } from "express";
import { GetTables } from "./get-tables";
import { JoinTable } from "./join-table";

export const router = Router();

router.get("/tables", async (_, res, next) => {
  try {
    const getTables = GetTables.execute;
    const tables = await getTables();
    res.json({ tables });
  } catch (error) {
    next(error);
  }
});

router.post("/tables/:tableId/members", async (req, res, next) => {
  const { tableId } = req.params;
  const { members } = req.body;

  if (!tableId && !members) {
    res.status(400).json({
      message: "invalid body",
    });
  }
  try {
    const joinTable = JoinTable.execute;
    await joinTable(members, tableId);
    res.status(200).json({ message: "Members updated successfully" });
  } catch (error) {
    next(error);
  }
});
