import { useMemo, useState } from "react"
import "./App.css"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const API_BASE_URL = "https://ai-recruiter-backend-7vet.onrender.com"

function App() {
  const [jobDescription, setJobDescription] = useState("")
  const [topN, setTopN] = useState(5)
  const [datasetFile, setDatasetFile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [results, setResults] = useState(null)
  const [resumeResult, setResumeResult] = useState(null)
  const [interviewQuestions, setInterviewQuestions] = useState({})
  const [datasetLoading, setDatasetLoading] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState("")

  const candidates = results?.candidates || []

  const selectedCandidate =
    candidates.find(
      (candidate) => String(candidate.candidate_id) === String(selectedCandidateId)
    ) || candidates[0]

  const averageScore = useMemo(() => {
    if (candidates.length === 0) return 0

    const totalScore = candidates.reduce(
      (sum, candidate) => sum + Number(candidate.dynamic_score || 0),
      0
    )

    return (totalScore / candidates.length).toFixed(2)
  }, [candidates])

  const strongConfidenceCount = useMemo(
    () =>
      candidates.filter(
        (candidate) => Number(candidate.explainability?.confidence || 0) >= 80
      ).length,
    [candidates]
  )

  const scoreChartData = selectedCandidate
    ? [
        {
          name: "Dynamic Score",
          value: Number(selectedCandidate.dynamic_score || 0),
        },
        {
          name: "Confidence",
          value: Number(selectedCandidate.explainability?.confidence || 0),
        },
      ]
    : []

  const skillChartData = selectedCandidate
    ? [
        {
          name: "Matched Skills",
          value: selectedCandidate.jd_skill_matches?.length || 0,
        },
        {
          name: "Strengths",
          value: selectedCandidate.hiring_recommendation?.strengths?.length || 0,
        },
        {
          name: "Risks",
          value: selectedCandidate.hiring_recommendation?.risks?.length || 0,
        },
      ]
    : []

  const readApiResponse = async (response) => {
    const contentType = response.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      return response.json()
    }

    return {
      detail: await response.text(),
    }
  }

  const rankUploadedDataset = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a Job Description")
      return
    }

    if (!datasetFile) {
      alert("Please upload candidate dataset")
      return
    }

    try {
      setDatasetLoading(true)
      setResults(null)
      setSelectedCandidateId("")

      const formData = new FormData()
      formData.append("job_description", jobDescription)
      formData.append("top_n", String(topN))
      formData.append("file", datasetFile)

      const response = await fetch(`${API_BASE_URL}/api/rank/uploaded-dataset`, {
        method: "POST",
        body: formData,
      })

      const data = await readApiResponse(response)

      if (!response.ok) {
        alert(data.detail || "Dataset ranking failed")
        return
      }

      setResults(data)
      setSelectedCandidateId(
        data.candidates?.[0]?.candidate_id ? String(data.candidates[0].candidate_id) : ""
      )
    } catch (error) {
      console.error("Dataset Ranking Error:", error)
      alert("Backend server running hai ya nahi check karo.")
    } finally {
      setDatasetLoading(false)
    }
  }

  const analyzeResume = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a Job Description")
      return
    }

    if (!resumeFile) {
      alert("Please upload a resume")
      return
    }

    try {
      setResumeLoading(true)

      const formData = new FormData()
      formData.append("job_description", jobDescription)
      formData.append("file", resumeFile)

      const response = await fetch(`${API_BASE_URL}/api/resume/match`, {
        method: "POST",
        body: formData,
      })

      const data = await readApiResponse(response)

      if (!response.ok) {
        alert(data.detail || "Resume analysis failed")
        return
      }

      setResumeResult(data)
    } catch (error) {
      console.error("Resume Match Error:", error)
      alert("Backend server running hai ya nahi check karo.")
    } finally {
      setResumeLoading(false)
    }
  }

  const generateInterviewQuestions = async (candidate) => {
    if (!candidate) return

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/interview/questions?title=${encodeURIComponent(
          candidate.title || ""
        )}`
      )

      const data = await readApiResponse(response)

      if (!response.ok) {
        alert(data.detail || "Interview question generation failed")
        return
      }

      setInterviewQuestions((previous) => ({
        ...previous,
        [candidate.candidate_id]: data.questions || [],
      }))
    } catch (error) {
      console.error("Interview Question Error:", error)
      alert("Interview questions generate nahi ho paaye.")
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>AI Recruiter Agent</h1>
        <p>Bulk Candidate Ranking + Individual Resume Match Platform</p>
      </div>

      <div className="card">
        <h2>1. Job Description</h2>
        <p>Paste the hiring requirement.</p>

        <textarea
          rows="8"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
        />

        <label htmlFor="top-n">Top Candidates Required</label>
        <input
          id="top-n"
          type="number"
          min="1"
          max="100"
          value={topN}
          onChange={(event) => setTopN(Number(event.target.value))}
        />
      </div>

      <div className="card">
        <h2>2. Bulk Candidate Dataset Ranking</h2>
        <p>Upload CSV, JSON, or JSONL candidate dataset.</p>

        <input
          type="file"
          accept=".csv,.json,.jsonl"
          onChange={(event) => setDatasetFile(event.target.files?.[0] || null)}
        />

        {datasetFile && <p>Selected Dataset: {datasetFile.name}</p>}

        <button onClick={rankUploadedDataset} disabled={datasetLoading}>
          {datasetLoading ? "Ranking Dataset..." : "Rank Uploaded Dataset"}
        </button>
      </div>

      <div className="card">
        <h2>3. Individual Resume Match</h2>
        <p>This is independent from ranked candidate results.</p>

        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
        />

        {resumeFile && <p>Selected Resume: {resumeFile.name}</p>}

        <button onClick={analyzeResume} disabled={resumeLoading}>
          {resumeLoading ? "Analyzing Resume..." : "Analyze Resume Match"}
        </button>

        {resumeResult?.result && (
          <div className="candidate-card">
            <h3>Resume Match Result</h3>

            <p className="score">
              <strong>Match Score:</strong> {resumeResult.result.match_score}%
            </p>

            <p>
              <strong>Recommendation:</strong> {resumeResult.result.recommendation}
            </p>

            <p>
              <strong>Matched Skills:</strong>{" "}
              {(resumeResult.result.matched_skills || []).join(", ") || "None"}
            </p>

            <p>
              <strong>Missing Skills:</strong>{" "}
              {(resumeResult.result.missing_skills || []).join(", ") || "None"}
            </p>

            {resumeResult.result.why_score_low && (
              <>
                <h4>Why Score Is Low</h4>
                <ul>
                  {resumeResult.result.why_score_low.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {resumeResult.result.improvement_suggestions && (
              <>
                <h4>How To Improve Resume</h4>
                <ul>
                  {resumeResult.result.improvement_suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {resumeResult.result.project_suggestions && (
              <>
                <h4>Recommended Projects</h4>
                <ul>
                  {resumeResult.result.project_suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      {results && (
        <div className="card results">
          <h2>4. Interactive Recruiter Dashboard</h2>

          <div className="stats-grid dashboard-stats">
            <div className="stat-card">
              <h3>{candidates.length}</h3>
              <p>Candidates Returned</p>
            </div>

            <div className="stat-card">
              <h3>{results.total_records || 0}</h3>
              <p>Total Records Processed</p>
            </div>

            <div className="stat-card">
              <h3>{candidates[0]?.dynamic_score || 0}</h3>
              <p>Top Score</p>
            </div>

            <div className="stat-card">
              <h3>{averageScore}</h3>
              <p>Average Score</p>
            </div>

            <div className="stat-card">
              <h3>{strongConfidenceCount}</h3>
              <p>Strong Confidence</p>
            </div>
          </div>

          {candidates.length === 0 && <p>No candidates found.</p>}

          {candidates.length > 0 && (
            <div className="dashboard-layout">
              <div className="candidate-list-panel">
                <h3>Top Candidates</h3>

                <div className="candidate-card-grid">
                  {candidates.map((candidate, index) => (
                    <button
                      key={candidate.candidate_id || index}
                      className={`mini-candidate-card ${
                        String(selectedCandidate?.candidate_id) ===
                        String(candidate.candidate_id)
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedCandidateId(String(candidate.candidate_id))
                      }
                    >
                      <span className="rank-badge">#{index + 1}</span>
                      <strong>{candidate.title || "Unknown Title"}</strong>
                      <small>{candidate.company || "N/A"}</small>
                      <p>Score: {candidate.dynamic_score || 0}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="candidate-detail-panel">
                <div className="slicer-row">
                  <label htmlFor="candidate-slicer">Select Candidate</label>

                  <select
                    id="candidate-slicer"
                    value={selectedCandidate?.candidate_id || ""}
                    onChange={(event) => setSelectedCandidateId(event.target.value)}
                  >
                    {candidates.map((candidate, index) => (
                      <option
                        key={candidate.candidate_id || index}
                        value={candidate.candidate_id}
                      >
                        #{index + 1} - {candidate.title || "Unknown"} | Score{" "}
                        {candidate.dynamic_score || 0}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCandidate && (
                  <div className="selected-dashboard">
                    <div className="profile-card">
                      <h3>{selectedCandidate.title || "Unknown Title"}</h3>

                      <p>
                        <strong>ID:</strong> {selectedCandidate.candidate_id || "N/A"}
                      </p>

                      <p>
                        <strong>Company:</strong> {selectedCandidate.company || "N/A"}
                      </p>

                      <p>
                        <strong>Location:</strong> {selectedCandidate.location || "N/A"}
                      </p>

                      <p>
                        <strong>Experience:</strong> {selectedCandidate.experience || 0} years
                      </p>

                      <p className="score">
                        <strong>Dynamic Score:</strong> {selectedCandidate.dynamic_score || 0}
                      </p>

                      <p className="reason">
                        <strong>Reason:</strong> {selectedCandidate.reason || "No reason available"}
                      </p>
                    </div>

                    <div className="chart-card">
                      <h3>Candidate Score Breakdown</h3>

                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={scoreChartData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                      <h3>Skill Match Overview</h3>

                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            data={skillChartData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={90}
                            label
                          >
                            {skillChartData.map((entry, index) => (
                              <Cell
                                key={`${entry.name}-${index}`}
                                fill={index === 0 ? "#06b6d4" : index === 1 ? "#7c3aed" : "#f59e0b"}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="explain-box dashboard-box">
                      <h4>Why Selected</h4>

                      <p>
                        <strong>Confidence:</strong>{" "}
                        {selectedCandidate.explainability?.confidence || 0}%
                      </p>

                      <ul>
                        {(selectedCandidate.explainability?.why_selected || []).map(
                          (item, idx) => (
                            <li key={idx}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="explain-box dashboard-box">
                      <h4>Matched JD Skills</h4>

                      <div className="skill-chip-wrap">
                        {(selectedCandidate.jd_skill_matches || []).length > 0 ? (
                          selectedCandidate.jd_skill_matches.map((skill, idx) => (
                            <span key={idx} className="skill-chip">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p>No matched skills available.</p>
                        )}
                      </div>
                    </div>

                    {selectedCandidate.hiring_recommendation && (
                      <div className="explain-box dashboard-box">
                        <h4>AI Hiring Recommendation</h4>

                        <p>
                          <strong>Status:</strong>{" "}
                          {selectedCandidate.hiring_recommendation.recommendation}
                        </p>

                        <p>
                          <strong>Confidence:</strong>{" "}
                          {selectedCandidate.hiring_recommendation.confidence}%
                        </p>

                        <p>
                          <strong>Decision:</strong>{" "}
                          {selectedCandidate.hiring_recommendation.decision}
                        </p>

                        <h5>Strengths</h5>
                        <ul>
                          {(selectedCandidate.hiring_recommendation.strengths || []).map(
                            (item, idx) => (
                              <li key={idx}>{item}</li>
                            )
                          )}
                        </ul>

                        <h5>Risks</h5>
                        <ul>
                          {(selectedCandidate.hiring_recommendation.risks || []).map(
                            (item, idx) => (
                              <li key={idx}>{item}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="explain-box dashboard-box">
                      <h4>Interview Questions</h4>

                      <button onClick={() => generateInterviewQuestions(selectedCandidate)}>
                        Generate Interview Questions
                      </button>

                      {interviewQuestions[selectedCandidate.candidate_id] && (
                        <ul>
                          {interviewQuestions[selectedCandidate.candidate_id].map(
                            (question, idx) => (
                              <li key={idx}>{question}</li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
