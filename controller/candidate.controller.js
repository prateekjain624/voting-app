import candidate from "../models/candidate.schema.js";
import User from "../models/user.schema.js";

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user.role === "admin") {
      return true;
    }
  } catch {
    return false;
  }
};

export const newCandidate = async (req, res) => {
  const userId = req.user.userId;
  if (!(await checkAdminRole(userId))) {
    return res
      .status(401)
      .json({ message: "You are not authorized to perform this action" });
  }

  try {
    const { name, age, party } = req.body;
    const newCandidate = new candidate({
      name: name,
      age: age,
      party: party,
    });

    const response = await newCandidate.save();
    res
      .status(201)
      .json({ msg: "candidate created succesfully", candidate: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateCandidate = async (req, res) => {
  const userId = req.user.userId;
  if (!(await checkAdminRole(userId))) {
    return res
      .status(401)
      .json({ message: "You are not authorized to perform this action" });
  }

  try {
    const candidateId = req.params.candidateId;
    const { name, age, party } = req.body;
    const oldCandidate = await candidate.findById(candidateId);
    if (!oldCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    oldCandidate.name = name;
    oldCandidate.age = age;
    oldCandidate.party = party;

    await oldCandidate.save();
    res.status(200).json({ msg: "Candidate updated succesfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    if (!checkAdminRole(req.user.userId))
      return res.status(403).json({ message: "user does not have admin role" });

    const candidateID = req.params.candidateId; // Extract the id from the URL parameter

    const response = await candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("candidate deleted");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const votingCandidate = async (req, res) => {
  try {
    const userId = req.user.userId;
    const candidateId = req.params.candidateId;
    const Candidate = await candidate.findById(candidateId);
    if (!Candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role === "admin") {
      return res
        .status(401)
        .json({ message: "You are not authorized to vote the candidate." });
    }

    if (user.isVoted === true) {
      return res
        .status(401)
        .json({ message: "You have already voted the candidate." });
    }

    Candidate.votes.push(user);
    Candidate.voteCount++;
    await Candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({ msg: "Candidate voted succesfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const votingCount = async (req, res) => {
  try {
    const Candidates = await candidate.find({}).sort({ voteCount: "desc" });
    if (!Candidates) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const votingRecord = Candidates.map((candidate) => {
      return {
        name: candidate.name,
        voteCount: candidate.voteCount,
      };
    });
    res.status(200).json({ votingRecord: votingRecord });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllCandidate = async (req, res) => {
  try {
    const AllCandidates = await candidate.find({}, "name party -_id");
    if (!AllCandidates) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.status(200).json({ candidates: AllCandidates });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
