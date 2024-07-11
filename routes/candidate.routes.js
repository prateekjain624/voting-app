import express from "express";
import {
  deleteCandidate,
  getAllCandidate,
  newCandidate,
  updateCandidate,
  votingCandidate,
  votingCount,
} from "../controller/candidate.controller.js";

import authorization from "../middlewares/auth.js";

const candidateRouter = express.Router();

candidateRouter.post("/newcandidate", authorization, newCandidate);
candidateRouter.put(
  "/updatecandidate/:candidateId",
  authorization,
  updateCandidate
);
candidateRouter.delete(
  "/votecandidate/:candidateId",
  authorization,
  deleteCandidate
);
candidateRouter.post(
  "/votecandidate/:candidateId",
  authorization,
  votingCandidate
);
candidateRouter.get("/votingcount", votingCount);
candidateRouter.get("/allcandidates", getAllCandidate);

export default candidateRouter;
